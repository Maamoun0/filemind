import { Pool } from 'pg';

// Using connection string from .env or docker-compose
const connectionString = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/filemind';

export const db = new Pool({
    connectionString,
});

// Utility wrapper for querying
export const query = async (text: string, params?: any[]) => {
    const start = Date.now();
    const res = await db.query(text, params);
    const duration = Date.now() - start;
    console.log('[fileMind-DB] Executed query', { text, duration, rows: res.rowCount });
    return res;
};
