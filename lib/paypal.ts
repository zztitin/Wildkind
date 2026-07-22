import { env } from "cloudflare:workers";
import { getAuthDb } from "./google-auth";

export const FIELD_GUIDE_PRODUCT = "field-guide-lifetime";
export const FIELD_GUIDE_CURRENCY = "USD";
export const DEFAULT_FIELD_GUIDE_PRICE = "5.99";

type PayPalEnvironment = "sandbox" | "live";

type RuntimeEnv = {
  PAYPAL_CLIENT_ID?: string;
  PAYPAL_CLIENT_SECRET?: string;
  PAYPAL_ENV?: string;
  PAYPAL_WEBHOOK_ID?: string;
  PAYPAL_FIELD_GUIDE_PRICE?: string;
};

type PayPalLink = { href: string; rel: string; method?: string };
type PayPalCapture = {
  id: string;
  status: string;
  amount?: { value?: string; currency_code?: string };
};
type PayPalOrder = {
  id: string;
  status: string;
  links?: PayPalLink[];
  purchase_units?: Array<{ payments?: { captures?: PayPalCapture[] } }>;
};

let paymentSchemaReady: Promise<void> | undefined;

export function getPayPalConfig() {
  const runtime = env as unknown as RuntimeEnv;
  const environment: PayPalEnvironment = runtime.PAYPAL_ENV === "live" ? "live" : "sandbox";
  const price = runtime.PAYPAL_FIELD_GUIDE_PRICE ?? DEFAULT_FIELD_GUIDE_PRICE;
  if (!runtime.PAYPAL_CLIENT_ID || !runtime.PAYPAL_CLIENT_SECRET) throw new Error("PayPal is not configured");
  if (!/^\d+\.\d{2}$/u.test(price)) throw new Error("PayPal price is invalid");
  return {
    clientId: runtime.PAYPAL_CLIENT_ID,
    clientSecret: runtime.PAYPAL_CLIENT_SECRET,
    environment,
    webhookId: runtime.PAYPAL_WEBHOOK_ID ?? null,
    price,
    baseUrl: environment === "live" ? "https://api-m.paypal.com" : "https://api-m.sandbox.paypal.com",
  };
}

export async function ensurePaymentSchema(db = getAuthDb()) {
  paymentSchemaReady ??= (async () => {
    await db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        product_code TEXT NOT NULL,
        paypal_order_id TEXT,
        paypal_capture_id TEXT,
        amount_value TEXT NOT NULL,
        currency_code TEXT NOT NULL,
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        completed_at TEXT,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE NO ACTION ON DELETE CASCADE
      )`),
      db.prepare("CREATE INDEX IF NOT EXISTS purchases_user_product_idx ON purchases (user_id, product_code)"),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS purchases_paypal_order_unique ON purchases (paypal_order_id)"),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS purchases_paypal_capture_unique ON purchases (paypal_capture_id)"),
      db.prepare(`CREATE TABLE IF NOT EXISTS paypal_events (
        id TEXT PRIMARY KEY NOT NULL,
        event_type TEXT NOT NULL,
        resource_id TEXT,
        processed_at TEXT NOT NULL
      )`),
    ]);
  })();
  await paymentSchemaReady;
  return db;
}

export async function hasFieldGuideEntitlement(userId: string) {
  const db = await ensurePaymentSchema();
  const row = await db.prepare(
    "SELECT id FROM purchases WHERE user_id = ? AND product_code = ? AND status = 'completed' LIMIT 1",
  ).bind(userId, FIELD_GUIDE_PRODUCT).first();
  return Boolean(row);
}

async function accessToken() {
  const config = getPayPalConfig();
  const credentials = btoa(`${config.clientId}:${config.clientSecret}`);
  const response = await fetch(`${config.baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: { Authorization: `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: "grant_type=client_credentials",
  });
  const body = await response.json<{ access_token?: string; error_description?: string }>();
  if (!response.ok || !body.access_token) throw new Error(body.error_description ?? "PayPal authentication failed");
  return { token: body.access_token, config };
}

export async function paypalRequest<T>(path: string, init: RequestInit = {}) {
  const { token, config } = await accessToken();
  const response = await fetch(`${config.baseUrl}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}`, ...init.headers },
  });
  const body = await response.json<T & { message?: string; details?: Array<{ description?: string }> }>();
  if (!response.ok) throw new Error(body.details?.[0]?.description ?? body.message ?? "PayPal request failed");
  return body;
}

export async function createFieldGuideOrder(userId: string, origin: string) {
  const db = await ensurePaymentSchema();
  if (await hasFieldGuideEntitlement(userId)) return { alreadyOwned: true as const };

  const config = getPayPalConfig();
  const purchaseId = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.prepare(`INSERT INTO purchases
    (id, user_id, product_code, amount_value, currency_code, status, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, 'creating', ?, ?)`)
    .bind(purchaseId, userId, FIELD_GUIDE_PRODUCT, config.price, FIELD_GUIDE_CURRENCY, now, now).run();

  try {
    const order = await paypalRequest<PayPalOrder>("/v2/checkout/orders", {
      method: "POST",
      headers: { "PayPal-Request-Id": `wildkind-${purchaseId}` },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{
          reference_id: purchaseId,
          invoice_id: purchaseId,
          description: "WildKind Complete Field Guide",
          amount: { currency_code: FIELD_GUIDE_CURRENCY, value: config.price },
        }],
        payment_source: { paypal: { experience_context: {
          brand_name: "WildKind",
          locale: "en-US",
          landing_page: "LOGIN",
          user_action: "PAY_NOW",
          return_url: `${origin}/checkout/paypal/return`,
          cancel_url: `${origin}/checkout/paypal/cancel`,
        } } },
      }),
    });
    const approvalUrl = order.links?.find(link => link.rel === "payer-action" || link.rel === "approve")?.href;
    if (!order.id || !approvalUrl) throw new Error("PayPal did not return an approval link");
    await db.prepare("UPDATE purchases SET paypal_order_id = ?, status = 'pending', updated_at = ? WHERE id = ?")
      .bind(order.id, new Date().toISOString(), purchaseId).run();
    return { alreadyOwned: false as const, orderId: order.id, approvalUrl };
  } catch (error) {
    await db.prepare("UPDATE purchases SET status = 'failed', updated_at = ? WHERE id = ?")
      .bind(new Date().toISOString(), purchaseId).run();
    throw error;
  }
}

export async function captureFieldGuideOrder(userId: string, orderId: string) {
  const db = await ensurePaymentSchema();
  const purchase = await db.prepare(`SELECT id, amount_value AS amountValue, currency_code AS currencyCode, status
    FROM purchases WHERE user_id = ? AND paypal_order_id = ? AND product_code = ?`)
    .bind(userId, orderId, FIELD_GUIDE_PRODUCT)
    .first<{ id: string; amountValue: string; currencyCode: string; status: string }>();
  if (!purchase) throw new Error("This PayPal order does not belong to the signed-in account");
  if (purchase.status === "completed") return { completed: true as const };
  if (purchase.status !== "pending") throw new Error("This PayPal order is not available for capture");

  const order = await paypalRequest<PayPalOrder>(`/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`, {
    method: "POST",
    headers: { "PayPal-Request-Id": `capture-${purchase.id}` },
    body: "{}",
  });
  const capture = order.purchase_units?.flatMap(unit => unit.payments?.captures ?? [])[0];
  if (order.status !== "COMPLETED" || capture?.status !== "COMPLETED" || !capture.id) throw new Error("PayPal has not completed this payment");
  if (capture.amount?.currency_code !== purchase.currencyCode || capture.amount?.value !== purchase.amountValue) throw new Error("PayPal returned an unexpected payment amount");

  const completedAt = new Date().toISOString();
  await db.prepare(`UPDATE purchases SET paypal_capture_id = ?, status = 'completed', updated_at = ?, completed_at = ?
    WHERE id = ? AND status = 'pending'`)
    .bind(capture.id, completedAt, completedAt, purchase.id).run();
  return { completed: true as const };
}

export async function cancelFieldGuideOrder(userId: string, orderId: string) {
  const db = await ensurePaymentSchema();
  await db.prepare(`UPDATE purchases SET status = 'cancelled', updated_at = ?
    WHERE user_id = ? AND paypal_order_id = ? AND product_code = ? AND status = 'pending'`)
    .bind(new Date().toISOString(), userId, orderId, FIELD_GUIDE_PRODUCT).run();
}

export async function verifyPayPalWebhook(request: Request, rawBody: string) {
  const config = getPayPalConfig();
  if (!config.webhookId) throw new Error("PayPal webhook is not configured");
  const verification = await paypalRequest<{ verification_status?: string }>("/v1/notifications/verify-webhook-signature", {
    method: "POST",
    body: JSON.stringify({
      auth_algo: request.headers.get("paypal-auth-algo"),
      cert_url: request.headers.get("paypal-cert-url"),
      transmission_id: request.headers.get("paypal-transmission-id"),
      transmission_sig: request.headers.get("paypal-transmission-sig"),
      transmission_time: request.headers.get("paypal-transmission-time"),
      webhook_id: config.webhookId,
      webhook_event: JSON.parse(rawBody),
    }),
  });
  return verification.verification_status === "SUCCESS";
}

export async function processPayPalWebhook(event: {
  id?: string;
  event_type?: string;
  resource?: {
    id?: string;
    status?: string;
    amount?: { value?: string; currency_code?: string };
    supplementary_data?: { related_ids?: { order_id?: string; capture_id?: string } };
  };
}) {
  if (!event.id || !event.event_type) throw new Error("PayPal webhook is malformed");
  const db = await ensurePaymentSchema();
  const seen = await db.prepare("SELECT id FROM paypal_events WHERE id = ?").bind(event.id).first();
  if (seen) return;

  const resource = event.resource;
  const orderId = resource?.supplementary_data?.related_ids?.order_id;
  const captureId = resource?.supplementary_data?.related_ids?.capture_id ?? resource?.id;
  const now = new Date().toISOString();

  if (event.event_type === "PAYMENT.CAPTURE.COMPLETED" && orderId && resource?.id) {
    const config = getPayPalConfig();
    if (resource.amount?.currency_code === FIELD_GUIDE_CURRENCY && resource.amount?.value === config.price) {
      await db.prepare(`UPDATE purchases SET paypal_capture_id = ?, status = 'completed', updated_at = ?, completed_at = ?
        WHERE paypal_order_id = ? AND product_code = ? AND status IN ('pending', 'completed')`)
        .bind(resource.id, now, now, orderId, FIELD_GUIDE_PRODUCT).run();
    }
  } else if (event.event_type === "PAYMENT.CAPTURE.DENIED" && captureId) {
    await db.prepare("UPDATE purchases SET status = 'denied', updated_at = ? WHERE paypal_capture_id = ? OR paypal_order_id = ?")
      .bind(now, captureId, orderId ?? "").run();
  } else if (event.event_type === "PAYMENT.CAPTURE.REFUNDED" && captureId) {
    await db.prepare("UPDATE purchases SET status = 'refunded', updated_at = ? WHERE paypal_capture_id = ?")
      .bind(now, captureId).run();
  } else if (event.event_type === "PAYMENT.CAPTURE.REVERSED" && captureId) {
    await db.prepare("UPDATE purchases SET status = 'reversed', updated_at = ? WHERE paypal_capture_id = ?")
      .bind(now, captureId).run();
  }

  await db.prepare("INSERT OR IGNORE INTO paypal_events (id, event_type, resource_id, processed_at) VALUES (?, ?, ?, ?)")
    .bind(event.id, event.event_type, resource?.id ?? null, now).run();
}
