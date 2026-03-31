import { NextResponse } from 'next/server';
import { getSession } from '@/lib/session';
import { db } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getSession();

        if (!session?.user?.id) {
            return NextResponse.json({ authenticated: false, stats: null }, { status: 200 });
        }

        const userDiscordId = session.user.id;

        let dbUser = await db.user.findUnique({
            where: { discordId: userDiscordId },
            include: {
                playerStats: true,
            }
        });

        if (!dbUser) {
            return NextResponse.json({
                authenticated: true,
                stats: {
                    kills: 0,
                    wins: 0,
                    booyahs: 0,
                    matches: 0,
                    winRate: 0,
                }
            });
        }

        const totalStats = dbUser.playerStats.reduce((acc, stat) => ({
            kills: acc.kills + stat.totalKills,
            wins: acc.wins + stat.wins,
            booyahs: acc.booyahs + stat.booyahCount,
            matches: acc.matches + (stat.wins + stat.losses),
        }), { kills: 0, wins: 0, booyahs: 0, matches: 0 });

        return NextResponse.json({
            authenticated: true,
            stats: {
                kills: totalStats.kills,
                wins: totalStats.wins,
                booyahs: totalStats.booyahs,
                matches: totalStats.matches,
                winRate: totalStats.matches > 0 ? Math.round((totalStats.wins / totalStats.matches) * 100) : 0,
            }
        });
    } catch (error) {
        console.error('User stats error:', error);
        return NextResponse.json({ authenticated: false, error: 'Failed to fetch stats' }, { status: 500 });
    }
}
