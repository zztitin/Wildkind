import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "WildKind Methodology — Our Approach",
  description:
    "See how WildKind's five behavioral dimensions, 32 observations, scoring rules, coverage checks, and provisional archetypes work.",
  alternates: { canonical: "/methodology" },
  openGraph: {
    title: "WildKind Methodology — Our Approach",
    description:
      "A transparent guide to the questions, scoring, evidence, limitations, and review status behind the WildKind Snapshot.",
    url: "/methodology",
  },
};

const dimensions = [
  {
    code: "DD",
    name: "Discovery Drive",
    purpose:
      "How readily a pet approaches, investigates, and persists with safe novelty.",
    why:
      "The five observations move from a new object to a new space, an altered familiar environment, and optional enrichment. This samples exploration across ordinary contexts instead of treating one bold or hesitant moment as a stable trait.",
    boundary: "It is not a measure of intelligence, courage, or trainability.",
  },
  {
    code: "SE",
    name: "Social Energy",
    purpose:
      "How often a pet voluntarily begins, joins, and sustains social participation.",
    why:
      "The questions separate initiation from duration and include familiar people, household gatherings, and known compatible animals. Voluntary choice matters: forced proximity is not counted as social interest.",
    boundary: "It is not a measure of popularity, kindness, or social competence.",
  },
  {
    code: "BS",
    name: "Bonding Style",
    purpose:
      "How a pet expresses affiliation, cooperative proximity, and comfort in trusted relationships.",
    why:
      "Observations cover accepted contact, re-engagement, familiar care routines, and resource-neutral shared space. They ask what the relationship looks like behaviorally without assuming that every species or individual shows attachment in the same way.",
    boundary: "It is not a measure of love, loyalty, or whether a pet is “good.”",
  },
  {
    code: "BR",
    name: "Behavioral Regulation",
    purpose:
      "How flexibly a pet pauses, disengages, transitions, and settles after an ordinary activity.",
    why:
      "The situations involve blocked access, the end of play, an available alternative, and routine transitions. These make regulation observable while avoiding moral labels for excitement, persistence, or frustration.",
    boundary: "It is not obedience or a direct equivalent of human conscientiousness.",
  },
  {
    code: "ER",
    name: "Emotional Resilience",
    purpose:
      "How intensely and for how long a pet responds to manageable everyday stress, expressed through recovery.",
    why:
      "The items focus on returning to ordinary behavior after a sound, visitor, routine change, minor frustration, or brief separation. Recovery is more concrete for an owner to recall than guessing an animal's inner emotional state.",
    boundary: "It is not the absence of fear, a diagnosis, or a safety prediction.",
  },
];

const references = [
  {
    authors: "Gosling, S. D., & John, O. P. (1999).",
    title: "Personality Dimensions in Nonhuman Animals: A Cross-Species Review.",
    journal: "Current Directions in Psychological Science, 8(3), 69–75.",
    doi: "10.1111/1467-8721.00017",
    use:
      "Cross-species foundation for describing stable behavioral differences while avoiding a simple transfer of the human Five-Factor Model.",
  },
  {
    authors: "Gosling, S. D., Kwan, V. S. Y., & John, O. P. (2003).",
    title:
      "A Dog's Got Personality: A Cross-Species Comparative Approach to Personality Judgments in Dogs and Humans.",
    journal: "Journal of Personality and Social Psychology, 85(6), 1161–1169.",
    doi: "10.1037/0022-3514.85.6.1161",
    use:
      "Evidence that knowledgeable observers can make meaningful personality judgments about dogs, with important limits on cross-species equivalence.",
  },
  {
    authors: "Jones, A. C., & Gosling, S. D. (2005).",
    title:
      "Temperament and Personality in Dogs (Canis familiaris): A Review and Evaluation of Past Research.",
    journal: "Applied Animal Behaviour Science, 95(1–2), 1–53.",
    doi: "10.1016/j.applanim.2005.04.008",
    use:
      "Informed the use of multiple observable situations and the distinction between owner ratings and controlled behavioral tests.",
  },
  {
    authors:
      "Litchfield, C. A., Quinton, G., Tindle, H., Chiera, B., Kikillus, K. H., & Roetman, P. (2017).",
    title:
      "The ‘Feline Five’: An Exploration of Personality in Pet Cats (Felis catus).",
    journal: "PLOS ONE, 12(8), e0183455.",
    doi: "10.1371/journal.pone.0183455",
    use:
      "A cat-specific example of large-scale owner reports and factor analysis; WildKind does not claim its five coordinates reproduce the Feline Five.",
  },
  {
    authors: "Fratkin, J. L., Sinn, D. L., Patall, E. A., & Gosling, S. D. (2013).",
    title: "Personality Consistency in Dogs: A Meta-Analysis.",
    journal: "PLOS ONE, 8(1), e54907.",
    doi: "10.1371/journal.pone.0054907",
    use:
      "Supports treating consistency as an empirical question affected by age, interval, and measurement method—not an assumption about a fixed type.",
  },
];

function PawMark() {
  return (
    <span className="methodology-paw" aria-hidden="true">
      <i />
      <i />
      <i />
      <b />
    </span>
  );
}

export default function MethodologyPage() {
  return (
    <div className="methodology-page">
      <header className="methodology-header">
        <Link href="/" className="methodology-brand">
          <PawMark />
          <span>WILDKIND</span>
        </Link>
        <nav aria-label="Methodology navigation">
          <Link href="/resources/pet-behavior-observation-checklist">Free checklist</Link>
          <Link href="/methodology" aria-current="page">Methodology</Link>
          <Link href="/pricing">Pricing</Link>
          <Link className="methodology-header-cta" href="/register">
            Create account <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <main>
        <article>
          <section className="methodology-hero">
            <div className="methodology-contours" aria-hidden="true"><i /><i /><i /><i /></div>
            <p className="eyebrow">Field note 03 · Research & method</p>
            <h1>WildKind Methodology.<br /><em>Observation before interpretation.</em></h1>
            <p className="methodology-lede">
              This page documents the questionnaire and scoring system used by the
              current WildKind Snapshot. It explains what is measured, why each
              question is asked, how answers become scores, and where the method
              must remain cautious.
            </p>
            <dl className="methodology-status">
              <div><dt>Release</dt><dd>Snapshot v0.1</dd></div>
              <div><dt>Format</dt><dd>Owner-reported observation</dd></div>
              <div><dt>Updated</dt><dd><time dateTime="2026-07-29">29 July 2026</time></dd></div>
              <div><dt>Validation</dt><dd>Not independently validated</dd></div>
            </dl>
          </section>

          <nav className="methodology-index" aria-label="On this page">
            <strong>On this page</strong>
            <ol>
              <li><a href="#principles">01 · Principles</a></li>
              <li><a href="#dimensions">02 · Five dimensions</a></li>
              <li><a href="#questions">03 · Question design</a></li>
              <li><a href="#scoring">04 · Scoring</a></li>
              <li><a href="#archetypes">05 · Archetypes</a></li>
              <li><a href="#limits">06 · Limits</a></li>
              <li><a href="#references">07 · References</a></li>
              <li><a href="#review">08 · Review history</a></li>
            </ol>
          </nav>

          <section id="principles" className="methodology-section methodology-principles">
            <div className="methodology-section-heading">
              <p className="eyebrow dark">01 · Principles</p>
              <h2>A behavioral snapshot, not a verdict.</h2>
            </div>
            <div className="methodology-prose">
              <p>
                WildKind asks a caregiver to recall recurring, observable behavior
                from the last 30 days. The unit of interpretation is the individual
                pet in recent, ordinary contexts—not a breed stereotype and not one
                unusually good or difficult day.
              </p>
              <div className="methodology-principle-grid">
                <article><span>Observe</span><h3>Behavior before labels</h3><p>Questions describe an action, situation, and time window so owners can recall events rather than rate vague adjectives.</p></article>
                <article><span>Repeat</span><h3>Patterns before moments</h3><p>Owners are asked to think across several occasions. “Not observed” is valid when a situation did not occur.</p></article>
                <article><span>Context</span><h3>Health before personality</h3><p>Pain, medication, major life changes, and sudden behavior changes are captured separately and can change how a result should be read.</p></article>
                <article><span>Translate</span><h3>Dimensions before archetypes</h3><p>Five continuous scores are the result. The named archetype is a memorable narrative translation, not a biological category.</p></article>
              </div>
            </div>
          </section>

          <section id="dimensions" className="methodology-section">
            <div className="methodology-section-heading">
              <p className="eyebrow dark">02 · Five dimensions</p>
              <h2>Why these questions are asked.</h2>
              <p>Each coordinate contains five scored observations, including one reverse-keyed item to reduce automatic agreement.</p>
            </div>
            <div className="methodology-dimensions">
              {dimensions.map((dimension, index) => (
                <article key={dimension.code}>
                  <div className="methodology-dimension-code"><span>0{index + 1}</span><b>{dimension.code}</b></div>
                  <div>
                    <h3>{dimension.name}</h3>
                    <p className="methodology-purpose">{dimension.purpose}</p>
                    <h4>Design logic</h4>
                    <p>{dimension.why}</p>
                    <p className="methodology-boundary"><strong>Boundary:</strong> {dimension.boundary}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section id="questions" className="methodology-section methodology-question-design">
            <div className="methodology-section-heading">
              <p className="eyebrow dark">03 · Question design</p>
              <h2>32 prompts, with different jobs.</h2>
            </div>
            <div className="methodology-prose">
              <div className="methodology-counts" aria-label="Question structure">
                <div><strong>25</strong><span>scored observations</span></div>
                <div><strong>5</strong><span>coordinates</span></div>
                <div><strong>7</strong><span>context & quality notes</span></div>
                <div><strong>30</strong><span>day recall window</span></div>
              </div>
              <p>
                The 25 scored items are interleaved across the five dimensions so
                the assessment does not feel like five obvious rating blocks. Every
                item names a safe, ordinary situation and a behavior that can be
                observed. One item in each dimension is phrased in the opposite
                direction and reverse-scored.
              </p>
              <p>
                The final seven prompts are not added to any personality score.
                They record time living together, health or medication changes,
                major life events, sudden behavior change, how many situations were
                observed repeatedly, and whether a second caregiver has offered an
                independent perspective.
              </p>
              <aside className="methodology-note">
                <strong>Response scale</strong>
                <p>Never = 0 · Rarely = 1 · Sometimes = 2 · Often = 3 · Almost always = 4</p>
                <p>“Not observed / not applicable” is treated as missing information—not as zero.</p>
              </aside>
            </div>
          </section>

          <section id="scoring" className="methodology-section methodology-scoring">
            <div className="methodology-section-heading">
              <p className="eyebrow dark">04 · Scoring</p>
              <h2>From an answer to a coordinate.</h2>
            </div>
            <div className="methodology-prose">
              <ol className="methodology-steps">
                <li><span>01</span><div><h3>Key each answer</h3><p>Forward items retain their 0–4 value. A reverse-keyed item uses <code>4 − selected value</code>.</p></div></li>
                <li><span>02</span><div><h3>Check observation coverage</h3><p>A dimension needs at least four answered items. With fewer than four, the score is shown as “Insufficient observation.”</p></div></li>
                <li><span>03</span><div><h3>Calculate the mean</h3><p>Add the available keyed values and divide by the number of available items in that dimension.</p></div></li>
                <li><span>04</span><div><h3>Convert to 0–100</h3><p>Multiply the 0–4 mean by 25 and round to the nearest whole number.</p></div></li>
              </ol>
              <div className="methodology-formula">
                <span>DOMAIN SCORE</span>
                <code>(sum of available keyed answers ÷ answered items) × 25</code>
              </div>
              <div className="methodology-coverage">
                <article><strong>Strong coverage</strong><p>All five items answered and the caregiver reports at least three examples for 21–25 of the scored situations.</p></article>
                <article><strong>Adequate coverage</strong><p>At least four items in the dimension are answered.</p></article>
                <article><strong>Insufficient observation</strong><p>Fewer than four items are answered; no domain score should be interpreted.</p></article>
              </div>
              <p className="methodology-caution">
                Coverage describes completeness of the observations. It is not a
                confidence interval, reliability coefficient, percentile, or proof
                that the score is accurate.
              </p>
            </div>
          </section>

          <section id="archetypes" className="methodology-section methodology-archetypes">
            <div className="methodology-section-heading">
              <p className="eyebrow">05 · Narrative layer</p>
              <h2>How scores correspond to an archetype.</h2>
            </div>
            <div className="methodology-prose">
              <p>
                When all five domain scores are available, the pet is represented
                as an ordered vector: <code>[DD, SE, BS, BR, ER]</code>. Each of the
                16 provisional field-guide prototypes has a reference vector built
                from low, middle, and high anchors at 20, 50, and 80.
              </p>
              <div className="methodology-formula dark-formula">
                <span>PROTOTYPE DISTANCE</span>
                <code>√ Σ (pet scoreᵢ − prototype scoreᵢ)²</code>
              </div>
              <p>
                WildKind calculates Euclidean distance to every prototype. The
                nearest vector supplies the primary narrative name. If the
                difference between the two closest distances is less than 10
                points, the result is described as a blend.
              </p>
              <aside className="methodology-note dark-note">
                <strong>What the match does not mean</strong>
                <p>
                  The prototypes were designed as an editorial interpretation
                  layer. They were not discovered through clustering a normative
                  population, and the distance is not a probability, percentile,
                  diagnosis, or measure of compatibility.
                </p>
              </aside>
            </div>
          </section>

          <section id="limits" className="methodology-section methodology-limits">
            <div className="methodology-section-heading">
              <p className="eyebrow dark">06 · Limitations</p>
              <h2>Where the map must stop.</h2>
            </div>
            <div className="methodology-prose">
              <ul className="methodology-limit-list">
                <li><strong>Not diagnostic.</strong> WildKind cannot diagnose anxiety, pain, cognitive change, a behavior disorder, or any medical condition.</li>
                <li><strong>Not a safety assessment.</strong> It cannot predict aggression or guarantee that an animal, person, or pair of pets can interact safely.</li>
                <li><strong>Not a substitute for care.</strong> Sudden change, distress, injury, health concerns, or safety risk should be discussed with a veterinarian or appropriately qualified behavior professional.</li>
                <li><strong>Owner reports have bias.</strong> Recall, expectations, relationship length, available situations, and interpretation of body language can affect answers.</li>
                <li><strong>No population norms yet.</strong> Snapshot v0.1 has no representative dog or cat norms, percentiles, published reliability estimates, or peer-reviewed validation study.</li>
                <li><strong>Species and context matter.</strong> The same visible behavior can have different causes. A single score cannot capture learning history, environment, breed, age, health, or every species-specific signal.</li>
              </ul>
              <p className="methodology-caution">
                WildKind should support better observation and better questions. It
                should never delay veterinary care or replace individualized
                professional assessment.
              </p>
            </div>
          </section>

          <section id="references" className="methodology-section methodology-references">
            <div className="methodology-section-heading">
              <p className="eyebrow dark">07 · References</p>
              <h2>Research that informed the approach.</h2>
              <p>These sources provide scientific context. Citing them does not mean their authors reviewed or endorsed WildKind.</p>
            </div>
            <ol>
              {references.map((reference) => (
                <li key={reference.doi}>
                  <p><strong>{reference.authors}</strong> {reference.title} <em>{reference.journal}</em></p>
                  <code>doi:{reference.doi}</code>
                  <span>{reference.use}</span>
                </li>
              ))}
            </ol>
          </section>

          <section id="review" className="methodology-section methodology-review">
            <div className="methodology-section-heading">
              <p className="eyebrow dark">08 · Review history</p>
              <h2>What has—and has not—been reviewed.</h2>
            </div>
            <div className="methodology-prose">
              <div className="methodology-history">
                <article>
                  <time dateTime="2026-07">July 2026</time>
                  <div><h3>Snapshot v0.1 drafted</h3><p>WildKind Product & Research defined the five-coordinate framework, 25 scored observations, seven context prompts, scoring rules, safety boundaries, and 16 provisional narrative prototypes.</p></div>
                </article>
                <article>
                  <time dateTime="2026-07-29">29 July 2026</time>
                  <div><h3>Internal implementation review</h3><p>WildKind Product & Engineering checked that this public methodology matches the questions and calculations running in the current website and strengthened the limitations and evidence notes.</p></div>
                </article>
                <article className="pending-review">
                  <span>Not yet completed</span>
                  <div><h3>Independent professional and psychometric review</h3><p>No veterinarian, veterinary behaviorist, certified applied animal behaviorist, or psychometrician has independently validated or endorsed Snapshot v0.1. External review, pilot reliability work, and species-specific validation remain future requirements.</p></div>
                </article>
              </div>
            </div>
          </section>

          <footer className="methodology-byline">
            <div><span>Author</span><strong>WildKind Product & Research</strong><p>Questionnaire framework, item writing, interpretation boundaries, and product documentation.</p></div>
            <div><span>Current reviewer</span><strong>WildKind Product & Engineering</strong><p>Internal questionnaire-to-code consistency and safety-language review, completed 29 July 2026.</p></div>
            <div><span>Independent reviewer</span><strong>None completed</strong><p>Professional review and psychometric validation are openly listed as pending work.</p></div>
          </footer>
        </article>

        <section className="methodology-cta">
          <p className="eyebrow">The map begins with observation</p>
          <h2>See the method in practice.</h2>
          <p>Take the free Snapshot, keep “Not observed” when evidence is missing, and read the result as a recent pattern—not a permanent label.</p>
          <div>
            <Link className="plan-button" href="/">Begin the assessment <span aria-hidden="true">↗</span></Link>
            <Link href="/pricing">Compare Field Guides</Link>
          </div>
        </section>
      </main>

      <footer className="methodology-site-footer">
        <Link href="/" className="methodology-brand"><PawMark /><span>WILDKIND</span></Link>
        <p>Warm science for the individual animal.</p>
        <nav><Link href="/resources/pet-behavior-observation-checklist">Free checklist</Link><Link href="/sample-field-guide">Sample report</Link><Link href="/methodology">Methodology</Link><Link href="/pricing">Pricing</Link><Link href="/register">Account</Link></nav>
        <small>© 2026 WildKind · Snapshot v0.1 · Not veterinary advice</small>
      </footer>
    </div>
  );
}
