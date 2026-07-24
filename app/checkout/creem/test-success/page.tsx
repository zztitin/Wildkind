import Link from "next/link";

export default function CreemTestSuccessPage() {
  return <main className="payment-status-page"><section className="payment-status-card payment-complete">
    <span className="checkout-success-mark">✓</span>
    <p className="eyebrow">Creem Test Mode confirmed</p>
    <h1>The test trail completed successfully.</h1>
    <p>Creem verified the simulated $5.99 USD payment. No real money moved and no production Field Guide access was granted.</p>
    <div><Link className="plan-button" href="/checkout?creem_test=1">Run another payment test <span>↗</span></Link><Link href="/">Return to basecamp</Link></div>
  </section></main>;
}
