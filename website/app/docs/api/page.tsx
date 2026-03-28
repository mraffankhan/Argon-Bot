"use client";

import Link from "next/link";
import { Terminal, Code, ChevronRight, Copy, Check } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function ApiPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="min-h-screen bg-black pt-24 pb-20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/10 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-5xl mx-auto px-6 relative z-10">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-sm mb-6">
                    <Terminal size={18} /> Developers
                </div>
                
                <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-8 leading-tight drop-shadow-xl">
                    API Reference
                </h1>
                
                <p className="text-xl text-gray-400 mb-16 max-w-2xl leading-relaxed">
                    Integrate Ravonixx into your own applications, custom dashboards, and communities. Our fast and secure REST API provides real-time access to your tournaments and data.
                </p>

                <div className="space-y-12">
                    {/* Endpoint 1 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-primary/30 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/5 blur-3xl group-hover:bg-green-500/10 transition-colors pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Get Tournament Status</h2>
                                <p className="text-gray-400">Fetches the public details of a specific tournament, including registered teams and bracket status.</p>
                            </div>
                            <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl px-4 py-3 w-full md:w-auto overflow-x-auto">
                                <span className="px-2 py-1 bg-green-500/10 text-green-400 font-bold text-xs rounded uppercase tracking-wider shrink-0">GET</span>
                                <code className="text-white font-mono text-sm whitespace-nowrap">/api/v1/tournaments/:id</code>
                                <button 
                                    onClick={() => handleCopy("/api/v1/tournaments/:id", "get-tourney")}
                                    className="ml-auto md:ml-2 text-gray-500 hover:text-white transition-colors shrink-0"
                                >
                                    {copiedId === "get-tourney" ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8 relative z-10">
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Response Object</h3>
                                <pre className="bg-black/80 p-5 rounded-2xl text-sm font-mono border border-white/5 overflow-x-auto text-blue-300 shadow-inner">
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
                            <div>
                                <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Parameters</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 rounded-lg bg-white/5 border border-white/5">
                                        <code className="text-primary font-mono text-sm">id</code>
                                        <span className="text-xs text-gray-400">string (required)</span>
                                    </div>
                                    <p className="text-sm text-gray-500 mt-2">
                                        The unique identifier for the tournament. You can find this in your dashboard or via Discord command.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Endpoint 2 */}
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:border-blue-500/30 transition-colors"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 blur-3xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 relative z-10">
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Register Team</h2>
                                <p className="text-gray-400">Register a user or team into an upcoming tournament via external authorization.</p>
                            </div>
                            <div className="flex items-center gap-3 bg-black/50 border border-white/10 rounded-xl px-4 py-3 w-full md:w-auto overflow-x-auto">
                                <span className="px-2 py-1 bg-blue-500/10 text-blue-400 font-bold text-xs rounded uppercase tracking-wider shrink-0">POST</span>
                                <code className="text-white font-mono text-sm whitespace-nowrap">/api/v1/tournaments/:id/register</code>
                                <button 
                                    onClick={() => handleCopy("/api/v1/tournaments/:id/register", "post-tourney")}
                                    className="ml-auto md:ml-2 text-gray-500 hover:text-white transition-colors shrink-0"
                                >
                                    {copiedId === "post-tourney" ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                                </button>
                            </div>
                        </div>

                        <div className="glass p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/5 mb-8 flex items-start gap-3 relative z-10">
                            <span className="text-yellow-500">⚠️</span>
                            <div className="text-sm text-gray-300">
                                <strong className="text-white block mb-1">Authorization Required</strong>
                                This endpoint requires an active API key passed in the headers: <code className="bg-black/50 px-1.5 py-0.5 rounded text-yellow-300">Authorization: Bearer YOUR_API_KEY</code>
                            </div>
                        </div>

                        <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 relative z-10">Request Body</h3>
                        <pre className="bg-black/80 p-5 rounded-2xl text-sm font-mono border border-white/5 overflow-x-auto text-pink-300 shadow-inner w-full md:w-1/2 relative z-10">
{`{
  "team_name": "Cloud9",
  "captain_discord_id": "123456789012345678",
  "players": [
    "123456789012345678",
    "987654321098765432"
  ]
}`}
                        </pre>
                    </motion.div>
                </div>

                <div className="mt-20 pt-10 border-t border-white/10 flex flex-col items-center justify-center text-center">
                    <Code size={40} className="text-gray-600 mb-6" />
                    <h3 className="text-2xl font-bold text-white mb-4">Need more endpoints?</h3>
                    <p className="text-gray-400 max-w-md mb-8">
                        We are constantly expanding our API. In the meantime, you can reach out to our team to request custom webhooks or enterprise access.
                    </p>
                    <Link href="/support" className="px-8 py-3 rounded-full bg-white text-black font-bold hover:scale-105 transition-transform">
                        Contact Developers
                    </Link>
                </div>
            </div>
        </div>
    );
}
