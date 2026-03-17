"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ChevronRight, Search, Book, Terminal, 
  Code, HelpCircle, Layout, MessageSquare 
} from "lucide-react";
import { motion } from "framer-motion";

const DOCS_NAV = [
  {
    title: "Getting Started",
    items: [
      { label: "Introduction", href: "/docs" },
      { label: "Quick Start", href: "/docs/quickstart" },
      { label: "Bot Setup", href: "/docs/setup" },
    ]
  },
  {
    title: "Core Features",
    items: [
      { label: "Tournaments", href: "/docs/tournaments" },
      { label: "Scrims", href: "/docs/scrims" },
      { label: "Ticketing", href: "/docs/tickets" },
    ]
  },
  {
    title: "Developers",
    items: [
      { label: "API Reference", href: "/docs/api" },
      { label: "Webhooks", href: "/docs/webhooks" },
      { label: "Custom Commands", href: "/docs/commands" },
    ]
  },
  {
    title: "Resources",
    items: [
      { label: "FAQ", href: "/docs/faq" },
      { label: "Best Practices", href: "/docs/best-practices" },
      { label: "Community Guides", href: "/docs/community" },
    ]
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("Introduction");

  return (
    <div className="flex min-h-screen bg-black pt-20">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-white/5 hidden lg:block overflow-y-auto h-[calc(100vh-80px)] sticky top-20 bg-black/50 backdrop-blur-md">
        <div className="p-6 space-y-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={14} />
            <input 
              type="text" 
              placeholder="Search docs..." 
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-white/5 border border-white/5 text-xs text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all"
            />
          </div>

          <nav className="space-y-6">
            {DOCS_NAV.map((section) => (
              <div key={section.title} className="space-y-2">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 px-3">{section.title}</h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item.label}
                      onClick={() => setActiveTab(item.label)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        activeTab === item.label 
                          ? "bg-primary/10 text-primary border-l-2 border-primary" 
                          : "text-gray-500 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 md:p-12 lg:p-20 overflow-hidden">
        <div className="max-w-4xl">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-4">
              <Book size={14} /> Documentation <ChevronRight size={14} /> {activeTab}
            </div>
            
            <h1 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-8 leading-tight">
              {activeTab === "Introduction" ? "The New Argon Documentation" : activeTab}
            </h1>

            <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-primary max-w-none space-y-8">
              <section className="space-y-4">
                <p className="text-xl leading-relaxed font-medium">
                  Welcome to the official documentation for Argon. Learn how to integrate the next generation of esports management into your Discord community.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mt-8">
                  <DocsCard 
                    icon={<Terminal size={24} />} 
                    title="Quick Setup" 
                    desc="Get your bot up and running in less than 5 minutes." 
                    href="/docs/setup"
                  />
                  <DocsCard 
                    icon={<Code size={24} />} 
                    title="API Guides" 
                    desc="Detailed documentation for integrating our API." 
                    href="/docs/api"
                  />
                </div>
              </section>

              <div className="h-px bg-white/5 my-12" />

              <section className="space-y-6">
                <h3 className="text-2xl font-bold italic uppercase tracking-tight">Core Concept</h3>
                <p className="text-gray-400 leading-relaxed font-medium">
                   Argon is built on the principle of extreme automation. We handle the repetitive tasks—bracket updates, point calculations, role management—so you can focus on building your community.
                </p>
                <div className="glass p-6 rounded-2xl border border-white/5 bg-white/[0.02]">
                  <div className="flex items-center gap-2 text-amber-500 font-bold text-sm uppercase mb-4 tracking-widest">
                     <HelpCircle size={16} /> Key Feature
                  </div>
                  <pre className="bg-black/40 p-4 rounded-xl text-xs text-primary-light font-mono border border-white/5 overflow-x-auto">
                    {`// Example API Request\nconst status = await argon.tournaments.getStatus("TX-991");\nconsole.log(status.active); // returns true`}
                  </pre>
                </div>
              </section>
            </div>

            <div className="mt-20 pt-10 border-t border-white/5 flex justify-between items-center text-sm font-medium">
               <span className="text-gray-500 italic">Last updated: {new Date().toLocaleDateString()}</span>
               <Link href="/support" className="text-primary hover:underline flex items-center gap-2">
                  Need help? Contact support <MessageSquare size={16} />
               </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function DocsCard({ icon, title, desc, href }: { icon: React.ReactNode; title: string; desc: string; href: string }) {
  return (
    <Link href={href} className="flex flex-col p-6 rounded-2xl glass border border-white/5 hover:border-primary/20 transition-all group">
      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary transition-colors mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-bold text-white mb-1">{title}</h3>
      <p className="text-xs text-gray-500 leading-relaxed font-medium">{desc}</p>
    </Link>
  );
}
