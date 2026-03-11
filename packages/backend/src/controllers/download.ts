import { Request, Response } from 'express';
import { db } from '../services/db';
import { JobStatus } from '@filemind/shared';
import path from 'path';
import fs from 'fs';

const TEMP_DIR = process.env.TEMP_DIR || path.join(process.cwd(), 'temp_uploads');

export const downloadResult = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;

        const result = await db.query(
            `SELECT id, status, tool_type, error_message, created_at, delete_at 
       FROM jobs 
       WHERE id = $1`,
            [jobId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Job not found or already deleted' });
        }

        const job = result.rows[0];

        if (job.status !== JobStatus.COMPLETED) {
            return res.status(400).json({ error: 'Job is not completed yet.' });
        }

        // Determine expected output filename based on tool type
        // In a real app, the worker would save the exact output mapping into the DB.
        // For our secure isolation, we know it's in temp_uploads/outputs/jobId/result...
        const outputDir = path.join(TEMP_DIR, 'outputs', jobId);

        // Check if directory exists
        if (!fs.existsSync(outputDir)) {
            return res.status(404).json({ error: 'Output files not found or have been cleaned up.' });
        }

        // Read the directory to find the result file (assuming 1 result file per job)
        const files = fs.readdirSync(outputDir);
        if (files.length === 0) {
            return res.status(404).json({ error: 'Result file is missing.' });
        }

        const resultFile = files[0];
        const absoluteFilePath = path.join(outputDir, resultFile);

        // Prompt download
        res.download(absoluteFilePath, `fileMind_Result_${resultFile}`, (err) => {
            if (err) {
                console.error('[fileMind-API] Error downloading file:', err);
                // Ensure no headers are sent twice
                if (!res.headersSent) {
                    res.status(500).send('Error downloading file');
                }
            }
        });

    } catch (error) {
        console.error('[fileMind-API] Download error:', error);
        if (!res.headersSent) {
            return res.status(500).json({ error: 'Failed to process download request' });
        }
    }
};
