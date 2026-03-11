'use client';

import React, { useEffect, useState } from 'react';

/**
 * DoubleCheckBadge — Premium animated component showing
 * "Two AI experts are reviewing your result..."
 * 
 * Visual features:
 * - Two animated expert avatars with pulsing borders
 * - A connecting "debate" line between them
 * - Rotating status messages
 * - Glassmorphism card design
 * - Smooth progress indication
 */

interface DoubleCheckBadgeProps {
    isReviewing: boolean;
    reviewInfo?: {
        verdict: string;
        confidence: number | null;
        reviewerNotes: string;
        revisionsApplied: number;
    } | null;
}

const REVIEW_MESSAGES = [
    'AI Expert A is analyzing output quality...',
    'AI Expert B is cross-verifying results...',
    'Comparing analysis from both experts...',
    'Running accuracy validation checks...',
    'Debate complete, finalizing verdict...',
];

const REVIEW_MESSAGES_AR = [
    'الخبير الأول يحلل جودة المخرجات...',
    'الخبير الثاني يتحقق من النتائج...',
    'مقارنة التحليلات من كلا الخبيرين...',
    'إجراء فحوصات دقة التحقق...',
    'اكتمل التدقيق، جارٍ تحديد النتيجة...',
];

export const DoubleCheckBadge: React.FC<DoubleCheckBadgeProps> = ({
    isReviewing,
    reviewInfo,
}) => {
    const [messageIndex, setMessageIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        if (!isReviewing) return;

        // Rotate messages every 2.5 seconds
        const messageTimer = setInterval(() => {
            setMessageIndex((prev) => (prev + 1) % REVIEW_MESSAGES.length);
        }, 2500);

        // Animate progress
        const progressTimer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 95) return prev;
                return prev + Math.random() * 8;
            });
        }, 500);

        return () => {
            clearInterval(messageTimer);
            clearInterval(progressTimer);
        };
    }, [isReviewing]);

    // Reset progress when review completes
    useEffect(() => {
        if (!isReviewing && reviewInfo) {
            setProgress(100);
        }
    }, [isReviewing, reviewInfo]);

    if (!isReviewing && !reviewInfo) return null;

    const isComplete = !isReviewing && reviewInfo;
    const verdictColor = reviewInfo?.verdict === 'approved'
        ? 'text-emerald-600'
        : reviewInfo?.verdict === 'needs_revision'
            ? 'text-amber-600'
            : 'text-red-500';
    const verdictBg = reviewInfo?.verdict === 'approved'
        ? 'bg-emerald-50 border-emerald-200'
        : reviewInfo?.verdict === 'needs_revision'
            ? 'bg-amber-50 border-amber-200'
            : 'bg-red-50 border-red-200';

    return (
        <div className={`mt-4 rounded-2xl border p-5 transition-all duration-500 ${isComplete
            ? verdictBg
            : 'bg-gradient-to-br from-indigo-50/80 via-violet-50/60 to-purple-50/80 border-indigo-200/60 backdrop-blur-sm'
            }`}>
            {/* Header Row */}
            <div className="flex items-center gap-3 mb-4">
                {/* AI Expert Avatars */}
                <div className="flex items-center -space-x-3">
                    {/* Expert A */}
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                        ${isReviewing
                            ? 'bg-gradient-to-br from-indigo-500 to-indigo-700 text-white ring-2 ring-indigo-300 animate-pulse'
                            : 'bg-indigo-600 text-white ring-2 ring-indigo-200'
                        }`}
                    >
                        A
                        {isReviewing && (
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping" />
                        )}
                    </div>

                    {/* Debate Connection */}
                    <div className={`w-6 h-0.5 z-10 ${isReviewing
                        ? 'bg-gradient-to-r from-indigo-400 to-violet-400 animate-pulse'
                        : 'bg-slate-300'
                        }`}
                    />

                    {/* Expert B */}
                    <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold
                        ${isReviewing
                            ? 'bg-gradient-to-br from-violet-500 to-purple-700 text-white ring-2 ring-violet-300 animate-pulse'
                            : 'bg-violet-600 text-white ring-2 ring-violet-200'
                        }`}
                    >
                        B
                        {isReviewing && (
                            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-ping" style={{ animationDelay: '0.5s' }} />
                        )}
                    </div>
                </div>

                {/* Status Text */}
                <div className="flex-1 min-w-0">
                    {isReviewing ? (
                        <div>
                            <h4 className="font-bold text-indigo-900 text-sm">
                                ⚡ جاري التدقيق من قبل خبيرين...
                            </h4>
                            <p className="text-xs text-indigo-600/80 font-medium truncate transition-all duration-300">
                                {REVIEW_MESSAGES[messageIndex]}
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h4 className={`font-bold text-sm ${verdictColor}`}>
                                {reviewInfo?.verdict === 'approved' && '✅ Verified by Two AI Experts'}
                                {reviewInfo?.verdict === 'needs_revision' && '⚠️ Review Complete — Minor Notes'}
                                {reviewInfo?.verdict === 'rejected' && '❌ Review Failed'}
                            </h4>
                            {reviewInfo?.confidence && (
                                <p className="text-xs text-slate-500 font-medium">
                                    Confidence: {(reviewInfo.confidence * 100).toFixed(0)}%
                                    {reviewInfo.revisionsApplied > 0 && ` • ${reviewInfo.revisionsApplied} revision(s) noted`}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* Shield Icon */}
                <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center
                    ${isReviewing
                        ? 'bg-indigo-100 text-indigo-600'
                        : reviewInfo?.verdict === 'approved'
                            ? 'bg-emerald-100 text-emerald-600'
                            : 'bg-amber-100 text-amber-600'
                    }`}
                >
                    {isReviewing ? (
                        <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    )}
                </div>
            </div>

            {/* Progress Bar (during review) */}
            {isReviewing && (
                <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500 rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${Math.min(progress, 95)}%` }}
                    />
                </div>
            )}

            {/* Review Notes (after completion) */}
            {isComplete && reviewInfo?.reviewerNotes && (
                <div className="mt-3 pt-3 border-t border-slate-200/60">
                    <p className="text-xs text-slate-600 leading-relaxed">
                        <span className="font-semibold text-slate-700">Expert Review: </span>
                        {reviewInfo.reviewerNotes}
                    </p>
                </div>
            )}
        </div>
    );
};
