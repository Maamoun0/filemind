'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { JobStatus, ToolType } from '@filemind/shared';
import { createOCRWorker, createPDFWorker } from '@/lib/workers/worker-client';
import { DoubleCheckBadge } from './DoubleCheckBadge';

interface FileUploaderProps {
    toolType: ToolType;
    maxSizeMB: number;
    acceptedMimeTypes: string;
    onSuccess?: (jobId: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    toolType,
    maxSizeMB,
    acceptedMimeTypes,
    onSuccess,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Upload mapping
    const [isUploading, setIsUploading] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // AI Double-Check review state
    const [reviewInfo, setReviewInfo] = useState<{
        verdict: string;
        confidence: number | null;
        reviewerNotes: string;
        revisionsApplied: number;
    } | null>(null);

    const validateAndSetFile = (selectedFile: File) => {
        setError(null);
        setJobId(null);
        setJobStatus(null);

        // Check file size limit
        if (selectedFile.size > maxSizeMB * 1024 * 1024) {
            setError(`File size exceeds maximum limit of ${maxSizeMB}MB.`);
            return;
        }

        setFile(selectedFile);
    };

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            validateAndSetFile(selectedFile);
        }
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(false);
    };

    const handleDrop = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        setIsHovering(false);

        const droppedFile = e.dataTransfer.files?.[0];
        if (droppedFile) {
            validateAndSetFile(droppedFile);
        }
    };

    const clearFile = () => {
        setFile(null);
        setError(null);
        setJobId(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);
        formData.append('toolType', toolType);

        try {
            // --- ARCHITECTURE UPDATE: Client-Side Processing Hook ---
            console.log(`[fileMind] Attempting browser-side processing for ${toolType}...`);

            let clientResult = null;

            if (toolType === ToolType.OCR_IMAGE) {
                const ocrWorker = createOCRWorker();
                try {
                    clientResult = await ocrWorker.processTask('PROCESS_OCR', { file });
                    console.log('[fileMind] Client-side OCR Success:', clientResult);
                    // In a real app, we would offer this result for download or display
                    // For now, if client-side is enough, we mark as completed
                } finally {
                    ocrWorker.terminate();
                }
            } else if (toolType === ToolType.PDF_TO_WORD) {
                // Example: Pre-analyze PDF in browser
                const pdfWorker = createPDFWorker();
                try {
                    const reader = new FileReader();
                    const arrayBuffer = await new Promise<ArrayBuffer>((res, rej) => {
                        reader.onload = () => res(reader.result as ArrayBuffer);
                        reader.onerror = rej;
                        reader.readAsArrayBuffer(file);
                    });

                    const analysis = await pdfWorker.processTask('PROCESS_PDF_METADATA', { arrayBuffer });
                    console.log('[fileMind] Client-side PDF Analysis:', analysis);
                } finally {
                    pdfWorker.terminate();
                }
            }

            // For now, even if client-side logic runs, we still proceed to backend 
            // unless we've fully implemented the specific tool's client logic.
            const clientSideHandled = false;

            if (clientSideHandled) {
                setJobStatus(JobStatus.COMPLETED);
                setIsUploading(false);
                return;
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tools/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to upload file');
            }

            setJobId(data.jobId);
            setJobStatus(data.status);
            if (onSuccess) onSuccess(data.jobId);

            // Start Polling process...
            pollJobStatus(data.jobId);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message || 'An unexpected error occurred during upload.');
            } else {
                setError('An unexpected error occurred during upload.');
            }
        } finally {
            setIsUploading(false);
        }
    };

    const pollJobStatus = async (id: string) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tools/status/${id}`);
                const data = await response.json();

                if (response.ok) {
                    setJobStatus(data.status);

                    // Capture AI Double-Check review info when available
                    if (data.reviewInfo) {
                        setReviewInfo(data.reviewInfo);
                    }

                    if (data.status === JobStatus.COMPLETED || data.status === JobStatus.FAILED) {
                        clearInterval(interval);
                        if (data.status === JobStatus.FAILED) {
                            setError(data.errorMessage || 'Job failed during processing.');
                        }
                    }
                } else {
                    clearInterval(interval);
                    setError('Lost track of job status.');
                }
            } catch {
                clearInterval(interval);
                setError('Failed to poll status.');
            }
        }, 1500); // Faster polling to catch REVIEWING phase
    };


    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            {!file && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-3xl p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-300
            ${isHovering ? 'border-primary-500 bg-primary-50 scale-[1.02]' : 'border-slate-300 bg-white hover:border-primary-400 hover:bg-slate-50'}`}
                >
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept={acceptedMimeTypes}
                        className="hidden"
                    />
                    <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
                        <UploadCloud size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Drag & Drop your file here</h3>
                    <p className="text-slate-500 mb-4 text-center text-sm max-w-sm">
                        Or click to browse from your device. Secure, fast, and completely private with <span className="text-indigo-600 font-bold">fileMind</span>.
                    </p>
                    <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full">
                        Max File Size: {maxSizeMB}MB
                    </div>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="shrink-0 mt-0.5" size={20} />
                    <div className="text-sm font-medium">{error}</div>
                </div>
            )}

            {file && (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm animate-fade-in mt-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center shrink-0">
                            <FileIcon size={24} />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-slate-800 truncate" title={file.name}>{file.name}</div>
                            <div className="text-sm text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
                        </div>

                        {/* Action Area based on status */}
                        <div className="shrink-0">
                            {!isUploading && !jobId && (
                                <button
                                    onClick={clearFile}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    aria-label="Remove file"
                                >
                                    <X size={20} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Processing Status Interface */}
                    {jobId && (
                        <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col gap-4">
                            {jobStatus === JobStatus.PENDING && (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Loader2 className="animate-spin text-primary-500" size={20} />
                                    <span className="font-medium">File uploading and queuing...</span>
                                </div>
                            )}
                            {jobStatus === JobStatus.PROCESSING && (
                                <div className="flex items-center gap-3 text-primary-600">
                                    <Loader2 className="animate-spin" size={20} />
                                    <span className="font-bold">Magic is happening! fileMind is processing your file...</span>
                                </div>
                            )}
                            {/* AI Double-Check Review Phase */}
                            {jobStatus === JobStatus.REVIEWING && (
                                <DoubleCheckBadge isReviewing={true} reviewInfo={null} />
                            )}
                            {jobStatus === JobStatus.COMPLETED && (
                                <div className="flex flex-col gap-3">
                                    {/* Show review result badge */}
                                    <DoubleCheckBadge isReviewing={false} reviewInfo={reviewInfo} />

                                    <div className="flex items-center gap-3 text-green-600 bg-green-50 p-3 rounded-lg border border-green-200">
                                        <CheckCircle size={20} />
                                        <span className="font-bold">Completed & Verified by AI Experts!</span>
                                    </div>
                                    <a
                                        href={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tools/download/${jobId}`}
                                        download
                                        className="btn-primary w-full py-3 mt-2 text-lg text-center inline-block"
                                    >
                                        Download Verified Result
                                    </a>
                                    <button onClick={clearFile} className="btn-secondary w-full py-2 text-sm mt-1">
                                        Process Another File
                                    </button>
                                </div>
                            )}
                        </div>
                    )}

                    {!isUploading && !jobId && (
                        <button
                            onClick={handleUpload}
                            className="btn-primary w-full mt-6 py-3 text-lg flex items-center justify-center gap-2"
                        >
                            Start Processing
                        </button>
                    )}

                    {isUploading && (
                        <button disabled className="btn-primary w-full mt-6 py-3 text-lg flex items-center justify-center gap-2 opacity-70 cursor-not-allowed">
                            <Loader2 className="animate-spin" size={20} />
                            Uploading...
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};
