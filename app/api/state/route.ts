import { env } from "cloudflare:workers";

export const dynamic = "force-dynamic";

const schema = `CREATE TABLE IF NOT EXISTS wildkind_state (
  owner_id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`;

function ownerId(request: Request) {
  const match = request.headers.get("cookie")?.match(/wk_owner=([^;]+)/);
  return match?.[1] ?? crypto.randomUUID();
}

async function ensureDb() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error("WildKind database is unavailable");
  await db.prepare(schema).run();
  return db;
}

export async function GET(request: Request) {
  const id = ownerId(request);
  const db = await ensureDb();
  const row = await db.prepare("SELECT payload FROM wildkind_state WHERE owner_id = ?").bind(id).first<{ payload: string }>();
  return Response.json(row ? JSON.parse(row.payload) : {}, {
    headers: { "Set-Cookie": `wk_owner=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000` },
  });
}

export async function POST(request: Request) {
  const id = ownerId(request);
  const payload = await request.json();
  const db = await ensureDb();
  await db.prepare(
    "INSERT INTO wildkind_state (owner_id, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(owner_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at"
  ).bind(id, JSON.stringify(payload), new Date().toISOString()).run();
  return Response.json({ ok: true }, {
    headers: { "Set-Cookie": `wk_owner=${id}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000` },
  });
}

export async function DELETE(request: Request) {
  const id = ownerId(request);
  const db = await ensureDb();
  await db.prepare("DELETE FROM wildkind_state WHERE owner_id = ?").bind(id).run();
  return Response.json({ ok: true }, {
    headers: { "Set-Cookie": "wk_owner=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0" },
  });
}
