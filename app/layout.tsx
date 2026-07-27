import type { Metadata } from "next";
import { GoogleConsent, GOOGLE_CONSENT_KEY } from "./components/GoogleConsent";
import "./globals.css";

const PUBLIC_ORIGIN = new URL("https://pet-wildkind.co.uk");
const GOOGLE_TAG_ID = "G-W4N9455EHD";
const GOOGLE_TAG_BOOTSTRAP = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
var wildKindAnalyticsConsent = 'denied';
try {
  wildKindAnalyticsConsent = window.localStorage.getItem('${GOOGLE_CONSENT_KEY}') === 'granted' ? 'granted' : 'denied';
} catch (error) {}
gtag('consent', 'default', {
  'analytics_storage': wildKindAnalyticsConsent,
  'ad_storage': 'denied',
  'ad_user_data': 'denied',
  'ad_personalization': 'denied',
  'wait_for_update': 500
});
gtag('set', 'ads_data_redaction', true);
gtag('js', new Date());
gtag('config', '${GOOGLE_TAG_ID}');
`;

export function generateMetadata(): Metadata {
  const title = "WildKind — Pet personality, carefully mapped";
  const description = "Explore five carefully observed behavioral dimensions, discover your pet's provisional WildKind archetype, and learn practical ways to help them thrive.";
  return {
    metadataBase: PUBLIC_ORIGIN,
    title,
    description,
    alternates: { canonical: "/" },
    icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
    openGraph: { title, description, type: "website", url: "/", images: [{ url: "/og.png", width: 1536, height: 1024, alt: "WildKind pet personality field guide" }] },
    twitter: { card: "summary_large_image", title, description, images: ["/og.png"] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_TAG_ID}`} />
        <script id="google-tag" dangerouslySetInnerHTML={{ __html: GOOGLE_TAG_BOOTSTRAP }} />
      </head>
      <body>
        {children}
        <GoogleConsent />
      </body>
    </html>
  );
}
