import { createCreemFieldGuideCheckout } from "../../../../lib/creem";
import { getGoogleUserFromRequest } from "../../../../lib/google-auth";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getGoogleUserFromRequest(request);
  if (!user) return Response.json({ error: "Sign in before starting checkout" }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "Invalid checkout origin" }, { status: 403 });
  try {
    const origin = new URL(request.url).origin;
    const checkout = await createCreemFieldGuideCheckout(user.id, user.email, origin);
    return Response.json(checkout, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Creem checkout creation failed", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "Creem could not start checkout. Please try again." }, { status: 502 });
  }
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
