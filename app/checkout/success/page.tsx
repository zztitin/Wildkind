import Link from "next/link";
import { headers } from "next/headers";
import { getGoogleUserFromCookie } from "../../../lib/google-auth";
import { hasFieldGuideEntitlement } from "../../../lib/payments";

export const dynamic = "force-dynamic";

export default async function CheckoutSuccessPage() {
  const requestHeaders = await headers();
  const user = await getGoogleUserFromCookie(requestHeaders.get("cookie"));
  const unlocked = user ? await hasFieldGuideEntitlement(user.id) : false;

  return <main className="payment-status-page"><section className={`payment-status-card ${unlocked ? "payment-complete" : "payment-error"}`}>
    <span className="checkout-success-mark">{unlocked ? "✓" : "!"}</span>
    <p className="eyebrow">{unlocked ? "Field Guide unlocked" : "Confirmation still pending"}</p>
    <h1>{unlocked ? "The complete terrain is yours." : "We are still checking the trail."}</h1>
    <p>{unlocked ? "Your one-time purchase is confirmed. Detailed guidance is now available on this account." : "PayPal has not yet produced a completed entitlement for this account. Do not repeat payment unless the checkout page confirms it is safe."}</p>
    <div>{unlocked && <Link className="plan-button" href="/?open=field-guide">Open the Field Guide <span>↗</span></Link>}<Link href={unlocked ? "/" : "/checkout"}>{unlocked ? "Return to basecamp" : "Return to checkout"}</Link></div>
  </section></main>;
}
