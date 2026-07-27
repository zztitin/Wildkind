import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

test("build contains the WildKind product shell and privacy-first analytics", async () => {
  await access(new URL("../dist/server/index.js", import.meta.url));
  const [page, app, layout, consent, css] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/WildKindApp.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/components/GoogleConsent.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
  ]);
  assert.match(page, /<WildKindApp initialUser=/);
  assert.match(app, /What&apos;s Your Pet&apos;s/);
  assert.match(app, /Begin the expedition/);
  assert.match(app, /Five coordinates/);
  assert.match(app, /unoptimized/);
  assert.match(layout, /Pet personality, carefully mapped/);
  assert.match(layout, /metadataBase: PUBLIC_ORIGIN/);
  assert.match(layout, /alternates: \{ canonical: "\/" \}/);
  assert.match(layout, /G-W4N9455EHD/);
  assert.match(layout, /googletagmanager\.com\/gtag\/js/);
  assert.match(layout, /gtag\('config', '\$\{GOOGLE_TAG_ID\}'\)/);
  assert.match(layout, /gtag\('consent', 'default'/);
  assert.match(layout, /'analytics_storage': wildKindAnalyticsConsent/);
  assert.match(layout, /'ad_storage': 'denied'/);
  assert.match(layout, /'ad_user_data': 'denied'/);
  assert.match(layout, /'ad_personalization': 'denied'/);
  assert.match(consent, /wildkind_google_analytics_consent/);
  assert.match(consent, /"consent", "update"/);
  assert.match(consent, /Accept analytics/);
  assert.match(consent, /Privacy choices/);
  assert.match(css, /--obsidian:#1a1816/);
  assert.match(css, /\.consent-banner/);
  assert.doesNotMatch(`${page}${app}${layout}`, /codex-preview|react-loading-skeleton|Starter Project/i);
});

test("pricing route contains the staged WildKind offer", async () => {
  const [page, pricing] = await Promise.all([
    readFile(new URL("../app/pricing/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/pricing/PricingPage.tsx", import.meta.url), "utf8"),
  ]);
  assert.match(page, /PricingPage/);
  assert.match(page, /alternates: \{ canonical: "\/pricing" \}/);
  assert.match(pricing, /WildKind Snapshot/);
  assert.match(pricing, /complete Field Guide/i);
  assert.match(pricing, /WildKind Compass/);
  assert.match(pricing, /secure one-time PayPal purchase/i);
  assert.doesNotMatch(pricing, /sandbox/i);
  assert.match(pricing, /USD/);
  assert.match(pricing, /\/checkout/);
});
