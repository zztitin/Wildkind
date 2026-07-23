# WildKind

Warm-science pet personality mapping and safe social discovery.

This MVP implements the core loop from the product requirements:

1. Complete one anonymous 32-observation WildKind Snapshot.
2. Calculate five transparent behavioral dimensions with coverage labels.
3. Open a Field Guide with a provisional archetype and three care actions.
4. Save a private pet profile and opt into discovery.
5. Find explainable recommendations, connect by mutual consent, and message.
6. Block, report, export, change visibility, or delete saved data.

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
