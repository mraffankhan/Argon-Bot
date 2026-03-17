import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RAVONIXX | The Ultimate Esports Tournament Management Platform",
  description: "Automate your esports tournaments, scrims, and community management with Ravonixx. The most powerful Discord-integrated platform for competitive gaming.",
  keywords: ["esports management", "tournament automation", "discord bot", "argon bot", "scrims manager", "gaming community", "esports platform"],
  authors: [{ name: "Ravonixx Team", url: "https://ravonixx.xyz" }],
  openGraph: {
    title: "RAVONIXX | Elite Esports Management",
    description: "Scale your gaming community with automated tournaments and powerful Discord integration.",
    url: "https://ravonixx.xyz",
    siteName: "Ravonixx",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Argon Esports Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ARGON | Elite Esports Management",
    description: "The next generation of Discord-driven esports automation.",
    images: ["/og-image.png"],
    creator: "@argonbot",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth" suppressHydrationWarning>
      <body className={`${inter.className} antialiased bg-black text-white min-h-screen flex flex-col selection:bg-primary/30 selection:text-white`}>
        <Navbar />
        <main className="flex-grow pt-24">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
