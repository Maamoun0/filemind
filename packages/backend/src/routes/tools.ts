import { Router } from 'express';
import { fileUploadMiddleware } from '../middlewares/upload';
import { handleFileUpload } from '../controllers/upload';
import { checkJobStatus } from '../controllers/status';
import { downloadResult } from '../controllers/download';

const router = Router();

// Route for file upload explicitly using Multer single file handler
router.post('/upload', fileUploadMiddleware.single('file'), handleFileUpload);

// Route for polling job status
router.get('/status/:jobId', checkJobStatus);

// Route to securely download output file
router.get('/download/:jobId', downloadResult);

export default router;
