"use client";

import { Crown, Sparkles, Shield, Rocket } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function PremiumPage() {
    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="max-w-4xl mx-auto text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12"
                >
                    <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-primary/30 to-primary/5 flex items-center justify-center border border-primary/20 shadow-[0_0_50px_rgba(255,255,255,0.05)] mb-8 ring-1 ring-white/10">
                        <Crown size={48} className="text-primary drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]" />
                    </div>
                    
                    <h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-6 drop-shadow-xl inline-block relative">
                        PREMIUM <span className="text-primary glow-text">ACCESS</span>
                    </h1>
                    
                    <div className="mt-8 inline-flex flex-col items-center glass px-10 py-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group max-w-2xl mx-auto backdrop-blur-xl">
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-[150%] animate-[shimmer_3s_infinite]" />
                        
                        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4 text-2xl sm:text-3xl md:text-4xl font-black text-white mb-4 tracking-tight drop-shadow-md text-center">
                            <Sparkles size={32} className="text-primary animate-pulse hidden md:block" />
                            <span>ALL FEATURES ARE FREE</span>
                            <Sparkles size={32} className="text-primary animate-pulse hidden md:block" />
                        </div>
                        <p className="text-gray-400 md:text-lg font-medium max-w-md mx-auto leading-relaxed">
                            No plans are currently ongoing. Enjoy unlimited access to every powerful feature on Ravonixx without spending a dime.
                        </p>
                    </div>
                </motion.div>

                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="grid md:grid-cols-2 gap-8 text-left mt-16 max-w-3xl mx-auto"
                >
                    <div className="glass p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-6 ring-1 ring-white/10 shadow-lg">
                            <Rocket size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Unlimited Limits</h3>
                        <p className="text-gray-400 leading-relaxed font-medium">
                            Create as many tournaments and scrims as you want. There are currently no restrictions on usage for any server large or small.
                        </p>
                    </div>
                    
                    <div className="glass p-8 rounded-3xl border border-white/5 bg-gradient-to-b from-white/[0.03] to-transparent hover:border-white/10 transition-colors">
                        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-primary mb-6 ring-1 ring-white/10 shadow-lg">
                            <Shield size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">Enterprise Grade</h3>
                        <p className="text-gray-400 leading-relaxed font-medium">
                            Get all the features normally reserved for enterprise clients, including advanced analytics and custom roles, completely free.
                        </p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-16"
                >
                    <Link href="/docs" className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-black bg-white rounded-xl hover:bg-gray-200 hover:text-black transition-all hover:scale-[1.02] active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]">
                        Explore Features
                    </Link>
                </motion.div>
            </div>
        </div>
    );
}
