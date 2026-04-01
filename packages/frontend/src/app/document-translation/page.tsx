'use client';

import React, { useState } from 'react';
import { FileUploader } from '@/components/FileUploader';
import { ToolType, MAX_FILE_SIZES } from '@filemind/shared';
import { ArrowLeftRight, Languages } from 'lucide-react';

export default function DocumentTranslationPage() {
    const docToolType = ToolType.DOCUMENT_TRANSLATION;
    const maxMb = MAX_FILE_SIZES[docToolType] / (1024 * 1024);
    
    // Direction: 'en-ar' means English to Arabic, 'ar-en' means Arabic to English
    const [direction, setDirection] = useState<'en-ar' | 'ar-en'>('en-ar');

    const toggleDirection = () => {
        setDirection((prev) => (prev === 'en-ar' ? 'ar-en' : 'en-ar'));
    };

    return (
        <div className="max-w-4xl mx-auto pb-16">
            <header className="text-center space-y-4 py-12 animate-slide-up">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-semibold text-sm mb-4 border border-primary-100 gap-2">
                    <Languages size={16} /> Highly Professional
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Document Translator
                </h1>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                    Translate your **Word, PDF, PowerPoint, or Excel** documents instantly while preserving layout and text direction (RTL/LTR) with <span className="text-indigo-600 font-bold">fileMind</span> AI.
                </p>
            </header>

            {/* Language Toggle Control */}
            <div className="max-w-2xl mx-auto mb-8 animate-fade-in flex justify-center">
                <div className="bg-white p-2 rounded-2xl shadow-sm border border-slate-200 inline-flex items-center gap-4">
                    <div className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${direction === 'en-ar' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}>
                        English
                    </div>
                    
                    <button 
                        onClick={toggleDirection}
                        className="p-3 bg-slate-50 hover:bg-indigo-600 hover:text-white text-slate-400 rounded-full transition-all duration-300 transform hover:scale-110 hover:rotate-180 drop-shadow-sm"
                        aria-label="Toggle language direction"
                    >
                        <ArrowLeftRight size={20} />
                    </button>
                    
                    <div className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${direction === 'ar-en' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-500'}`}>
                        Arabic (العربية)
                    </div>
                </div>
            </div>

            {/* Main interactive Uploader Tool */}
            <div className="animate-fade-in">
                <FileUploader
                    toolType={docToolType}
                    maxSizeMB={maxMb}
                    acceptedMimeTypes=".docx, .pptx, .xlsx, .pdf, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.presentationml.presentation, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/pdf"
                    extraFields={{ translationDirection: direction }}
                />
            </div>

            {/* SEO Optimized Content Section */}
            <section className="mt-24 space-y-12 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card p-6 border-transparent hover:border-indigo-100 transition-colors">
                        <h3 className="font-bold text-lg mb-2 text-slate-800">Preserves Layout Format</h3>
                        <p className="text-slate-600 text-sm">
                            Unlike regular translators, we keep your tables, fonts, colors, and margins exactly as they were in the original document. No more messy alignments.
                        </p>
                    </div>
                    <div className="card p-6 border-transparent hover:border-indigo-100 transition-colors">
                        <h3 className="font-bold text-lg mb-2 text-slate-800">Auto RTL/LTR Adjustments</h3>
                        <p className="text-slate-600 text-sm">
                            We automatically adjust the BiDirectional properties of your paragraphs. Translating to Arabic automatically flips the alignment and page direction mathematically.
                        </p>
                    </div>
                    <div className="card p-6 border-transparent hover:border-indigo-100 transition-colors">
                        <h3 className="font-bold text-lg mb-2 text-slate-800">Contextual Translation</h3>
                        <p className="text-slate-600 text-sm">
                            Driven by advanced LLMs that understand document context, giving you a highly professional translation rather than robotic word-for-word conversions.
                        </p>
                    </div>
                </div>

                {/* User FAQ */}
                <div className="pt-8 border-t border-slate-200 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-800 mb-2">What formats are supported?</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                We support Microsoft Word (.docx), PowerPoint (.pptx), Excel (.xlsx), and PDF files. Each format is handled by a specialized engine to ensure maximum layout retention.
                            </p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-800 mb-2">Will my sensitive documents be saved?</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">
                                Never! We enforce a strict Zero Permanent Storage framework. Your uploaded file and its translation are deleted entirely 1 hour after uploading.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
