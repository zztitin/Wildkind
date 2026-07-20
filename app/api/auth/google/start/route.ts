import {
  ensureAuthSchema,
  getAuthDb,
  getGoogleOAuthConfig,
  oauthStateCookie,
  randomToken,
  safeReturnTo,
  sha256Base64Url,
} from "../../../../../lib/google-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const secure = requestUrl.protocol === "https:";
  const ageConfirmed = requestUrl.searchParams.get("age") === "1";
  const serviceConsent = requestUrl.searchParams.get("service") === "1";
  if (!ageConfirmed || !serviceConsent) {
    return Response.redirect(new URL("/register?error=required-consent", requestUrl.origin), 302);
  }

  try {
    const db = getAuthDb();
    const { clientId } = getGoogleOAuthConfig();
    await ensureAuthSchema(db);

    const state = randomToken(32);
    const stateHash = await sha256Base64Url(state);
    const codeVerifier = randomToken(64);
    const codeChallenge = await sha256Base64Url(codeVerifier);
    const createdAt = new Date();
    const expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000);
    const returnTo = safeReturnTo(requestUrl.searchParams.get("return_to"));

    await db.batch([
      db.prepare("DELETE FROM oauth_states WHERE expires_at <= ?").bind(createdAt.toISOString()),
      db.prepare(`INSERT INTO oauth_states (
        state_hash, code_verifier, return_to, age_confirmed, service_consent,
        research_consent, marketing_consent, created_at, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`)
        .bind(
          stateHash,
          codeVerifier,
          returnTo,
          1,
          1,
          requestUrl.searchParams.get("research") === "1" ? 1 : 0,
          requestUrl.searchParams.get("marketing") === "1" ? 1 : 0,
          createdAt.toISOString(),
          expiresAt.toISOString(),
        ),
    ]);

    const redirectUri = `${requestUrl.origin}/api/auth/callback/google`;
    const googleUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleUrl.searchParams.set("client_id", clientId);
    googleUrl.searchParams.set("redirect_uri", redirectUri);
    googleUrl.searchParams.set("response_type", "code");
    googleUrl.searchParams.set("scope", "openid email profile");
    googleUrl.searchParams.set("state", state);
    googleUrl.searchParams.set("code_challenge", codeChallenge);
    googleUrl.searchParams.set("code_challenge_method", "S256");
    googleUrl.searchParams.set("prompt", "select_account");

    const headers = new Headers({ Location: googleUrl.toString(), "Cache-Control": "no-store" });
    headers.append("Set-Cookie", oauthStateCookie(state, secure));
    return new Response(null, { status: 302, headers });
  } catch {
    return Response.redirect(new URL("/register?error=configuration", requestUrl.origin), 302);
  }
}
