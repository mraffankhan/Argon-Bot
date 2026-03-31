import { getSession } from "@/lib/session";
import { db } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { User, LogOut, ShieldCheck, Medal, Swords, Target, Gamepad2, Users, Calendar, Trophy } from "lucide-react";
import Link from "next/link";
import LogoutButton from "./LogoutButton";

export default async function ProfilePage() {
    const session = await getSession();

    if (!session?.user?.id) {
        redirect("/api/auth/discord");
    }

    const userDiscordId = session.user.id;

    // Fetch user with their registered teams, tournaments, and global player stats
    let dbUser = await db.user.findUnique({
        where: { discordId: userDiscordId },
        include: {
            playerStats: {
                include: { tournament: true }
            },
            teamMembers: {
                include: { team: { include: { tournament: true } } }
            },
            captainOf: {
                include: { tournament: true }
            }
        }
    });

    // If dbUser is missing, fallback to create them dynamically based on the session!
    // This happens because the custom OAuth route doesn't automatically insert them like NextAuth.
    if (!dbUser) {
        dbUser = await db.user.create({
            data: {
                discordId: userDiscordId,
                username: session.user.username || "Unknown",
                avatar: session.user.avatar || null,
                email: session.user.email || null,
            },
            include: {
                playerStats: { include: { tournament: true } },
                teamMembers: { include: { team: { include: { tournament: true } } } },
                captainOf: { include: { tournament: true } }
            }
        }) as any;
    }
    
    const user = dbUser!;

    // Aggregate stats across all tournaments
    const totalStats = user.playerStats.reduce((acc: any, stat: any) => ({
        kills: acc.kills + stat.totalKills,
        wins: acc.wins + stat.wins,
        booyahs: acc.booyahs + stat.booyahCount,
        matches: acc.matches + (stat.wins + stat.losses),
    }), { kills: 0, wins: 0, booyahs: 0, matches: 0 });

    // Combine teams where user is captain OR just a member
    const captainTeamsMap = new Map(user.captainOf.map((t: any) => [t.id, { ...t, role: "Captain" }]));
    user.teamMembers.forEach((tm: any) => {
        if (!captainTeamsMap.has(tm.team.id)) {
            captainTeamsMap.set(tm.team.id, { ...tm.team, role: "Member" });
        }
    });
    const myTeams = Array.from(captainTeamsMap.values());

    return (
        <div className="min-h-screen bg-[#07090E] text-white pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] bg-cyan-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-600/10 blur-[150px] rounded-full mix-blend-screen pointer-events-none" />

            <div className="max-w-6xl w-full mx-auto relative z-10 flex flex-col gap-8">
                
                {/* Header Banner */}
                <div className="glass border border-white/5 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 blur-[100px] pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 z-10">
                        <div className="relative">
                            {session.user.avatar ? (
                                <img src={session.user.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-cyan-500/30 shadow-[0_0_30px_rgba(6,182,212,0.3)] object-cover" />
                            ) : (
                                <div className="w-32 h-32 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-4xl font-bold border-4 border-cyan-500/30">
                                    {user.username.charAt(0)}
                                </div>
                            )}
                            <div className="absolute bottom-0 right-0 bg-cyan-500 text-black text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-black shadow-lg">
                                {user.role}
                            </div>
                        </div>

                        <div className="text-center md:text-left">
                            <h1 className="text-4xl lg:text-5xl font-black uppercase italic tracking-tight drop-shadow-lg text-white mb-2">
                                {user.username}
                            </h1>
                            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-gray-300">
                                    <Target className="w-4 h-4 text-cyan-400" /> Discord ID: {user.discordId}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="z-10">
                        <LogoutButton />
                    </div>
                </div>

                {/* Global Stats Grid */}
                <div>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Medal className="w-6 h-6 text-cyan-400" /> Career Stats
                    </h2>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-black/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-cyan-500/30 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 blur-[40px] group-hover:bg-cyan-500/20 transition-all pointer-events-none" />
                            <Target className="w-6 h-6 text-cyan-500 mb-3 relative z-10" />
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider relative z-10">Total Kills</p>
                            <p className="text-3xl font-black text-white relative z-10">{totalStats.kills}</p>
                        </div>
                        <div className="bg-black/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-yellow-500/30 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 blur-[40px] group-hover:bg-yellow-500/20 transition-all pointer-events-none" />
                            <Trophy className="w-6 h-6 text-yellow-500 mb-3 relative z-10" />
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider relative z-10">Booyahs / Wins</p>
                            <p className="text-3xl font-black text-white relative z-10">{totalStats.booyahs}</p>
                        </div>
                        <div className="bg-black/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-purple-500/30 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 blur-[40px] group-hover:bg-purple-500/20 transition-all pointer-events-none" />
                            <Swords className="w-6 h-6 text-purple-500 mb-3 relative z-10" />
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider relative z-10">Matches Played</p>
                            <p className="text-3xl font-black text-white relative z-10">{totalStats.matches}</p>
                        </div>
                        <div className="bg-black/60 border border-white/5 rounded-2xl p-6 relative overflow-hidden group hover:border-green-500/30 transition-colors">
                            <div className="absolute top-0 right-0 w-24 h-24 bg-green-500/10 blur-[40px] group-hover:bg-green-500/20 transition-all pointer-events-none" />
                            <ShieldCheck className="w-6 h-6 text-green-500 mb-3 relative z-10" />
                            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider relative z-10">Win Rate</p>
                            <p className="text-3xl font-black text-white relative z-10">
                                {totalStats.matches > 0 ? Math.round((totalStats.wins / totalStats.matches) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                </div>

                {/* Registered Teams / Tournaments */}
                <div className="mt-4">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Users className="w-6 h-6 text-cyan-400" /> Active Registrations
                    </h2>

                    {myTeams.length === 0 ? (
                        <div className="text-center py-20 bg-black/40 rounded-3xl border border-white/5">
                            <Swords className="w-16 h-16 text-white/10 mx-auto mb-4" />
                            <h3 className="text-xl font-bold mb-2">No Active Teams</h3>
                            <p className="text-gray-400 mb-6 font-medium">You haven't registered for any tournaments yet.</p>
                            <Link href="/tournaments" className="px-6 py-3 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 font-bold uppercase tracking-wider rounded-xl transition-all inline-block">
                                Browse Tournaments
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {myTeams.map((team: any) => (
                                <div key={team.id} className="bg-black/60 border border-white/10 rounded-2xl p-6 hover:border-cyan-500/30 transition-colors flex flex-col group relative">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase tracking-widest ${
                                                team.role === 'Captain' ? 'bg-yellow-500/10 text-yellow-500' : 'bg-blue-500/10 text-blue-400'
                                            }`}>
                                                {team.role}
                                            </span>
                                            <h3 className="text-xl font-bold text-white mt-3 mb-1">{team.name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1"><Gamepad2 className="w-3 h-3" /> {team.tournament.name}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-auto pt-4 flex gap-2">
                                        <Link 
                                            href={`/tournaments/${team.tournamentId}`}
                                            className="flex-1 text-center py-2.5 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl text-xs font-bold uppercase tracking-wider text-white transition-colors"
                                        >
                                            View Tournament Hub
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
