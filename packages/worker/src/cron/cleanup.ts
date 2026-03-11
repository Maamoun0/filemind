import cron from 'node-cron';
import { Pool } from 'pg';
import fs from 'fs';
import path from 'path';

// Note: Ensure this uses the same db config as backend or isolate it
const connectionString = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/filemind';
const db = new Pool({ connectionString });

// Temp directory where processed files live
const TEMP_DIR = process.env.TEMP_DIR || path.join(process.cwd(), 'temp_uploads');

export const startCronJobs = () => {
    // Run every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
        console.log('[fileMind-Cron] Starting 10-minute cleanup task for zero permanent storage policy...');

        const client = await db.connect();
        try {
            // Find jobs that have a delete_at time strictly before NOW()
            const result = await client.query(`
        SELECT id, tool_type 
        FROM jobs 
        WHERE delete_at IS NOT NULL AND delete_at <= NOW()
      `);

            if (result.rowCount === 0) {
                console.log('[fileMind-Cron] No expired jobs found to clean up.');
                return;
            }

            console.log(`[fileMind-Cron] Found ${result.rowCount} expired jobs. Cleaning...`);

            for (const row of result.rows) {
                // Here we would implement logic to delete associated files on the local FS or S3
                // Example local FS cleanup:
                const fileUploadsPath = path.join(TEMP_DIR, 'uploads', row.id);
                const fileOutputPath = path.join(TEMP_DIR, 'outputs', row.id);

                [fileUploadsPath, fileOutputPath].forEach((dirPath) => {
                    if (fs.existsSync(dirPath)) {
                        fs.rmSync(dirPath, { recursive: true, force: true });
                        console.log(`[fileMind-Cron] Deleted files at ${dirPath}`);
                    }
                });

                // Finally, delete the record strictly
                await client.query('DELETE FROM jobs WHERE id = $1', [row.id]);
                console.log(`[fileMind-Cron] Removed job record ${row.id} from database.`);
            }

        } catch (error) {
            console.error('[fileMind-Cron] Error during cleanup task:', error);
        } finally {
            client.release();
        }
    });

    console.log('[fileMind-Cron] Cleanup cron job scheduled successfully.');
};
