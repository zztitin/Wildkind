import Link from "next/link";
import { chatGPTSignInPath, getChatGPTUser } from "../chatgpt-auth";
import { RegistrationForm } from "./RegistrationForm";

export const dynamic = "force-dynamic";

export default async function RegisterPage() {
  const user = await getChatGPTUser();
  const signInPath = chatGPTSignInPath("/");

  return (
    <main className="registration-page">
      <header className="registration-header">
        <Link href="/" className="registration-brand">WILD<span>◆</span>KIND</Link>
        <Link href="/" className="registration-back">← Back to the field station</Link>
      </header>
      <section className="registration-shell">
        <aside className="registration-story">
          <p className="eyebrow">Establish your basecamp</p>
          <h1>Keep the map.<br />Continue the expedition.</h1>
          <p>Create a private WildKind account to save Field Guides, manage up to three pet profiles, and choose if you ever appear in discovery.</p>
          <ol>
            <li><span>01</span>Private profile by default</li>
            <li><span>02</span>Separate research and community choices</li>
            <li><span>03</span>Export or delete your data at any time</li>
          </ol>
        </aside>
        <RegistrationForm signInPath={signInPath} userName={user?.displayName ?? null} />
      </section>
      <footer className="registration-footnote">WildKind describes recurring behavioral tendencies. It is not veterinary advice, an aggression assessment, or a compatibility guarantee.</footer>
    </main>
  );
}
