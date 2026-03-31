import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; tourneyId: string }> }
) {
    try {
        const { tourneyId } = await params;

        // Get slot IDs from junction table
        const junctionRows = await db<any[]>`
            SELECT tmslot_id FROM "tm.tourney_tm.register" WHERE "tm.tourney_id" = ${tourneyId}
        `;

        if (!junctionRows || junctionRows.length === 0) {
            return NextResponse.json([]);
        }

        const slotIds = junctionRows.map((j: any) => j.tmslot_id);

        // Get actual slot data
        const slots = await db<any[]>`
            SELECT id, num, team_name, leader_id, members, jump_url, confirm_jump_url 
            FROM "tm.register" 
            WHERE id IN ${db(slotIds)} 
            ORDER BY num ASC
        `;

        return NextResponse.json(slots || []);

    } catch (error) {
        console.error('Error fetching slots:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ id: string; tourneyId: string }> }
) {
    try {
        const { tourneyId } = await params;
        const { slotId } = await req.json();

        if (!slotId) {
            return NextResponse.json({ error: 'Missing slotId' }, { status: 400 });
        }

        // Remove from junction table
        await db`
            DELETE FROM "tm.tourney_tm.register" WHERE "tm.tourney_id" = ${tourneyId} AND tmslot_id = ${slotId}
        `;

        // Delete the slot itself
        await db`DELETE FROM "tm.register" WHERE id = ${slotId}`;

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error('Error deleting slot:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
