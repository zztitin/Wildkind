import { confirmCreemRedirect } from "../../../../lib/creem";
import { getGoogleUserFromRequest } from "../../../../lib/google-auth";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const user = await getGoogleUserFromRequest(request);
  if (!user) {
    return Response.redirect(new URL("/register?return_to=/checkout%3Fcreem_test%3D1", request.url), 303);
  }
  try {
    const result = await confirmCreemRedirect(request, user.id);
    return Response.redirect(
      new URL(result.testMode ? "/checkout/creem/test-success" : "/checkout/success", request.url),
      303,
    );
  } catch (error) {
    console.error("Creem return verification failed", error instanceof Error ? error.message : "unknown error");
    return Response.redirect(new URL("/checkout/creem/error", request.url), 303);
  }
}
