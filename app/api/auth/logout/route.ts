import {
  clearSessionCookie,
  deleteSession,
  ensureAuthSchema,
  getAuthDb,
  safeReturnTo,
} from "../../../../lib/google-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const requestUrl = new URL(request.url);
  const secure = requestUrl.protocol === "https:";
  try {
    const db = getAuthDb();
    await ensureAuthSchema(db);
    await deleteSession(db, request.headers.get("cookie"));
  } catch {
    // Clearing the browser cookie still signs the visitor out locally.
  }

  const headers = new Headers({
    Location: new URL(safeReturnTo(requestUrl.searchParams.get("return_to")), requestUrl.origin).toString(),
    "Cache-Control": "no-store",
  });
  headers.append("Set-Cookie", clearSessionCookie(secure));
  return new Response(null, { status: 303, headers });
}
