import postgres from 'postgres';

let _db: ReturnType<typeof postgres> | null = null;

export function getDb() {
    if (!_db) {
        const dbUrl = (process.env.DATABASE_URL || "").replace("?schema=public", "");
        _db = postgres(dbUrl, {
            ssl: { rejectUnauthorized: false }
        });
    }
    return _db;
}

export const db = new Proxy({} as ReturnType<typeof postgres>, {
    get(_target, prop) {
        const sql = getDb();
        return (sql as any)[prop];
    },
    apply(_target, _thisArg, args) {
        return getDb()(...args);
    }
});
