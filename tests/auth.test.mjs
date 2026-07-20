import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Google OAuth keeps credentials server-side and stores revocable sessions", async () => {
  const [auth, start, callback, schema, registration] = await Promise.all([
    readFile(new URL("../lib/google-auth.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/google/start/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/api/auth/callback/google/route.ts", import.meta.url), "utf8"),
    readFile(new URL("../db/schema.ts", import.meta.url), "utf8"),
    readFile(new URL("../app/register/RegistrationForm.tsx", import.meta.url), "utf8"),
  ]);

  assert.match(auth, /GOOGLE_CLIENT_SECRET/);
  assert.match(auth, /HttpOnly; SameSite=Lax/);
  assert.match(start, /code_challenge_method.*S256/);
  assert.match(callback, /openidconnect\.googleapis\.com\/v1\/userinfo/);
  assert.match(callback, /DELETE FROM oauth_states/);
  assert.doesNotMatch(callback, /refresh_token/);
  assert.match(schema, /sessions/);
  assert.match(schema, /consents/);
  assert.match(registration, /Continue with Google/);
});
