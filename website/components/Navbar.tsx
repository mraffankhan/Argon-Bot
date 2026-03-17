"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LogIn, Loader2, Trophy, ChevronDown } from "lucide-react";
import { User } from "@/lib/session";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                if (res.ok) {
                    const data = await res.json();
                    if (data.authenticated && data.user) {
                        setUser(data.user);
                    } else {
                        setUser(null);
                    }
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Failed to fetch user session", error);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        handleAuth();
    }, []);

    const handleLogin = () => {
        window.location.href = '/api/auth/discord';
    };

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' });
            setUser(null);
            setIsOpen(false);
        } catch (error) {
            console.error("Failed to logout", error);
        }
    };

    return (
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-black/60 backdrop-blur-xl border-b border-white/5 py-3" : "bg-transparent py-5"
            }`}
        >
            <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                <div className="flex items-center gap-10">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="relative w-9 h-9 rounded-xl overflow-hidden glass flex items-center justify-center group-hover:border-primary/50 transition-colors">
                            <img src="/R_logo.png" alt="Logo" className="w-7 h-7 object-contain" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white uppercase italic">Ravonixx</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8">
                        <NavLink href="/#features">Features</NavLink>
                        <NavLink href="/tournaments">Tournaments</NavLink>
                        <NavLink href="/docs">Docs</NavLink>
                        <NavLink href="/#premium" icon={<Trophy size={14} className="text-amber-400" />}>Premium</NavLink>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {loading ? (
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Loader2 size={20} className="text-primary animate-spin" />
                        </div>
                    ) : user ? (
                        <div className="relative group">
                            <button className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-full glass hover:bg-white/10 transition-all">
                                <img
                                    src={user.avatar || "/default-avatar.png"}
                                    alt="User"
                                    className="w-7 h-7 rounded-full object-cover border border-white/20"
                                />
                                <span className="text-sm font-medium text-white max-w-[100px] truncate">
                                    {user.global_name || user.username}
                                </span>
                                <ChevronDown size={14} className="text-gray-400 group-hover:text-white transition-colors" />
                            </button>
                            
                            <div className="absolute right-0 mt-2 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <div className="glass-darker p-2 rounded-xl border border-white/10 shadow-2xl">
                                    <Link href="/profile" className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Profile</Link>
                                    <Link href="/servers" className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">Dashboard</Link>
                                    <div className="h-px bg-white/5 my-1 mx-2" />
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-colors"
                                    >
                                        Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="hidden md:flex items-center gap-3">
                            <button 
                                onClick={handleLogin} 
                                className="px-6 py-2.5 text-sm font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-full transition-all shadow-[0_0_20px_rgba(88,101,242,0.3)] hover:scale-105 active:scale-95 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
                                </svg>
                                <span>Login via Discord</span>
                            </button>
                        </div>
                    )}

                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden p-2 text-gray-400 hover:text-white glass rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: "100%" }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: "100%" }}
                        className="fixed inset-0 z-[60] glass-darker md:hidden"
                    >
                        <div className="flex flex-col h-full p-6">
                            <div className="flex justify-between items-center mb-12">
                                <Link href="/" className="flex items-center gap-2" onClick={() => setIsOpen(false)}>
                                    <img src="/R_logo.png" alt="Logo" className="w-8 h-8 rounded-lg" />
                                    <span className="text-xl font-bold text-white">RAVONIXX</span>
                                </Link>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-gray-400 hover:text-white glass rounded-full"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="flex flex-col gap-6">
                                <MobileNavLink href="/#features" onClick={() => setIsOpen(false)}>Features</MobileNavLink>
                                <MobileNavLink href="/tournaments" onClick={() => setIsOpen(false)}>Tournaments</MobileNavLink>
                                <MobileNavLink href="/docs" onClick={() => setIsOpen(false)}>Documentation</MobileNavLink>
                                <MobileNavLink href="/#premium" onClick={() => setIsOpen(false)}>Premium</MobileNavLink>
                            </div>

                            <div className="mt-auto flex flex-col gap-4">
                                {user ? (
                                    <>
                                        <div className="flex items-center gap-3 p-4 glass rounded-2xl">
                                            <img src={user.avatar || "/default-avatar.png"} alt="User" className="w-12 h-12 rounded-full border border-white/20" />
                                            <div>
                                                <div className="text-white font-bold">{user.global_name || user.username}</div>
                                                <div className="text-gray-400 text-sm">Active Session</div>
                                            </div>
                                        </div>
                                        <button onClick={handleLogout} className="w-full py-4 rounded-2xl bg-red-500/10 text-red-400 font-bold border border-red-500/20">Sign Out</button>
                                    </>
                                ) : (
                                    <button 
                                        onClick={handleLogin} 
                                        className="w-full py-4 rounded-2xl bg-[#5865F2] text-white font-bold text-center flex items-center justify-center gap-3"
                                    >
                                        <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
                                        </svg>
                                        Login via Discord
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}

function NavLink({ href, children, icon }: { href: string; children: React.ReactNode; icon?: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-gray-400 hover:text-white text-sm font-medium transition-colors flex items-center gap-1.5 group relative"
        >
            {icon}
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary group-hover:w-full transition-all duration-300" />
        </Link>
    );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="text-2xl font-bold text-white hover:text-primary transition-colors"
        >
            {children}
        </Link>
    );
}
