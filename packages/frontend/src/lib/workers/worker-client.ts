/**
 * fileMind WorkerManager — Unified interface for browser Web Workers
 * Provides factory methods for each tool domain (PDF, OCR, Audio).
 */
export type WorkerTaskResult = {
    status: 'SUCCESS' | 'ERROR' | 'PROGRESS';
    result?: any;
    message?: string;
};

export class WorkerManager {
    private worker: Worker | null = null;
    private onProgress?: (percent: number) => void;

    constructor(workerPath: string) {
        if (typeof window !== 'undefined') {
            try {
                this.worker = new Worker(new URL(workerPath, import.meta.url));
            } catch (err) {
                console.warn('[WorkerManager] Failed to initialize worker:', err);
            }
        }
    }

    /**
     * Set a callback for progress updates from the worker
     */
    setProgressCallback(callback: (percent: number) => void) {
        this.onProgress = callback;
        return this;
    }

    /**
     * Send a task to the worker and await the result.
     * Handles SUCCESS, ERROR, and PROGRESS messages.
     */
    async processTask(type: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            if (!this.worker) return reject(new Error('Workers not supported or failed to init'));

            this.worker.onmessage = (event: MessageEvent<WorkerTaskResult>) => {
                const { status, result, message } = event.data;

                if (status === 'SUCCESS') {
                    resolve(result);
                } else if (status === 'PROGRESS') {
                    if (this.onProgress && result?.progress !== undefined) {
                        this.onProgress(result.progress);
                    }
                    // Don't resolve/reject on progress — keep listening
                } else {
                    reject(new Error(message || 'Worker task failed'));
                }
            };

            this.worker.onerror = (error) => {
                console.error('[WorkerManager] Worker Error:', error);
                reject(new Error('Worker execution error'));
            };

            // Post the message with any Transferable objects
            this.worker.postMessage({ type, data });
        });
    }

    terminate() {
        this.worker?.terminate();
        this.worker = null;
    }
}

// ──────────────────────────────────────────────────────────────
// Factory Functions for each domain
// ──────────────────────────────────────────────────────────────

/** PDF operations: merge, split, compress, metadata */
export const createPDFWorker = () => new WorkerManager('./pdf-worker.ts');

/** OCR: extract text from images using Tesseract.js */
export const createOCRWorker = () => new WorkerManager('./ocr-worker.ts');

/** Audio: format conversion using FFmpeg WASM */
export const createAudioWorker = () => new WorkerManager('./audio-worker.ts');
