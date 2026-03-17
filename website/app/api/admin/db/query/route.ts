import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { isAuthorizedDev } from '@/lib/auth';

export async function POST(req: Request) {
    try {
        const { userId, action, table, payload } = await req.json();

        // 1. Verify Developer Access
        if (!isAuthorizedDev(userId)) {
            return NextResponse.json({ error: 'Unauthorized access.' }, { status: 403 });
        }

        if (!table || !/^[a-zA-Z0-9_.]+$/.test(table)) {
            return NextResponse.json({ error: 'Invalid table name.' }, { status: 400 });
        }

        let result: any;

        // 2. Handle CRUD Operations via `postgres` module
        switch (action) {
            case 'read':
                // Using postgres.js tagged templates for safe queries
                result = await db`SELECT * FROM ${db(table)} LIMIT 100 OFFSET ${payload?.offset || 0}`;
                break;

            case 'read_columns':
                // In PostgreSQL, target schema is typically 'public'
                result = await db`
                    SELECT column_name, data_type 
                    FROM information_schema.columns 
                    WHERE table_schema = 'public' AND table_name = ${table}
                `;
                break;

            case 'create':
                if (!payload || Object.keys(payload).length === 0) throw new Error("No data provided");
                
                // postgres.js helper for multi-column inserts
                result = await db`
                    INSERT INTO ${db(table)} ${db(payload)}
                    RETURNING *
                `;
                break;

            case 'update':
                if (!payload?.data || Object.keys(payload.data).length === 0 || !payload.idField || payload.idValue === undefined) {
                    throw new Error("Invalid update payload");
                }

                // postgres.js helper for updates
                result = await db`
                    UPDATE ${db(table)} SET ${db(payload.data)}
                    WHERE ${db(payload.idField)} = ${payload.idValue}
                    RETURNING *
                `;
                break;

            case 'delete':
                if (!payload.idField || payload.idValue === undefined) {
                    throw new Error("Invalid delete payload");
                }

                result = await db`
                    DELETE FROM ${db(table)} 
                    WHERE ${db(payload.idField)} = ${payload.idValue}
                    RETURNING *
                `;
                break;

            default:
                return NextResponse.json({ error: `Unsupported action: ${action}` }, { status: 400 });
        }

        return NextResponse.json({ success: true, data: result });

    } catch (error: any) {
        console.error(`Error during DB query [${req.method}] :`, error);
        return NextResponse.json({ error: error.message || 'Failed database operation.' }, { status: 500 });
    }
}
