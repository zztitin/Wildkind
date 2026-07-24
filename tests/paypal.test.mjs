import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("PayPal checkout is server-confirmed, USD-only, and entitlement-gated", async () => {
  const [payments, paypal, createRoute, captureRoute, webhookRoute, app, envExample] = await Promise.all([
    readFile(new URL("../lib/payments.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/paypal.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/paypal/orders/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/paypal/capture/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/paypal/webhook/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/components/WildKindApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);

  assert.match(payments, /FIELD_GUIDE_CURRENCY = "USD"/);
  assert.match(payments, /DEFAULT_FIELD_GUIDE_PRICE = "5\.99"/);
  assert.match(payments, /status = 'completed'/);
  assert.match(paypal, /status = 'completed'/);
  assert.match(paypal, /verify-webhook-signature/);
  assert.match(createRoute, /getGoogleUserFromRequest/);
  assert.match(captureRoute, /captureFieldGuideOrder/);
  assert.match(webhookRoute, /verifyPayPalWebhook/);
  assert.match(app, /fieldGuideUnlocked/);
  assert.match(envExample, /PAYPAL_CLIENT_SECRET=store-this-as-a-hosted-secret/);
  assert.doesNotMatch(`${payments}${paypal}${createRoute}${captureRoute}${webhookRoute}${app}${envExample}`, /PAYPAL_CLIENT_SECRET\s*=\s*["'][A-Za-z0-9_-]{20,}/);
});
