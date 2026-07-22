import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { getGoogleUserFromCookie } from "../../lib/google-auth";
import { DEFAULT_FIELD_GUIDE_PRICE, hasFieldGuideEntitlement } from "../../lib/paypal";
import { CheckoutButton } from "./CheckoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Complete Field Guide Checkout — WildKind",
  description: "Securely unlock the WildKind Complete Field Guide with PayPal.",
};

export default async function CheckoutPage() {
  const requestHeaders = await headers();
  const user = await getGoogleUserFromCookie(requestHeaders.get("cookie"));
  const unlocked = user ? await hasFieldGuideEntitlement(user.id) : false;

  return <main className="checkout-page">
    <header className="checkout-header"><Link href="/" className="registration-brand">WILD<span>◆</span>KIND</Link><Link href="/pricing">← Back to pricing</Link></header>
    <section className="checkout-shell">
      <aside className="checkout-summary">
        <p className="eyebrow">One map · Yours to keep</p>
        <h1>Complete<br />Field Guide</h1>
        <p>A detailed translation of all five behavioral coordinates, with a practical seven-day care plan and one follow-up retest.</p>
        <ul><li>Detailed five-dimension interpretation</li><li>Personalized care plan</li><li>Saved complete Field Guide</li><li>One follow-up retest</li></ul>
      </aside>
      <section className="checkout-card">
        <div className="checkout-product"><div><span>WILDKIND · DIGITAL FIELD GUIDE</span><h2>Lifetime access for one pet</h2></div><strong>${DEFAULT_FIELD_GUIDE_PRICE}</strong></div>
        <div className="checkout-total"><span>Total due today</span><strong>${DEFAULT_FIELD_GUIDE_PRICE} USD</strong></div>
        <div className="sandbox-banner"><strong>PayPal Sandbox</strong><span>This is a test checkout. No real money will move.</span></div>
        {!user ? <div className="checkout-account-needed"><h3>Establish your basecamp first.</h3><p>Sign in so the Field Guide can be attached securely to your WildKind account.</p><Link className="plan-button" href="/register?return_to=/checkout">Create account or sign in <span>↗</span></Link></div>
          : unlocked ? <div className="checkout-account-needed"><span className="checkout-success-mark">✓</span><h3>Your Field Guide is already unlocked.</h3><p>No additional purchase is needed for this account.</p><Link className="plan-button" href="/checkout/success">Open your Field Guide <span>↗</span></Link></div>
          : <CheckoutButton />}
        <p className="checkout-terms">By continuing, you are purchasing one digital WildKind Complete Field Guide. WildKind is not veterinary or diagnostic advice.</p>
      </section>
    </section>
  </main>;
}
