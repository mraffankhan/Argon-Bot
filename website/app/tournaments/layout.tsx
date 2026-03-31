import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Esports Tournaments - Join & Compete | Ravonixx",
  description: "Browse and register for active esports tournaments. Free Fire, BGMI, Valorant competitive gaming events with live leaderboards, team management, and automated Discord integration.",
  keywords: ["esports tournaments", "gaming tournaments", "Free Fire tournament", "BGMI tournament", "Valorant tournament", "tournament registration", "competitive gaming", "esports events"],
  openGraph: {
    title: "Esports Tournaments - Join & Compete | Ravonixx",
    description: "Browse and register for active esports tournaments. Free Fire, BGMI, Valorant competitive gaming events.",
    url: "https://ravonixx.xyz/tournaments",
    type: "website",
  },
};

export default function TournamentsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
