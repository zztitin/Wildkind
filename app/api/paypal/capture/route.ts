import { getGoogleUserFromRequest } from "../../../../lib/google-auth";
import { captureFieldGuideOrder } from "../../../../lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getGoogleUserFromRequest(request);
  if (!user) return Response.json({ error: "Your session expired. Sign in and try again." }, { status: 401 });
  if (!sameOrigin(request)) return Response.json({ error: "Invalid checkout origin" }, { status: 403 });
  const body = await request.json<{ orderId?: string }>().catch(() => ({}));
  if (!body.orderId || !/^[A-Z0-9-]{8,40}$/iu.test(body.orderId)) return Response.json({ error: "Invalid PayPal order" }, { status: 400 });
  try {
    const result = await captureFieldGuideOrder(user.id, body.orderId);
    return Response.json(result, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("PayPal capture failed", error instanceof Error ? error.message : "unknown error");
    return Response.json({ error: "PayPal has not confirmed this payment. You have not been granted paid access." }, { status: 502 });
  }
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
