"use client";

import Link from "next/link";
import { useState } from "react";

export function RegistrationForm({ userName, error, returnTo }: { userName: string | null; error: string | null; returnTo: string }) {
  const [age, setAge] = useState(false);
  const [service, setService] = useState(false);
  const [research, setResearch] = useState(false);
  const [marketing, setMarketing] = useState(false);

  if (userName) {
    return <section className="registration-card registration-complete">
      <span className="registration-seal">✓</span>
      <p className="eyebrow dark">Basecamp established</p>
      <h2>You&apos;re signed in.</h2>
      <p>Welcome, {userName}. Your Field Guides and privacy choices can now stay with your account.</p>
      <Link className="registration-submit ready" href={returnTo}>Continue to WildKind <span>↗</span></Link>
      <form action="/api/auth/logout?return_to=/register" method="post" className="registration-signout">
        <button type="submit">Sign out</button>
      </form>
    </section>;
  }

  const ready = age && service;
  const signInPath = `/api/auth/google/start?${new URLSearchParams({
    return_to: returnTo,
    age: age ? "1" : "0",
    service: service ? "1" : "0",
    research: research ? "1" : "0",
    marketing: marketing ? "1" : "0",
  })}`;
  return <section className="registration-card">
    <div className="registration-step">ACCOUNT · 01</div>
    <h2>Create your WildKind account</h2>
    <p className="registration-intro">Continue with Google for secure, password-free sign-in. Your account starts private.</p>
    {error && <p className="registration-error" role="alert">{error}</p>}
    <div className="registration-consents">
      <label><input type="checkbox" checked={age} onChange={event => setAge(event.target.checked)} /><span><strong>Age confirmation</strong>I confirm I meet the minimum age requirement for my region.</span></label>
      <label><input type="checkbox" checked={service} onChange={event => setService(event.target.checked)} /><span><strong>Service processing</strong>I agree to the processing required to create and operate my private account.</span></label>
    </div>
    <div className="registration-optional">
      <span>Optional — change anytime</span>
      <label><input type="checkbox" checked={research} onChange={event => setResearch(event.target.checked)} />Contribute de-identified assessment responses to research</label>
      <label><input type="checkbox" checked={marketing} onChange={event => setMarketing(event.target.checked)} />Receive occasional WildKind field notes by email</label>
    </div>
    {ready ? <a className="registration-submit ready" href={signInPath}><span className="google-mark" aria-hidden="true">G</span>Continue with Google <span>↗</span></a> : <button className="registration-submit" disabled>Confirm the required choices <span>↗</span></button>}
    <p className="registration-privacy">Community discovery remains off until you explicitly publish a pet profile. Research, marketing, and public-profile consent stay separate.</p>
  </section>;
}
