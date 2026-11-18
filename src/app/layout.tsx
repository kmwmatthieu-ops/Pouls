import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pouls — Métriques, disponibilité et valeur de votre SaaS sur un seul écran",
  description:
    "Pouls connecte votre compte Stripe en lecture seule pour afficher MRR, churn et LTV, analyser votre niche et vos utilisateurs, surveiller la disponibilité de votre service et estimer la valeur de revente de votre SaaS.",
  alternates: {
    canonical: "https://pouls.example/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Pouls",
    title: "Pouls — Le tableau de bord et analyseur des fondateurs de SaaS",
    description:
      "MRR, churn, analyse d'utilisateurs par niche, disponibilité et estimation de valeur de votre SaaS, réunis sur un seul écran.",
    url: "https://pouls.example/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pouls — Le tableau de bord des fondateurs de SaaS",
    description:
      "MRR, churn, analyse d'utilisateurs par niche, disponibilité et estimation de valeur de votre SaaS.",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%230B7A5C'/%3E%3Cpath d='M5 17h5l3-7 5 13 3-6h6' fill='none' stroke='white' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAF7" },
    { media: "(prefers-color-scheme: dark)", color: "#0D0F12" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Pouls",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    inLanguage: "fr",
    description:
      "Tableau de bord tout-en-un pour fondateurs de SaaS : métriques Stripe, analyse d'utilisateurs et de niche, surveillance de disponibilité et estimation de valeur de revente.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/PreOrder",
    },
  };

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body className="font-sans antialiased selection:bg-accent-soft selection:text-accent">
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-4 focus:py-3 focus:font-semibold focus:text-on-accent"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
