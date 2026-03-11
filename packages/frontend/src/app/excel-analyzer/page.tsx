import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Smart Excel Analyzer | fileMind',
    description: 'Upload your Excel or CSV files and get instant analysis: duplicates, empty cells, column statistics, and data quality insights. Powered by pandas.',
    keywords: ['excel analyzer', 'csv analysis', 'duplicate detection', 'data quality', 'fileMind'],
};

export default function ExcelAnalyzerPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10">
            <section className="text-center space-y-4 animate-slide-up">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Smart <span className="text-indigo-600">Excel</span> Analyzer
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Upload any Excel (.xlsx) or CSV file and get <span className="font-semibold text-indigo-600">instant analysis</span> powered by pandas. Detect duplicates, empty cells, and get per-column statistics.
                </p>
            </section>

            <section className="animate-fade-in">
                <div className="max-w-2xl mx-auto">
                    <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                        <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800 mb-2">Upload Excel or CSV</h3>
                        <p className="text-slate-500 mb-6 text-sm max-w-sm">
                            Drag & drop your spreadsheet or click to browse. Analysis happens server-side using pandas for maximum accuracy.
                        </p>
                        <span className="inline-block bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-semibold">
                            Full integration coming soon
                        </span>
                    </div>
                </div>
            </section>

            <div className="text-center pt-4">
                <Link href="/" className="btn-secondary inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
