import { getAuthDb } from "./google-auth";

export const FIELD_GUIDE_PRODUCT = "field-guide-lifetime";
export const FIELD_GUIDE_CURRENCY = "USD";
export const DEFAULT_FIELD_GUIDE_PRICE = "5.99";
export const DEFAULT_FIELD_GUIDE_PRICE_CENTS = 599;

let paymentSchemaReady: Promise<void> | undefined;

export async function ensurePaymentSchema(db = getAuthDb()) {
  paymentSchemaReady ??= (async () => {
    await db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS purchases (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        product_code TEXT NOT NULL,
        payment_provider TEXT NOT NULL DEFAULT 'paypal',
        provider_checkout_id TEXT,
        provider_payment_id TEXT,
        provider_customer_id TEXT,
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
      db.prepare(`CREATE TABLE IF NOT EXISTS paypal_events (
        id TEXT PRIMARY KEY NOT NULL,
        event_type TEXT NOT NULL,
        resource_id TEXT,
        processed_at TEXT NOT NULL
      )`),
      db.prepare(`CREATE TABLE IF NOT EXISTS creem_events (
        id TEXT PRIMARY KEY NOT NULL,
        event_type TEXT NOT NULL,
        resource_id TEXT,
        processed_at TEXT NOT NULL
      )`),
    ]);

    const tableInfo = await db.prepare("PRAGMA table_info(purchases)").all<{ name: string }>();
    const columns = new Set(tableInfo.results.map(column => column.name));
    const alterations: D1PreparedStatement[] = [];
    if (!columns.has("payment_provider")) {
      alterations.push(db.prepare("ALTER TABLE purchases ADD COLUMN payment_provider TEXT NOT NULL DEFAULT 'paypal'"));
    }
    if (!columns.has("provider_checkout_id")) {
      alterations.push(db.prepare("ALTER TABLE purchases ADD COLUMN provider_checkout_id TEXT"));
    }
    if (!columns.has("provider_payment_id")) {
      alterations.push(db.prepare("ALTER TABLE purchases ADD COLUMN provider_payment_id TEXT"));
    }
    if (!columns.has("provider_customer_id")) {
      alterations.push(db.prepare("ALTER TABLE purchases ADD COLUMN provider_customer_id TEXT"));
    }
    if (alterations.length) await db.batch(alterations);

    await db.batch([
      db.prepare("CREATE INDEX IF NOT EXISTS purchases_user_product_idx ON purchases (user_id, product_code)"),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS purchases_paypal_order_unique ON purchases (paypal_order_id)"),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS purchases_paypal_capture_unique ON purchases (paypal_capture_id)"),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS purchases_provider_checkout_unique ON purchases (provider_checkout_id)"),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS purchases_provider_payment_unique ON purchases (provider_payment_id)"),
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
