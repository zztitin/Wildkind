import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sample Field Guide — WildKind",
  description:
    "Explore a complete fictional WildKind Field Guide for Buddy, including five behavioral dimensions, archetype interpretation, stress factors, and a seven-day care plan.",
  alternates: { canonical: "/sample-field-guide" },
  openGraph: {
    title: "Sample Field Guide — Meet Buddy's WildKind",
    description:
      "A complete fictional WildKind report showing the behavioral map, narrative profile, trade-offs, stress factors, and practical care plan.",
    url: "/sample-field-guide",
    images: [
      {
        url: "/sample-field-guide-og.png",
        width: 1536,
        height: 1024,
        alt: "WildKind sample Field Guide for the fictional dog Buddy",
      },
    ],
  },
};

const scores = [
  {
    code: "DD",
    name: "Discovery Drive",
    score: 82,
    interpretation: "More frequently expressed",
    evidence: [
      "Moved toward safe new objects quickly",
      "Sustained investigation of scent and search activities",
    ],
    context:
      "May appear less exploratory in noisy spaces or when no retreat is available.",
  },
  {
    code: "SE",
    name: "Social Energy",
    score: 78,
    interpretation: "More frequently expressed",
    evidence: [
      "Often initiated play or proximity with familiar people",
      "Readily joined ordinary household activity",
    ],
    context:
      "High participation does not mean every person or animal is welcome.",
  },
  {
    code: "BS",
    name: "Bonding Style",
    score: 55,
    interpretation: "Context-dependent expression",
    evidence: [
      "Comfortably shared neutral space with familiar people",
      "Sometimes invited familiar contact to continue",
    ],
    context:
      "Affiliation was clearest during familiar routines and lower-pressure contact.",
  },
  {
    code: "BR",
    name: "Behavioral Regulation",
    score: 53,
    interpretation: "Context-dependent expression",
    evidence: [
      "Usually shifted when an accessible alternative was offered",
      "Needed extra help when exciting play ended abruptly",
    ],
    context:
      "Regulation was easier after predictable cues than after sudden interruption.",
  },
  {
    code: "ER",
    name: "Emotional Resilience",
    score: 59,
    interpretation: "Context-dependent expression",
    evidence: [
      "Recovered readily after ordinary household sounds",
      "Needed longer after crowded or highly social events",
    ],
    context:
      "Recovery time varied with intensity, duration, and access to a quiet resting place.",
  },
] as const;

const carePlan = [
  {
    day: "01–02",
    title: "Give curiosity a clear trail",
    reason: "Supports higher Discovery Drive without creating constant stimulation.",
    try:
      "Set up a three-stop scent trail using familiar food or a safe, known scent source.",
    start: "One trail of 3–5 minutes, once per day.",
    look: "Loose movement, voluntary investigation, and an easy return to you.",
    pause:
      "Buddy becomes frantic, repeatedly scratches at inaccessible areas, or cannot disengage.",
  },
  {
    day: "03–04",
    title: "Practice a predictable ending",
    reason:
      "Supports the interaction between high enthusiasm and context-dependent regulation.",
    try:
      "Use the same closing cue at the end of play, then offer a familiar chew, mat, or sniffing activity.",
    start: "One transition after a short, familiar play session.",
    look: "A brief pause followed by choosing the alternative activity.",
    pause:
      "Repetition escalates, body tension rises, or the alternative is ignored for more than a minute.",
  },
  {
    day: "05–07",
    title: "Balance company with recovery",
    reason:
      "Supports higher Social Energy while respecting variable Emotional Resilience.",
    try:
      "Plan one small familiar social activity, followed by uninterrupted access to Buddy's usual quiet space.",
    start: "Five minutes of social activity, then at least 15 minutes of choice-led recovery.",
    look: "Voluntary approach during the activity and ordinary resting afterward.",
    pause:
      "Buddy avoids re-entry, scans continuously, paces, or remains unsettled after the activity ends.",
  },
] as const;

function PawMark() {
  return (
    <span className="sample-paw" aria-hidden="true">
      <i />
      <i />
      <i />
      <b />
    </span>
  );
}

function RadarChart() {
  return (
    <figure className="sample-radar-figure">
      <header className="sample-radar-header">
        <div><span>Behavioral coordinate map</span><strong>BUDDY · SNAPSHOT 0.1</strong></div>
        <small>ASSESSMENT SCALE<br /><b>0 — 100</b></small>
      </header>
      <div className="sample-radar-layout">
        <div
          className="sample-radar"
          role="img"
          aria-label="Buddy's radar chart: Discovery Drive 82, Social Energy 78, Bonding Style 55, Behavioral Regulation 53, Emotional Resilience 59"
        >
          <div className="radar-grid radar-grid-100" />
          <div className="radar-grid radar-grid-75" />
          <div className="radar-grid radar-grid-50" />
          <div className="radar-grid radar-grid-25" />
          <i className="radar-axis axis-1" /><i className="radar-axis axis-2" />
          <i className="radar-axis axis-3" /><i className="radar-axis axis-4" />
          <i className="radar-axis axis-5" />
          <div className="radar-data" />
          <i className="radar-point radar-point-dd" /><i className="radar-point radar-point-se" />
          <i className="radar-point radar-point-bs" /><i className="radar-point radar-point-br" />
          <i className="radar-point radar-point-er" />
          <span className="radar-code radar-code-dd">DD</span>
          <span className="radar-code radar-code-se">SE</span>
          <span className="radar-code radar-code-bs">BS</span>
          <span className="radar-code radar-code-br">BR</span>
          <span className="radar-code radar-code-er">ER</span>
          <span className="radar-center">5<small>coordinates</small></span>
        </div>
        <ol className="sample-radar-key" aria-label="Buddy's five coordinate scores">
          {scores.map((score) => (
            <li key={score.code}>
              <b>{score.code}</b>
              <span>{score.name}</span>
              <strong>{score.score}</strong>
            </li>
          ))}
        </ol>
      </div>
      <footer className="sample-radar-scale"><span>Less frequently expressed</span><i /><span>More frequently expressed</span></footer>
      <figcaption>Continuous behavioral coordinates · No population percentiles</figcaption>
    </figure>
  );
}

export default function SampleFieldGuidePage() {
  return (
    <div className="sample-guide-page">
      <header className="sample-guide-header">
        <Link href="/" className="sample-guide-brand"><PawMark /><span>WILDKIND</span></Link>
        <nav aria-label="Sample Field Guide navigation">
          <Link href="/resources/pet-behavior-observation-checklist">Free checklist</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/pricing">Pricing</Link>
          <Link className="sample-header-cta" href="/register">Create account <span aria-hidden="true">↗</span></Link>
        </nav>
      </header>

      <aside className="sample-disclosure">
        <strong>This is a sample report, generated based on the fictional pet ‘Buddy’</strong>
        <span>No real user, account, or assessment data appears on this page.</span>
      </aside>

      <main>
        <article>
          <section className="sample-cover">
            <div className="sample-cover-copy">
              <p className="eyebrow">Complete Field Guide · Sample</p>
              <span className="sample-profile-status">Owner-reported Snapshot · Strong coverage</span>
              <h1>Buddy&apos;s<br /><em>wild terrain.</em></h1>
              <p>
                A curious, socially visible adult dog who tends to move toward
                what is happening next—and benefits from clear endings and
                deliberate recovery time.
              </p>
            </div>
            <dl className="sample-pet-facts">
              <div><dt>Pet</dt><dd>Buddy</dd></div>
              <div><dt>Species</dt><dd>Dog · fictional mixed breed</dd></div>
              <div><dt>Life stage</dt><dd>Adult · fictional age 4</dd></div>
              <div><dt>Assessment</dt><dd>29 July 2026</dd></div>
              <div><dt>Questionnaire</dt><dd>Snapshot v0.1</dd></div>
              <div><dt>Evidence</dt><dd>Owner report · 30-day recall</dd></div>
            </dl>
          </section>

          <section className="sample-profile-summary" aria-labelledby="profile-map-title">
            <div className="sample-section-heading">
              <p className="eyebrow dark">01 · Profile summary</p>
              <h2 id="profile-map-title">Five coordinates.<br />One recent pattern.</h2>
              <p>Scores describe how frequently the fictional observations were expressed. They are not grades or percentiles.</p>
            </div>
            <RadarChart />
          </section>

          <section className="sample-prototype">
            <div className="sample-prototype-seal"><PawMark /><span>Provisional narrative match</span></div>
            <div>
              <p className="eyebrow">02 · Field-guide prototype</p>
              <h2>Thundertrail Scout</h2>
              <blockquote>“The next interesting thing rarely goes unnoticed.”</blockquote>
              <p>
                Buddy&apos;s fictional map sits nearest the Thundertrail Scout
                prototype: active, socially visible, and eager to investigate
                what happens next. The name translates the shape of the five
                scores; it is not a fixed biological type.
              </p>
              <div className="sample-prototype-details">
                <article><strong>Likely tendencies</strong><ul><li>Investigates safe novelty readily</li><li>Joins familiar activity without much prompting</li><li>Stays engaged when an experience remains rewarding</li></ul></article>
                <article><strong>May look different when</strong><ul><li>The environment is crowded or unpredictable</li><li>Exciting access ends without a clear transition</li><li>Buddy has not had enough recovery time</li></ul></article>
                <article><strong>Enrichment preferences</strong><ul><li>Choice-led scent and search activities</li><li>Short cooperative games with clear beginnings and endings</li></ul></article>
                <article><strong>Do not assume</strong><p>Enthusiasm does not mean every person, animal, object, or environment is safe or welcome.</p></article>
              </div>
            </div>
          </section>

          <section className="sample-dimensions" aria-labelledby="dimension-title">
            <div className="sample-section-heading">
              <p className="eyebrow dark">03 · Dimension detail</p>
              <h2 id="dimension-title">The evidence behind the shape.</h2>
              <p>Every coordinate shows its score, interpretation, coverage, contributing observations, and one reason to stay cautious.</p>
            </div>
            <div className="sample-score-list">
              {scores.map((dimension, index) => (
                <article key={dimension.code}>
                  <div className="sample-score-index"><span>0{index + 1}</span><b>{dimension.code}</b></div>
                  <div className="sample-score-main">
                    <div><h3>{dimension.name}</h3><p>{dimension.interpretation}</p></div>
                    <strong>{dimension.score}<small>/100</small></strong>
                    <div className="sample-score-track"><i style={{ width: `${dimension.score}%` }} /></div>
                    <dl>
                      <div><dt>Source & coverage</dt><dd>Owner report · Strong coverage</dd></div>
                      <div><dt>Contributing observations</dt><dd>{dimension.evidence[0]}<br />{dimension.evidence[1]}</dd></div>
                      <div><dt>Interpret with context</dt><dd>{dimension.context}</dd></div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="sample-tradeoffs">
            <div>
              <p className="eyebrow">04 · Practical translation</p>
              <h2>Advantages and disadvantages.</h2>
              <p>Every pattern brings useful capacities and possible trade-offs. Neither side is a moral judgment.</p>
            </div>
            <div className="sample-tradeoff-columns">
              <article>
                <span>Likely advantages</span>
                <ul>
                  <li><strong>Fast engagement:</strong> New enrichment often becomes usable without a long warm-up.</li>
                  <li><strong>Visible communication:</strong> Social interest and participation are usually easy for a caregiver to notice.</li>
                  <li><strong>Flexible curiosity:</strong> Buddy may find several rewarding ways to explore a familiar environment.</li>
                  <li><strong>Shared activity:</strong> Cooperative games can support both enrichment and connection.</li>
                </ul>
              </article>
              <article>
                <span>Possible disadvantages</span>
                <ul>
                  <li><strong>Over-engagement:</strong> Interesting events may make rest or disengagement harder.</li>
                  <li><strong>Expectation loops:</strong> Repeated exciting outcomes can produce persistent requests.</li>
                  <li><strong>Social spillover:</strong> Joining activity readily can be mistaken for universal comfort.</li>
                  <li><strong>Delayed recovery:</strong> Several stimulating events close together may accumulate even when each seems manageable.</li>
                </ul>
              </article>
            </div>
          </section>

          <section className="sample-stress" aria-labelledby="stress-title">
            <div className="sample-section-heading">
              <p className="eyebrow dark">05 · Stress factors</p>
              <h2 id="stress-title">What may narrow Buddy&apos;s choices.</h2>
              <p>These are hypotheses from the fictional score pattern—not diagnoses or predictions.</p>
            </div>
            <div className="sample-stress-grid">
              <article><span>01</span><h3>Abrupt endings</h3><p>Exciting access disappearing without a familiar cue may increase repetition or make the next activity harder to choose.</p></article>
              <article><span>02</span><h3>Stacked stimulation</h3><p>Visitors, play, travel, and novel environments in quick succession may extend recovery time.</p></article>
              <article><span>03</span><h3>Forced greetings</h3><p>Visible social energy can create pressure to interact when Buddy would benefit from distance or choice.</p></article>
              <article><span>04</span><h3>No retreat option</h3><p>Curiosity is safer and more informative when Buddy can pause, move away, or return voluntarily.</p></article>
            </div>
          </section>

          <section className="sample-care-plan" aria-labelledby="care-title">
            <div className="sample-section-heading">
              <p className="eyebrow dark">06 · Personalized seven-day plan</p>
              <h2 id="care-title">Three actions. One manageable week.</h2>
              <p>Recommendations come from the dimension pattern and context—not from the archetype name alone.</p>
            </div>
            <div className="sample-care-list">
              {carePlan.map((item, index) => (
                <article key={item.title}>
                  <div className="sample-care-number"><span>0{index + 1}</span><b>Days {item.day}</b></div>
                  <div>
                    <h3>{item.title}</h3>
                    <p className="sample-care-reason">{item.reason}</p>
                    <dl>
                      <div><dt>Try</dt><dd>{item.try}</dd></div>
                      <div><dt>Start with</dt><dd>{item.start}</dd></div>
                      <div><dt>Look for</dt><dd>{item.look}</dd></div>
                      <div><dt>Pause if</dt><dd>{item.pause}</dd></div>
                    </dl>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="sample-context">
            <div className="sample-section-heading">
              <p className="eyebrow dark">07 · Context & follow-up</p>
              <h2>What makes this Snapshot readable.</h2>
            </div>
            <div>
              <dl className="sample-context-grid">
                <div><dt>Observation coverage</dt><dd><strong>Strong</strong> · all 25 situations answered; fictional caregiver recalled at least three occasions for 21–25 items.</dd></div>
                <div><dt>Health and medication</dt><dd><strong>No fictional change reported</strong> during the 30-day recall period.</dd></div>
                <div><dt>Major life change</dt><dd><strong>No major fictional change reported.</strong></dd></div>
                <div><dt>Independent perspective</dt><dd><strong>Mostly similar.</strong> A fictional second caregiver described broadly consistent recent behavior.</dd></div>
              </dl>
              <aside>
                <strong>Observation to record next</strong>
                <p>After an exciting activity ends, note the closing cue, the alternative offered, and how long Buddy takes to begin an ordinary relaxed activity.</p>
                <span>Suggested follow-up retest: after 30 days of ordinary routine, or later if the month contains unusual health or household changes.</span>
              </aside>
            </div>
          </section>

          <section className="sample-boundary">
            <strong>Scientific and safety boundary</strong>
            <p>
              WildKind describes recurring behavioral tendencies. It is not
              veterinary advice, an aggression assessment, a diagnosis, or a
              guarantee that animals or people can interact safely. Sudden
              changes, distress, health concerns, or safety risks require
              appropriate professional support.
            </p>
          </section>
        </article>

        <section className="sample-final-cta">
          <span>END OF FICTIONAL SAMPLE · FIELD GUIDE 01/01</span>
          <h2>Ready to map an individual pet?</h2>
          <p>Begin with the free Snapshot. Purchase a complete Field Guide only after you have seen the five-coordinate result.</p>
          <div><Link className="plan-button" href="/">Begin free assessment <span aria-hidden="true">↗</span></Link><Link href="/pricing">See pricing</Link></div>
        </section>
      </main>

      <footer className="sample-guide-footer">
        <Link href="/" className="sample-guide-brand"><PawMark /><span>WILDKIND</span></Link>
        <p>Warm science for the individual animal.</p>
        <nav><Link href="/resources/pet-behavior-observation-checklist">Free checklist</Link><Link href="/sample-field-guide">Sample report</Link><Link href="/methodology">Methodology</Link><Link href="/pricing">Pricing</Link></nav>
        <small>© 2026 WildKind · Fictional demonstration · Not veterinary advice</small>
      </footer>
    </div>
  );
}
