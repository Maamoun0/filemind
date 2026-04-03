import { z } from 'zod';
import { ToolType } from '../types';

// Constants for Strict Limits (Security & Privacy rules)
// These apply per file upload based on tool category.
export const MAX_FILE_SIZES = {
    [ToolType.PDF_TO_WORD]: 100 * 1024 * 1024, // 100MB
    [ToolType.OCR_PDF_TO_WORD]: 100 * 1024 * 1024, // 100MB
    [ToolType.COMPRESS_PDF]: 150 * 1024 * 1024, // 150MB
    [ToolType.AI_SUMMARY_PDF]: 50 * 1024 * 1024, // 50MB
    [ToolType.OCR_IMAGE]: 25 * 1024 * 1024, // 25MB
    [ToolType.AUDIO_TO_TEXT]: 100 * 1024 * 1024, // 100MB
    [ToolType.EXCEL_ANALYZER]: 100 * 1024 * 1024, // 100MB
    [ToolType.COMPRESS_FILES]: 150 * 1024 * 1024, // 150MB
    [ToolType.DOCUMENT_TRANSLATION]: 100 * 1024 * 1024, // 100MB
} as const;

// Default limit if tool is not mapped individually
export const DEFAULT_MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

export const CreateJobSchema = z.object({
    toolType: z.nativeEnum(ToolType, {
        required_error: 'Tool type is required',
        invalid_type_error: 'Invalid or unsupported tool type',
    }),
    fileSize: z
        .number()
        .positive('File size must be a positive number')
        .max(150 * 1024 * 1024, 'Absolute maximum file size exceeded (150MB)'), // Hard ceiling for server stability
    originalName: z
        .string()
        .min(1, 'File name is required')
        .max(255, 'File name is too long'),
    // Add other metrics that scale for processing queue...
});

export const UsageStatsSchema = z.object({
    toolType: z.nativeEnum(ToolType),
    ipHash: z.string().length(64, 'IP Hash must be a valid SHA-256 hash'), // SHA-256 hash length is 64 hex chars
    country: z.string().length(2).optional(), // 2 letter ISO country code
});
