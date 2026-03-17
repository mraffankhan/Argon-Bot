"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Trophy, Swords, Ticket, Database, 
  UserPlus, Crown, Shield, Server, Box, Terminal,
  Zap, Globe, Layout, Share2, Layers
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const [stats, setStats] = useState<{
    commands: number | string;
    users: number | string;
    servers: number | string;
    uptime: string;
    loading: boolean;
    error: boolean;
  }>({
    commands: 0,
    users: 0,
    servers: 0,
    uptime: "99.9%",
    loading: true,
    error: false
  });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setStats({
            commands: data.commands,
            users: data.users,
            servers: data.servers,
            uptime: data.uptime,
            loading: false,
            error: false
          });
        } else {
          setStats(prev => ({ ...prev, loading: false, error: true }));
        }
      })
      .catch(err => {
        console.error("Failed to fetch stats", err);
        setStats(prev => ({ ...prev, loading: false, error: true }));
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
        {/* Animated Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 blur-[150px] animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/10 blur-[150px] animate-pulse delay-700" />
        </div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-1.5 rounded-full glass border border-white/5 text-sm font-semibold text-gray-400 mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span>Platform is Live & Scaleable</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tighter italic uppercase leading-[1.1] text-white"
          >
            RAVONIXX <span className="text-gradient">DEVELOPMENT</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl font-medium leading-relaxed"
          >
            The most powerful Discord platform for tournament management, scrims, and community scaling. Built for teams who demand elite performance.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-5"
          >
            <button
              onClick={() => window.location.href = '/api/auth/discord'}
              className="px-10 py-5 bg-white text-black font-black text-lg rounded-2xl hover:bg-gray-100 transition-all flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:scale-105 active:scale-95 group"
            >
              Start Building <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="/docs"
              className="px-10 py-5 glass border border-white/10 text-white font-black text-lg rounded-2xl hover:bg-white/5 transition-all flex items-center justify-center gap-2"
            >
              <Terminal size={20} /> View Docs
            </Link>
          </motion.div>
        </div>

        {/* Floating Component Mockups */}
        <div className="relative w-full max-w-6xl mx-auto mt-24 px-6 hidden lg:block">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="w-full aspect-video glass rounded-3xl border border-white/10 overflow-hidden shadow-2xl relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
            <div className="p-8 h-full flex flex-col">
              <div className="flex items-center gap-4 mb-8">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                  <div className="w-3 h-3 rounded-full bg-white/10" />
                </div>
                <div className="h-6 w-48 rounded-md bg-white/5 border border-white/5" />
              </div>
              <div className="flex-grow grid grid-cols-12 gap-6">
                <div className="col-span-3 space-y-4">
                  {[1,2,3,4].map(i => <div key={i} className="h-4 w-full rounded bg-white/5" />)}
                </div>
                <div className="col-span-9 space-y-6">
                  <div className="h-32 w-full rounded-2xl bg-white/5 border border-white/5" />
                  <div className="grid grid-cols-2 gap-6">
                    <div className="h-40 w-full rounded-2xl bg-white/5 border border-white/5" />
                    <div className="h-40 w-full rounded-2xl bg-white/5 border border-white/5" />
                  </div>
                </div>
              </div>
            </div>
            {/* Real Image Layer if available */}
            {/* <img src="/dashboard-preview.png" className="absolute inset-0 object-cover opacity-50" /> */}
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Users" 
              value={stats.error ? "Data unavailable" : stats.loading ? "Loading..." : stats.users.toLocaleString()} 
              prefix={!stats.loading && !stats.error ? "+" : ""} 
            />
            <StatCard 
              title="Guilds Active" 
              value={stats.error ? "Data unavailable" : stats.loading ? "Loading..." : stats.servers.toLocaleString()} 
            />
            <StatCard 
              title="Global Commands" 
              value={stats.error ? "Data unavailable" : stats.loading ? "Loading..." : stats.commands.toLocaleString()} 
            />
            <StatCard 
              title="System Uptime" 
              value={stats.uptime} 
            />
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 mb-20">
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-white italic uppercase tracking-tighter mb-6">Engineered for<br /><span className="text-gradient">Performance</span></h2>
              <p className="text-gray-400 text-lg max-w-xl">Every module in Argon is built from the ground up for speed, scalability, and ease of use in highly competitive environments.</p>
            </div>
            <Link href="/tournaments" className="px-8 py-4 glass text-white font-bold rounded-2xl hover:bg-white/5 flex items-center gap-2 group border border-white/10 shrink-0">
              Explore Platform <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureItem
              icon={<Trophy size={32} strokeWidth={1.5} />}
              title="Tournament Engine"
              description="A robust automation engine for single-elim, double-elim, and round-robin structures with auto-seeding."
              color="primary"
            />
            <FeatureItem
              icon={<Swords size={32} strokeWidth={1.5} />}
              title="Scrim Management"
              description="Daily scrim automation including point tables, slot management, and automated match reporting."
              color="secondary"
            />
            <FeatureItem
              icon={<Zap size={32} strokeWidth={1.5} />}
              title="Rapid Execution"
              description="Built on an optimized database layer delivering sub-10ms query execution across millions of records."
              color="blue-500"
            />
            <FeatureItem
              icon={<Shield size={32} strokeWidth={1.5} />}
              title="Enterprise Security"
              description="ISO-grade encryption for user data and comprehensive audit logs for all administrative actions."
              color="emerald-500"
            />
            <FeatureItem
              icon={<Layers size={32} strokeWidth={1.5} />}
              title="Discord Components v2"
              description="Leveraging the latest Discord UI capabilities for interactive, high-fidelity community experiences."
              color="amber-500"
            />
            <FeatureItem
              icon={<Globe size={32} strokeWidth={1.5} />}
              title="Global Scale"
              description="Deployed across edge locations worldwide to ensure low-latency access for gaming communities everywhere."
              color="rose-500"
            />
          </div>
        </div>
      </section>

      {/* Social / Trust Section */}
      <section className="py-24 border-y border-white/5 bg-white/[0.01]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-12">
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">Trusted by the best.</h3>
              <p className="text-gray-500">Powering events and organizations around the globe.</p>
            </div>
            <div className="flex flex-wrap items-center gap-12 opacity-30 grayscale brightness-200">
               {/* Placeholders for partner logos */}
               <Box size={40} />
               <Layout size={40} />
               <Share2 size={40} />
               <Zap size={40} />
               <Globe size={40} />
            </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8 italic leading-tight">Ready to <span className="text-gradient">Elevate</span> Your Community?</h2>
          <p className="text-xl text-gray-400 mb-12 max-w-2xl mx-auto">Join thousands of servers already using Argon to automate their growth and competitive play.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <Link href="/get" className="px-10 py-5 bg-white text-black font-black text-lg rounded-2xl hover:scale-105 transition-all">Add to Discord</Link>
             <Link href="/community" className="px-10 py-5 glass border border-white/10 text-white font-black text-lg rounded-2xl hover:bg-white/5 transition-all">Join Community</Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function StatCard({ title, value, prefix }: { title: string; value: string; prefix?: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass border border-white/5 p-8 rounded-3xl"
    >
      <div className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tighter italic">
        {prefix}{value}
      </div>
      <div className="text-xs font-bold uppercase tracking-widest text-gray-500">{title}</div>
    </motion.div>
  );
}

function FeatureItem({ icon, title, description, color }: { icon: React.ReactNode; title: string; description: string; color: string }) {
  return (
    <div className="group p-10 rounded-3xl glass border border-white/5 hover:border-primary/20 transition-all duration-500 relative overflow-hidden">
      <div className={`mb-8 p-4 rounded-xl inline-flex text-white glass border border-white/10 group-hover:scale-110 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white mb-4 italic uppercase">{title}</h3>
      <p className="text-gray-400 leading-relaxed font-medium">{description}</p>
      
      {/* Subtle Background Accent */}
      <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-primary/5 blur-2xl rounded-full group-hover:bg-primary/10 transition-colors" />
    </div>
  );
}
