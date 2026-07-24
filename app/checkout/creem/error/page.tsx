import Link from "next/link";

export default function CreemErrorPage() {
  return <main className="payment-status-page"><section className="payment-status-card payment-error">
    <span className="checkout-success-mark">!</span>
    <p className="eyebrow">The test trail paused</p>
    <h1>Creem could not confirm this checkout.</h1>
    <p>No production Field Guide access was granted. Return to the checkout and try again only if Creem did not report a completed test payment.</p>
    <div><Link className="plan-button" href="/checkout?creem_test=1">Return to checkout <span>↗</span></Link><Link href="/">Return to basecamp</Link></div>
  </section></main>;
}
