"use client";

import { Activity, CheckCircle, Server, Database, Globe, Hexagon } from "lucide-react";
import { motion } from "framer-motion";

const STATUS_ITEMS = [
    { name: "Bot Engine", status: "Operational", icon: <Hexagon size={20} className="text-gray-400" /> },
    { name: "Dashboard API", status: "Operational", icon: <Activity size={20} className="text-gray-400" /> },
    { name: "Website Frontend", status: "Operational", icon: <Globe size={20} className="text-gray-400" /> },
    { name: "Database Cluster", status: "Operational", icon: <Database size={20} className="text-gray-400" /> },
    { name: "Matchmaking Service", status: "Operational", icon: <Server size={20} className="text-gray-400" /> },
];

export default function StatusPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-20 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute top-[-10%] left-[-5%] w-[800px] h-[800px] bg-green-500/10 blur-[150px] rounded-full pointer-events-none" />
            
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <div className="text-center mb-16">
                    <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-500/30 bg-green-500/10 text-green-400 text-sm font-bold tracking-wide uppercase mb-8"
                    >
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                        </span>
                        All Systems Operational
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-6 leading-tight drop-shadow-lg"
                    >
                        System <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-green-600">Status</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto"
                    >
                        Real-time overview of the Ravonixx platform, API, and core infrastructure.
                    </motion.p>
                </div>

                <div className="space-y-4 mb-20">
                    {STATUS_ITEMS.map((item, i) => (
                        <motion.div
                            key={item.name}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + (i * 0.1) }}
                            className="glass p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between border border-white/5 hover:border-white/10 transition-colors bg-gradient-to-r from-white/[0.02] to-transparent gap-4"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                                    {item.icon}
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold text-white tracking-tight">{item.name}</h3>
                                    <p className="text-sm text-gray-500">Uptime: 99.99%</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2 text-green-400 font-bold bg-green-500/10 px-4 py-2 rounded-lg border border-green-500/20">
                                <CheckCircle size={18} />
                                {item.status}
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                    className="glass p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full" />
                    <h3 className="text-2xl font-bold text-white mb-6 relative z-10">Past Incidents</h3>
                    
                    <div className="space-y-8 relative z-10">
                        <div className="border-l-2 border-green-500/30 pl-6 pb-2 relative">
                            <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-[7px] top-1.5 ring-4 ring-black" />
                            <h4 className="text-white font-bold text-lg">No incidents reported</h4>
                            <p className="text-gray-400 text-sm mt-1">Today</p>
                            <p className="text-gray-500 text-sm mt-3">All systems have been fully operational without any interruptions.</p>
                        </div>
                        <div className="border-l-2 border-yellow-500/30 pl-6 pb-2 relative">
                            <div className="absolute w-3 h-3 bg-yellow-500 rounded-full -left-[7px] top-1.5 ring-4 ring-black" />
                            <h4 className="text-white font-bold text-lg">Scheduled Maintenance</h4>
                            <p className="text-gray-400 text-sm mt-1">Mar 12, 2026</p>
                            <p className="text-gray-500 text-sm mt-3">Routine database updates and security patches were carried out successfully over a 15-minute window.</p>
                        </div>
                        <div className="border-l-2 border-white/10 pl-6 pb-2 relative">
                            <div className="absolute w-3 h-3 bg-gray-500 rounded-full -left-[7px] top-1.5 ring-4 ring-black" />
                            <h4 className="text-white font-bold text-lg">No incidents reported</h4>
                            <p className="text-gray-400 text-sm mt-1">Mar 1...11, 2026</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
