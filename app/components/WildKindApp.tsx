"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { archetypes, demoProfiles, domains, questions, responseLabels, type DomainCode } from "../data";

type Screen = "home" | "setup" | "assessment" | "result" | "dashboard" | "discover" | "connections" | "messages" | "privacy" | "safety";
type Answers = Record<number, number | string>;
type Pet = { name: string; species: "Dog" | "Cat"; stage: string; region: string; breed: string; bio: string; visibility: "Private" | "Discoverable"; activity: string; goal: string };
type SavedState = { pet?: Pet; result?: Result; connections?: string[]; messages?: Record<string, string[]>; blocked?: string[] };
type Result = { scores: Record<DomainCode, number | null>; coverage: Record<DomainCode, string>; archetype: string; second?: string; essence: string; healthFlag: boolean; recommendations: Array<{ title: string; try: string; look: string }> };

const defaultPet: Pet = { name: "", species: "Dog", stage: "Adult", region: "Shanghai", breed: "", bio: "", visibility: "Private", activity: "Balanced", goal: "Similar-personality community" };

function Mark({ small = false }: { small?: boolean }) {
  return <span className={small ? "mark mark-small" : "mark"} aria-label="WildKind contour seal"><i /><i /><i /><b /></span>;
}

function Header({ screen, setScreen, signedIn }: { screen: Screen; setScreen: (s: Screen) => void; signedIn: boolean }) {
  const app = ["dashboard", "discover", "connections", "messages", "privacy"].includes(screen);
  return (
    <header className="site-header">
      <button className="brand" onClick={() => setScreen(signedIn ? "dashboard" : "home")}><Mark small /><span>WILDKIND</span></button>
      {app ? (
        <nav aria-label="Primary navigation">
          <button className={screen === "dashboard" ? "active" : ""} onClick={() => setScreen("dashboard")}>Dashboard</button>
          <button className={screen === "discover" ? "active" : ""} onClick={() => setScreen("discover")}>Discover</button>
          <button className={screen === "connections" ? "active" : ""} onClick={() => setScreen("connections")}>Connections</button>
          <button className={screen === "messages" ? "active" : ""} onClick={() => setScreen("messages")}>Messages</button>
        </nav>
      ) : <span className="header-note">Behavior, carefully observed.</span>}
      {signedIn && <button className="avatar" onClick={() => setScreen("privacy")} aria-label="Open privacy and account settings">ZC</button>}
    </header>
  );
}

function Button({ children, onClick, secondary = false, disabled = false, type = "button" }: { children: React.ReactNode; onClick?: () => void; secondary?: boolean; disabled?: boolean; type?: "button" | "submit" }) {
  return <button type={type} disabled={disabled} onClick={onClick} className={secondary ? "button secondary" : "button"}>{children}<span aria-hidden="true">↗</span></button>;
}

function Home({ begin, how }: { begin: () => void; how: () => void }) {
  return <main>
    <section className="hero">
      <div className="topo topo-one" aria-hidden="true" />
      <div className="hero-copy">
        <p className="eyebrow">Decoding the Nature Beneath the Nurture</p>
        <h1>What&apos;s Your Pet&apos;s <em>WildKind?</em></h1>
        <p className="lede">Map five behavioral dimensions, discover their WildKind archetype, and learn what helps them thrive.</p>
        <div className="button-row"><Button onClick={begin}>Begin the expedition</Button><Button onClick={how} secondary>See how the map works</Button></div>
        <p className="microcopy">About 8 minutes · Dogs & cats · One anonymous expedition</p>
      </div>
      <div className="field-orbit" aria-label="Five dimensions form one behavioral map">
        <div className="orbit-ring ring-a" /><div className="orbit-ring ring-b" /><div className="orbit-core"><Mark /><span>5 coordinates</span></div>
        {domains.map((d, i) => <span key={d.code} className={`orbit-label label-${i}`}>{d.name}</span>)}
      </div>
      <div className="hero-index"><span>FIELD NOTE 01</span><span>31.2304° N</span><span>OBSERVE · MAP · UNDERSTAND</span></div>
    </section>

    <section className="campaign-card-section" aria-labelledby="campaign-card-title">
      <div className="campaign-card-copy">
        <p className="eyebrow">A mark for every wild soul</p>
        <h2 id="campaign-card-title">Your pet&apos;s territory starts here.</h2>
        <p>The contour paw maps five behavioral coordinates. Select the paw to create a private account and keep the Field Guide you uncover.</p>
        <span>Private by default · No password to remember</span>
      </div>
      <figure className="campaign-card-art">
        <Image
          src="/social-cards/wildkind-contour-paw.png"
          alt="WildKind campaign card featuring a contour-map paw and five behavioral dimensions"
          width={1254}
          height={1254}
          sizes="(max-width: 1000px) 90vw, 60vw"
        />
        <Link className="paw-register-hotspot" href="/register" aria-label="Select the contour paw to create your WildKind account">
          <span>Create your account</span>
        </Link>
        <figcaption>Select the contour paw to register <span aria-hidden="true">↗</span></figcaption>
      </figure>
    </section>

    <section id="map" className="map-section">
      <div className="section-heading"><p className="eyebrow dark">A continuous profile, not a label</p><h2>Five coordinates.<br />One individual map.</h2><p>Traits come first. The archetype is a memorable translation of the shape—not a diagnosis or a fixed type.</p></div>
      <div className="dimension-list">
        {domains.map((d, i) => <article key={d.code}><span>0{i + 1}</span><div><h3>{d.name}</h3><p>{d.description}</p></div><b>{d.code}</b></article>)}
      </div>
    </section>

    <section className="method-section">
      <div><p className="eyebrow">The expedition</p><h2>Careful observation.<br />Practical guidance.</h2></div>
      <ol>
        <li><span>01</span><h3>Observe</h3><p>Recall behavior across real situations from the last 30 days.</p></li>
        <li><span>02</span><h3>Map</h3><p>See five transparent dimension scores and observation coverage.</p></li>
        <li><span>03</span><h3>Support</h3><p>Try three low-risk care ideas shaped by scores and context.</p></li>
        <li><span>04</span><h3>Connect</h3><p>Opt in to discover relevant owners through shared terrain.</p></li>
      </ol>
      <Button onClick={begin}>Map your pet&apos;s WildKind</Button>
    </section>

    <section className="manifesto">
      <Mark />
      <blockquote>“We don&apos;t believe in good pets and bad pets. We believe in wild souls wearing domesticated coats.”</blockquote>
      <p>WildKind doesn&apos;t label your pet. It translates recurring patterns—so you can stop guessing and start understanding.</p>
    </section>
    <section className="limitation"><strong>Important field note</strong><p>WildKind describes recurring behavioral tendencies. It is not veterinary advice, an aggression assessment, or a guarantee that animals or people can interact safely.</p></section>
  </main>;
}

function Setup({ pet, setPet, onStart }: { pet: Pet; setPet: (p: Pet) => void; onStart: () => void }) {
  const [age, setAge] = useState(false); const [service, setService] = useState(false); const [research, setResearch] = useState(false); const [community, setCommunity] = useState(false);
  return <main className="paper-page">
    <div className="setup-grid">
      <aside><p className="eyebrow dark">Field preparation</p><h1>Every good map begins with careful observation.</h1><p>Think about your pet&apos;s behavior during the last 30 days and answer from real situations—not the personality you hope they have.</p><div className="field-note"><strong>There are no good or bad coordinates.</strong><span>You can choose “Not observed” whenever a situation did not occur.</span></div></aside>
      <form className="setup-card" onSubmit={(e) => { e.preventDefault(); onStart(); }}>
        <div className="step-kicker">01 / 03 · Your pet</div>
        <fieldset><legend>Who are we mapping?</legend><div className="species-toggle"><button type="button" className={pet.species === "Dog" ? "selected" : ""} onClick={() => setPet({ ...pet, species: "Dog" })}>DOG <span>Canis familiaris</span></button><button type="button" className={pet.species === "Cat" ? "selected" : ""} onClick={() => setPet({ ...pet, species: "Cat" })}>CAT <span>Felis catus</span></button></div></fieldset>
        <label>Pet&apos;s name<input required value={pet.name} onChange={e => setPet({ ...pet, name: e.target.value })} placeholder="e.g. Milo" /></label>
        <div className="form-row"><label>Life stage<select value={pet.stage} onChange={e => setPet({ ...pet, stage: e.target.value })}><option>Young adult</option><option>Adult</option><option>Senior</option></select></label><label>Breed (optional)<input value={pet.breed} onChange={e => setPet({ ...pet, breed: e.target.value })} placeholder="Mixed / unknown is fine" /></label></div>
        <label className="check"><input type="checkbox" checked={age} onChange={e => setAge(e.target.checked)} /><span>I confirm I meet the minimum age requirement for my region.</span></label>
        <label className="check"><input type="checkbox" checked={service} onChange={e => setService(e.target.checked)} /><span>I agree to the service processing needed to produce this private result.</span></label>
        <div className="consent-options"><p>Separate, optional choices</p><label className="check"><input type="checkbox" checked={research} onChange={e => setResearch(e.target.checked)} /><span>Contribute de-identified responses to research</span></label><label className="check"><input type="checkbox" checked={community} onChange={e => setCommunity(e.target.checked)} /><span>Consider a discoverable profile after results</span></label></div>
        <Button type="submit" disabled={!age || !service || !pet.name.trim()}>Start the field observations</Button>
      </form>
    </div>
  </main>;
}

function Assessment({ pet, answers, setAnswers, index, setIndex, finish }: { pet: Pet; answers: Answers; setAnswers: (a: Answers) => void; index: number; setIndex: (i: number) => void; finish: () => void }) {
  const q = questions[index]; const context = "options" in q; const choices = context ? q.options : responseLabels; const progress = Math.round(((index + 1) / questions.length) * 100);
  const answer = answers[q.id];
  return <main className="assessment-page">
    <div className="trail-header"><button onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0}>← Back</button><div><span>TRAIL PROGRESS</span><div className="trail"><i style={{ width: `${progress}%` }} /></div></div><strong>{String(index + 1).padStart(2, "0")} / 32</strong></div>
    <section className="question-card">
      <div className="question-meta"><span>{context ? "Context note" : "Field observation"}</span><span>{pet.species} · Last 30 days</span></div>
      <p className="question-title">{q.title}</p><h1>{q.text}</h1>
      {!context && <p className="species-example">Consider several ordinary situations—{pet.species === "Dog" ? "walks, toys, visitors, or familiar routines" : "play objects, visitors, household sounds, or familiar resting places"}.</p>}
      <div className="answer-grid">{choices.map((choice, i) => { const value = context ? choice : i === 5 ? "missing" : i; return <button key={choice} className={answer === value ? "chosen" : ""} onClick={() => { const next = { ...answers, [q.id]: value }; setAnswers(next); sessionStorage.setItem("wk-draft", JSON.stringify(next)); }}>{!context && <span>{i === 5 ? "—" : i}</span>}<b>{choice}</b></button>; })}</div>
      <div className="question-actions"><span>Saved on this device for this expedition</span>{index < 31 ? <Button onClick={() => setIndex(index + 1)} disabled={answer === undefined}>Continue</Button> : <Button onClick={finish} disabled={answer === undefined}>Map the results</Button>}</div>
    </section>
  </main>;
}

function computeResult(answers: Answers): Result {
  const scores = {} as Record<DomainCode, number | null>; const coverage = {} as Record<DomainCode, string>;
  for (const d of domains) {
    const vals = questions.flatMap(q => {
      if (!("domain" in q) || q.domain !== d.code) return [];
      const value = answers[q.id];
      if (typeof value !== "number") return [];
      return [q.reverse ? 4 - value : value];
    });
    scores[d.code] = vals.length >= 4 ? Math.round((vals.reduce((a, b) => a + b, 0) / vals.length) * 25) : null;
    coverage[d.code] = vals.length === 5 && answers[31] === "21–25" ? "Strong coverage" : vals.length >= 4 ? "Adequate coverage" : "Insufficient observation";
  }
  const scoreList = domains.map(d => scores[d.code]);
  const ranked = archetypes.map(a => ({ a, distance: scoreList.every(s => s !== null) ? Math.sqrt(scoreList.reduce((sum, s, i) => sum + Math.pow((s as number) - a[1][i], 2), 0)) : 999 })).sort((a,b) => a.distance - b.distance);
  const first = ranked[0]; const second = ranked[1]; const blended = second.distance - first.distance < 10;
  const healthFlag = [answers[27] === "Confirmed or substantial change", answers[28] === "Yes", answers[30] === "Yes, and it is continuing"].some(Boolean);
  const ordered = domains.filter(d => scores[d.code] !== null).sort((a,b) => (scores[b.code] as number) - (scores[a.code] as number));
  const high = ordered[0]?.name ?? "Discovery Drive"; const low = ordered.at(-1)?.name ?? "Emotional Resilience";
  const recommendations = healthFlag ? [{ title: "Begin with health context", try: "Speak with your veterinarian before interpreting a sudden or ongoing change as personality.", look: "Track appetite, sleep, movement, recovery, and when the change began." }] : [
    { title: `Support ${high}`, try: high === "Discovery Drive" ? "Offer five minutes of voluntary scent or object exploration with a familiar retreat available." : "Create one predictable opportunity for this strength to be expressed each day.", look: "Relaxed engagement and voluntary return." },
    { title: `Make room for ${low}`, try: low === "Emotional Resilience" ? "Reduce novelty, add distance, and give recovery time after manageable change." : "Use one low-pressure invitation and let your pet choose whether to participate.", look: "Soft body language, easy disengagement, and ordinary recovery." },
    { title: "Build a clear ending", try: "Use a consistent cue, then offer an easy alternative activity after enrichment or social time.", look: "A smoother shift without escalating repetition." },
  ];
  return { scores, coverage, archetype: first.a[0], second: blended ? second.a[0] : undefined, essence: first.a[2], healthFlag, recommendations };
}

function ResultView({ pet, result, save, discover }: { pet: Pet; result: Result; save: () => void; discover: () => void }) {
  return <main className="result-page">
    <section className="result-intro"><p className="eyebrow dark">The trail is mapped</p><h1>Here is the pattern your observations reveal.</h1><p>Dimensions come first. This profile reflects the last 30 days and the situations you were able to observe.</p><div className="result-actions"><Button onClick={save}>Save to {pet.name}&apos;s profile</Button><Button onClick={discover} secondary>Explore shared terrain</Button></div></section>
    {result.healthFlag && <div className="health-alert"><strong>Context before interpretation</strong><p>Personality-style scores can be affected by pain, illness, medication, and major environmental changes. A sudden behavior change deserves veterinary attention before it is interpreted as personality.</p></div>}
    <section className="score-sheet"><div className="sheet-title"><span>WILDKIND FIELD GUIDE · SNAPSHOT 0.1</span><strong>{pet.name.toUpperCase()}</strong></div><div className="scores">{domains.map(d => { const score = result.scores[d.code]; return <article key={d.code}><div><span>{d.code}</span><h2>{d.name}</h2><p>{score === null ? "Insufficient observation" : score < 35 ? "Less frequently expressed" : score > 65 ? "More frequently expressed" : "Context-dependent expression"}</p></div><div className="score-number">{score ?? "—"}<small>/100</small></div><div className="score-track"><i style={{ width: `${score ?? 0}%` }} /></div><em>{result.coverage[d.code]}</em></article>})}</div></section>
    {!result.healthFlag && <section className="archetype"><p className="eyebrow dark">Provisional narrative match</p><div className="archetype-main"><Mark /><div><span>{result.second ? "A blended pattern" : "Nearest field-guide pattern"}</span><h2>{result.archetype}</h2>{result.second && <h3>with {result.second} qualities</h3>}<p>{result.essence}. The archetype is a storytelling layer, not a fixed biological type.</p></div></div></section>}
    <section className="care-plan"><p className="eyebrow dark">Three starting points</p><h2>A small care plan for the next week</h2><div>{result.recommendations.map((r, i) => <article key={r.title}><span>0{i + 1}</span><h3>{r.title}</h3><p><strong>Try:</strong> {r.try}</p><p><strong>Look for:</strong> {r.look}</p><small>Pause if tension, avoidance, escalating frustration, or prolonged recovery appears.</small></article>)}</div></section>
    <section className="limitation paper"><strong>Scientific boundary</strong><p>WildKind describes recurring behavioral tendencies. It is not veterinary advice, an aggression assessment, or a guarantee that animals or people can interact safely. No population percentiles or diagnoses are shown.</p></section>
  </main>;
}

function Dashboard({ pet, result, setScreen }: { pet: Pet; result?: Result; setScreen: (s: Screen) => void }) {
  return <main className="app-page"><section className="welcome"><div><p className="eyebrow">Basecamp · Dashboard</p><h1>Good evening, explorer.</h1><p>Your next useful observation is more valuable than a perfect score.</p></div><Mark /></section><section className="dashboard-grid"><article className="pet-card"><div className="pet-photo"><span>{pet.species === "Cat" ? "CAT" : "DOG"}</span><Mark /></div><div><span className="status private">{pet.visibility}</span><h2>{pet.name || "Your pet"}</h2><p>{pet.stage} {pet.breed ? `· ${pet.breed}` : ""}</p>{result ? <><strong>{result.archetype}</strong><div className="mini-bars">{domains.map(d => <i key={d.code} style={{ height: `${Math.max(12, result.scores[d.code] ?? 0)}%` }} title={`${d.name}: ${result.scores[d.code] ?? "insufficient"}`} />)}</div></> : <Button onClick={() => setScreen("setup")}>Begin the expedition</Button>}</div></article><article className="next-card"><span>YOUR NEXT TRAIL</span><h2>{result ? "Explore shared terrain" : "Map a WildKind Snapshot"}</h2><p>{result ? "Four relevant profiles are waiting, ordered by goals, behavioral relevance, activity, and general region." : "One careful eight-minute observation set unlocks a private Field Guide."}</p><Button onClick={() => setScreen(result ? "discover" : "setup")}>{result ? "Open discovery" : "Start assessment"}</Button></article><article className="insight-card"><span>FIELD NOTE</span><blockquote>“Private by default. Discoverable only when you choose.”</blockquote><button onClick={() => setScreen("privacy")}>Review privacy controls →</button></article></section></main>;
}

function Discover({ connections, request, blocked, block, report }: { connections: string[]; request: (id: string) => void; blocked: string[]; block: (id: string) => void; report: (id: string) => void }) {
  const [species, setSpecies] = useState("All"); const [goal, setGoal] = useState("Similar-personality community");
  const visible = demoProfiles.filter(p => !blocked.includes(p.id) && (species === "All" || p.species === species));
  return <main className="app-page light"><section className="discover-head"><p className="eyebrow dark">Discovery · Shared terrain</p><h1>Relevant, not “compatible.”</h1><p>Recommendations combine your goal, behavioral profile, activity preference, general region, and profile quality.</p></section><div className="filters"><label>Species<select value={species} onChange={e => setSpecies(e.target.value)}><option>All</option><option>Dog</option><option>Cat</option></select></label><label>Goal<select value={goal} onChange={e => setGoal(e.target.value)}><option>Similar-personality community</option><option>Calm companionship</option><option>Active enrichment</option><option>Walking / outing</option><option>Care discussion</option><option>Potential pet introduction</option></select></label><label>General region<select><option>Shanghai</option></select></label><button>More filters +</button></div><div className="profile-grid">{visible.map(p => <article className="profile-card" key={p.id}><div className={`profile-visual ${p.color}`}><span>{p.species.toUpperCase()}</span><strong>{p.name.slice(0,1)}</strong><em>{p.region}</em></div><div className="profile-body"><div className="profile-top"><span>{p.stage} · {p.activity}</span><b>{p.score}<small>/100</small></b></div><h2>{p.name}</h2><p className="archetype-label">{p.archetype} · with {p.owner}</p><ul>{p.signals.map(s => <li key={s}>{s}</li>)}</ul><p className="recommendation-note">An app recommendation score—not a safety probability.</p><div className="card-actions"><button onClick={() => request(p.id)} disabled={connections.includes(p.id)}>{connections.includes(p.id) ? "Request sent" : "Connect"}</button><button onClick={() => report(p.id)}>Report</button><button onClick={() => block(p.id)}>Block</button></div></div></article>)}</div></main>;
}

function Connections({ connections, accept, setScreen }: { connections: string[]; accept: (id: string) => void; setScreen: (s: Screen) => void }) {
  return <main className="app-page light"><section className="discover-head"><p className="eyebrow dark">Connections</p><h1>Mutual consent opens the trail.</h1><p>Messages remain closed until both owners accept.</p></section><div className="connection-list">{connections.length === 0 ? <div className="empty-state"><Mark /><h2>No active requests yet</h2><p>Explore relevant profiles and send a request that names your pet and goal.</p><Button onClick={() => setScreen("discover")}>Open discovery</Button></div> : connections.map((id) => { const baseId = id.replace("-accepted", ""); const p = demoProfiles.find(x => x.id === baseId)!; const accepted = id.endsWith("-accepted"); return <article key={id}><div className={`connection-avatar ${p?.color ?? "moss"}`}>{p?.name.slice(0,1)}</div><div><h2>{p?.name ?? "Pet profile"} <small>with {p?.owner}</small></h2><p>Goal: Similar-personality community · Pet: your current profile</p></div><span className={accepted ? "status discoverable" : "status private"}>{accepted ? "Connected" : "Pending"}</span>{!accepted && <button onClick={() => accept(id)}>Simulate acceptance</button>}</article> })}</div></main>;
}

function Messages({ connections, messages, send, block, report }: { connections: string[]; messages: Record<string, string[]>; send: (id: string, text: string) => void; block: (id: string) => void; report: (id: string) => void }) {
  const accepted = connections.filter(id => id.endsWith("-accepted")); const [active, setActive] = useState(accepted[0] ?? ""); const [text, setText] = useState(""); const base = active.replace("-accepted", ""); const profile = demoProfiles.find(p => p.id === base);
  return <main className="message-page"><aside><p className="eyebrow dark">Messages</p><h1>Conversations</h1>{accepted.length === 0 ? <p className="message-empty">Messaging opens after mutual acceptance.</p> : accepted.map(id => { const p = demoProfiles.find(x => x.id === id.replace("-accepted", ""))!; return <button key={id} className={active === id ? "active" : ""} onClick={() => setActive(id)}><span className={`connection-avatar ${p.color}`}>{p.name[0]}</span><div><strong>{p.owner} & {p.name}</strong><small>Connected · plain text only</small></div></button> })}</aside><section>{profile ? <><header><div><h2>{profile.owner} & {profile.name}</h2><p>{profile.region} · exact location is never shown</p></div><div><button onClick={() => report(base)}>Report</button><button onClick={() => block(base)}>Block</button></div></header><div className="chat"><div className="system-message">You connected around a similar-personality community goal. Relevance does not guarantee safe interaction.</div><div className="bubble theirs">Hello! {profile.name} also prefers a little time to observe before joining in.</div>{(messages[active] ?? []).map((m,i) => <div key={i} className="bubble mine">{m}</div>)}</div><form onSubmit={e => { e.preventDefault(); if(text.trim()) { send(active,text.trim()); setText(""); } }}><label><span className="sr-only">Message</span><textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write a plain-text message…" /></label><button disabled={!text.trim()}>Send</button></form></> : <div className="empty-state"><Mark /><h2>No open conversation</h2><p>Accept a connection before messaging begins.</p></div>}</section></main>;
}

function Privacy({ pet, setPet, clear }: { pet: Pet; setPet: (p: Pet) => void; clear: () => void }) {
  return <main className="app-page light privacy-page"><section className="discover-head"><p className="eyebrow dark">Privacy & data</p><h1>Your map. Your boundaries.</h1><p>Service, research, marketing, and public-profile choices remain separate.</p></section><section className="settings-card"><div><h2>Profile visibility</h2><p>Private is the default. Discoverable shares only the fields you select.</p></div><div className="segmented"><button className={pet.visibility === "Private" ? "active" : ""} onClick={() => setPet({ ...pet, visibility: "Private" })}>Private</button><button className={pet.visibility === "Discoverable" ? "active" : ""} onClick={() => setPet({ ...pet, visibility: "Discoverable" })}>Discoverable</button></div></section><section className="settings-card"><div><h2>Public Field Guide details</h2><p>Archetype and selected dimensions can be hidden independently.</p></div><label className="switch"><input type="checkbox" defaultChecked /><span /> Show archetype</label><label className="switch"><input type="checkbox" defaultChecked /><span /> Show selected dimensions</label></section><section className="settings-card"><div><h2>Download your data</h2><p>Export your profile, assessment responses, results, connections, and messages.</p></div><button onClick={() => { const blob = new Blob([JSON.stringify({ pet }, null, 2)], { type: "application/json" }); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url;a.download="wildkind-data.json";a.click();URL.revokeObjectURL(url); }}>Export JSON</button></section><section className="settings-card danger"><div><h2>Delete WildKind data</h2><p>Public profiles are disabled immediately. Personal data enters the deletion workflow.</p></div><button onClick={() => { if(confirm("Delete this local WildKind profile and assessment? This cannot be undone.")) clear(); }}>Delete my data</button></section></main>;
}

function Safety({ close }: { close: () => void }) { return <div className="modal-backdrop"><div className="modal"><p className="eyebrow dark">Community safety</p><h2>Report submitted for review</h2><p>The report records a category, optional context, profile reference, and timestamp. Moderators see only the minimum necessary context.</p><label>Category<select><option>Harassment</option><option>Spam</option><option>Unsafe advice</option><option>Inappropriate content</option><option>Impersonation</option><option>Underage concern</option><option>Other</option></select></label><label>Optional explanation<textarea placeholder="Describe what happened without sharing unnecessary sensitive details." /></label><div className="button-row"><Button onClick={close}>Submit report</Button><Button onClick={close} secondary>Cancel</Button></div></div></div> }

export function WildKindApp() {
  const [screen, setScreen] = useState<Screen>("home"); const [pet, setPet] = useState<Pet>(defaultPet); const [answers, setAnswers] = useState<Answers>({}); const [index, setIndex] = useState(0); const [result, setResult] = useState<Result>(); const [signedIn, setSignedIn] = useState(false); const [connections, setConnections] = useState<string[]>([]); const [messages, setMessages] = useState<Record<string,string[]>>({}); const [blocked, setBlocked] = useState<string[]>([]); const [reporting, setReporting] = useState(false); const [loaded, setLoaded] = useState(false);
  useEffect(() => { fetch("/api/state").then(r=>r.ok?r.json():{}).then((s:SavedState)=>{ const draft=sessionStorage.getItem("wk-draft"); if(draft)setAnswers(JSON.parse(draft)); if(s.pet){setPet(s.pet);setSignedIn(true)} if(s.result)setResult(s.result); if(s.connections)setConnections(s.connections); if(s.messages)setMessages(s.messages); if(s.blocked)setBlocked(s.blocked); }).finally(()=>setLoaded(true)); }, []);
  const state = useMemo(() => ({ pet, result, connections, messages, blocked }), [pet,result,connections,messages,blocked]);
  useEffect(() => { if(loaded && signedIn) fetch("/api/state", { method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(state) }); }, [state, loaded, signedIn]);
  const finish = () => { const r=computeResult(answers); setResult(r); setScreen("result"); window.scrollTo({top:0,behavior:"smooth"}); };
  const save = () => { setSignedIn(true); setScreen("dashboard"); };
  const request = (id:string) => setConnections(c => c.includes(id) ? c : [...c,id]);
  const accept = (id:string) => setConnections(c => c.map(x => x===id ? `${x}-accepted` : x));
  const block = (id:string) => { setBlocked(b => [...new Set([...b,id])]); setConnections(c=>c.filter(x=>x.replace("-accepted","")!==id)); setScreen("discover"); };
  const clear = () => { void fetch("/api/state", { method:"DELETE" }); setPet(defaultPet);setResult(undefined);setConnections([]);setMessages({});setBlocked([]);setSignedIn(false);sessionStorage.removeItem("wk-draft");setScreen("home"); };
  return <div className={`site-shell screen-${screen}`}><Header screen={screen} setScreen={setScreen} signedIn={signedIn} />
    {screen === "home" && <Home begin={() => setScreen("setup")} how={() => document.getElementById("map")?.scrollIntoView({behavior:"smooth"})} />}
    {screen === "setup" && <Setup pet={pet} setPet={setPet} onStart={() => { setIndex(0); setScreen("assessment"); }} />}
    {screen === "assessment" && <Assessment pet={pet} answers={answers} setAnswers={setAnswers} index={index} setIndex={setIndex} finish={finish} />}
    {screen === "result" && result && <ResultView pet={pet} result={result} save={save} discover={() => { setSignedIn(true);setScreen("discover"); }} />}
    {screen === "dashboard" && <Dashboard pet={pet} result={result} setScreen={setScreen} />}
    {screen === "discover" && <Discover connections={connections.map(x=>x.replace("-accepted",""))} request={request} blocked={blocked} block={block} report={() => setReporting(true)} />}
    {screen === "connections" && <Connections connections={connections} accept={accept} setScreen={setScreen} />}
    {screen === "messages" && <Messages connections={connections} messages={messages} send={(id,text)=>setMessages(m=>({...m,[id]:[...(m[id]??[]),text]}))} block={block} report={()=>setReporting(true)} />}
    {screen === "privacy" && <Privacy pet={pet} setPet={setPet} clear={clear} />}
    {reporting && <Safety close={() => setReporting(false)} />}
    <footer><div className="brand"><Mark small /><span>WILDKIND</span></div><p>Warm science for the individual animal.</p><nav><button onClick={() => setReporting(true)}>Safety</button><button onClick={() => setScreen(signedIn ? "privacy" : "home")}>Privacy</button><a href="https://github.com/zztitin/Wildkind/tree/main/docs">Methodology</a></nav><small>© 2026 WildKind · Snapshot v0.1 · Not veterinary advice</small></footer>
  </div>;
}
