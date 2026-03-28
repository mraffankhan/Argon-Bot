"use client";

import { LifeBuoy, Book, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
    {
        question: "How do I invite the bot to my server?",
        answer: "You can invite Ravonixx by clicking the 'Add Bot' button on the homepage or dashboard. Ensure you have 'Manage Server' permissions to authorize the bot and allow the necessary intents."
    },
    {
        question: "How do I change the bot's prefix?",
        answer: "Ravonixx heavily relies on modern Discord Slash Commands (/). There is no prefix to configure—just type '/' and select the command from the list, or rely on our beautifully designed auto-complete features."
    },
    {
        question: "Is there a premium plan?",
        answer: "Currently, all features of the bot and website are entirely free. Enjoy unlimited functionality while we are in this phase. We may introduce premium features in the future, but core functions will stay free."
    },
    {
        question: "How do I setup a tournament?",
        answer: "Use the /tournament command in your server to start the interactive setup process. You can configure brackets, team limits, and automated match channels entirely within Discord."
    }
];

export default function SupportPage() {
    const [openFaq, setOpenFaq] = useState<number | null>(0);

    return (
        <div className="min-h-screen bg-black pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-1/4 left-0 w-full h-[500px] bg-primary/5 blur-[150px] -z-10 rounded-full pointer-events-none" />
            
            <div className="max-w-5xl mx-auto">
                <div className="text-center space-y-6 mb-20 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-white/5 bg-white/5 text-sm font-medium text-primary shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.2)]"
                    >
                        <LifeBuoy size={16} /> 24/7 Assistance
                    </motion.div>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter leading-tight drop-shadow-xl"
                    >
                        HOW CAN WE <span className="text-primary glow-text">HELP?</span>
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto"
                    >
                        Whether you are experiencing an issue, have a question, or want to report a bug, our support team is ready to assist you.
                    </motion.p>
                </div>

                <div className="grid md:grid-cols-2 gap-8 mb-24 relative z-10">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="glass p-10 flex flex-col items-center text-center rounded-[32px] border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] group bg-gradient-to-b from-white/[0.02] to-transparent"
                    >
                        <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 ring-1 ring-white/10">
                            <Book size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Documentation</h3>
                        <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                            Learn everything about Ravonixx. Read our comprehensive guides on setting up tournaments, scrims, and more.
                        </p>
                        <Link href="/docs" className="mt-auto px-8 py-3.5 bg-white/10 hover:bg-white text-white hover:text-black font-bold rounded-xl transition-all duration-300 w-full hover:shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                            Read the Docs
                        </Link>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 }}
                        className="glass p-10 flex flex-col items-center text-center rounded-[32px] border border-primary/30 bg-primary/[0.03] hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_40px_rgba(var(--primary-color-rgb),0.15)] group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-black mb-6 group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(var(--primary-color-rgb),0.4)]">
                            <MessageSquare size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">Live Support</h3>
                        <p className="text-gray-400 mb-8 max-w-sm leading-relaxed relative z-10">
                            Can't find what you're looking for? Join our Discord server and open a ticket to speak with a staff member.
                        </p>
                        <a href="https://discord.gg/XQkjvCfTv2" target="_blank" rel="noopener noreferrer" className="relative z-10 mt-auto px-8 py-3.5 bg-primary hover:bg-white text-black font-bold rounded-xl transition-all duration-300 w-full shadow-[0_0_15px_rgba(var(--primary-color-rgb),0.3)] hover:shadow-white/50">
                            Open a Ticket
                        </a>
                    </motion.div>
                </div>

                <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-3xl font-black text-white mb-10 text-center uppercase tracking-tight italic"
                    >
                        Frequently Asked <span className="text-primary">Questions</span>
                    </motion.h2>
                    
                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                key={index} 
                                className={`glass border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === index ? 'border-primary/40 bg-white/[0.03]' : 'border-white/5 hover:border-white/20'}`}
                            >
                                <button 
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                                >
                                    <h4 className={`text-lg font-bold transition-colors ${openFaq === index ? 'text-white' : 'text-gray-300'}`}>
                                        {faq.question}
                                    </h4>
                                    <div className={`flex-shrink-0 ml-4 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === index ? 'bg-primary/20 text-primary' : 'bg-white/5 text-gray-500'}`}>
                                        <ChevronDown size={20} className={`transition-transform duration-300 ${openFaq === index ? 'rotate-180' : 'rotate-0'}`} />
                                    </div>
                                </button>
                                <AnimatePresence>
                                    {openFaq === index && (
                                        <motion.div 
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: "auto", opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3, ease: "easeInOut" }}
                                            className="overflow-hidden"
                                        >
                                            <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-5 ml-2 border-l-2 border-l-primary/50 relative pl-4">
                                                {faq.answer}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
