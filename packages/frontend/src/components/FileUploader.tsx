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
    extraFields?: Record<string, string>;
    onSuccess?: (jobId: string) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
    toolType,
    maxSizeMB,
    acceptedMimeTypes,
    extraFields,
    onSuccess,
}) => {
    const [file, setFile] = useState<File | null>(null);
    const [isHovering, setIsHovering] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Upload mapping
    const [isUploading, setIsUploading] = useState(false);
    const [jobId, setJobId] = useState<string | null>(null);
    const [jobStatus, setJobStatus] = useState<JobStatus | null>(null);
    const [isDownloading, setIsDownloading] = useState(false);
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

        try {
            // 1. طلب رابط الرفع المباشر
            const urlResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tools/get-presigned-url?filename=${encodeURIComponent(file.name)}&tool_type=${toolType}`, {
                method: 'POST',
            });
            const { url, key } = await urlResponse.json();

            // 2. رفع الملف مباشرة إلى السحابة
            const uploadResponse = await fetch(url, {
                method: 'PUT',
                body: file,
                headers: { 'Content-Type': file.type },
            });

            if (!uploadResponse.ok) throw new Error('Failed to upload file to storage');

            // 3. إبلاغ الخلفية ببدء المعالجة
            const formData = new FormData();
            formData.append('key', key);
            formData.append('tool_type', toolType);
            formData.append('original_name', file.name);

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tools/start-s3-processing`, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to start processing');

            setJobId(data.job_id);
            setJobStatus(data.status);
            pollJobStatus(data.job_id);

        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Upload failed');
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

    const handleDownload = async (id: string, fileName: string) => {
        setIsDownloading(true);
        try {
            const downloadUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/tools/download/${id}`;
            const response = await fetch(downloadUrl);
            
            if (!response.ok) throw new Error('Download failed');
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            // Reconstruct a professional filename
            const extension = fileName.split('.').pop();
            const cleanName = fileName.split('.')[0].replace('fileMind_Translated_', '');
            a.download = `fileMind_Translated_${cleanName}.${extension}`;
            
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (err) {
            console.error('[fileMind] Download error:', err);
            setError('Failed to download the translated file. Please try again.');
        } finally {
            setIsDownloading(false);
        }
    };


    return (
        <div className="w-full max-w-2xl mx-auto mt-8">
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
                                    <button
                                        onClick={() => handleDownload(jobId, file.name)}
                                        disabled={isDownloading}
                                        className="btn-primary w-full py-3 mt-2 text-lg text-center flex items-center justify-center gap-2"
                                    >
                                        {isDownloading ? (
                                            <>
                                                <Loader2 className="animate-spin" size={20} />
                                                Preparing Download...
                                            </>
                                        ) : (
                                            'Download Verified Result'
                                        )}
                                    </button>
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
        </div>
    );
};
