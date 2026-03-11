import path from 'path';
import fs from 'fs';
import { createWorker } from 'tesseract.js';

/**
 * Backend OCR Processor using Tesseract.js (Node version)
 */
export const processOcrImage = async (jobId: string, filePath: string, originalName: string) => {
    console.log(`[fileMind-Worker] Starting OCR processing for Job: ${jobId}`);

    const outputDir = path.join(path.dirname(filePath), '..', '..', 'outputs', jobId);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    const worker = await createWorker('eng'); // Default to English for now

    try {
        const { data: { text } } = await worker.recognize(filePath);

        const outputPath = path.join(outputDir, 'result.txt');
        fs.writeFileSync(outputPath, text);

        console.log(`[fileMind-Worker] OCR result saved to ${outputPath}`);
    } finally {
        await worker.terminate();
    }
};
