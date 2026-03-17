"use client";

import Link from "next/link";
import { Github, Twitter, MessageSquare, Mail } from "lucide-react";

const FOOTER_LINKS = [
    {
        title: "Product",
        links: [
            { label: "Features", href: "/#features" },
            { label: "Tournaments", href: "/tournaments" },
            { label: "Premium", href: "/#premium" },
            { label: "Status", href: "/status" },
        ]
    },
    {
        title: "Resources",
        links: [
            { label: "Documentation", href: "/docs" },
            { label: "API Reference", href: "/docs/api" },
            { label: "Community", href: "/community" },
            { label: "Support", href: "/support" },
        ]
    },
    {
        title: "Legal",
        links: [
            { label: "Terms of Service", href: "/terms" },
            { label: "Privacy Policy", href: "/privacy" },
            { label: "Refund Policy", href: "/refund" },
            { label: "Cookie Policy", href: "/cookies" },
        ]
    }
];

export default function Footer() {
    return (
        <footer className="bg-black border-t border-white/5 relative overflow-hidden">
            {/* Background Accent */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[300px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 py-12 md:py-20 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
                    <div className="col-span-2 lg:col-span-2 space-y-6">
                        <Link href="/" className="flex items-center gap-2 group">
                            <div className="w-8 h-8 rounded-lg glass flex items-center justify-center">
                                <img src="/R_logo.png" alt="Logo" className="w-6 h-6 object-contain" />
                            </div>
                            <span className="text-xl font-bold tracking-tight text-white uppercase italic">Ravonixx</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                            The next generation of Discord-driven esports automation. Manage tournaments, scrims, and communities with ease.
                        </p>
                        <div className="flex items-center gap-4">
                            <SocialLink href="#" icon={<Twitter size={18} />} />
                            <SocialLink href="#" icon={<Github size={18} />} />
                            <SocialLink href="#" icon={<MessageSquare size={18} />} />
                            <SocialLink href="#" icon={<Mail size={18} />} />
                        </div>
                    </div>

                    {FOOTER_LINKS.map((section) => (
                        <div key={section.title} className="space-y-4">
                            <h4 className="text-white text-sm font-bold uppercase tracking-wider">{section.title}</h4>
                            <ul className="space-y-2">
                                {section.links.map((link) => (
                                    <li key={link.label}>
                                        <Link 
                                            href={link.href} 
                                            className="text-gray-400 hover:text-white text-sm transition-colors"
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-gray-500 text-xs">
                        &copy; {new Date().getFullYear()} Ravonixx Development. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        <span className="flex items-center gap-1.5 text-xs text-green-500/80 font-medium">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            All Systems Operational
                        </span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

function SocialLink({ href, icon }: { href: string; icon: React.ReactNode }) {
    return (
        <a 
            href={href} 
            className="w-9 h-9 rounded-lg glass flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all border border-white/5"
            target="_blank"
            rel="noopener noreferrer"
        >
            {icon}
        </a>
    );
}
