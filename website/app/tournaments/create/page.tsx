"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Server, Gamepad2, Settings, Trophy, AlertTriangle, ShieldCheck, ChevronRight, Hash } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface Guild {
    id: string;
    name: string;
    icon: string | null;
    has_bot: boolean;
}

export default function CreateTournament() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [guilds, setGuilds] = useState<Guild[]>([]);
  const [fetchingGuilds, setFetchingGuilds] = useState(true);
  const [guildError, setGuildError] = useState<string | null>(null);

  const [step, setStep] = useState(1);

  const [formData, setFormData] = useState({
    name: "",
    game: "Free Fire Max",
    format: "Single Elim",
    teamSize: "Squad",
    maxTeams: 64,
    prize: "",
    rules: "",
    guildId: "",
    teamsPerGroup: 12,
    pingRoleId: "",
  });

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
          if (isMounted) {
            const validGuilds = data.filter((g: Guild) => g.has_bot);
            setGuilds(validGuilds);
            if (validGuilds.length > 0) {
              setFormData(prev => ({ ...prev, guildId: validGuilds[0].id }));
            }
          }
        } else if (response.status === 429 && retries > 0) {
          const body = await response.json().catch(() => ({}));
          const delay = (body.details?.retry_after || 1) * 1000 + 500;
          await new Promise(r => setTimeout(r, delay));
          return fetchServers(retries - 1);
        } else {
          if (isMounted) setGuildError("Failed to fetch your Discord Servers.");
        }
      } catch (err) {
        if (isMounted) setGuildError("Network error while talking to Discord.");
      } finally {
        if (isMounted) setFetchingGuilds(false);
      }
    };
    fetchServers();
    return () => { isMounted = false; };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNextStep = () => {
    if (step === 1 && !formData.guildId) {
      alert("Please select a Discord server to automate.");
      return;
    }
    if (step === 2 && !formData.name) {
      alert("Please provide a tournament name.");
      return;
    }
    setStep((s) => Math.min(s + 1, 3));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.guildId) return;

    setLoading(true);
    try {
      const res = await fetch("/api/tournaments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/dashboard");
      } else {
        const data = await res.json();
        alert(data.error || "Failed to create tournament");
      }
    } catch (err) {
      alert("An error occurred connecting to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07090E] text-white selection:bg-purple-500/30 flex justify-center py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-pink-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto relative z-10 flex flex-col pt-10">
        
        {/* Header Section */}
        <div className="text-center mb-10">
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tight uppercase italic drop-shadow-lg flex items-center justify-center gap-3">
            <Trophy className="text-primary w-10 h-10" />
            Host <span className="text-primary drop-shadow-[0_0_15px_rgba(236,72,153,0.3)]">Tournament</span>
          </h2>
          <p className="mt-4 text-base text-gray-400 max-w-xl mx-auto">
            Our autonomous Esports OS takes over from here. Select your community, define the rules, and let Ravonixx handle the brackets, grouping, and score calculations.
          </p>
        </div>

        {/* Steps Tracker */}
        <div className="flex justify-center mb-10">
            <div className="flex items-center gap-2">
                {[1, 2, 3].map((s) => (
                    <div key={s} className="flex items-center gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 transition-all ${step === s ? 'bg-primary border-primary text-black shadow-[0_0_20px_var(--color-primary-glow)]' : step > s ? 'bg-white/10 border-white/20 text-white' : 'border-white/10 text-gray-500'}`}>
                            {step > s ? <ShieldCheck size={18} /> : s}
                        </div>
                        {s < 3 && <div className={`w-12 h-1 rounded-full ${step > s ? 'bg-primary' : 'bg-white/10'}`}></div>}
                    </div>
                ))}
            </div>
        </div>

        <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNextStep(); }} className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden min-h-[500px] flex flex-col">
            
            {/* Navigation Strip */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-white/5">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${(step / 3) * 100}%` }}></div>
            </div>

            <div className="flex-1 p-8 lg:p-12 relative overflow-y-auto">
                <AnimatePresence mode="wait">
                    
                    {/* STEP 1: Discord Setup */}
                    {step === 1 && (
                        <motion.div 
                            key="step1"
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="space-y-8 h-full"
                        >
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2 mb-2"><Server className="text-primary" /> Target Community</h3>
                                <p className="text-gray-400 text-sm">Select the Discord Server where Ravonixx will build the automated category and registration channels.</p>
                            </div>

                            <div className="space-y-6 flex-1">
                                {fetchingGuilds ? (
                                    <div className="flex flex-col items-center justify-center py-12 bg-black/40 rounded-2xl border border-white/5">
                                        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
                                        <p className="text-gray-400 text-sm animate-pulse">Scanning your connected servers...</p>
                                    </div>
                                ) : guildError ? (
                                    <div className="flex flex-col items-center justify-center py-12 bg-red-500/10 rounded-2xl border border-red-500/20">
                                        <AlertTriangle className="w-8 h-8 text-red-500 mb-4" />
                                        <p className="text-red-400 text-sm">{guildError}</p>
                                    </div>
                                ) : guilds.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-12 bg-black/40 rounded-2xl border border-white/5">
                                        <Server className="w-12 h-12 text-gray-500 mb-4" />
                                        <p className="text-gray-400 font-medium mb-4">No compatible servers found.</p>
                                        <a href={`https://discord.com/oauth2/authorize?client_id=${process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || "1470031097357140063"}&permissions=8&scope=bot+applications.commands`} target="_blank" rel="noopener noreferrer" className="px-6 py-2 bg-primary hover:bg-primary/80 text-black font-bold rounded-xl transition-all">
                                            Invite Argon Bot to a Server
                                        </a>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {guilds.map(g => (
                                            <div 
                                                key={g.id} 
                                                onClick={() => setFormData({ ...formData, guildId: g.id })}
                                                className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${
                                                    formData.guildId === g.id 
                                                    ? 'bg-primary/20 border-primary shadow-[0_0_20px_rgba(236,72,153,0.3)]' 
                                                    : 'bg-[#0E131F] border-white/10 hover:border-primary/50 text-gray-400'
                                                }`}
                                            >
                                                {g.icon ? (
                                                    <img src={`https://cdn.discordapp.com/icons/${g.id}/${g.icon}.png`} className="w-12 h-12 rounded-full border border-white/20" alt="" />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold border border-primary/30">{g.name.charAt(0)}</div>
                                                )}
                                                <div className="flex-1 min-w-0">
                                                    <p className={`font-bold truncate ${formData.guildId === g.id ? 'text-white' : 'text-gray-300'}`}>{g.name}</p>
                                                    <p className="text-xs truncate flex items-center gap-1 mt-1"><Hash size={12}/> {g.id}</p>
                                                </div>
                                                {formData.guildId === g.id && <ShieldCheck className="text-primary w-5 h-5" />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                
                                <div className="p-5 bg-white/5 border border-white/10 rounded-2xl mt-8">
                                    <label htmlFor="pingRoleId" className="block text-sm font-bold text-white mb-1 flex items-center gap-2">
                                        Announcement Role (Optional)
                                    </label>
                                    <p className="text-xs text-gray-400 mb-3">Leave blank to use @everyone/@here. Or paste a role ID to ping specifically.</p>
                                    <input
                                        id="pingRoleId"
                                        name="pingRoleId"
                                        type="text"
                                        className="block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary transition-colors text-white placeholder-gray-600"
                                        placeholder="e.g. 859292908123456789"
                                        value={formData.pingRoleId}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 2: General Info */}
                    {step === 2 && (
                        <motion.div 
                            key="step2"
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="space-y-8 h-full"
                        >
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2 mb-2"><Gamepad2 className="text-primary" /> Event Configuration</h3>
                                <p className="text-gray-400 text-sm">Define the primary structure and games taking place.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label htmlFor="name" className="block text-sm font-bold text-gray-300 mb-2">Tournament Title</label>
                                    <input
                                        id="name"
                                        name="name"
                                        type="text"
                                        required
                                        className="block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-4 text-lg focus:border-primary focus:ring-1 focus:ring-primary transition-colors shadow-inner text-white placeholder-gray-600 font-bold"
                                        placeholder="e.g. Ravonixx BGMI Showdown Season 4"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="game" className="block text-sm font-medium text-gray-300 mb-2">Game Title</label>
                                    <select id="game" name="game" className="w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary text-white" value={formData.game} onChange={handleChange}>
                                        <option value="Free Fire Max">Free Fire Max</option>
                                        <option value="BGMI">BGMI</option>
                                        <option value="Valorant">Valorant</option>
                                        <option value="Custom">Custom / Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="format" className="block text-sm font-medium text-gray-300 mb-2">Match Format</label>
                                    <select id="format" name="format" className="w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary text-white" value={formData.format} onChange={handleChange}>
                                        <option value="Single Elim">Single Elimination</option>
                                        <option value="Double Elim">Double Elimination</option>
                                        <option value="Round Robin">Round Robin</option>
                                    </select>
                                </div>
                                
                                <div className="md:col-span-2">
                                    <label htmlFor="prize" className="block text-sm font-medium text-gray-300 mb-2">Prize Pool (Optional)</label>
                                    <input
                                        id="prize"
                                        name="prize"
                                        type="text"
                                        className="block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary text-white placeholder-gray-600"
                                        placeholder="e.g. $1,500 Total"
                                        value={formData.prize}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* STEP 3: Setup Logistics */}
                    {step === 3 && (
                        <motion.div 
                            key="step3"
                            initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
                            className="space-y-8 h-full"
                        >
                            <div>
                                <h3 className="text-2xl font-bold flex items-center gap-2 mb-2"><Settings className="text-primary" /> Structure & Splitting</h3>
                                <p className="text-gray-400 text-sm">Ravonixx automates group sorting. Tell us exactly how many you are letting in.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-black/40 p-6 rounded-2xl border border-white/5">
                                <div>
                                    <label htmlFor="teamSize" className="block text-sm font-medium text-gray-300 mb-2">Team Size</label>
                                    <select id="teamSize" name="teamSize" className="w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary text-white" value={formData.teamSize} onChange={handleChange}>
                                        <option value="Solo">Solo (1v1)</option>
                                        <option value="Duo">Duo (2v2)</option>
                                        <option value="Squad">Squad (4v4+)</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="maxTeams" className="block text-sm font-bold text-white mb-1 mt-1 md:mt-0">Overall Capacity</label>
                                    <input
                                        id="maxTeams" name="maxTeams" type="number" min="2" required
                                        className="block w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary text-white font-bold"
                                        value={formData.maxTeams} onChange={handleChange}
                                    />
                                </div>

                                <div className="md:col-span-2 mt-4 pt-6 border-t border-white/5">
                                    <label htmlFor="teamsPerGroup" className="block text-sm font-bold text-primary mb-2">Teams Per Group / Lobby Size</label>
                                    <p className="text-xs text-gray-400 mb-4">This determines how many bot channels are actively generated inside the category. (e.g., Free Fire uses 12 per lobby)</p>
                                    <input
                                        id="teamsPerGroup" name="teamsPerGroup" type="number" min="2" required
                                        className="block w-full bg-[#0E131F]/80 border-2 border-primary/30 rounded-xl px-4 py-4 text-base focus:border-primary text-white font-bold"
                                        value={formData.teamsPerGroup} onChange={handleChange}
                                    />
                                </div>
                            </div>
                            
                            <div className="mt-6">
                                <label htmlFor="rules" className="block text-sm font-medium text-gray-300 mb-2">Tournament Rules & Guidelines</label>
                                <textarea
                                    id="rules" name="rules" rows={3}
                                    className="w-full bg-[#0E131F] border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-primary text-white placeholder-gray-600 resize-none font-mono"
                                    placeholder="Add any specific guidelines to appear on the registration page..."
                                    value={formData.rules} onChange={handleChange}
                                />
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </div>

            {/* Bottom Actions */}
            <div className="p-6 lg:px-12 bg-black/40 border-t border-white/10 flex items-center justify-between">
                <div>
                    {step > 1 && (
                        <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-3 text-gray-400 hover:text-white font-medium transition-colors">
                            Back
                        </button>
                    )}
                </div>
                <div>
                    {step < 3 ? (
                        <button type="button" onClick={handleNextStep} className="flex items-center gap-2 px-8 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all hover:scale-105 active:scale-95 border border-white/10 hover:border-white/30">
                            Continue <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button type="submit" disabled={loading || !formData.guildId} className="group relative flex items-center gap-2 py-3 px-8 text-sm font-extrabold rounded-xl text-black bg-gradient-to-r from-primary to-secondary hover:from-white hover:to-white overflow-hidden transition-all shadow-[0_0_20px_rgba(236,72,153,0.4)] disabled:opacity-50 hover:scale-105 active:scale-95">
                            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-white rounded-full group-hover:w-full group-hover:h-56 opacity-10 blur-xl"></span>
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Deploy System"}
                        </button>
                    )}
                </div>
            </div>

        </form>
      </div>
    </div>
  );
}
