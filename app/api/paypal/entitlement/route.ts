import { getGoogleUserFromRequest } from "../../../../lib/google-auth";
import { hasFieldGuideEntitlement } from "../../../../lib/paypal";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getGoogleUserFromRequest(request);
  const fieldGuide = user ? await hasFieldGuideEntitlement(user.id) : false;
  return Response.json({ fieldGuide }, { headers: { "Cache-Control": "no-store" } });
}
