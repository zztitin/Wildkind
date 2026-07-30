# WildKind

> **Decoding the nature beneath the nurture.**

[Visit WildKind](https://pet-wildkind.co.uk) ·
[View a sample Field Guide](https://pet-wildkind.co.uk/sample-field-guide) ·
[Read the methodology](https://pet-wildkind.co.uk/methodology) ·
[Download the free observation checklist](https://pet-wildkind.co.uk/resources/pet-behavior-observation-checklist)

WildKind is a warm-science pet behavior project that helps people notice
patterns without reducing an animal to a label. It translates everyday
observations into five transparent behavioral dimensions, a provisional
archetype, and practical care suggestions.

The public product, educational resources, methodology, pricing, and project
story are available at **[pet-wildkind.co.uk](https://pet-wildkind.co.uk)**.

## Project overview

The current MVP supports this core journey:

1. Complete one anonymous 32-observation WildKind Snapshot.
2. Calculate five transparent behavioral dimensions with coverage labels.
3. Open a Field Guide with a provisional archetype and three care actions.
4. Save a private pet profile and opt into discovery.
5. Find explainable recommendations, connect by mutual consent, and message.
6. Block, report, export, change visibility, or delete saved data.

WildKind is an observation and educational tool—not a diagnostic service or a
replacement for veterinary care, a veterinary behaviorist, or a qualified
animal behavior professional. See the
[full methodology and limitations](https://pet-wildkind.co.uk/methodology).

## Explore WildKind

- [Take the WildKind assessment](https://pet-wildkind.co.uk)
- [Preview Buddy’s fictional sample report](https://pet-wildkind.co.uk/sample-field-guide)
- [See pricing and Field Guide options](https://pet-wildkind.co.uk/pricing)
- [Use the free 30-day behavior observation checklist](https://pet-wildkind.co.uk/resources/pet-behavior-observation-checklist)
- [Read the story and editorial standards](https://pet-wildkind.co.uk/about)

## Local development

Requires Node.js 22.13 or newer and pnpm.

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm test
```

The app uses Next.js, React, Tailwind CSS, Vinext, Cloudflare Workers, and D1.
Product and assessment specifications are in `docs/`.

## Google sign-in

The public registration flow uses Google OAuth with PKCE. Configure
`GOOGLE_CLIENT_ID` as a production environment variable and
`GOOGLE_CLIENT_SECRET` as a production secret. The authorized callback URL is:

```text
https://pet-wildkind.co.uk/api/auth/callback/google
```

D1 stores verified account details, append-only consent events, and hashed
revocable sessions. Google access tokens and raw session tokens are not stored.

## PayPal checkout

The Complete Field Guide uses a one-time, server-confirmed PayPal Orders v2
checkout. The production configuration charges `$5.99 USD`. Configure
`PAYPAL_CLIENT_ID`, `PAYPAL_CLIENT_SECRET`,
`PAYPAL_ENV`, `PAYPAL_WEBHOOK_ID`, and `PAYPAL_FIELD_GUIDE_PRICE` as hosted
runtime values. Never expose the client secret in browser code or commit it.

The public webhook URL is:

```text
https://pet-wildkind.co.uk/api/paypal/webhook
```

Payment capture and verified webhook events create the D1 entitlement. Browser
redirects alone never unlock paid access.

## Creem checkout

Creem runs alongside PayPal as a second one-time checkout provider. Configure
`CREEM_API_KEY`, `CREEM_ENV`, `CREEM_PRODUCT_ID`, and
`CREEM_WEBHOOK_SECRET` as hosted runtime values. Test and production products,
keys, and webhooks are isolated by Creem and must not be mixed.

The Creem webhook URL is:

```text
https://pet-wildkind.co.uk/api/creem/webhook
```

The return route verifies Creem's signed redirect and then retrieves the
checkout from Creem's server before recording it. The signed webhook remains
the durable source for completed, refunded, and disputed payment updates.
Test-mode purchases are stored as `test_completed` and never grant production
Field Guide access. Use `/checkout?creem_test=1` to expose the test button.
