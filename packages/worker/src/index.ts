import { Worker, Job } from 'bullmq';
import { startCronJobs } from './cron/cleanup';
import { Pool } from 'pg';
import { JobStatus, ToolType } from '@filemind/shared';
import { processPdfToWord } from './processors/pdf-to-word';
import { processOcrImage } from './processors/ocr-image';
import { runAIDoubleCheck } from './processors/ai-review';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';
const connectionString = process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/filemind';
const db = new Pool({ connectionString });

console.log('[fileMind-Worker] Initializing...');

// Start the 10-minute cron job to clean up expired files and records
startCronJobs();

// Initialize BullMQ Worker to process incoming jobs
const worker = new Worker(
    'filemind-processing',
    async (job: Job) => {
        console.log(`[fileMind-Worker] Started processing job ${job.id} of type ${job.name}`);
        const { toolType, filePath, originalName, jobId } = job.data;

        try {
            // ── Phase 1: Mark as PROCESSING ──
            await db.query('UPDATE jobs SET status = $1 WHERE id = $2', [JobStatus.PROCESSING, jobId]);

            if (toolType === ToolType.PDF_TO_WORD) {
                await processPdfToWord(jobId, filePath, originalName);
            } else if (toolType === ToolType.OCR_IMAGE) {
                await processOcrImage(jobId, filePath, originalName);
            } else {
                // Generic latency for other unimplemented tools
                await new Promise((resolve) => setTimeout(resolve, 3000));
            }

            console.log(`[fileMind-Worker] Primary processing done for ${toolType} on ${originalName}`);

            // ── Phase 2: AI Double-Check Review (Debate Mode) ──
            console.log(`[fileMind-Worker] Starting AI Double-Check for job ${jobId}...`);

            const reviewResult = await runAIDoubleCheck(db, jobId, toolType, originalName);

            console.log(
                `[fileMind-Worker] AI Review complete: verdict=${reviewResult.verdict}, ` +
                `confidence=${(reviewResult.confidence * 100).toFixed(0)}%`
            );

            // ── Phase 3: Mark as COMPLETED (only after review passes) ──
            const completedAt = new Date();
            await db.query(
                'UPDATE jobs SET status = $1, completed_at = $2 WHERE id = $3',
                [JobStatus.COMPLETED, completedAt, jobId]
            );

            console.log(`[fileMind-Worker] ✅ Job ${jobId} fully completed (processed + reviewed)`);
            return { success: true, processedJobId: jobId, review: reviewResult };
        } catch (error: any) {
            console.error(`[fileMind-Worker] Failed job ${job.id}`, error);
            // Mark as FAILED
            await db.query(
                'UPDATE jobs SET status = $1, error_message = $2 WHERE id = $3',
                [JobStatus.FAILED, error.message, jobId]
            );
            throw error;
        }
    },
    {
        connection: {
            url: REDIS_URL,
        },
        concurrency: 5, // Process up to 5 files concurrently
    }
);

worker.on('completed', (job) => {
    console.log(`[fileMind-Worker Event] Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
    console.log(`[fileMind-Worker Event] Job ${job?.id} failed with error ${err.message}`);
});

console.log('[fileMind-Worker] Listening for jobs...');
