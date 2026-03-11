import * as Tesseract from 'tesseract.js';

self.onmessage = async (e: MessageEvent) => {
    const { type, data } = e.data;

    if (type === 'PROCESS_OCR') {
        try {
            const { file } = data; // File object or Blob

            console.log('[Worker-OCR] Starting client-side OCR analysis with Tesseract.js...');

            const result = await Tesseract.recognize(
                file,
                'eng',
                { logger: m => console.log(m) }
            );

            self.postMessage({
                status: 'SUCCESS',
                result: result.data.text
            });
        } catch (error: any) {
            console.error('[Worker-OCR] Error:', error);
            self.postMessage({ status: 'ERROR', message: error.message });
        }
    }
};
