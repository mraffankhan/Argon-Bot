"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, Loader2, ChevronDown, User as UserIcon, Gamepad2, Users, FolderOpen, Crown, LayoutDashboard, LogOut, Zap } from "lucide-react";
import { User } from "@/lib/session";
import { motion, AnimatePresence } from "framer-motion";

const MORE_DROPDOWN = [
    { label: "Leaderboard", href: "/leaderboard", icon: <Crown size={16} /> },
    { label: "Community", href: "/community", icon: <Users size={16} /> },
    { label: "Sponsors", href: "/sponsors", icon: <Zap size={16} /> },
    { label: "Docs", href: "/docs", icon: <FolderOpen size={16} /> },
];

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [scrolled, setScrolled] = useState(false);
    const [moreOpen, setMoreOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

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
        <>
        <header 
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                scrolled ? "bg-black/80 backdrop-blur-xl border-b border-white/5" : "bg-transparent"
            }`}
        >
            <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between h-20">
                <Link href="/" className="flex items-center gap-3 group">
                    <div className="w-10 h-10 rounded-xl overflow-hidden bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-colors">
                        <img src="/R_logo.png" alt="Logo" className="w-8 h-8 object-contain" />
                    </div>
                    <span className="text-xl font-bold tracking-tight text-white uppercase italic">Ravonixx</span>
                </Link>

                <div className="hidden md:flex items-center gap-1">
                    <NavLink href="/" active>Home</NavLink>
                    <NavLink href="/tournaments">Play</NavLink>
                    <NavLink href="/teams">Team</NavLink>
                    
                    <div className="relative">
                        <button 
                            onMouseEnter={() => setMoreOpen(true)}
                            onMouseLeave={() => setMoreOpen(false)}
                            className="flex items-center gap-1 px-4 py-2 text-gray-400 hover:text-white text-sm font-medium transition-colors rounded-lg hover:bg-white/5"
                        >
                            More <ChevronDown size={14} className={`transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                        </button>
                        
                        <AnimatePresence>
                            {moreOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute top-full left-0 mt-2 w-48 glass rounded-xl border border-white/10 shadow-2xl overflow-hidden"
                                >
                                    {MORE_DROPDOWN.map((item) => (
                                        <Link 
                                            key={item.href}
                                            href={item.href}
                                            className="flex items-center gap-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                                        >
                                            {item.icon}
                                            <span className="text-sm font-medium">{item.label}</span>
                                        </Link>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {loading ? (
                        <div className="w-10 h-10 flex items-center justify-center">
                            <Loader2 size={20} className="text-primary animate-spin" />
                        </div>
                    ) : user ? (
                        <div className="relative group">
                            <Link href="/profile" className="flex items-center gap-2 p-1 rounded-full glass hover:bg-white/10 transition-all">
                                <img
                                    src={user.avatar || "/default-avatar.png"}
                                    alt="User"
                                    className="w-9 h-9 rounded-full object-cover border border-white/20"
                                />
                                <ChevronDown size={14} className="hidden sm:block text-gray-400 group-hover:text-white transition-colors mr-2" />
                            </Link>
                            
                            <div className="hidden md:block absolute right-0 mt-2 w-48 invisible group-hover:visible opacity-0 group-hover:opacity-100 transition-all duration-200">
                                <div className="glass p-2 rounded-xl border border-white/10 shadow-2xl">
                                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        <UserIcon size={16} /> Profile
                                    </Link>
                                    <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        <LayoutDashboard size={16} /> Dashboard
                                    </Link>
                                    <Link href="/commands" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                                        <Gamepad2 size={16} /> Commands
                                    </Link>
                                    <div className="h-px bg-white/5 my-1 mx-2" />
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-colors"
                                    >
                                        <LogOut size={16} /> Sign Out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <button 
                            onClick={handleLogin} 
                            className="px-5 py-2.5 text-sm font-bold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(88,101,242,0.2)] hover:scale-105 active:scale-95"
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.947 2.419-2.157 2.419zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.086 2.157 2.419c0 1.334-.946 2.419-2.157 2.419z"/>
                            </svg>
                            <span className="hidden sm:inline">Login</span>
                        </button>
                    )}

                    <button
                        onClick={() => setIsOpen(true)}
                        className="md:hidden p-2 text-gray-400 hover:text-white glass rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                </div>
            </nav>
        </header>

        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, x: "100%" }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: "100%" }}
                    className="fixed inset-0 z-[60] bg-black/95 md:hidden"
                >
                    <div className="flex flex-col h-full p-6 overflow-y-auto">
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

                        <div className="flex flex-col gap-2 mt-4">
                            <MobileNavLink href="/" onClick={() => setIsOpen(false)} icon={<Zap size={20} />}>Home</MobileNavLink>
                            <MobileNavLink href="/tournaments" onClick={() => setIsOpen(false)} icon={<Gamepad2 size={20} />}>Play</MobileNavLink>
                            <MobileNavLink href="/teams" onClick={() => setIsOpen(false)} icon={<Users size={20} />}>Team</MobileNavLink>
                            <MobileNavLink href="/leaderboard" onClick={() => setIsOpen(false)} icon={<Crown size={20} />}>Leaderboard</MobileNavLink>
                            <MobileNavLink href="/community" onClick={() => setIsOpen(false)} icon={<Users size={20} />}>Community</MobileNavLink>
                            <MobileNavLink href="/sponsors" onClick={() => setIsOpen(false)} icon={<Zap size={20} />}>Sponsors</MobileNavLink>
                            <MobileNavLink href="/docs" onClick={() => setIsOpen(false)} icon={<FolderOpen size={20} />}>Docs</MobileNavLink>
                        </div>

                        <div className="mt-auto flex flex-col gap-4 pt-10">
                            {user ? (
                                <>
                                    <div className="h-px bg-white/10 w-full mb-2" />
                                    <div className="flex items-center gap-4 p-4 glass rounded-2xl border border-white/5">
                                        <img src={user.avatar || "/default-avatar.png"} alt="User" className="w-12 h-12 rounded-full border border-white/20 shadow-lg" />
                                        <div>
                                            <div className="text-white font-bold text-lg">{user.global_name || user.username}</div>
                                            <div className="text-gray-400 text-sm flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                                Online
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <MobileNavLink href="/profile" onClick={() => setIsOpen(false)} icon={<UserIcon size={20} />}>Profile</MobileNavLink>
                                        <MobileNavLink href="/dashboard" onClick={() => setIsOpen(false)} icon={<LayoutDashboard size={20} />}>Dashboard</MobileNavLink>
                                    </div>
                                    <button onClick={handleLogout} className="mt-4 w-full py-4 rounded-xl bg-red-500/10 text-red-400 font-bold border border-red-500/20 flex items-center justify-center gap-2 hover:bg-red-500/20 transition-all active:scale-95">
                                        <LogOut size={20} /> Sign Out
                                    </button>
                                </>
                            ) : (
                                <button 
                                    onClick={handleLogin} 
                                    className="w-full py-4 rounded-xl shadow-[0_0_20px_rgba(88,101,242,0.3)] bg-[#5865F2] hover:bg-[#4752C4] text-white font-bold text-center flex items-center justify-center gap-3 transition-all active:scale-95"
                                >
                                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
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
        </>
    );
}

function NavLink({ href, children, active }: { href: string; children: React.ReactNode; active?: boolean }) {
    return (
        <Link
            href={href}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                active 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
        >
            {children}
        </Link>
    );
}

function MobileNavLink({ href, onClick, children, icon, delay = 0 }: { href: string; onClick: () => void; children: React.ReactNode; icon?: React.ReactNode; delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 + (delay * 0.05), duration: 0.3 }}
        >
            <Link
                href={href}
                onClick={onClick}
                className="flex items-center gap-4 text-xl font-bold text-gray-300 hover:text-white p-4 rounded-2xl hover:bg-white/5 transition-all group active:scale-95"
            >
                {icon && (
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:bg-primary/10 transition-colors border border-white/5">
                        {icon}
                    </div>
                )}
                <span className="group-hover:translate-x-1 transition-transform">{children}</span>
            </Link>
        </motion.div>
    );
}
