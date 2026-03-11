import { Request, Response } from 'express';
import { db } from '../services/db';
import { addJobToQueue } from '../queue';
import { JobStatus, ToolType, CreateJobSchema } from '@filemind/shared';

export const handleFileUpload = async (req: Request, res: Response) => {
    try {
        const { toolType } = req.body;
        const file = req.file;
        const jobId = req.body.jobId;

        if (!file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        // Validate payload with Zod
        const validationResult = CreateJobSchema.safeParse({
            toolType,
            fileSize: file.size,
            originalName: file.originalname,
        });

        if (!validationResult.success) {
            return res.status(400).json({
                error: 'Validation Failed',
                details: validationResult.error.errors
            });
        }

        const deleteAt = new Date();
        deleteAt.setHours(deleteAt.getHours() + 1); // Exact 1 hour zero permanent storage logic

        // Create Job in Postgres
        await db.query(
            `INSERT INTO jobs (id, tool_type, status, file_size, delete_at) 
       VALUES ($1, $2, $3, $4, $5)`,
            [jobId, toolType, JobStatus.PENDING, file.size, deleteAt]
        );

        // Queue for worker
        await addJobToQueue(jobId, toolType, file.path, file.originalname);

        return res.status(202).json({
            jobId,
            status: JobStatus.PENDING,
            message: 'File uploaded and queued for processing successfully',
            expiresAt: deleteAt,
        });
    } catch (error) {
        console.error('[fileMind-API] Upload handling error:', error);
        return res.status(500).json({ error: 'Internal Server Error processing upload' });
    }
};
