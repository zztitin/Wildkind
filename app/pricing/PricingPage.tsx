import Link from "next/link";

const price = { guide: "5.99", guideStandard: "9.99", pet: "5.99", compass: "29.99" };

const comparison = [
  ["32 careful observations", true, true, true],
  ["Five behavioral coordinates", true, true, true],
  ["Primary WildKind archetype", true, true, true],
  ["Detailed dimension interpretation", false, true, true],
  ["Personalized seven-day care plan", false, true, true],
  ["Saved complete Field Guide", false, true, true],
  ["One follow-up retest", false, true, true],
  ["Up to three pet profiles", false, false, true],
  ["Quarterly retests and score trends", false, false, true],
  ["Ongoing personalized field notes", false, false, true],
] as const;

function PawMark() {
  return <span className="pricing-paw" aria-hidden="true"><i /><i /><i /><b /></span>;
}

function Check({ included }: { included: boolean }) {
  return <span className={included ? "comparison-yes" : "comparison-no"} aria-label={included ? "Included" : "Not included"}>{included ? "✓" : "—"}</span>;
}

export function PricingPage() {
  return <div className="pricing-page">
    <header className="pricing-header">
      <Link href="/" className="pricing-brand"><PawMark /><span>WILD<strong>◆</strong>KIND</span></Link>
      <nav aria-label="Pricing navigation"><Link href="/methodology">Methodology</Link><Link href="/pricing" aria-current="page">Pricing</Link><Link className="pricing-header-cta" href="/register">Create account <span>↗</span></Link></nav>
    </header>

    <main>
      <section className="pricing-hero">
        <div className="pricing-contours" aria-hidden="true"><i /><i /><i /><i /></div>
        <p className="eyebrow">Simple paths · No surprise turns</p>
        <h1>Start with the map.<br /><em>Go deeper when it helps.</em></h1>
        <p>Every pet can begin with a free behavioral Snapshot. Pay once for the complete Field Guide—or wait for an annual plan built around genuine, ongoing value.</p>
        <div className="beta-note"><span>FOUNDING OFFER</span><p>The Complete Field Guide is now available as a secure one-time PayPal purchase. Pay once and keep the guide on your WildKind account.</p></div>
      </section>

      <section className="pricing-plans" aria-labelledby="plans-title">
        <div className="pricing-section-head">
          <div><p className="eyebrow dark">Choose your trail</p><h2 id="plans-title">Clear value at every stage.</h2></div>
          <div className="currency-badge"><span>Checkout currency</span><strong>USD $</strong></div>
        </div>

        <div className="plan-grid">
          <article className="plan-card snapshot-plan">
            <div className="plan-number">01 · ORIENTATION</div>
            <h3>WildKind Snapshot</h3>
            <p className="plan-purpose">A useful first map of your pet&apos;s recurring behavioral patterns.</p>
            <div className="plan-price"><strong>Free</strong><span>for one pet</span></div>
            <ul><li>Complete 32-observation assessment</li><li>Five behavioral coordinates</li><li>Primary WildKind archetype</li><li>Short interpretation and starting ideas</li></ul>
            <Link className="plan-button secondary-plan-button" href="/">Begin free assessment <span>↗</span></Link>
            <small>No card required · About eight minutes</small>
          </article>

          <article className="plan-card guide-plan">
            <div className="recommended-flag">Founding offer</div>
            <div className="plan-number">02 · COMPLETE FIELD GUIDE</div>
            <h3>Understand the whole terrain.</h3>
            <p className="plan-purpose">A lasting, practical guide for owners who want more than a personality label.</p>
            <div className="plan-price"><strong>${price.guide}</strong><span>USD · one time · per pet<br /><s>${price.guideStandard} standard price</s></span></div>
            <ul><li>Everything in the free Snapshot</li><li>Detailed interpretation of all five dimensions</li><li>Personalized seven-day care plan</li><li>Saved complete Field Guide</li><li>One follow-up retest</li></ul>
            <Link className="plan-button" href="/checkout">Purchase with PayPal <span>↗</span></Link>
            <small>Secure PayPal checkout · One-time payment</small>
          </article>

          <article className="plan-card compass-plan">
            <div className="plan-number">03 · CONTINUING EXPEDITION</div>
            <h3>WildKind Compass</h3>
            <p className="plan-purpose">For multi-pet homes that want to follow change over time.</p>
            <div className="plan-price"><strong>${price.compass}</strong><span>USD · per year<br />about $2.50/month</span></div>
            <ul><li>Complete guides for up to three pets</li><li>Quarterly retests and score trends</li><li>Ongoing personalized field notes</li><li>Full report and observation history</li><li>Additional pets at ${price.pet} each</li></ul>
            <Link className="plan-button secondary-plan-button" href="/register">Join the founding list <span>↗</span></Link>
            <small>Opening after beta · No subscription starts today</small>
          </article>
        </div>
        <p className="currency-note">All PayPal charges are denominated in USD. The Complete Field Guide is a one-time purchase—not a recurring subscription.</p>
      </section>

      <section className="pricing-principle">
        <PawMark />
        <div><p className="eyebrow">Our pricing compass</p><blockquote>Charge for depth and continuity.<br />Never for dignity, privacy, or safety.</blockquote></div>
        <p>The basic result, account controls, data export and deletion remain accessible. Research participation is always optional and never tied to a discount.</p>
      </section>

      <section className="comparison-section" aria-labelledby="compare-title">
        <div className="pricing-section-head"><div><p className="eyebrow dark">The field kit</p><h2 id="compare-title">Compare every coordinate.</h2></div><p>Community discovery and mutual-consent messaging remain free while the network grows.</p></div>
        <div className="comparison-wrap">
          <table>
            <thead><tr><th scope="col">What you receive</th><th scope="col">Snapshot<br /><span>Free</span></th><th scope="col">Field Guide<br /><span>${price.guide}</span></th><th scope="col">Compass<br /><span>${price.compass}/yr</span></th></tr></thead>
            <tbody>{comparison.map(([feature, snapshot, guide, compass]) => <tr key={feature}><th scope="row">{feature}</th><td><Check included={snapshot} /></td><td><Check included={guide} /></td><td><Check included={compass} /></td></tr>)}</tbody>
          </table>
        </div>
      </section>

      <section className="pricing-faq" aria-labelledby="faq-title">
        <div><p className="eyebrow">Field questions</p><h2 id="faq-title">Good maps make the boundaries clear.</h2><p>If pricing changes after beta, existing users will be told before it affects them.</p></div>
        <div className="faq-list">
          <details open><summary>How will I be charged?</summary><p>PayPal processes a one-time $5.99 USD payment for the Complete Field Guide. No subscription is created.</p></details>
          <details><summary>Why is the Field Guide a one-time purchase?</summary><p>A personality assessment is naturally episodic. You should not need a subscription simply to keep a report you already created.</p></details>
          <details><summary>What makes Compass worth renewing?</summary><p>Compass will launch only when it includes recurring value: multi-pet profiles, quarterly retests, score trends, ongoing guidance and complete history.</p></details>
          <details><summary>Is WildKind veterinary or diagnostic advice?</summary><p>No. WildKind describes observed behavioral tendencies. Sudden changes, health concerns and safety risks should be discussed with an appropriate veterinary or behavioral professional.</p></details>
          <details><summary>Can I keep using community features for free?</summary><p>Yes. Discovery, connection requests, mutual-consent messaging, blocking and reporting are not part of a paid tier during this stage.</p></details>
        </div>
      </section>

      <section className="pricing-final-cta">
        <span>FIELD NOTE 02 · A FAIR START</span>
        <h2>Your pet&apos;s territory is already worth understanding.</h2>
        <p>Begin with one careful observation set. Decide how far you want to explore after you see the map.</p>
        <div><Link className="plan-button" href="/">Begin free assessment <span>↗</span></Link><Link className="text-link" href="/register">Create a private account</Link></div>
      </section>
    </main>

    <footer className="pricing-footer"><Link href="/" className="pricing-brand"><PawMark /><span>WILD<strong>◆</strong>KIND</span></Link><p>Warm science for the individual animal.</p><nav><Link href="/pricing">Pricing</Link><Link href="/methodology">Methodology</Link><Link href="/register">Account</Link></nav><small>© 2026 WildKind · Snapshot v0.1 · Not veterinary advice</small></footer>
  </div>;
}
