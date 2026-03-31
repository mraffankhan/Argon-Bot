import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Providers from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://ravonixx.xyz"),
  title: {
    default: "Ravonixx | Esports Tournament Platform - Host & Join Gaming Tournaments",
    template: "%s | Ravonixx Esports Platform"
  },
  description: "Ravonixx is the ultimate esports tournament platform. Host, manage, and join competitive gaming tournaments with automated Discord integration. Free Fire, BGMI, Valorant tournaments with live leaderboards and team management.",
  keywords: [
    "esports tournament platform",
    "gaming tournament management",
    "esports tournament organizer",
    "Free Fire tournament",
    "BGMI tournament",
    "Valorant tournament",
    "Discord esports bot",
    "tournament automation",
    "gaming community platform",
    "esports leaderboard",
    "competitive gaming platform",
    "tournament registration system",
    "esports management software",
    "gaming tournament hosting",
    "Argon bot",
    "Ravonixx",
    "esports OS",
    "tournament brackets",
    "gaming scrims manager",
    "esports infrastructure"
  ],
  authors: [{ name: "Ravonixx Team", url: "https://ravonixx.xyz" }],
  creator: "Ravonixx",
  publisher: "Ravonixx",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ravonixx.xyz",
    title: "Ravonixx | Esports Tournament Platform - Host & Join Gaming Tournaments",
    description: "The ultimate esports tournament platform. Host, manage, and join competitive gaming tournaments with automated Discord integration. Free Fire, BGMI, Valorant tournaments.",
    siteName: "Ravonixx",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Ravonixx Esports Tournament Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Ravonixx | Esports Tournament Platform",
    description: "The ultimate esports tournament platform. Host, manage, and join competitive gaming tournaments with automated Discord integration.",
    images: ["/og-image.png"],
    creator: "@ravonixx",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "YOUR_GOOGLE_VERIFICATION_CODE",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  alternates: {
    canonical: "https://ravonixx.xyz",
  },
  category: "esports",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#07090E" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ravonixx",
    url: "https://ravonixx.xyz",
    description: "The ultimate esports tournament platform for hosting and joining competitive gaming tournaments.",
    publisher: {
      "@type": "Organization",
      name: "Ravonixx",
      url: "https://ravonixx.xyz",
      logo: {
        "@type": "ImageObject",
        url: "https://ravonixx.xyz/R_logo.png",
      },
    },
    potentialAction: {
      "@type": "SearchAction",
      target: "https://ravonixx.xyz/tournaments?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
    sameAs: [
      "https://instagram.com/ravonixx.dev",
    ],
  };

  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="google-adsense-account" content="ca-pub-6576867639479039" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${inter.className} antialiased bg-black text-white min-h-screen flex flex-col selection:bg-primary/30 selection:text-white`}>
        <Providers>
          <Navbar />
          <main className="flex-grow pt-20">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
