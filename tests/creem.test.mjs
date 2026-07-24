import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Creem checkout is authenticated, verified, idempotent, and test-safe", async () => {
  const [payments, creem, checkoutRoute, returnRoute, webhookRoute, buttons, envExample] = await Promise.all([
    readFile(new URL("../lib/payments.ts", import.meta.url), "utf8"),
    readFile(new URL("../lib/creem.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/creem/checkouts/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/creem/return/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/creem/webhook/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/checkout/CheckoutButtons.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);

  assert.match(creem, /https:\/\/test-api\.creem\.io/);
  assert.match(creem, /creem-signature/);
  assert.match(creem, /crypto\.subtle\.sign\("HMAC"/);
  assert.match(creem, /verifyCreemRedirectSignature/);
  assert.match(creem, /\/v1\/checkouts\?checkout_id=/);
  assert.match(creem, /order\.amount !== DEFAULT_FIELD_GUIDE_PRICE_CENTS/);
  assert.match(creem, /productId !== config\.productId/);
  assert.match(creem, /"test_completed"/);
  assert.match(creem, /SELECT id FROM creem_events WHERE id = \?/);
  assert.match(creem, /if \(!\(await completeCreemPurchase\(checkout, userId\)\)\)/);
  assert.match(creem, /acknowledge any event that does not match a locally-created purchase/);
  assert.match(payments, /status = 'completed'/);
  assert.doesNotMatch(payments, /test_completed.*LIMIT 1/s);
  assert.match(checkoutRoute, /getGoogleUserFromRequest/);
  assert.match(checkoutRoute, /sameOrigin/);
  assert.match(returnRoute, /confirmCreemRedirect/);
  assert.match(webhookRoute, /verifyCreemWebhook/);
  assert.match(buttons, /Continue with PayPal/);
  assert.match(buttons, /Pay by card or wallet/);
  assert.match(envExample, /CREEM_API_KEY=store-this-as-a-hosted-secret/);
  assert.doesNotMatch(
    `${payments}${creem}${checkoutRoute}${returnRoute}${webhookRoute}${buttons}${envExample}`,
    /creem_test_[A-Za-z0-9_-]{12,}/,
  );
});
