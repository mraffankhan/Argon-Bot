"use client";

import { MessageSquare, Users, Trophy, ChevronRight } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function CommunityPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center space-y-16">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 max-w-3xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 bg-white/5 text-sm font-medium text-primary shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.2)]">
                        <Users size={16} /> Join the Movement
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-tight drop-shadow-xl">
                        THE RAVONIXX <span className="text-primary glow-text">COMMUNITY</span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                        Connect with thousands of gamers, tournament organizers, and developers. Build your next team, find scrims instantly, and rise to the top.
                    </p>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="grid md:grid-cols-3 gap-8 text-left"
                >
                    <div className="glass p-8 rounded-3xl border border-white/5 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.15)] transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-transform mb-6 ring-1 ring-white/10">
                            <MessageSquare size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Discord Server</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Join our official Discord server to get real-time support, discuss features, and hang out with the team.
                        </p>
                        <a href="https://discord.gg/XQkjvCfTv2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:text-white font-bold transition-colors">
                            Join Discord <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.15)] transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-transform mb-6 ring-1 ring-white/10">
                            <Trophy size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Esports Events</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Participate in official Ravonixx tournaments and community events to win exclusive prizes and roles.
                        </p>
                        <a href="https://discord.gg/XQkjvCfTv2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:text-white font-bold transition-colors">
                            Find Events in Discord <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>

                    <div className="glass p-8 rounded-3xl border border-white/5 hover:border-primary/30 hover:shadow-[0_0_30px_rgba(var(--primary-color-rgb),0.15)] transition-all duration-300 group relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-[50px] pointer-events-none group-hover:bg-primary/20 transition-all duration-500" />
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/10 transition-transform mb-6 ring-1 ring-white/10">
                            <Users size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Find a Team</h3>
                        <p className="text-gray-400 leading-relaxed mb-6">
                            Looking for players? Check out our looking-for-group (LFG) channels designed for competitive play.
                        </p>
                        <a href="https://discord.gg/XQkjvCfTv2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-primary hover:text-white font-bold transition-colors">
                            Visit LFG Channels <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                        </a>
                    </div>
                </motion.div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <a href="https://discord.gg/XQkjvCfTv2" target="_blank" rel="noopener noreferrer" className="group relative inline-flex items-center justify-center px-10 py-5 text-lg font-bold text-black bg-primary rounded-2xl hover:bg-white hover:text-black transition-all hover:scale-105 active:scale-95 shadow-[0_0_40px_rgba(var(--primary-color-rgb),0.4)] overflow-hidden">
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:animate-[shimmer_1.5s_infinite]" />
                        <MessageSquare size={24} className="mr-3" /> Connect Now
                    </a>
                </motion.div>
            </div>
        </div>
    );
}
