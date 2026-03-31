import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; tourneyId: string }> }
) {
    try {
        const { id: guildId, tourneyId } = await params;

        const rows = await db<any[]>`
            SELECT * FROM "tm.tourney" WHERE id = ${tourneyId} AND guild_id = ${guildId} LIMIT 1
        `;

        if (!rows || rows.length === 0) {
            return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
        }

        // Get slot count
        const countRows = await db<any[]>`
            SELECT COUNT(*) AS cnt FROM "tm.tourney_tm.register" WHERE "tm.tourney_id" = ${tourneyId}
        `;

        return NextResponse.json({ ...rows[0], slot_count: countRows[0]?.cnt || 0 });

    } catch (error) {
        console.error('Error fetching tournament:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; tourneyId: string }> }
) {
    try {
        const { id: guildId, tourneyId } = await params;
        const body = await req.json();

        // Only allow updating specific fields
        const allowedFields = [
            'name', 'total_slots', 'required_mentions', 'multiregister',
            'teamname_compulsion', 'no_duplicate_name', 'autodelete_rejected',
            'success_message', 'group_size', 'required_lines', 'allow_duplicate_tags',
            'registration_channel_id', 'confirm_channel_id', 'ping_role_id',
        ];

        const updates: Record<string, any> = {};
        for (const field of allowedFields) {
            if (body[field] !== undefined) {
                updates[field] = body[field];
            }
        }

        if (Object.keys(updates).length === 0) {
            return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
        }

        // postgres.js helper for dynamic updates
        const result = await db`
            UPDATE "tm.tourney" SET ${db(updates)} 
            WHERE id = ${tourneyId} AND guild_id = ${guildId}
            RETURNING *
        `;

        return NextResponse.json({ success: true, tournament: result[0] });

    } catch (error) {
        console.error('Error updating tournament:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; tourneyId: string }> }
) {
    try {
        const { id: guildId, tourneyId } = await params;
        const botToken = process.env.DISCORD_BOT_TOKEN;

        // 1. Get tournament to find the role_id
        const tourneyRows = await db<any[]>`
            SELECT role_id FROM "tm.tourney" WHERE id = ${tourneyId} AND guild_id = ${guildId} LIMIT 1
        `;

        if (!tourneyRows || tourneyRows.length === 0) {
            return NextResponse.json({ error: 'Tournament not found' }, { status: 404 });
        }
        const tourney = tourneyRows[0];

        // 2. Delete associated slots
        const junctionRows = await db<any[]>`
            SELECT tmslot_id FROM "tm.tourney_tm.register" WHERE "tm.tourney_id" = ${tourneyId}
        `;

        if (junctionRows && junctionRows.length > 0) {
            const slotIds = junctionRows.map((j: any) => j.tmslot_id);
            await db`DELETE FROM "tm.register" WHERE id IN ${db(slotIds)}`;
            await db`DELETE FROM "tm.tourney_tm.register" WHERE "tm.tourney_id" = ${tourneyId}`;
        }

        // 3. Delete tournament from PostgreSQL
        await db`
            DELETE FROM "tm.tourney" WHERE id = ${tourneyId} AND guild_id = ${guildId}
        `;

        // 4. Delete Discord role
        if (botToken && tourney.role_id) {
            try {
                await fetch(`https://discord.com/api/v10/guilds/${guildId}/roles/${tourney.role_id}`, {
                    method: 'DELETE',
                    headers: { 'Authorization': `Bot ${botToken}` },
                });
            } catch (err) {
                console.error('Failed to delete Discord role:', err);
            }
        }

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting tournament:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
