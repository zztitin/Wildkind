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

test("methodology route documents the live scoring model and review boundary", async () => {
  const methodology = await readFile(new URL("../app/methodology/page.tsx", import.meta.url), "utf8");
  assert.match(methodology, /WildKind Methodology — Our Approach/);
  assert.match(methodology, /Discovery Drive/);
  assert.match(methodology, /Social Energy/);
  assert.match(methodology, /Bonding Style/);
  assert.match(methodology, /Behavioral Regulation/);
  assert.match(methodology, /Emotional Resilience/);
  assert.match(methodology, /4 − selected value/);
  assert.match(methodology, /Euclidean distance/);
  assert.match(methodology, /difference between the two closest distances is less than 10/);
  assert.match(methodology, /Not diagnostic/);
  assert.match(methodology, /Litchfield/);
  assert.match(methodology, /Gosling/);
  assert.match(methodology, /No veterinarian, veterinary behaviorist/);
  assert.match(methodology, /WildKind Product & Research/);
  assert.doesNotMatch(methodology, /github\.com/i);
});

test("sample Field Guide is complete, fictional, and payment-preview ready", async () => {
  const sample = await readFile(new URL("../app/sample-field-guide/page.tsx", import.meta.url), "utf8");
  assert.match(sample, /Sample Field Guide — WildKind/);
  assert.match(sample, /This is a sample report, generated based on the fictional pet ‘Buddy’/);
  assert.match(sample, /No real user, account, or assessment data appears/);
  assert.match(sample, /Buddy's radar chart: Discovery Drive 82/);
  assert.match(sample, /Thundertrail Scout/);
  assert.match(sample, /Advantages and disadvantages/);
  assert.match(sample, /Stress factors/);
  assert.match(sample, /Personalized seven-day plan/);
  assert.match(sample, /Start with/);
  assert.match(sample, /Pause if/);
  assert.match(sample, /Observation to record next/);
  assert.match(sample, /Scientific and safety boundary/);
});

test("observation checklist resource is neutral, printable, and share-ready", async () => {
  const resource = await readFile(
    new URL(
      "../app/resources/pet-behavior-observation-checklist/page.tsx",
      import.meta.url,
    ),
    "utf8",
  );
  assert.match(resource, /30-Day Pet Behavior Observation Checklist/);
  assert.match(
    resource,
    /No diagnosis required, no labeling needed, just record-keeping/,
  );
  assert.match(
    resource,
    /Created by WildKind, based on frameworks of animal behavior/,
  );
  assert.match(resource, /Diet & hydration/);
  assert.match(resource, /Sleep & rest/);
  assert.match(resource, /Social responses/);
  assert.match(resource, /Stress signals/);
  assert.match(resource, /Play preferences/);
  assert.match(resource, /Trainers/);
  assert.match(resource, /Groomers/);
  assert.match(resource, /Rescue & foster teams/);
  assert.match(
    resource,
    /wildkind-30-day-pet-behavior-observation-checklist\.pdf/,
  );
  assert.match(resource, /download/);
});
