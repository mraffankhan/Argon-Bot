import postgres from 'postgres';

const sql = postgres({
    host: process.env.DB_HOST || 'db.fwywdcoiudevrssihfuf.supabase.co',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'postgres',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'affan@805032',
    ssl: { rejectUnauthorized: false }
});

export const db = sql;
