import { env } from "cloudflare:workers";
import {
  DEFAULT_FIELD_GUIDE_PRICE,
  DEFAULT_FIELD_GUIDE_PRICE_CENTS,
  ensurePaymentSchema,
  FIELD_GUIDE_CURRENCY,
  FIELD_GUIDE_PRODUCT,
  hasFieldGuideEntitlement,
} from "./payments";

type CreemEnvironment = "test" | "live";

type RuntimeEnv = {
  CREEM_API_KEY?: string;
  CREEM_ENV?: string;
  CREEM_PRODUCT_ID?: string;
  CREEM_WEBHOOK_SECRET?: string;
};

type CreemReference = string | { id?: string; email?: string } | null;

type CreemOrder = {
  id?: string;
  product?: CreemReference;
  customer?: CreemReference;
  amount?: number;
  amount_paid?: number;
  currency?: string;
  status?: string;
  type?: string;
};

type CreemCheckout = {
  id?: string;
  mode?: string;
  status?: string;
  product?: CreemReference;
  request_id?: string;
  units?: number;
  order?: CreemOrder | null;
  customer?: CreemReference;
  checkout_url?: string;
  metadata?: Record<string, unknown>;
};

type CreemEvent = {
  id?: string;
  eventType?: string;
  object?: CreemCheckout & {
    transaction?: { order?: CreemReference };
    checkout?: CreemCheckout;
  };
};

export function isCreemConfigured() {
  const runtime = env as unknown as RuntimeEnv;
  return {
    configured: Boolean(runtime.CREEM_API_KEY && runtime.CREEM_PRODUCT_ID),
    environment: runtime.CREEM_ENV === "live" ? "live" as const : "test" as const,
  };
}

export function getCreemConfig() {
  const runtime = env as unknown as RuntimeEnv;
  const environment: CreemEnvironment = runtime.CREEM_ENV === "live" ? "live" : "test";
  if (!runtime.CREEM_API_KEY || !runtime.CREEM_PRODUCT_ID) throw new Error("Creem is not configured");
  return {
    apiKey: runtime.CREEM_API_KEY,
    environment,
    productId: runtime.CREEM_PRODUCT_ID,
    webhookSecret: runtime.CREEM_WEBHOOK_SECRET ?? null,
    baseUrl: environment === "live" ? "https://api.creem.io" : "https://test-api.creem.io",
  };
}

async function creemRequest<T>(path: string, init: RequestInit = {}) {
  const config = getCreemConfig();
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", "x-api-key": config.apiKey, ...init.headers },
  });
  const body = await response.json<T & { message?: string; error?: string }>();
  if (!response.ok) throw new Error(body.message ?? body.error ?? "Creem request failed");
  return body;
}

export async function createCreemFieldGuideCheckout(userId: string, email: string, origin: string) {
  const db = await ensurePaymentSchema();
  if (await hasFieldGuideEntitlement(userId)) return { alreadyOwned: true as const };

  const config = getCreemConfig();
  const purchaseId = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO purchases
    (id, user_id, product_code, payment_provider, amount_value, currency_code, status, created_at, updated_at)
    VALUES (?, ?, ?, 'creem', ?, ?, 'creating', ?, ?)`)
    .bind(purchaseId, userId, FIELD_GUIDE_PRODUCT, DEFAULT_FIELD_GUIDE_PRICE, FIELD_GUIDE_CURRENCY, now, now).run();

  try {
    const checkout = await creemRequest<CreemCheckout>("/v1/checkouts", {
      method: "POST",
      body: JSON.stringify({
        product_id: config.productId,
        request_id: purchaseId,
        units: 1,
        customer: { email },
        success_url: `${origin}/api/creem/return`,
        metadata: { purchaseId, productCode: FIELD_GUIDE_PRODUCT },
      }),
    });
    const productId = referenceId(checkout.product);
    if (!checkout.id || !checkout.checkout_url || productId !== config.productId) {
      throw new Error("Creem did not return a valid checkout");
    }
    await db.prepare(`UPDATE purchases SET provider_checkout_id = ?, status = 'pending', updated_at = ?
      WHERE id = ? AND payment_provider = 'creem'`)
      .bind(checkout.id, new Date().toISOString(), purchaseId).run();
    return {
      alreadyOwned: false as const,
      checkoutId: checkout.id,
      checkoutUrl: checkout.checkout_url,
      testMode: config.environment === "test",
    };
  } catch (error) {
    await db.prepare("UPDATE purchases SET status = 'failed', updated_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), purchaseId).run();
    throw error;
  }
}

export async function confirmCreemRedirect(request: Request, userId: string) {
  const config = getCreemConfig();
  const params = await verifyCreemRedirectSignature(request, config.apiKey);
  if (!params.checkout_id || !params.request_id || params.product_id !== config.productId) {
    throw new Error("Creem returned an incomplete checkout reference");
  }

  const checkout = await creemRequest<CreemCheckout>(
    `/v1/checkouts?checkout_id=${encodeURIComponent(params.checkout_id)}`,
  );
  if (checkout.id !== params.checkout_id || checkout.request_id !== params.request_id) {
    throw new Error("Creem checkout verification did not match the redirect");
  }
  if (params.order_id && checkout.order?.id !== params.order_id) {
    throw new Error("Creem order verification did not match the redirect");
  }
  await completeCreemPurchase(checkout, userId);
  return { testMode: config.environment === "test" };
}

export async function verifyCreemWebhook(request: Request, rawBody: string) {
  const config = getCreemConfig();
  if (!config.webhookSecret) throw new Error("Creem webhook is not configured");
  const supplied = request.headers.get("creem-signature")?.replace(/^sha256=/u, "") ?? "";
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(config.webhookSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(rawBody));
  return constantTimeEqual(supplied.toLowerCase(), toHex(new Uint8Array(signature)));
}

export async function processCreemWebhook(event: CreemEvent) {
  if (!event.id || !event.eventType || !event.object) throw new Error("Creem webhook is malformed");
  const db = await ensurePaymentSchema();
  const seen = await db.prepare("SELECT id FROM creem_events WHERE id = ?").bind(event.id).first();
  if (seen) return;

  if (event.eventType === "checkout.completed") {
    await completeCreemPurchase(event.object);
  } else if (event.eventType === "refund.created" || event.eventType === "dispute.created") {
    const checkout = event.object.checkout;
    const paymentId = referenceId(event.object.order) ?? referenceId(event.object.transaction?.order);
    const requestId = checkout?.request_id;
    const checkoutId = checkout?.id;
    const status = event.eventType === "refund.created" ? "refunded" : "disputed";
    const now = new Date().toISOString();
    if (paymentId) {
      await db.prepare(`UPDATE purchases SET status = ?, updated_at = ?
        WHERE payment_provider = 'creem' AND provider_payment_id = ?`)
        .bind(status, now, paymentId).run();
    } else if (requestId || checkoutId) {
      await db.prepare(`UPDATE purchases SET status = ?, updated_at = ?
        WHERE payment_provider = 'creem' AND (id = ? OR provider_checkout_id = ?)`)
        .bind(status, now, requestId ?? "", checkoutId ?? "").run();
    }
  }

  await db.prepare("INSERT OR IGNORE INTO creem_events (id, event_type, resource_id, processed_at) VALUES (?, ?, ?, ?)")
    .bind(event.id, event.eventType, event.object.id ?? null, new Date().toISOString()).run();
}

async function completeCreemPurchase(checkout: CreemCheckout, expectedUserId?: string) {
  const config = getCreemConfig();
  const productId = referenceId(checkout.product) ?? referenceId(checkout.order?.product);
  const customerId = referenceId(checkout.customer) ?? referenceId(checkout.order?.customer);
  const order = checkout.order;
  if (
    checkout.status !== "completed"
    || !checkout.id
    || !checkout.request_id
    || checkout.units !== 1
    || productId !== config.productId
    || !order?.id
    || order.status !== "paid"
    || order.amount !== DEFAULT_FIELD_GUIDE_PRICE_CENTS
    || order.currency !== FIELD_GUIDE_CURRENCY
    || (order.type && order.type !== "onetime")
  ) {
    throw new Error("Creem did not confirm the expected Field Guide payment");
  }
  if (config.environment === "test" && checkout.mode !== "test") throw new Error("Creem environment mismatch");
  if (config.environment === "live" && checkout.mode === "test") throw new Error("Creem environment mismatch");

  const db = await ensurePaymentSchema();
  const purchase = await db.prepare(`SELECT id, user_id AS userId, amount_value AS amountValue,
    currency_code AS currencyCode, status FROM purchases
    WHERE id = ? AND payment_provider = 'creem' AND product_code = ?`)
    .bind(checkout.request_id, FIELD_GUIDE_PRODUCT)
    .first<{ id: string; userId: string; amountValue: string; currencyCode: string; status: string }>();
  if (!purchase || (expectedUserId && purchase.userId !== expectedUserId)) {
    throw new Error("This Creem checkout does not belong to the signed-in account");
  }
  if (purchase.amountValue !== DEFAULT_FIELD_GUIDE_PRICE || purchase.currencyCode !== FIELD_GUIDE_CURRENCY) {
    throw new Error("Creem returned an unexpected payment amount");
  }

  const now = new Date().toISOString();
  const status = config.environment === "test" ? "test_completed" : "completed";
  await db.prepare(`UPDATE purchases SET provider_checkout_id = ?, provider_payment_id = ?,
    provider_customer_id = ?, status = ?, updated_at = ?, completed_at = ?
    WHERE id = ? AND status IN ('pending', 'test_completed', 'completed')`)
    .bind(checkout.id, order.id, customerId, status, now, now, purchase.id).run();
}

async function verifyCreemRedirectSignature(request: Request, apiKey: string) {
  const rawQuery = new URL(request.url).search.slice(1);
  const values: Record<string, string> = {};
  const parts: string[] = [];
  let supplied = "";
  for (const pair of rawQuery.split("&")) {
    if (!pair) continue;
    const separator = pair.indexOf("=");
    const rawKey = separator === -1 ? pair : pair.slice(0, separator);
    const rawValue = separator === -1 ? "" : pair.slice(separator + 1);
    const key = decodeQueryPart(rawKey);
    const value = decodeQueryPart(rawValue);
    if (key === "signature") {
      supplied = value;
      continue;
    }
    if (!value || value === "null") continue;
    values[key] = value;
    parts.push(`${key}=${value}`);
  }
  parts.push(`salt=${apiKey}`);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(parts.join("|")));
  if (!constantTimeEqual(supplied.toLowerCase(), toHex(new Uint8Array(digest)))) {
    throw new Error("Invalid Creem redirect signature");
  }
  return values;
}

function referenceId(value: CreemReference | undefined) {
  if (typeof value === "string") return value;
  return value?.id ?? null;
}

function decodeQueryPart(value: string) {
  return decodeURIComponent(value.replaceAll("+", " "));
}

function toHex(bytes: Uint8Array) {
  return Array.from(bytes, byte => byte.toString(16).padStart(2, "0")).join("");
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length || !left.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}
