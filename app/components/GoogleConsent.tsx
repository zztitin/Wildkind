"use client";

import { useState, useSyncExternalStore } from "react";

export const GOOGLE_CONSENT_KEY = "wildkind_google_analytics_consent";
const GOOGLE_CONSENT_CHANGE_EVENT = "wildkind:google-consent-change";

type ConsentChoice = "granted" | "denied";
type ConsentSnapshot = ConsentChoice | null | "loading";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function subscribeToConsent(onStoreChange: () => void) {
  window.addEventListener("storage", onStoreChange);
  window.addEventListener(GOOGLE_CONSENT_CHANGE_EVENT, onStoreChange);
  return () => {
    window.removeEventListener("storage", onStoreChange);
    window.removeEventListener(GOOGLE_CONSENT_CHANGE_EVENT, onStoreChange);
  };
}

function getConsentSnapshot(): ConsentSnapshot {
  try {
    const value = window.localStorage.getItem(GOOGLE_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function getServerConsentSnapshot(): ConsentSnapshot {
  return "loading";
}

export function GoogleConsent() {
  const savedChoice = useSyncExternalStore(subscribeToConsent, getConsentSnapshot, getServerConsentSnapshot);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  function saveChoice(choice: ConsentChoice) {
    try {
      window.localStorage.setItem(GOOGLE_CONSENT_KEY, choice);
    } catch {
      // The current page can still honor the choice without persisting it.
    }

    window.dispatchEvent(new Event(GOOGLE_CONSENT_CHANGE_EVENT));
    window.gtag?.("consent", "update", {
      analytics_storage: choice,
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
    setIsSettingsOpen(false);
  }

  if (savedChoice === "loading") return null;

  if (savedChoice !== null && !isSettingsOpen) {
    return (
      <button className="privacy-choices-trigger" type="button" onClick={() => setIsSettingsOpen(true)}>
        Privacy choices
      </button>
    );
  }

  return (
    <section className="consent-banner" role="dialog" aria-label="Google Analytics privacy choices" aria-live="polite">
      <div>
        <span>Optional analytics</span>
        <h2>Help us understand the trail.</h2>
        <p>
          We use Google Analytics to learn how WildKind is used. Advertising storage and personalized advertising stay off.
          Your choice is remembered on this device and can be changed at any time.
        </p>
      </div>
      <div className="consent-actions">
        <button type="button" className="consent-decline" onClick={() => saveChoice("denied")}>
          Decline
        </button>
        <button type="button" className="consent-accept" onClick={() => saveChoice("granted")}>
          Accept analytics
        </button>
      </div>
    </section>
  );
}
