import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { DEFAULT_MAX_FILE_SIZE } from '@filemind/shared';

const TEMP_DIR = process.env.TEMP_DIR || path.join(process.cwd(), 'temp_uploads');

// Ensure base temp directory exists
const uploadsDir = path.join(TEMP_DIR, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Ensure outputs temp directory exists
const outputsDir = path.join(TEMP_DIR, 'outputs');
if (!fs.existsSync(outputsDir)) {
    fs.mkdirSync(outputsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Generate a secure unique ID for each job directory to ensure perfect isolation
        const reqJobId = uuidv4();
        req.body.jobId = reqJobId; // attach to request for the controller

        const jobUploadDir = path.join(uploadsDir, reqJobId);
        fs.mkdirSync(jobUploadDir, { recursive: true });

        cb(null, jobUploadDir);
    },
    filename: (req, file, cb) => {
        // Preserve original extension but sanitize filename to prevent path traversal
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `source${ext}`);
    },
});

export const fileUploadMiddleware = multer({
    storage,
    limits: {
        fileSize: DEFAULT_MAX_FILE_SIZE, // Overridden in specific controllers if needed
    },
});
