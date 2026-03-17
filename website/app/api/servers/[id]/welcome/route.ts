import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: guildId } = await params;
        console.log(`[Welcome API] GET request for guildId: ${guildId}`);

        const rows = await db<any[]>`
            SELECT guild_id, channel_id, message, enabled, embed_enabled, embed_color, embed_title FROM welcome_configs WHERE guild_id = ${guildId} LIMIT 1
        `;
        const data = rows.length > 0 ? rows[0] : null;

        const welcomeData = data || {
            guild_id: guildId,
            channel_id: null,
            message: 'Welcome {user} to **{server}**! You are member #{member_count}.',
            enabled: false,
            embed_enabled: false,
            embed_color: 65459,
            embed_title: 'Welcome!'
        };

        // Ensure guild_id is a string and use the exact string from the URL to avoid precision loss
        welcomeData.guild_id = guildId;

        return NextResponse.json(welcomeData);

    } catch (error) {
        console.error('[Welcome API] Error fetching welcome config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: guildId } = await params;
        const body = await req.json();
        console.log(`[Welcome API] PUT request for guildId: ${guildId}`, body);

        // Always override guild_id from params, discarding body's potentially precision-lost value
        body.guild_id = guildId;

        // PostgreSQL syntax for ON CONFLICT
        await db`
            INSERT INTO welcome_configs (
                guild_id, channel_id, message, enabled, embed_enabled, embed_color, embed_title
            ) VALUES (
                ${guildId}, ${body.channel_id || null}, ${body.message || ''}, 
                ${body.enabled ? 1 : 0}, ${body.embed_enabled ? 1 : 0}, 
                ${body.embed_color || 0}, ${body.embed_title || ''}
            )
            ON CONFLICT (guild_id) DO UPDATE SET
                channel_id = EXCLUDED.channel_id,
                message = EXCLUDED.message,
                enabled = EXCLUDED.enabled,
                embed_enabled = EXCLUDED.embed_enabled,
                embed_color = EXCLUDED.embed_color,
                embed_title = EXCLUDED.embed_title
        `;

        const rows = await db<any[]>`
            SELECT guild_id, channel_id, message, enabled, embed_enabled, embed_color, embed_title FROM welcome_configs WHERE guild_id = ${guildId} LIMIT 1
        `;
        const data = rows[0];

        // Always use original guildId from URL params to ensure perfect precision
        if (data) {
            data.guild_id = guildId;
        }

        return NextResponse.json(data);

    } catch (error) {
        console.error('[Welcome API] Error updating welcome config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
