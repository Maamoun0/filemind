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

    constructor(worker: Worker | null) {
        this.worker = worker;
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
                } else {
                    reject(new Error(message || 'Worker task failed'));
                }
            };

            this.worker.onerror = (error) => {
                console.error('[WorkerManager] Worker Error:', error);
                reject(new Error('Worker execution error'));
            };

            this.worker.postMessage({ type, data });
        });
    }

    terminate() {
        this.worker?.terminate();
        this.worker = null;
    }
}

// ──────────────────────────────────────────────────────────────
// Factory Functions for each domain - Static analysis friendly
// ──────────────────────────────────────────────────────────────

/** PDF operations: merge, split, compress, metadata */
export const createPDFWorker = () => {
    if (typeof window === 'undefined') return new WorkerManager(null);
    try {
        const worker = new Worker(new URL('./pdf-worker.ts', import.meta.url));
        return new WorkerManager(worker);
    } catch (e) {
        console.error('Failed to create PDF worker:', e);
        return new WorkerManager(null);
    }
};

/** OCR: extract text from images using Tesseract.js */
export const createOCRWorker = () => {
    if (typeof window === 'undefined') return new WorkerManager(null);
    try {
        const worker = new Worker(new URL('./ocr-worker.ts', import.meta.url));
        return new WorkerManager(worker);
    } catch (e) {
        console.error('Failed to create OCR worker:', e);
        return new WorkerManager(null);
    }
};

/** Audio: format conversion using FFmpeg WASM */
export const createAudioWorker = () => {
    if (typeof window === 'undefined') return new WorkerManager(null);
    try {
        const worker = new Worker(new URL('./audio-worker.ts', import.meta.url));
        return new WorkerManager(worker);
    } catch (e) {
        console.error('Failed to create Audio worker:', e);
        return new WorkerManager(null);
    }
};
