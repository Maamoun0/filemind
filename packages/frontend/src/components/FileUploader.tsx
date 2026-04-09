'use client';

import React, { useState, useRef, ChangeEvent, DragEvent } from 'react';
import { UploadCloud, File as FileIcon, X, CheckCircle, AlertCircle, Loader2, ScanSearch, FileText } from 'lucide-react';
import { JobStatus, ToolType } from '@filemind/shared';
import { createOCRWorker, createPDFWorker } from '@/lib/workers/worker-client';
import { DoubleCheckBadge } from './DoubleCheckBadge';
import { useUsageLimit } from '@/providers/UsageProvider';
import LimitReachedModal from './modals/LimitReachedModal';
import ShareModal from './share/ShareModal';
import { Share2 } from 'lucide-react';

interface FileUploaderProps {
    toolType: ToolType;
    alternateToolType?: ToolType;
    maxSizeMB: number;
    acceptedMimeTypes: string;
    extraFields?: Record<string, string>;
    onSuccess?: (jobId: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    toolType,
    alternateToolType,
    maxSizeMB,
    acceptedMimeTypes,
    extraFields,
    onSuccess,
}) => {
    // Mode selector state (only active when alternateToolType is provided)
    const [activeMode, setActiveMode] = useState<'standard' | 'ocr'>('standard');
    const effectiveToolType = activeMode === 'ocr' && alternateToolType ? alternateToolType : toolType;
    const [file, setFile] = useState<File | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Upload mapping
    const [isUploading, setIsUploading] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { isLimitReached, refreshUsage, usageCount, dailyLimit } = useUsageLimit();
    const [showLimitModal, setShowLimitModal] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);

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

        if (isLimitReached) {
            setShowLimitModal(true);
            return;
        }

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

    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

    // Normalize status from backend (UPPERCASE) to frontend enum (lowercase)
    const normalizeStatus = (status: string): string => {
        return status.toLowerCase();
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            // Direct upload to backend server
            const formData = new FormData();
            formData.append('file', file);
            formData.append('toolType', effectiveToolType);

            const response = await fetch(`${API_URL}/api/tools/upload`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.detail || 'Failed to upload file');

            const finalJobId = data.job_id || data.jobId;
            setJobId(finalJobId);
            setJobStatus(normalizeStatus(data.status) as JobStatus);
            if (onSuccess && finalJobId) onSuccess(finalJobId);

            // Start polling for completion
            if (finalJobId) {
                pollJobStatus(finalJobId);
            }

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const pollJobStatus = async (id: string) => {
        const interval = setInterval(async () => {
            try {
                const response = await fetch(`${API_URL}/api/tools/status/${id}`);
                const data = await response.json();

                if (response.ok) {
                    const normalized = normalizeStatus(data.status) as JobStatus;
                    setJobStatus(normalized);

                    if (data.reviewInfo) {
                        setReviewInfo(data.reviewInfo);
                    }

                    if (normalized === JobStatus.COMPLETED || normalized === JobStatus.FAILED) {
                        clearInterval(interval);
                        if (normalized === JobStatus.COMPLETED) {
                            refreshUsage(); // Sync limit count
                        }
                        if (normalized === JobStatus.FAILED) {
                            setError(data.errorMessage || data.error || 'Job failed during processing.');
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
        }, 2000);
    };

    const handleDownload = async (id: string, fileName: string) => {
        console.log(`[fileMind-UI] Starting download for job: ${id}, original: ${fileName}`);
        setIsDownloading(true);
        setError(null);
        
        try {
            // Use Next.js API proxy route to avoid CORS issues with binary blob downloads
            // The proxy at /api/tools/download/[jobId] fetches server-to-server from Railway backend
            const proxyUrl = `/api/tools/download/${id}`;
            console.log(`[fileMind-UI] Fetching via proxy: ${proxyUrl}`);
            
            const response = await fetch(proxyUrl, {
                method: 'GET',
            });
            
            if (!response.ok) {
                let errorMessage = `Server error (${response.status})`;
                try {
                    const errorText = await response.text();
                    try {
                        const errorData = JSON.parse(errorText);
                        errorMessage = errorData.detail || errorMessage;
                    } catch {
                        errorMessage = errorText || errorMessage;
                    }
                } catch {
                    // Fail silently and use default errorMessage
                }
                console.error('[fileMind-UI] Download failed:', response.status, errorMessage);
                throw new Error(errorMessage);
            }
            
            const blob = await response.blob();
            if (blob.size === 0) {
                console.error('[fileMind-UI] Error: Received empty blob');
                throw new Error('Received an empty file from server. The file might have expired.');
            }
            
            console.log(`[fileMind-UI] Received blob of size: ${blob.size} bytes. Type: ${blob.type}`);
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            const disposition = response.headers.get('content-disposition');
            console.log('[fileMind-UI] Raw Content-Disposition header:', disposition);
            
            let outFileName = `fileMind_${fileName.replace(/\.[^.]+$/, '')}.bin`;
            
            if (disposition) {
                // Support both standard and RFC 5987 (UTF-8) filenames (case-insensitive)
                const utf8Match = disposition.match(/filename\*=utf-8''([^;\n]*)/i);
                if (utf8Match && utf8Match[1]) {
                    console.log('[fileMind-UI] Found UTF-8 encoded filename');
                    outFileName = decodeURIComponent(utf8Match[1].trim());
                } else {
                    const standardMatch = disposition.match(/filename="?([^";\n]*)"?/);
                    if (standardMatch && standardMatch[1]) {
                        console.log('[fileMind-UI] Found standard filename');
                        outFileName = standardMatch[1].trim();
                    }
                }
            } else {
                console.warn('[fileMind-UI] Content-Disposition header not found or not exposed. Running fallback logic.');
                const stem = fileName.replace(/\.[^.]+$/, '');
                if (effectiveToolType === ToolType.PDF_TO_WORD || effectiveToolType === ToolType.OCR_PDF_TO_WORD) outFileName = `fileMind_${stem}.docx`;
                else if (effectiveToolType === ToolType.COMPRESS_FILES) outFileName = `fileMind_${stem}.zip`;
                else if (effectiveToolType === ToolType.OCR_IMAGE) outFileName = `fileMind_${stem}.txt`;
            }

            console.log(`[fileMind-UI] Initiating browser download for: ${outFileName}`);
            a.download = outFileName;
            
            document.body.appendChild(a);
            a.click();
            
            // Allow time for browser to register the blob URL before revocation
            setTimeout(() => {
                window.URL.revokeObjectURL(url);
                document.body.removeChild(a);
                setIsDownloading(false);
                console.log('[fileMind-UI] Cleanup complete, download handles passed to browser.');
            }, 1000);

        } catch (err: any) {
            console.error('[fileMind-UI] Download process error:', err);
            setError(err.message || 'The download failed. Your session might have expired or the server is busy.');
            setIsDownloading(false);
        }
    };


    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
            {/* Mode Selector Tabs — only shown when alternateToolType is provided */}
            {alternateToolType && (
                <div className="mb-6 animate-fade-in">
                    <div className="flex rounded-2xl bg-slate-100/80 p-1.5 border border-slate-200/60 shadow-sm backdrop-blur-sm">
                        <button
                            onClick={() => setActiveMode('standard')}
                            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeMode === 'standard'
                                    ? 'bg-white text-indigo-700 shadow-md shadow-indigo-100/50 ring-1 ring-indigo-100'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
                            }`}
                        >
                            <FileText size={18} className={activeMode === 'standard' ? 'text-indigo-500' : ''} />
                            Standard PDF
                        </button>
                        <button
                            onClick={() => setActiveMode('ocr')}
                            className={`flex-1 flex items-center justify-center gap-2.5 py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                                activeMode === 'ocr'
                                    ? 'bg-white text-violet-700 shadow-md shadow-violet-100/50 ring-1 ring-violet-100'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-white/40'
                            }`}
                        >
                            <ScanSearch size={18} className={activeMode === 'ocr' ? 'text-violet-500' : ''} />
                            OCR Scanner
                        </button>
                    </div>
                    <p className="text-xs text-center text-slate-500 mt-2.5 leading-relaxed">
                        {activeMode === 'standard'
                            ? '📄 Best for digital PDFs — preserves formatting, tables, and fonts.'
                            : '🔍 Best for scanned books & printed documents — extracts text using AI OCR.'}
                    </p>
                </div>
            )}

            {!file && (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`relative glass-card p-12 flex flex-col items-center justify-center cursor-pointer transition-all duration-500 group overflow-hidden
            ${isHovering ? 'border-primary-500 scale-[1.03] ring-4 ring-primary-500/10' : 'hover:border-primary-400'}`}
                >
                    {/* Animated background glow on hover */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                    
                    <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept={acceptedMimeTypes}
                        className="hidden"
                    />
                    <div className="relative w-20 h-20 bg-indigo-50 text-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500">
                        <UploadCloud size={36} />
                        {/* Pulse effect */}
                        <div className="absolute inset-0 rounded-3xl bg-indigo-400/20 animate-ping group-hover:block hidden" />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Drag & Drop your file</h3>
                    <p className="text-slate-500 mb-6 text-center text-sm max-w-sm leading-relaxed">
                        Or click to browse from your device. <br />
                        Secure, fast, and completely private with <span className="text-indigo-600 font-bold">fileMind</span>.
                    </p>
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] bg-slate-100/50 backdrop-blur-sm px-4 py-1.5 rounded-full border border-slate-200/50 group-hover:bg-indigo-50 group-hover:text-indigo-600 group-hover:border-indigo-100 transition-colors">
                        Max Capacity: {maxSizeMB}MB
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
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleDownload(jobId, file.name)}
                                            disabled={isDownloading}
                                            className="btn-primary flex-1 py-3 mt-2 text-lg text-center flex items-center justify-center gap-2"
                                        >
                                            {isDownloading ? (
                                                <>
                                                    <Loader2 className="animate-spin" size={20} />
                                                    Preparing...
                                                </>
                                            ) : (
                                                'تحميل النتيجة ✅'
                                            )}
                                        </button>
                                        <button 
                                            onClick={() => setShowShareModal(true)}
                                            className="mt-2 p-3 px-6 rounded-2xl bg-indigo-50 text-indigo-600 font-bold hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2"
                                        >
                                            <Share2 size={20} />
                                            شارك
                                        </button>
                                    </div>
                                    <button onClick={clearFile} disabled={isDownloading} className="btn-secondary w-full py-2 text-sm mt-1">
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

            <div className="mt-4 text-center">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Daily Limit: {usageCount}/{dailyLimit} Operations
                </span>
            </div>

            {showLimitModal && <LimitReachedModal onClose={() => setShowLimitModal(false)} />}
            {showShareModal && <ShareModal onClose={() => setShowShareModal(false)} url={window.location.href} />}
        </div>
    );
};
