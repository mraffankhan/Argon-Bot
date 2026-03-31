"use client";

import { useEffect, useState } from "react";
import { Server, Shield, Crown, ShieldCheck, Users, PlusCircle, Settings2, Loader2, Info, X, Hash } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Guild {
    id: string;
    name: string;
    icon: string | null;
    role: string;
    has_bot: boolean;
    is_premium: boolean;
    prefix: string;
    member_count: number;
}

export default function ConnectedServers() {
    const [guilds, setGuilds] = useState<Guild[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        const fetchServers = async (retries = 2): Promise<void> => {
            try {
                const response = await fetch("/api/discord/guilds", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({}),
                });

                if (response.ok) {
                    const data = await response.json();
                    if (isMounted) setGuilds(data.filter((g: Guild) => g.has_bot));
                } else if (response.status === 401) {
                    if (isMounted) setError("Your Discord session has expired. Please go to your Profile, Sign Out, and log back in.");
                } else if (response.status === 429 && retries > 0) {
                    const body = await response.json().catch(() => ({}));
                    const delay = (body.details?.retry_after || 1) * 1000 + 500;
                    await new Promise(r => setTimeout(r, delay));
                    return fetchServers(retries - 1);
                } else {
                    if (isMounted) setError("Failed to fetch connected servers.");
                }
            } catch (err) {
                if (isMounted) setError("Network error. Please try again.");
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchServers();
        return () => { isMounted = false; };
    }, []);

    if (loading) {
        return (
            <div className="glass border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-12 flex flex-col items-center justify-center min-h-[300px]">
                <Loader2 size={40} className="text-secondary animate-spin mb-4" />
                <p className="text-gray-400 font-medium animate-pulse">Scanning Discord Integration...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="glass border border-red-500/20 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-12 flex flex-col items-center justify-center min-h-[300px]">
                <Shield size={40} className="text-red-400 mb-4" />
                <p className="text-red-400 font-medium">{error}</p>
            </div>
        );
    }

    return (
        <div className="glass border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-12">
            <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 blur-[100px] pointer-events-none" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 relative z-10 gap-4">
                <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Server className="w-6 h-6 text-secondary" /> Connected Communities
                </h2>
                <a
                    href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1470031097357140063"}&permissions=8&scope=bot+applications.commands`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-5 py-2.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-all border border-white/10 text-sm whitespace-nowrap"
                >
                    <PlusCircle size={16} /> Invite Bot
                </a>
            </div>

            {guilds.length === 0 ? (
                <div className="text-center py-12 bg-black/40 rounded-2xl border border-white/5 relative z-10">
                    <Server className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">No Active Communities</h3>
                    <p className="text-gray-400 mb-6 font-medium text-sm">Add the Argon bot to a server where you have admin permissions.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
                    {guilds.map((guild, index) => (
                        <motion.div
                            key={guild.id}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-black/60 border border-white/10 rounded-2xl p-6 hover:border-secondary/40 hover:bg-surface transition-all group relative overflow-hidden shadow-xl"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                            
                            {guild.is_premium && (
                                <div className="absolute top-0 right-0 bg-yellow-500/20 text-yellow-500 text-[10px] uppercase font-bold px-2 py-0.5 rounded-bl-lg border-l border-b border-yellow-500/30 flex items-center gap-1">
                                    <Crown size={10} /> Premium
                                </div>
                            )}

                            <div className="flex items-center gap-4 mb-5">
                                {guild.icon ? (
                                    <img
                                        src={`https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.png`}
                                        alt={guild.name}
                                        className="w-14 h-14 rounded-full border-2 border-white/10 group-hover:border-secondary/50 transition-colors"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center text-lg font-bold text-secondary border-2 border-secondary/30">
                                        {guild.name.charAt(0)}
                                    </div>
                                )}
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-lg font-bold text-white truncate" title={guild.name}>
                                        {guild.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mt-1">
                                        <span className={`text-[10px] px-2 py-0.5 rounded-full border flex items-center gap-1 ${guild.role === 'Owner'
                                            ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                                            : 'text-secondary bg-secondary/10 border-secondary/20'
                                            }`}>
                                            {guild.role === 'Owner' ? <Crown size={10} /> : <ShieldCheck size={10} />}
                                            {guild.role}
                                        </span>
                                        <span className="text-[10px] text-gray-300 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 flex items-center gap-1">
                                            <Users size={10} /> {guild.member_count.toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <Link
                                    href={`/tournaments/create`}
                                    className="flex-1 flex bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 text-secondary font-bold py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all items-center justify-center gap-2"
                                >
                                    <PlusCircle size={14} /> Host Event
                                </Link>
                                <button className="flex-none flex bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-bold py-2.5 px-3 rounded-xl transition-all items-center justify-center border border-white/10">
                                    <Settings2 size={16} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
