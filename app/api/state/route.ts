import { env } from "cloudflare:workers";
import { getGoogleUserFromRequest, readCookie } from "../../../lib/google-auth";

export const dynamic = "force-dynamic";

const schema = `CREATE TABLE IF NOT EXISTS wildkind_state (
  owner_id TEXT PRIMARY KEY,
  payload TEXT NOT NULL,
  updated_at TEXT NOT NULL
)`;

async function owner(request: Request) {
  const user = await getGoogleUserFromRequest(request);
  if (user) return { id: `user:${user.id}`, authenticated: true };
  return {
    id: readCookie(request.headers.get("cookie"), "wk_owner") ?? crypto.randomUUID(),
    authenticated: false,
  };
}

async function ensureDb() {
  const db = (env as unknown as { DB?: D1Database }).DB;
  if (!db) throw new Error("WildKind database is unavailable");
  await db.prepare(schema).run();
  return db;
}

export async function GET(request: Request) {
  const current = await owner(request);
  const db = await ensureDb();
  const row = await db.prepare("SELECT payload FROM wildkind_state WHERE owner_id = ?").bind(current.id).first<{ payload: string }>();
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (!current.authenticated) headers.append("Set-Cookie", ownerCookie(current.id, request));
  return Response.json(row ? JSON.parse(row.payload) : {}, {
    headers,
  });
}

export async function POST(request: Request) {
  const current = await owner(request);
  const payload = await request.json();
  const serialized = JSON.stringify(payload);
  if (serialized.length > 1_000_000) return Response.json({ error: "Payload too large" }, { status: 413 });
  const db = await ensureDb();
  await db.prepare(
    "INSERT INTO wildkind_state (owner_id, payload, updated_at) VALUES (?, ?, ?) ON CONFLICT(owner_id) DO UPDATE SET payload = excluded.payload, updated_at = excluded.updated_at"
  ).bind(current.id, serialized, new Date().toISOString()).run();
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (!current.authenticated) headers.append("Set-Cookie", ownerCookie(current.id, request));
  return Response.json({ ok: true }, {
    headers,
  });
}

export async function DELETE(request: Request) {
  const current = await owner(request);
  const db = await ensureDb();
  await db.prepare("DELETE FROM wildkind_state WHERE owner_id = ?").bind(current.id).run();
  return Response.json({ ok: true }, {
    headers: current.authenticated
      ? { "Cache-Control": "no-store" }
      : { "Set-Cookie": ownerCookie("", request, 0), "Cache-Control": "no-store" },
  });
}

function ownerCookie(id: string, request: Request, maxAge = 31536000) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `wk_owner=${encodeURIComponent(id)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}
