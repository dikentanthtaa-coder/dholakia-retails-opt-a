import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import HeaderWrapper from "@/components/HeaderWrapper";
import Footer from "@/components/Footer";
import DrLoader from "@/components/DrLoader";

const syne = Syne({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-syne",
  weight: ["400", "500", "600", "700"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
  weight: ["300", "400", "500"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-jetbrains-mono",
  weight: ["400", "500"],
});

const SITE_URL = "https://dholakiaretail.com";
const SITE_NAME = "Dholakia Retail";
const SITE_DESCRIPTION =
  "Dholakia Retail Private Limited is the corporate foundation for a growing portfolio of luxury jewellery brands, bringing together heritage, precision, and a future-facing approach to brand creation.";
const DEFAULT_OG_IMAGE = `${SITE_URL}/brand/dr-logo/dr_logo_light.svg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Dholakia Retail — Building the Future of Luxury Retail",
    template: "%s · Dholakia Retail",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: "Dholakia Retail Private Limited", url: SITE_URL }],
  creator: "Dholakia Retail Private Limited",
  publisher: "Dholakia Retail Private Limited",
  keywords: [
    "Dholakia Retail",
    "luxury jewellery",
    "Mayavé",
    "lab-grown diamonds",
    "diamond manufacturing",
    "Surat jewellery",
    "responsible luxury",
    "fine jewellery brands",
  ],
  category: "Luxury Jewellery",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: "Dholakia Retail — Building the Future of Luxury Retail",
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: "en_IN",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Dholakia Retail — corporate platform for luxury jewellery brands",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Dholakia Retail — Building the Future of Luxury Retail",
    description: SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
    { media: "(prefers-color-scheme: dark)", color: "#0B1426" },
  ],
};

/**
 * Organization JSON-LD — Schema.org structured data for the brand entity.
 * Indexed by Google's Knowledge Graph + powers rich-result eligibility.
 * Inlined as a `<script type="application/ld+json">` in <head> via the
 * recommended Next.js inline-script pattern (no client component needed).
 */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Dholakia Retail Private Limited",
  alternateName: "Dholakia Retail",
  url: SITE_URL,
  logo: DEFAULT_OG_IMAGE,
  description: SITE_DESCRIPTION,
  foundingDate: "2024",
  legalName: "Dholakia Retail Private Limited",
  // CIN is rendered in Footer; including here helps verifiers resolve the
  // legal entity to its India MCA registration.
  identifier: {
    "@type": "PropertyValue",
    propertyID: "CIN",
    value: "U32111GJ2024PTC155690",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Surat",
    addressRegion: "Gujarat",
    addressCountry: "IN",
  },
  sameAs: [
    "https://www.linkedin.com/company/dholakia-retail",
    "https://www.instagram.com/dholakiaretail",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: "en-IN",
  publisher: {
    "@type": "Organization",
    name: "Dholakia Retail Private Limited",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${dmSans.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        {/* Start the TLS handshake with the Sanity image CDN as early as
            possible — every CMS-backed thumbnail is served from here. */}
        <link rel="preconnect" href="https://cdn.sanity.io" crossOrigin="" />
        <link rel="dns-prefetch" href="https://cdn.sanity.io" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationJsonLd),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteJsonLd),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[var(--color-bg-primary)] text-[var(--color-text-body)]">
        {/* Initial-load splash — rendered into the first HTML payload so it
            paints immediately, then torn down by the inline script below
            once `window.load` fires (i.e. all images, fonts, and scripts
            have finished). Belt-and-braces safety timeout caps it at 12s
            in case `load` never fires (e.g. a hung sub-resource). */}
        <div
          id="dr-initial-loader"
          data-dr-initial-loader
          // The inline script below adds `dr-loader-host--leaving` and
          // eventually removes this node *before* React hydrates on fast
          // loads. That's a known, intentional pre-hydration mutation —
          // tell React not to flag it as a mismatch (suppression is
          // shallow: only this element's attrs, not its children).
          suppressHydrationWarning
        >
          <DrLoader />
        </div>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var el=document.getElementById('dr-initial-loader');if(!el)return;var done=false;function hide(){if(done)return;done=true;el.classList.add('dr-loader-host--leaving');setTimeout(function(){el&&el.parentNode&&el.parentNode.removeChild(el);},600);}if(document.readyState==='complete'){hide();}else{window.addEventListener('load',hide,{once:true});}setTimeout(hide,12000);})();`,
          }}
        />
        <HeaderWrapper />
        <main id="main" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
