import {
  clearOAuthStateCookie,
  createSession,
  ensureAuthSchema,
  getAuthDb,
  getGoogleOAuthConfig,
  readCookie,
  readOAuthStateCookie,
  safeReturnTo,
  sessionCookie,
  sha256Base64Url,
} from "../../../../../lib/google-auth";

export const dynamic = "force-dynamic";

type OAuthStateRow = {
  codeVerifier: string;
  returnTo: string;
  ageConfirmed: number;
  serviceConsent: number;
  researchConsent: number;
  marketingConsent: number;
  expiresAt: string;
};

type GoogleTokenResponse = { access_token?: string; error?: string };
type GoogleProfile = {
  sub?: string;
  email?: string;
  email_verified?: boolean;
  name?: string;
  picture?: string;
};

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const secure = requestUrl.protocol === "https:";
  const fail = (reason: string) => redirectWithClearedState(
    new URL(`/register?error=${encodeURIComponent(reason)}`, requestUrl.origin),
    secure,
  );

  const code = requestUrl.searchParams.get("code");
  const state = requestUrl.searchParams.get("state");
  const stateCookie = readOAuthStateCookie(request.headers.get("cookie"));
  if (!code || !state || !stateCookie || state !== stateCookie) return fail("oauth-state");

  try {
    const db = getAuthDb();
    const { clientId, clientSecret } = getGoogleOAuthConfig();
    await ensureAuthSchema(db);

    const stateHash = await sha256Base64Url(state);
    const stored = await db.prepare(`SELECT
      code_verifier AS codeVerifier,
      return_to AS returnTo,
      age_confirmed AS ageConfirmed,
      service_consent AS serviceConsent,
      research_consent AS researchConsent,
      marketing_consent AS marketingConsent,
      expires_at AS expiresAt
      FROM oauth_states WHERE state_hash = ?`)
      .bind(stateHash)
      .first<OAuthStateRow>();
    await db.prepare("DELETE FROM oauth_states WHERE state_hash = ?").bind(stateHash).run();
    if (!stored || stored.expiresAt <= new Date().toISOString()) return fail("oauth-state");

    const redirectUri = `${requestUrl.origin}/api/auth/callback/google`;
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
        code_verifier: stored.codeVerifier,
      }),
    });
    const tokens = await tokenResponse.json<GoogleTokenResponse>();
    if (!tokenResponse.ok || !tokens.access_token) return fail("google-token");

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    const profile = await profileResponse.json<GoogleProfile>();
    if (!profileResponse.ok || !profile.sub || !profile.email || profile.email_verified !== true) {
      return fail("google-profile");
    }

    const now = new Date().toISOString();
    const existing = await db.prepare("SELECT id FROM users WHERE google_subject = ? OR email = ? LIMIT 1")
      .bind(profile.sub, profile.email.toLowerCase())
      .first<{ id: string }>();
    const userId = existing?.id ?? crypto.randomUUID();
    if (existing) {
      await db.prepare(`UPDATE users SET google_subject = ?, email = ?, email_verified = 1,
        name = ?, avatar_url = ?, updated_at = ?, last_login_at = ? WHERE id = ?`)
        .bind(profile.sub, profile.email.toLowerCase(), profile.name ?? null, profile.picture ?? null, now, now, userId)
        .run();
    } else {
      await db.prepare(`INSERT INTO users (
        id, google_subject, email, email_verified, name, avatar_url, created_at, updated_at, last_login_at
      ) VALUES (?, ?, ?, 1, ?, ?, ?, ?, ?)`)
        .bind(userId, profile.sub, profile.email.toLowerCase(), profile.name ?? null, profile.picture ?? null, now, now, now)
        .run();
    }

    const consentRows: Array<[string, number]> = [
      ["minimum_age", stored.ageConfirmed],
      ["service", stored.serviceConsent],
      ["research", stored.researchConsent],
      ["marketing", stored.marketingConsent],
    ];
    await db.batch(consentRows.map(([kind, granted]) => db.prepare(
      "INSERT INTO consents (id, user_id, kind, granted, policy_version, source, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    ).bind(crypto.randomUUID(), userId, kind, granted, "2026-07-20", "google-registration", now)));

    const anonymousOwner = readCookie(request.headers.get("cookie"), "wk_owner");
    const userOwner = `user:${userId}`;
    if (anonymousOwner && anonymousOwner !== userOwner) {
      await db.batch([
        db.prepare(`INSERT INTO wildkind_state (owner_id, payload, updated_at)
          SELECT ?, payload, updated_at FROM wildkind_state WHERE owner_id = ?
          ON CONFLICT(owner_id) DO NOTHING`).bind(userOwner, anonymousOwner),
        db.prepare("DELETE FROM wildkind_state WHERE owner_id = ?").bind(anonymousOwner),
      ]);
    }

    const session = await createSession(db, userId);
    await db.prepare("DELETE FROM sessions WHERE expires_at <= ?").bind(now).run();

    const headers = new Headers({
      Location: new URL(safeReturnTo(stored.returnTo), requestUrl.origin).toString(),
      "Cache-Control": "no-store",
    });
    headers.append("Set-Cookie", sessionCookie(session.token, session.maxAge, secure));
    headers.append("Set-Cookie", clearOAuthStateCookie(secure));
    headers.append("Set-Cookie", `wk_owner=${encodeURIComponent(userOwner)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=31536000${secure ? "; Secure" : ""}`);
    return new Response(null, { status: 302, headers });
  } catch {
    return fail("oauth-failed");
  }
}

function redirectWithClearedState(url: URL, secure: boolean) {
  const headers = new Headers({ Location: url.toString(), "Cache-Control": "no-store" });
  headers.append("Set-Cookie", clearOAuthStateCookie(secure));
  return new Response(null, { status: 302, headers });
}
