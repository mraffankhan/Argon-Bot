"use client";

import { useEffect, useState } from "react";

export default function SponsorsPage() {
  const [stats, setStats] = useState({
    players: 0,
    tournaments: 0,
    matches: 0,
    communities: 0,
  });

  useEffect(() => {
    fetch("/api/leaderboard?type=players&limit=1")
      .then(r => r.json())
      .catch(() => {});
    // We'll use placeholder numbers; in production these come from an API
    setStats({ players: 250, tournaments: 45, matches: 320, communities: 12 });
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-zinc-950 to-yellow-900/20"></div>
        <div className="relative max-w-5xl mx-auto px-6 py-24 text-center">
          <p className="text-purple-400 font-bold uppercase tracking-widest text-sm mb-4">Partner With Us</p>
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">
            India's Fastest Growing<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-yellow-400">
              Esports Platform
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Ravonixx powers tournament operations for the most active mobile gaming communities in India.
            Put your brand in front of passionate gamers.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20 space-y-20">

        {/* Live Stats */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Registered Players", value: `${stats.players}+`, icon: "👤" },
            { label: "Tournaments Hosted", value: `${stats.tournaments}+`, icon: "🏆" },
            { label: "Matches Played", value: `${stats.matches}+`, icon: "🎮" },
            { label: "Communities", value: `${stats.communities}+`, icon: "💬" },
          ].map((s, i) => (
            <div key={i} className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className="text-3xl font-black text-white">{s.value}</div>
              <div className="text-sm text-zinc-500 mt-1">{s.label}</div>
            </div>
          ))}
        </section>

        {/* Audience Profile */}
        <section className="text-center">
          <h2 className="text-3xl font-black mb-6">🎯 Our Audience</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
              <div className="text-2xl font-black text-purple-400 mb-2">18-24</div>
              <div className="text-zinc-400">Year old Indian mobile gamers</div>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
              <div className="text-2xl font-black text-purple-400 mb-2">Free Fire Max & BGMI</div>
              <div className="text-zinc-400">Primary competitive titles</div>
            </div>
            <div className="bg-zinc-900/70 border border-zinc-800 rounded-xl p-6">
              <div className="text-2xl font-black text-purple-400 mb-2">Discord-Native</div>
              <div className="text-zinc-400">Community-driven engagement</div>
            </div>
          </div>
        </section>

        {/* Sponsorship Tiers */}
        <section>
          <h2 className="text-3xl font-black text-center mb-8">💎 Sponsorship Tiers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tier 1 */}
            <div className="relative bg-gradient-to-b from-yellow-900/20 to-zinc-900/70 border border-yellow-500/30 rounded-2xl p-8 text-center">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black text-xs font-black px-4 py-1 rounded-full uppercase">
                Title Sponsor
              </div>
              <div className="text-4xl mb-4">👑</div>
              <h3 className="text-xl font-black mb-2">Tier 1</h3>
              <ul className="text-zinc-400 text-sm space-y-2 text-left mt-6">
                <li>✅ Logo on all result cards</li>
                <li>✅ Mentioned in all champion announcements</li>
                <li>✅ Banner on tournament pages</li>
                <li>✅ Dedicated branded tournament</li>
                <li>✅ Monthly analytics report</li>
              </ul>
              <a href="mailto:ravonixx.contact@gmail.com?subject=Title Sponsor Inquiry"
                className="mt-6 block bg-yellow-500 hover:bg-yellow-400 text-black font-bold py-3 rounded-lg transition-colors">
                Contact Us
              </a>
            </div>

            {/* Tier 2 */}
            <div className="bg-zinc-900/70 border border-purple-500/30 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🎮</div>
              <h3 className="text-xl font-black mb-2">Event Sponsor</h3>
              <ul className="text-zinc-400 text-sm space-y-2 text-left mt-6">
                <li>✅ Logo on champion card</li>
                <li>✅ Mentioned in tournament announcements</li>
                <li>✅ Logo on website during event</li>
                <li>✅ Social media shoutout</li>
              </ul>
              <a href="mailto:ravonixx.contact@gmail.com?subject=Event Sponsor Inquiry"
                className="mt-6 block bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-lg transition-colors">
                Contact Us
              </a>
            </div>

            {/* Tier 3 */}
            <div className="bg-zinc-900/70 border border-zinc-700 rounded-2xl p-8 text-center">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-black mb-2">Community Partner</h3>
              <ul className="text-zinc-400 text-sm space-y-2 text-left mt-6">
                <li>✅ Prize contribution in tournaments</li>
                <li>✅ Mentioned as prize sponsor</li>
                <li>✅ Brand visibility to players</li>
                <li>✅ Product placement</li>
              </ul>
              <a href="mailto:ravonixx.contact@gmail.com?subject=Community Partner Inquiry"
                className="mt-6 block bg-zinc-700 hover:bg-zinc-600 text-white font-bold py-3 rounded-lg transition-colors">
                Contact Us
              </a>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center bg-gradient-to-r from-purple-900/20 to-yellow-900/20 border border-zinc-800 rounded-2xl p-12">
          <h2 className="text-3xl font-black mb-4">Ready to Reach India's Gamers?</h2>
          <p className="text-zinc-400 mb-6">Drop us an email and we'll craft a custom partnership for your brand.</p>
          <a href="mailto:ravonixx.contact@gmail.com"
            className="inline-block bg-purple-600 hover:bg-purple-500 text-white font-bold px-8 py-3 rounded-lg text-lg transition-colors">
            📧 ravonixx.contact@gmail.com
          </a>
        </section>
      </div>
    </div>
  );
}
