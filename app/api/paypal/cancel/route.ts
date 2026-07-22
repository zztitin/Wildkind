import { getGoogleUserFromRequest } from "../../../../lib/google-auth";
import { cancelFieldGuideOrder } from "../../../../lib/paypal";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const user = await getGoogleUserFromRequest(request);
  if (!user) return Response.json({ ok: true });
  if (!sameOrigin(request)) return Response.json({ error: "Invalid checkout origin" }, { status: 403 });
  const body = await request.json<{ orderId?: string }>().catch(() => ({}));
  if (body.orderId) await cancelFieldGuideOrder(user.id, body.orderId);
  return Response.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
}

function sameOrigin(request: Request) {
  const origin = request.headers.get("origin");
  return !origin || origin === new URL(request.url).origin;
}
