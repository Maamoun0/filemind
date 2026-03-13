import * as Tesseract from 'tesseract.js';

const ctx: Worker = self as any;

ctx.onmessage = async (e: MessageEvent) => {
    const { type, data } = e.data;

    if (type === 'PROCESS_OCR') {
        try {
            const { file } = data; // File object or Blob

            console.log('[Worker-OCR] Starting client-side OCR analysis with Tesseract.js...');

            const result = await Tesseract.recognize(
                file,
                'ara+eng', // Replaced 'eng' with 'ara+eng' for bilingual OCR
                { logger: m => console.log(m) }
            );

            ctx.postMessage({
                status: 'SUCCESS',
                result: result.data.text
            });
        } catch (error: any) {
            console.error('[Worker-OCR] Error:', error);
            ctx.postMessage({ status: 'ERROR', message: error.message });
        }
    }
};
