import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pouls — Tableau de bord, Analyseur 360° & Valorisation SaaS",
  description:
    "Pilotez vos métriques clés, votre ARR, analysez vos cohortes par niche, surveillez l'uptime en direct et maximisez la valeur de votre SaaS avec Pouls.",
  alternates: {
    canonical: "https://pouls.example/",
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    siteName: "Pouls",
    title: "Pouls — Tableau de bord, Analyseur 360° & Valorisation SaaS",
    description:
      "MRR, rétention, benchmark par niche, uptime en temps réel et valorisation de cession sur une interface d'exception.",
    url: "https://pouls.example/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pouls — Tableau de bord, Analyseur 360° & Valorisation SaaS",
    description:
      "Pilotez vos métriques clés, l'ARR, la santé et la valorisation de votre SaaS en un coup d'œil.",
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Crect width='32' height='32' rx='8' fill='%235B3DF5'/%3E%3Cpath d='M5 17h5l3-7 5 13 3-6h6' fill='none' stroke='white' stroke-width='2.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E",
  },
};

export const viewport: Viewport = {
  themeColor: "#0B0A14",
  colorScheme: "dark light",
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
      "Tableau de bord haute fidélité pour fondateurs SaaS : métriques d'ARR, analyse d'utilisateurs et de niche, surveillance de disponibilité et estimation de valeur de cession.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "EUR",
      availability: "https://schema.org/PreOrder",
    },
  };

  return (
    <html lang="fr" suppressHydrationWarning className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-sans antialiased bg-[#0B0A14] text-white selection:bg-[#5B3DF5] selection:text-white"
      >
        <a
          href="#contenu"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:rounded-lg focus:bg-[#5B3DF5] focus:px-4 focus:py-3 focus:font-semibold focus:text-white"
        >
          Aller au contenu
        </a>
        {children}
      </body>
    </html>
  );
}
