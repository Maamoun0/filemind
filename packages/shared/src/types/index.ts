export enum JobStatus {
    PENDING = 'pending',
    PROCESSING = 'processing',
    REVIEWING = 'reviewing',      // AI Double-Check: Expert B is reviewing Expert A's output
    COMPLETED = 'completed',
    FAILED = 'failed',
}

// ── AI Double-Check System Types ──
export enum ReviewVerdict {
    APPROVED = 'approved',
    NEEDS_REVISION = 'needs_revision',
    REJECTED = 'rejected',
}

export interface DoubleCheckResult {
    verdict: ReviewVerdict;
    confidence: number;         // 0.0 – 1.0
    processorSummary: string;   // Expert A's brief summary
    reviewerNotes: string;      // Expert B's review notes
    revisionsApplied: number;   // Number of corrections made
    cachedResult: boolean;      // Whether result came from cache
}

export enum ToolCategory {
    PDF = 'pdf',
    IMAGE = 'image',
    AUDIO = 'audio',
    SMART = 'smart',
}

export enum ToolType {
    // PDF Tools
    PDF_TO_WORD = 'pdf-to-word',
    WORD_TO_PDF = 'word-to-pdf',
    MERGE_PDF = 'merge-pdf',
    SPLIT_PDF = 'split-pdf',
    COMPRESS_PDF = 'compress-pdf',
    EXTRACT_TEXT = 'extract-text',
    AI_SUMMARY_PDF = 'ai-summary-pdf',

    // Image Tools
    IMAGE_TO_PDF = 'image-to-pdf',
    OCR_IMAGE = 'ocr-image',
    FORMAT_CONVERSION = 'format-conversion',

    // Audio Tools
    AUDIO_TO_TEXT = 'audio-to-text',
    NOISE_REDUCTION = 'noise-reduction',

    // Smart Tools
    EXCEL_ANALYZER = 'excel-analyzer',

    // Generic Tools
    COMPRESS_FILES = 'compress-files',
}

export interface JobRecord {
    id: string; // UUID
    tool_type: ToolType;
    status: JobStatus;
    file_size: number;
    processing_time?: number; // In ms
    created_at: Date;
    completed_at?: Date;
    delete_at?: Date; // 1 hour after creation
    error_message?: string;
}

export interface CreateJobPayload {
    toolType: ToolType;
    fileSize: number;
    originalName: string;
}

export interface JobResponse {
    jobId: string;
    status: JobStatus;
    message?: string;
    downloadUrl?: string; // S3 pre-signed or local endpoint
    expiresAt: Date;
}
