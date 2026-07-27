import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { getGoogleUserFromCookie } from "../../lib/google-auth";
import { isCreemConfigured } from "../../lib/creem";
import { DEFAULT_FIELD_GUIDE_PRICE, hasFieldGuideEntitlement } from "../../lib/payments";
import { CheckoutButtons } from "./CheckoutButtons";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Complete Field Guide Checkout — WildKind",
  description: "Securely purchase the WildKind Complete Field Guide for one pet with a one-time USD payment through PayPal or Creem.",
  alternates: { canonical: "/checkout" },
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ creem_test?: string }>;
}) {
  const requestHeaders = await headers();
  const user = await getGoogleUserFromCookie(requestHeaders.get("cookie"));
  const unlocked = user ? await hasFieldGuideEntitlement(user.id) : false;
  const creem = isCreemConfigured();
  const showCreem = creem.configured && (creem.environment === "live" || (await searchParams).creem_test === "1");

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
        <div className="payment-banner"><strong>{showCreem ? "Choose a secure checkout" : "Secure PayPal checkout"}</strong><span>{showCreem ? "PayPal is live. Creem remains isolated in Test Mode until its production credentials are approved." : `You will be charged $${DEFAULT_FIELD_GUIDE_PRICE} USD once. This is not a subscription.`}</span></div>
        {!user ? <div className="checkout-account-needed"><h3>Establish your basecamp first.</h3><p>Sign in so the Field Guide can be attached securely to your WildKind account.</p><Link className="plan-button" href="/register?return_to=/checkout">Create account or sign in <span>↗</span></Link></div>
          : unlocked ? <div className="checkout-account-needed"><span className="checkout-success-mark">✓</span><h3>Your Field Guide is already unlocked.</h3><p>No additional purchase is needed for this account.</p><Link className="plan-button" href="/checkout/success">Open your Field Guide <span>↗</span></Link></div>
          : <CheckoutButtons showCreem={showCreem} creemTestMode={creem.environment === "test"} />}
        <p className="checkout-terms">By continuing, you are purchasing one digital WildKind Complete Field Guide. WildKind is not veterinary or diagnostic advice.</p>
      </section>
    </section>
  </main>;
}
