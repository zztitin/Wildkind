import { env } from "cloudflare:workers";

const SESSION_COOKIE = "wk_session";
const OAUTH_STATE_COOKIE = "wk_oauth_state";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;

export type GoogleUser = {
  id: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
};

type RuntimeEnv = {
  DB?: D1Database;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};

let schemaReady: Promise<void> | undefined;

export function getRuntimeEnv(): RuntimeEnv {
  return env as unknown as RuntimeEnv;
}

export function getAuthDb(): D1Database {
  const db = getRuntimeEnv().DB;
  if (!db) throw new Error("WildKind database is unavailable");
  return db;
}

export function getGoogleOAuthConfig() {
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } = getRuntimeEnv();
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    throw new Error("Google sign-in is not configured");
  }
  return { clientId: GOOGLE_CLIENT_ID, clientSecret: GOOGLE_CLIENT_SECRET };
}

export async function ensureAuthSchema(db = getAuthDb()): Promise<void> {
  schemaReady ??= (async () => {
    await db.batch([
      db.prepare(`CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY NOT NULL,
        google_subject TEXT NOT NULL,
        email TEXT NOT NULL,
        email_verified INTEGER NOT NULL,
        name TEXT,
        avatar_url TEXT,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL,
        last_login_at TEXT NOT NULL
      )`),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS users_google_subject_unique ON users (google_subject)"),
      db.prepare("CREATE UNIQUE INDEX IF NOT EXISTS users_email_unique ON users (email)"),
      db.prepare(`CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        last_seen_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE NO ACTION ON DELETE CASCADE
      )`),
      db.prepare("CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions (user_id)"),
      db.prepare("CREATE INDEX IF NOT EXISTS sessions_expires_at_idx ON sessions (expires_at)"),
      db.prepare(`CREATE TABLE IF NOT EXISTS oauth_states (
        state_hash TEXT PRIMARY KEY NOT NULL,
        code_verifier TEXT NOT NULL,
        return_to TEXT NOT NULL,
        age_confirmed INTEGER NOT NULL,
        service_consent INTEGER NOT NULL,
        research_consent INTEGER NOT NULL,
        marketing_consent INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        expires_at TEXT NOT NULL
      )`),
      db.prepare("CREATE INDEX IF NOT EXISTS oauth_states_expires_at_idx ON oauth_states (expires_at)"),
      db.prepare(`CREATE TABLE IF NOT EXISTS consents (
        id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        kind TEXT NOT NULL,
        granted INTEGER NOT NULL,
        policy_version TEXT NOT NULL,
        source TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE NO ACTION ON DELETE CASCADE
      )`),
      db.prepare("CREATE INDEX IF NOT EXISTS consents_user_kind_idx ON consents (user_id, kind)"),
    ]);
  })();
  return schemaReady;
}

export async function getGoogleUserFromRequest(request: Request): Promise<GoogleUser | null> {
  return getGoogleUserFromCookie(request.headers.get("cookie"));
}

export async function getGoogleUserFromCookie(cookieHeader: string | null): Promise<GoogleUser | null> {
  const sessionToken = readCookie(cookieHeader, SESSION_COOKIE);
  if (!sessionToken) return null;

  const db = getAuthDb();
  await ensureAuthSchema(db);
  const sessionHash = await sha256Base64Url(sessionToken);
  const now = new Date().toISOString();
  return db.prepare(`SELECT users.id, users.email, users.name, users.avatar_url AS avatarUrl
    FROM sessions
    INNER JOIN users ON users.id = sessions.user_id
    WHERE sessions.id = ? AND sessions.expires_at > ?`)
    .bind(sessionHash, now)
    .first<GoogleUser>();
}

export async function createSession(db: D1Database, userId: string) {
  const token = randomToken(32);
  const id = await sha256Base64Url(token);
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + SESSION_TTL_SECONDS * 1000);
  await db.prepare(
    "INSERT INTO sessions (id, user_id, created_at, expires_at, last_seen_at) VALUES (?, ?, ?, ?, ?)",
  ).bind(id, userId, createdAt.toISOString(), expiresAt.toISOString(), createdAt.toISOString()).run();
  return { token, maxAge: SESSION_TTL_SECONDS };
}

export async function deleteSession(db: D1Database, cookieHeader: string | null) {
  const token = readCookie(cookieHeader, SESSION_COOKIE);
  if (!token) return;
  await db.prepare("DELETE FROM sessions WHERE id = ?").bind(await sha256Base64Url(token)).run();
}

export function sessionCookie(token: string, maxAge: number, secure: boolean) {
  return buildCookie(SESSION_COOKIE, token, maxAge, secure);
}

export function oauthStateCookie(state: string, secure: boolean) {
  return buildCookie(OAUTH_STATE_COOKIE, state, 600, secure);
}

export function clearSessionCookie(secure: boolean) {
  return buildCookie(SESSION_COOKIE, "", 0, secure);
}

export function clearOAuthStateCookie(secure: boolean) {
  return buildCookie(OAUTH_STATE_COOKIE, "", 0, secure);
}

export function readOAuthStateCookie(cookieHeader: string | null) {
  return readCookie(cookieHeader, OAUTH_STATE_COOKIE);
}

export function readCookie(cookieHeader: string | null, name: string): string | null {
  if (!cookieHeader) return null;
  for (const part of cookieHeader.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return decodeURIComponent(value.join("="));
  }
  return null;
}

export function safeReturnTo(value: string | null | undefined): string {
  if (!value?.startsWith("/") || value.startsWith("//")) return "/";
  try {
    const url = new URL(value, "https://app.local");
    if (url.origin !== "https://app.local") return "/";
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return "/";
  }
}

export function randomToken(byteLength = 32): string {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return base64Url(bytes);
}

export async function sha256Base64Url(value: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return base64Url(new Uint8Array(digest));
}

function base64Url(bytes: Uint8Array): string {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/u, "");
}

function buildCookie(name: string, value: string, maxAge: number, secure: boolean) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure ? "; Secure" : ""}`;
}
