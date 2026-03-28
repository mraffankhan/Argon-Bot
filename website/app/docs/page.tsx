"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ChevronRight, Search, Book, Terminal, 
  Code, HelpCircle, Menu, X, Rocket, Shield, MessageSquare
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DOCS_NAV = [
  {
    title: "Ecosystem Hub",
    items: ["Introduction", "Architecture", "API Reference"]
  },
  {
    title: "Services",
    items: ["Automation", "Staff Management", "Tournaments", "LAN Events", "Discord Integrations"]
  },
  {
    title: "Resources",
    items: ["FAQ", "Best Practices", "Community Guides"]
  }
];

export default function DocsPage() {
  const [activeTab, setActiveTab] = useState("Introduction");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu when tab changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [activeTab]);

  return (
    <div className="flex min-h-screen bg-black pt-20 relative">
      
      {/* Mobile Header for Docs */}
      <div className="lg:hidden fixed top-20 left-0 right-0 h-16 bg-black/80 backdrop-blur-xl border-b border-white/10 z-30 flex items-center justify-between px-6">
        <div className="flex items-center gap-2 font-bold text-white">
          <Book size={18} className="text-primary" /> Documentation
        </div>
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white focus:outline-none"
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        fixed inset-0 top-[144px] lg:top-20 z-20 w-full lg:w-72 border-r border-white/5 bg-black/95 lg:bg-black/50 backdrop-blur-xl lg:static lg:block
        transition-transform duration-300 ease-in-out lg:translate-x-0 overflow-y-auto
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-6 space-y-8 min-h-[calc(100vh-80px)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
              type="text" 
              placeholder="Search docs..." 
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-primary/50 transition-all focus:ring-1 focus:ring-primary/50"
            />
          </div>

          <nav className="space-y-8">
            {DOCS_NAV.map((section) => (
              <div key={section.title} className="space-y-3">
                <h4 className="text-[11px] font-black uppercase tracking-[0.25em] text-gray-500 px-3">{section.title}</h4>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <button
                      key={item}
                      onClick={() => setActiveTab(item)}
                      className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                        activeTab === item 
                          ? "bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.1)]" 
                          : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                      }`}
                    >
                      {item}
                      {activeTab === item && <ChevronRight size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow p-6 pt-24 lg:pt-12 md:p-12 lg:p-20 overflow-hidden relative min-h-screen border-l border-white/5 shadow-[-20px_0_30px_rgba(0,0,0,0.5)]">
        {/* Background Accent */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="max-w-4xl relative z-10">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 text-xs font-bold text-gray-500 uppercase tracking-widest mb-6">
              <Book size={14} className="text-primary/70" /> Documentation <ChevronRight size={14} /> <span className="text-white">{activeTab}</span>
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-white italic uppercase tracking-tighter mb-10 leading-tight drop-shadow-lg">
              {activeTab}
            </h1>

            <div className="prose prose-invert prose-p:text-gray-400 prose-headings:text-white prose-a:text-primary max-w-none">
              <TabContent tab={activeTab} setActiveTab={setActiveTab} />
            </div>

            <div className="mt-24 pt-10 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center text-sm font-medium gap-6">
               <span className="text-gray-500 italic">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
               <Link href="/support" className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                  Need help? Contact Support <MessageSquare size={16} />
               </Link>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

// Content Router
function TabContent({ tab, setActiveTab }: { tab: string, setActiveTab: (tab: string) => void }) {
    switch (tab) {
        case "Introduction":
            return (
                <div className="space-y-10">
                    <p className="text-xl md:text-2xl leading-relaxed text-gray-300 font-medium">
                        Welcome to the official documentation for the <strong className="text-white">Ravonixx Ecosystem</strong>. Learn how to integrate the next generation of complete esports infrastructure into your operations.
                    </p>
                    <div className="grid md:grid-cols-2 gap-6 mt-12">
                        <DocsCard 
                            icon={<Terminal size={24} />} 
                            title="Architecture Overview" 
                            desc="Understand how the 5 pillars of Ravonixx connect." 
                            onClick={() => setActiveTab("Architecture")}
                        />
                        <DocsCard 
                            icon={<Code size={24} />} 
                            title="API Guides" 
                            desc="Detailed documentation for integrating our API into your custom dashboards." 
                            onClick={() => setActiveTab("API Reference")}
                        />
                    </div>
                    <div className="h-px bg-white/5 my-12" />
                    <h3 className="text-3xl font-bold tracking-tight text-white mb-6">Core Concept</h3>
                    <p className="text-lg text-gray-400 leading-relaxed max-w-3xl">
                       Ravonixx is not just a bot; it is a unified ecosystem. We provide the interconnected infrastructure needed to automate workflows, manage LAN venues, oversee staff, and execute massive tournaments from a single automated architecture.
                    </p>
                    <div className="glass p-8 rounded-3xl border border-primary/20 bg-primary/[0.02] shadow-xl mt-8 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl" />
                        <div className="flex items-center gap-2 text-primary font-black text-xs uppercase mb-6 tracking-widest relative z-10">
                            <HelpCircle size={16} /> Fast Integration
                        </div>
                        <pre className="bg-black/60 p-6 rounded-2xl text-sm text-primary-light font-mono border border-white/10 overflow-x-auto shadow-inner relative z-10">
                            <code className="text-green-400">const</code> <code className="text-blue-400">status</code> <code className="text-white">=</code> <code className="text-purple-400">await</code> <code className="text-yellow-200">ravonixx.tournaments.getStatus</code><code className="text-white">(</code><code className="text-orange-300">"TX-991"</code><code className="text-white">);</code>{'\n'}
                            <code className="text-gray-500">// Returns the current live status of your tournament</code>
                        </pre>
                    </div>
                </div>
            );
        case "Architecture":
            return (
                <div className="space-y-8">
                    <p className="text-xl text-gray-300 leading-relaxed font-medium mb-10">
                        The Ravonixx Ecosystem relies on a connected loop of edge compute, persistent storage, and real-time WebSockets to sync data across Discord, Web, and live LAN environments.
                    </p>
                    <div className="glass p-8 rounded-3xl border border-white/10 bg-black/50">
                        <h4 className="font-bold text-white text-xl mb-4">REST API & WebSockets</h4>
                        <p className="text-gray-400">Our universal endpoint allows any consumer (a Discord server, an OBS stream, a private web dashboard) to query or subscribe to live tournament states simultaneously.</p>
                    </div>
                </div>
            );
        case "Tournaments":
            return (
                <div className="space-y-10">
                    <p className="text-xl text-gray-300 leading-relaxed font-medium mb-8">
                        The Ravonixx Tournament Engine automates the entire lifecycle. From registration to bracket generation, everything is handled seamlessly.
                    </p>
                    
                    <div className="grid md:grid-cols-3 gap-6 mb-12">
                        <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-primary/20 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">1</div>
                            <h4 className="font-bold text-white text-xl mb-3">Create</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Admins initialize the event via API or Discord.</p>
                        </div>
                        <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-primary/20 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">2</div>
                            <h4 className="font-bold text-white text-xl mb-3">Register</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Players connect their accounts uniquely to the database.</p>
                        </div>
                        <div className="p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/[0.03] to-transparent hover:border-primary/20 transition-colors">
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold mb-4">3</div>
                            <h4 className="font-bold text-white text-xl mb-3">Execute</h4>
                            <p className="text-sm text-gray-400 leading-relaxed">Brackets build instantly and live URLs are generated.</p>
                        </div>
                    </div>
                </div>
            );
        case "Discord Integrations":
            return (
                <div className="space-y-8">
                    <p className="text-xl text-gray-300 leading-relaxed font-medium mb-10">
                        While Ravonixx spans the entire web, Discord remains a core ingestion point. You can deploy our Argon bot to control your Discord server operations automatically.
                    </p>
                    <div className="flex gap-6">
                        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center font-black text-xl border border-amber-500/30 shadow-[0_0_15px_rgba(var(--amber-color-rgb),0.2)]">!</div>
                        <div className="space-y-4 pt-2 w-full">
                            <h3 className="text-2xl font-bold text-white">Initializing the Connection</h3>
                            <p className="text-gray-400 leading-relaxed text-lg">Grant our platform OAuth2 access to rapidly architect channel frameworks, lock permissions, and map staff Discord IDs to your internal Ravonixx hierarchy.</p>
                        </div>
                    </div>
                </div>
            );
        case "API Reference":
             return (
                <div className="space-y-8">
                    <p className="text-xl text-gray-300 leading-relaxed font-medium">
                        Build powerful custom frontends or integrations using the Ravonixx REST API. 
                    </p>
                    <div className="glass p-6 rounded-2xl border border-white/10 bg-[#0a0a0a]">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 font-bold text-xs rounded uppercase tracking-wider">GET</span>
                            <code className="text-white text-sm font-mono">/api/v1/tournaments/:id</code>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Fetches the public details of a specific tournament, including registered teams and bracket status.</p>
                        <pre className="text-xs text-blue-300 font-mono overflow-x-auto">
{`{
  "id": "TX-991",
  "name": "Summer Championship",
  "game": "Valorant",
  "status": "in_progress",
  "teams_registered": 64,
  "max_teams": 64
}`}
                        </pre>
                    </div>
                    
                    <div className="glass p-6 rounded-2xl border border-white/10 bg-[#0a0a0a]">
                        <div className="flex items-center gap-4 border-b border-white/10 pb-4 mb-4">
                            <span className="px-3 py-1 bg-blue-500/10 text-blue-400 font-bold text-xs rounded uppercase tracking-wider">POST</span>
                            <code className="text-white text-sm font-mono">/api/v1/tournaments/:id/register</code>
                        </div>
                        <p className="text-gray-400 text-sm mb-4">Register a user or team into an upcoming tournament via external authorization.</p>
                        <div className="text-xs text-gray-500 italic">Requires Authorization API Key header.</div>
                    </div>
                </div>
             );
        default:
            return (
                <div className="space-y-6">
                    <p className="text-gray-400 leading-relaxed text-lg">
                        Detailed documentation for <strong className="text-white">{tab}</strong> is currently being drafted by our engineering team to ensure high quality and accuracy. Check back soon for comprehensive guides.
                    </p>
                    <div className="glass p-16 rounded-3xl border border-dashed border-white/20 flex flex-col items-center justify-center text-center mt-8 bg-white/[0.01]">
                        <Book size={48} className="mb-6 opacity-30 text-primary" />
                        <h3 className="text-2xl font-bold text-white mb-2">Coming Soon</h3>
                        <p className="text-gray-500 text-sm max-w-sm">We are working hard to complete this section. You can join our Discord for immediate questions.</p>
                    </div>
                </div>
            );
    }
}

function DocsCard({ icon, title, desc, onClick }: { icon: React.ReactNode; title: string; desc: string; onClick?: () => void; }) {
    return (
        <div 
            onClick={onClick}
            className="flex flex-col p-8 rounded-3xl glass border border-white/5 hover:border-primary/30 transition-all duration-300 group bg-gradient-to-b from-white/[0.03] to-transparent cursor-pointer hover:shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.1)] relative overflow-hidden"
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] group-hover:bg-primary/10 transition-colors" />
            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-6 ring-1 ring-white/10 group-hover:scale-110 group-hover:bg-primary/10 transition-transform relative z-10 shadow-lg">
                {icon}
            </div>
            <h3 className="text-2xl font-bold text-white mb-3 relative z-10 tracking-tight">{title}</h3>
            <p className="text-sm font-medium text-gray-400 leading-relaxed relative z-10">{desc}</p>
        </div>
    );
}
