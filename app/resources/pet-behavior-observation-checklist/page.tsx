import type { Metadata } from "next";
import Link from "next/link";

const pagePath = "/resources/pet-behavior-observation-checklist";
const pdfPath =
  "/resources/wildkind-30-day-pet-behavior-observation-checklist.pdf";

export const metadata: Metadata = {
  title: "30-Day Pet Behavior Observation Checklist — WildKind",
  description:
    "Download WildKind’s free, printable 30-day chart for recording diet, sleep, social responses, stress signals, and play preferences.",
  alternates: { canonical: pagePath },
  openGraph: {
    title: "Free 30-Day Pet Behavior Observation Checklist",
    description:
      "A neutral, printable daily record for pet owners, trainers, groomers, foster carers, and rescue teams.",
    url: pagePath,
    type: "article",
  },
};

const observationAreas = [
  {
    code: "01",
    title: "Diet & hydration",
    copy: "Record changes in appetite and water intake using simple comparisons with the pet’s usual pattern.",
    prompt: "Ate half the usual meal; water appeared usual.",
  },
  {
    code: "02",
    title: "Sleep & rest",
    copy: "Estimate rest time, note interruptions, and record where the animal chose to settle.",
    prompt: "Rested near the doorway; woke twice during visitors.",
  },
  {
    code: "03",
    title: "Social responses",
    copy: "Describe whether the pet approached, watched, remained nearby, or moved away—and who was present.",
    prompt: "Watched the groomer, then approached after two minutes.",
  },
  {
    code: "04",
    title: "Stress signals",
    copy: "Record visible signals, the immediate context, and approximately how long recovery took.",
    prompt: "Paced after the doorbell; settled after five minutes.",
  },
  {
    code: "05",
    title: "Play preferences",
    copy: "Note what was offered, what the pet chose, and whether engagement was brief or sustained.",
    prompt: "Chose the scent box; stayed engaged for four minutes.",
  },
] as const;

const audiences = [
  "Pet households",
  "Trainers",
  "Groomers",
  "Rescue & foster teams",
] as const;

function PawMark() {
  return (
    <span className="resource-paw" aria-hidden="true">
      <i />
      <i />
      <i />
      <b />
    </span>
  );
}

function DownloadButton({ compact = false }: { compact?: boolean }) {
  return (
    <a
      className={`resource-download${compact ? " resource-download-compact" : ""}`}
      href={pdfPath}
      download
    >
      <span>
        <small>FREE · A4 LANDSCAPE · 5 PAGES</small>
        Download the printable PDF
      </span>
      <b aria-hidden="true">↓</b>
    </a>
  );
}

function ChecklistPreview() {
  return (
    <figure className="resource-preview">
      <div className="resource-preview-paper" aria-hidden="true">
        <header>
          <span>WILDKIND</span>
          <strong>Daily observations · Days 1–10</strong>
          <small>Write what happened.</small>
        </header>
        <div className="resource-preview-grid">
          {["Day", "Diet", "Sleep", "Social", "Stress", "Play", "Context"].map(
            (heading) => (
              <b key={heading}>{heading}</b>
            ),
          )}
          {Array.from({ length: 28 }, (_, index) => (
            <i key={index} />
          ))}
        </div>
      </div>
      <figcaption>
        <span>Inside the download</span>
        <strong>Three 10-day tracking sheets</strong>
        <small>One row per day · neutral prompts · room for context</small>
      </figcaption>
    </figure>
  );
}

export default function PetBehaviorObservationChecklistPage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "DigitalDocument",
    name: "WildKind 30-Day Pet Behavior Observation Checklist",
    description:
      "A free printable daily record for diet, sleep, social responses, stress signals, and play or enrichment preferences.",
    url: `https://pet-wildkind.co.uk${pagePath}`,
    contentUrl: `https://pet-wildkind.co.uk${pdfPath}`,
    encodingFormat: "application/pdf",
    isAccessibleForFree: true,
    creator: { "@type": "Organization", name: "WildKind" },
  };

  return (
    <div className="resource-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <header className="resource-header">
        <Link href="/" className="resource-brand">
          <PawMark />
          <span>WILDKIND</span>
        </Link>
        <nav aria-label="Resource navigation">
          <Link href="/sample-field-guide">Sample report</Link>
          <Link href="/methodology">Methodology</Link>
          <Link href="/about">About</Link>
          <Link href="/pricing">Pricing</Link>
          <Link className="resource-header-cta" href="/register">
            Create account <span aria-hidden="true">↗</span>
          </Link>
        </nav>
      </header>

      <main>
        <section className="resource-hero">
          <div className="resource-contours" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
          </div>
          <div className="resource-hero-copy">
            <p className="eyebrow">Free field resource · 30 days</p>
            <h1>
              Notice the pattern.
              <em>Keep the label out.</em>
            </h1>
            <p className="resource-hero-lede">
              A printable daily chart for observing diet, sleep, social
              responses, stress signals, and play or enrichment preferences.
            </p>
            <blockquote>
              “No diagnosis required, no labeling needed, just record-keeping”
            </blockquote>
            <DownloadButton />
          </div>
          <ChecklistPreview />
        </section>

        <aside className="resource-share-strip">
          <div>
            <span>Made to travel</span>
            <strong>Print it. Share it. Bring it to the conversation.</strong>
          </div>
          <ul aria-label="Who this checklist is for">
            {audiences.map((audience) => (
              <li key={audience}>{audience}</li>
            ))}
          </ul>
        </aside>

        <section className="resource-intro">
          <div>
            <p className="eyebrow dark">One ordinary record at a time</p>
            <h2>What the chart helps you notice.</h2>
          </div>
          <div>
            <p>
              The checklist turns memory into a simple sequence of dated
              observations. Its prompts ask what happened, in what context, and
              what changed—not what kind of pet you think you have.
            </p>
            <p className="resource-created">
              Created by WildKind, based on frameworks of animal behavior
              observation
            </p>
          </div>
        </section>

        <section className="resource-areas" aria-labelledby="observation-areas-title">
          <div className="resource-section-heading">
            <p className="eyebrow dark">Five daily observation areas</p>
            <h2 id="observation-areas-title">Describe first. Interpret later.</h2>
            <p>
              Each prompt is deliberately neutral, so the record remains useful
              when it is shared between caregivers or with a professional.
            </p>
          </div>
          <ol>
            {observationAreas.map((area) => (
              <li key={area.code}>
                <span>{area.code}</span>
                <div>
                  <h3>{area.title}</h3>
                  <p>{area.copy}</p>
                  <small>Example note · “{area.prompt}”</small>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="resource-how">
          <div>
            <p className="eyebrow">A two-minute field habit</p>
            <h2>Useful records are specific, not perfect.</h2>
          </div>
          <ol>
            <li>
              <span>01</span>
              <h3>Pick one time</h3>
              <p>
                Add the record at roughly the same time each day. Leave a field
                blank when something was not observed.
              </p>
            </li>
            <li>
              <span>02</span>
              <h3>Describe the action</h3>
              <p>
                Write “moved away when touched” instead of “was unfriendly.”
              </p>
            </li>
            <li>
              <span>03</span>
              <h3>Add the context</h3>
              <p>
                Note what happened just before, who was present, and what helped
                the pet settle or re-engage.
              </p>
            </li>
            <li>
              <span>04</span>
              <h3>Share the sequence</h3>
              <p>
                Bring the chart to a trainer, groomer, rescue coordinator,
                veterinarian, or behaviorist when context would help.
              </p>
            </li>
          </ol>
        </section>

        <aside className="resource-boundary">
          <strong>Safety boundary</strong>
          <p>
            This chart is a record-keeping aid, not a diagnostic, veterinary,
            aggression, or safety assessment. Contact a veterinarian for sudden
            or marked behavior change, suspected pain or illness, persistent
            appetite or sleep disruption, self-injury, severe distress, or
            behavior that could injure a person or animal.
          </p>
        </aside>

        <section className="resource-final">
          <p className="eyebrow dark">Free to download and share</p>
          <h2>Thirty days.<br />A clearer record.</h2>
          <p>
            Use the five-page PDF at home or share this page with a client,
            adopter, foster carer, colleague, or care team.
          </p>
          <DownloadButton compact />
        </section>
      </main>

      <footer className="resource-footer">
        <Link href="/" className="resource-brand">
          <PawMark />
          <span>WILDKIND</span>
        </Link>
        <p>Warm science for the individual animal.</p>
        <nav>
          <Link href="/methodology">Methodology</Link>
          <Link href="/sample-field-guide">Sample report</Link>
          <Link href="/about">About</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/register">Account</Link>
        </nav>
        <small>
          © 2026 WildKind · Free record-keeping resource · Not veterinary advice
        </small>
      </footer>
    </div>
  );
}
