import { Request, Response } from 'express';
import { db } from '../services/db';

export const checkJobStatus = async (req: Request, res: Response) => {
    try {
        const { jobId } = req.params;

        const result = await db.query(
            `SELECT id, status, tool_type, error_message, created_at, delete_at,
                    review_status, review_confidence, review_notes, revisions_applied
       FROM jobs 
       WHERE id = $1`,
            [jobId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Job not found or already deleted' });
        }

        const job = result.rows[0];

        const response: any = {
            jobId: job.id,
            status: job.status,
            toolType: job.tool_type,
            errorMessage: job.error_message,
            createdAt: job.created_at,
            expiresAt: job.delete_at,
        };

        // Include AI Double-Check review info if available
        if (job.review_status) {
            response.reviewInfo = {
                verdict: job.review_status,
                confidence: job.review_confidence ? parseFloat(job.review_confidence) : null,
                reviewerNotes: job.review_notes,
                revisionsApplied: job.revisions_applied || 0,
            };
        }

        return res.status(200).json(response);

    } catch (error) {
        console.error('[fileMind-API] Status check error:', error);
        return res.status(500).json({ error: 'Failed to retrieve job status' });
    }
};
