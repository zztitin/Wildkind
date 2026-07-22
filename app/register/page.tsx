import Link from "next/link";
import { headers } from "next/headers";
import { getGoogleUserFromCookie, safeReturnTo } from "../../lib/google-auth";
import { RegistrationForm } from "./RegistrationForm";

export const dynamic = "force-dynamic";

const errors: Record<string, string> = {
  "required-consent": "Confirm the required age and service choices before continuing.",
  configuration: "Google sign-in is still being configured. Please try again shortly.",
  "oauth-state": "That sign-in attempt expired or could not be verified. Please try again.",
  "google-token": "Google could not complete the sign-in exchange. Please try again.",
  "google-profile": "WildKind needs a verified Google email address to create your account.",
  "oauth-failed": "Sign-in could not be completed. Please try again.",
};

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; return_to?: string }>;
}) {
  const requestHeaders = await headers();
  const user = await getGoogleUserFromCookie(requestHeaders.get("cookie"));
  const { error: errorCode, return_to: requestedReturnTo } = await searchParams;
  const returnTo = safeReturnTo(requestedReturnTo);

  return (
    <main className="registration-page">
      <header className="registration-header">
        <Link href="/" className="registration-brand">WILD<span>◆</span>KIND</Link>
        <nav className="registration-nav" aria-label="Registration navigation"><Link href="/pricing">Pricing</Link><Link href="/" className="registration-back">← Back to the field station</Link></nav>
      </header>
      <section className="registration-shell">
        <aside className="registration-story">
          <p className="eyebrow">Establish your basecamp</p>
          <h1>Keep the map.<br />Continue the expedition.</h1>
          <p>Create a private WildKind account to keep your Field Guide. Multi-pet profiles and progress tracking will arrive with WildKind Compass after beta.</p>
          <ol>
            <li><span>01</span>Private profile by default</li>
            <li><span>02</span>Separate research and community choices</li>
            <li><span>03</span>Export or delete your data at any time</li>
          </ol>
        </aside>
        <RegistrationForm userName={user?.name ?? user?.email ?? null} error={errorCode ? errors[errorCode] ?? errors["oauth-failed"] : null} returnTo={returnTo} />
      </section>
      <footer className="registration-footnote">WildKind describes recurring behavioral tendencies. It is not veterinary advice, an aggression assessment, or a compatibility guarantee.</footer>
    </main>
  );
}
