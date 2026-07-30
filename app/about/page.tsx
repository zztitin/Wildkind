import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About WildKind — Our Story & Editorial Standards",
  description:
    "Why Tinke Zhang created WildKind, how its animal-behavior content is reviewed, who is involved, and how to get in touch.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About WildKind — Observation Before Labels",
    description:
      "The independent story, editorial principles, review boundaries, and founder behind WildKind.",
    url: "/about",
    type: "article",
  },
};

const editorialStandards = [
  {
    code: "01",
    title: "Observe before interpreting",
    copy:
      "Behavioral claims begin with actions an owner can reasonably notice. We avoid moral labels and do not present guesses about an animal’s inner state as fact.",
  },
  {
    code: "02",
    title: "Prefer primary evidence",
    copy:
      "Methodology and educational content prioritize peer-reviewed animal-behavior research and clearly separate published findings from WildKind’s own provisional framework.",
  },
  {
    code: "03",
    title: "Show the boundary",
    copy:
      "Every assessment claim must state what it cannot establish. WildKind does not diagnose illness, assess aggression, replace veterinary care, or guarantee safe interactions.",
  },
  {
    code: "04",
    title: "Correct in public",
    copy:
      "Material changes to questions, scoring, evidence, or safety language are versioned in the methodology review history. Errors are corrected rather than quietly rewritten.",
  },
] as const;

const reviewSchedule = [
  {
    label: "Routine review",
    value: "Quarterly",
    copy:
      "Research references, educational pages, product claims, links, and safety language are checked in January, April, July, and October.",
  },
  {
    label: "Method changes",
    value: "Before release",
    copy:
      "Any scoring or questionnaire change is checked against the live implementation and documented before it reaches users.",
  },
  {
    label: "Urgent corrections",
    value: "As needed",
    copy:
      "Safety concerns, factual errors, broken references, and misleading wording are reviewed as soon as they are identified.",
  },
] as const;

function PawMark() {
  return (
    <span className="about-paw" aria-hidden="true">
      <i />
      <i />
      <i />
      <b />
    </span>
  );
}

export default function AboutPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About WildKind",
    url: "https://pet-wildkind.co.uk/about",
    mainEntity: {
      "@type": "Organization",
      name: "WildKind",
      founder: {
        "@type": "Person",
        name: "Tinke Zhang",
        sameAs: ["https://x.com/TinkeZhang"],
      },
    },
  };

  return (
    <div className="about-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="about-header">
        <Link href="/" className="about-brand">
          <PawMark />
          <span>WILDKIND</span>
        </Link>
        <nav aria-label="About navigation">
          <Link href="/resources/pet-behavior-observation-checklist">
            Free checklist
          </Link>
          <Link href="/sample-field-guide">Sample report</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/about" aria-current="page">About</Link>
          <Link className="about-header-cta" href="/register">
            Create account <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <main>
        <article>
          <section className="about-hero">
            <div className="about-contours" aria-hidden="true">
              <i />
              <i />
              <i />
              <i />
            </div>
            <p className="eyebrow">About WildKind · Independent field note</p>
            <h1>
              It started with a dog
              <em>who disappeared.</em>
            </h1>
            <p className="about-hero-lede">
              WildKind began in the gap between playful pet quizzes and
              inaccessible research—with one owner trying to describe an animal
              more carefully.
            </p>
            <dl className="about-status">
              <div>
                <dt>Founded by</dt>
                <dd>Tinke Zhang</dd>
              </div>
              <div>
                <dt>Structure</dt>
                <dd>Independent solo project</dd>
              </div>
              <div>
                <dt>External review</dt>
                <dd>Not yet completed</dd>
              </div>
              <div>
                <dt>Last reviewed</dt>
                <dd><time dateTime="2026-07-30">30 July 2026</time></dd>
              </div>
            </dl>
          </section>

          <nav className="about-index" aria-label="On this page">
            <strong>On this page</strong>
            <ol>
              <li><a href="#story">01 · Our story</a></li>
              <li><a href="#principles">02 · Editorial principles</a></li>
              <li><a href="#review">03 · Review process</a></li>
              <li><a href="#founder">04 · Founder</a></li>
              <li><a href="#experts">05 · Experts & consultants</a></li>
              <li><a href="#contact">06 · Contact</a></li>
            </ol>
          </nav>

          <section id="story" className="about-story">
            <aside>
              <p className="eyebrow dark">01 · Our story</p>
              <blockquote>
                “None of the labels seemed to describe the animal in front of
                me.”
              </blockquote>
              <span>Milo is the name used for this story.</span>
            </aside>
            <div className="about-story-copy">
              <p className="about-dropcap">
                It started with a question I could not answer. My dog—let’s call
                him Milo—would meet me at the door each day with a bright,
                familiar welcome. But when a stranger entered the house, he
                would slip under the bed and vanish.
              </p>
              <p>
                I tried the descriptions I found online: anxious, shy,
                dominant. None felt precise. They were conclusions attached to
                an animal whose behavior I had not yet learned to describe.
                Milo was not a problem to solve. He was communicating in
                distance, posture, scent, sound, and choice.
              </p>
              <p>
                The search for something better revealed two extremes. At one
                end were quizzes that turned pets into human personality types.
                At the other were valuable academic papers that required time,
                specialist language, or paid access. There was very little in
                between: something evidence-aware, practical, and humble enough
                to recognize animals as animals.
              </p>
              <p>
                WildKind began as a spreadsheet on my laptop. I read studies on
                animal personality and behavior, including work associated with
                Sam Gosling and Carla Litchfield. I rewrote questions,
                challenged assumptions, and removed sections when they drifted
                into human stories that an animal could never confirm.
              </p>
              <p>
                The name changed. The code broke. I learned DNS records late at
                night, payment webhooks even later, and more about CSS Grid than
                any sensible person should at 4 a.m. Whenever the project felt
                too ambitious, Milo would be nearby—resting with one eye open,
                keeping watch over the hallway in his own way.
              </p>
              <p className="about-story-closing">
                That is the idea at the center of WildKind: every domesticated
                pet still carries needs and tendencies shaped by being an
                animal. These are not flaws to erase. WildKind does not promise
                to reveal a pet’s hidden truth. It offers a map for observing
                more carefully, with enough science to be useful and enough
                humility to leave room for mystery.
              </p>
            </div>
          </section>

          <section id="principles" className="about-principles">
            <div className="about-section-heading">
              <p className="eyebrow dark">02 · Editorial principles</p>
              <h2>How WildKind earns the right to explain.</h2>
              <p>
                These standards apply to assessment language, educational
                resources, care suggestions, pricing claims, and public
                methodology notes.
              </p>
            </div>
            <ol>
              {editorialStandards.map((standard) => (
                <li key={standard.code}>
                  <span>{standard.code}</span>
                  <div>
                    <h3>{standard.title}</h3>
                    <p>{standard.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section id="review" className="about-review">
            <div className="about-section-heading">
              <p className="eyebrow dark">03 · Editing & review</p>
              <h2>A schedule, a record, and a clear owner.</h2>
              <p>
                WildKind is currently a solo project. That makes authorship
                clear, but it does not create independent review. The process
                below is an editorial control—not a substitute for expert
                validation.
              </p>
            </div>
            <div>
              <div className="about-review-grid">
                {reviewSchedule.map((item) => (
                  <article key={item.label}>
                    <span>{item.label}</span>
                    <strong>{item.value}</strong>
                    <p>{item.copy}</p>
                  </article>
                ))}
              </div>
              <ol className="about-review-steps">
                <li><span>01</span><p><strong>Source check.</strong> Confirm that a statement is supported by an appropriate reference and has not been stretched beyond the study’s species, setting, or measurement.</p></li>
                <li><span>02</span><p><strong>Language check.</strong> Remove diagnosis-like, anthropomorphic, moralizing, or certainty-heavy wording.</p></li>
                <li><span>03</span><p><strong>Product check.</strong> Ensure public descriptions match the questions, calculations, prices, and safeguards actually running on the site.</p></li>
                <li><span>04</span><p><strong>Boundary check.</strong> Reconfirm limitations, escalation guidance, privacy statements, and professional-care referrals.</p></li>
                <li><span>05</span><p><strong>Publish the change.</strong> Record substantive methodology updates with a date and version; correct ordinary copy and broken links promptly.</p></li>
              </ol>
              <p className="about-corrections">
                Found something unclear or incorrect? Please send the page URL,
                the passage, and any supporting source through the contact
                channel below.
              </p>
            </div>
          </section>

          <section id="founder" className="about-founder">
            <div className="about-founder-mark" aria-hidden="true">
              <span>TZ</span>
              <i />
              <i />
              <i />
            </div>
            <div>
              <p className="eyebrow">04 · About the founder</p>
              <h2>Tinke Zhang</h2>
              <blockquote>
                “Technology should help us pay closer attention to the animals
                who share our lives.”
              </blockquote>
              <p>
                Tinke Zhang is a freelance web developer and the independent
                creator of WildKind, responsible for its design, writing, code,
                testing, and operation—from the assessment interface to
                the late-night deployment work that users never see.
              </p>
              <p>
                Tinke’s interest in pet behavior grew from the ordinary difficulty
                of understanding a companion animal without forcing that animal
                into a human category. That curiosity led him toward ethology,
                animal-personality research, and the practical question behind
                WildKind: how can digital tools help owners observe more
                carefully?
              </p>
              <p className="about-founder-disclosure">
                <strong>Credential disclosure.</strong> Tinke is not a
                veterinarian, veterinary behaviorist, certified applied animal
                behaviorist, or academic researcher in animal behavior.
                WildKind’s credibility must come from transparent sources,
                careful boundaries, testable claims, and qualified independent
                review—not from implying credentials its founder does not hold.
              </p>
            </div>
          </section>

          <section id="experts" className="about-experts">
            <div className="about-section-heading">
              <p className="eyebrow dark">05 · Experts & consultants</p>
              <h2>No borrowed authority.</h2>
            </div>
            <div>
              <div className="about-expert-status">
                <span>Current status</span>
                <strong>No external expert or consultant has yet reviewed or endorsed WildKind.</strong>
                <p>
                  The researchers named in the <Link href="/methodology">methodology</Link> are
                  cited authors, not collaborators, advisers, or endorsers. No
                  affiliation should be inferred.
                </p>
              </div>
              <p>
                WildKind is seeking constructive review from veterinarians,
                veterinary behaviorists, certified applied animal behaviorists,
                qualified trainers using humane methods, shelter behavior
                specialists, and psychometricians. Future contributors will be
                listed here only with their permission, role, scope of review,
                and review date.
              </p>
              <p>
                Professional feedback is especially welcome on species-specific
                question design, welfare and safety language, scoring validity,
                inter-rater reliability, and the limits of owner-reported
                observation.
              </p>
            </div>
          </section>

          <section id="contact" className="about-contact">
            <div>
              <p className="eyebrow">06 · Contact</p>
              <h2>Questions, corrections, or professional review.</h2>
              <p>
                The current public contact channel is X. A monitored WildKind
                email address will be published here after the inbox and
                response process are operational.
              </p>
            </div>
            <a
              className="about-contact-card"
              href="https://x.com/TinkeZhang"
              target="_blank"
              rel="noreferrer"
            >
              <span>X / Twitter</span>
              <strong>@TinkeZhang</strong>
              <small>Founder contact · corrections · review enquiries</small>
              <b aria-hidden="true">↗</b>
            </a>
          </section>
        </article>
      </main>

      <footer className="about-footer">
        <Link href="/" className="about-brand">
          <PawMark />
          <span>WILDKIND</span>
        </Link>
        <p>Warm science for the individual animal.</p>
        <nav>
          <Link href="/about">About</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/sample-field-guide">Sample report</Link>
          <Link href="/pricing">Pricing</Link>
        </nav>
        <small>
          © 2026 WildKind · Independently created · Not veterinary advice
        </small>
      </footer>
    </div>
  );
}
