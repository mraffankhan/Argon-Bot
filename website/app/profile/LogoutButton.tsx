"use client";

import { LogOut } from "lucide-react";

export default function LogoutButton() {
    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        window.location.href = '/';
    };

    return (
        <button
            onClick={handleLogout}
            className="px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 font-bold rounded-xl transition-all flex items-center justify-center gap-2 uppercase tracking-wide text-xs"
        >
            <LogOut size={16} />
            Sign Out
        </button>
    );
}
