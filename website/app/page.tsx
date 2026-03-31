"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Gamepad2, Users, Target, Trophy, Swords, Medal, Star } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[80vh] flex flex-col items-center justify-center px-6 overflow-hidden" aria-label="Hero">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10"
        >
          <h1 className="text-7xl sm:text-8xl md:text-[10rem] font-black text-white italic tracking-tighter leading-[0.85] mb-6">
            RAVONIXX
          </h1>
          <p className="text-gray-500 text-lg font-medium mb-8">The Ultimate Esports Tournament Platform</p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link
              href="/tournaments"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-white text-black font-bold text-lg rounded-2xl hover:bg-gray-100 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.1)]"
            >
              <Gamepad2 className="w-5 h-5" />
              Play Now
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/teams"
              className="inline-flex items-center gap-2.5 px-8 py-4 glass border border-white/10 text-white font-bold text-lg rounded-2xl hover:bg-white/5 transition-all hover:scale-105 active:scale-95"
            >
              <Users className="w-5 h-5" />
              Find Team
            </Link>
          </div>

          <div className="flex items-center justify-center gap-3">
            <span className="text-gray-600 text-sm font-medium">POWERED BY</span>
            <span className="text-white text-xl font-black uppercase tracking-wider">VoxiHost</span>
          </div>
        </motion.div>
      </section>

      <section className="py-20 border-t border-white/5" aria-label="Platform Statistics">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="sr-only">Platform Statistics</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard icon={<Target className="w-5 h-5 text-primary" />} label="Total Kills" value="1.2M" />
            <StatCard icon={<Trophy className="w-5 h-5 text-yellow-500" />} label="Tournaments Hosted" value="2,341" />
            <StatCard icon={<Swords className="w-5 h-5 text-secondary" />} label="Active Players" value="12.8K" />
            <StatCard icon={<Medal className="w-5 h-5 text-emerald-500" />} label="Platform Uptime" value="99.9%" />
          </div>
        </div>
      </section>

      <section className="py-20 border-t border-white/5" aria-label="Trusted Partners">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <Star className="w-8 h-8 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Trusted by the best</h2>
          <p className="text-gray-500 mb-8">Powering esports organizations and communities worldwide</p>
          <Link 
            href="/sponsors"
            className="inline-flex items-center gap-2 px-6 py-3 glass border border-white/10 text-white font-medium rounded-xl hover:bg-white/5 transition-all"
          >
            View Our Partners <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="glass border border-white/5 rounded-2xl p-6 text-center hover:border-white/10 transition-all">
      <div className="flex items-center justify-center mb-3" aria-hidden="true">{icon}</div>
      <div className="text-2xl md:text-3xl font-black text-white tracking-tight italic mb-1">{value}</div>
      <div className="text-xs text-gray-600 font-semibold uppercase tracking-wider">{label}</div>
    </div>
  );
}
