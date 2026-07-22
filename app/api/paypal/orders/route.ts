import { getGoogleUserFromRequest } from "../../../../lib/google-auth";
import { createFieldGuideOrder } from "../../../../lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getGoogleUserFromRequest(request);
  if (!user) return Response.json({ error: "Sign in before starting checkout" }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "Invalid checkout origin" }, { status: 403 });
  try {
    const origin = new URL(request.url).origin;
    const order = await createFieldGuideOrder(user.id, origin);
    return Response.json(order, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("PayPal order creation failed", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "PayPal could not start checkout. Please try again." }, { status: 502 });
  }
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
