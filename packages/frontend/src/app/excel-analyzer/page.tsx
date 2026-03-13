import type { Metadata } from 'next';
import Link from 'next/link';
import { ExcelAnalyzer } from '@/components/ExcelAnalyzer';

export const metadata: Metadata = {
    title: 'Smart Excel Analyzer | fileMind',
    description: 'Upload your Excel or CSV files and get instant analysis: duplicates, empty cells, column statistics, and data quality insights. Powered by pandas.',
    keywords: ['excel analyzer', 'csv analysis', 'duplicate detection', 'data quality', 'fileMind'],
};

export default function ExcelAnalyzerPage() {
    return (
        <div className="max-w-6xl mx-auto space-y-12 py-10 px-4">
            <section className="text-center space-y-4 animate-slide-up">
                <div className="inline-block px-3 py-1 rounded-full bg-violet-100 text-violet-700 text-xs font-bold uppercase tracking-widest mb-2">
                    Powered by pandas
                </div>
                <h1 className="text-3xl md:text-6xl font-extrabold text-slate-900 tracking-tight font-outfit">
                    Smart <span className="text-violet-600">Excel</span> Analyzer
                </h1>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
                    Upload any Excel (.xlsx) or CSV file and get <span className="font-semibold text-slate-900">instant insights</span>. Detect duplicates, empty cells, and get per-column statistics securely in the cloud.
                </p>
            </section>

            <section className="animate-fade-in relative">
                {/* Decorative elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-violet-200/20 rounded-full blur-3xl -z-10" />
                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-200/20 rounded-full blur-3xl -z-10" />
                
                <ExcelAnalyzer />
            </section>

            <div className="text-center pt-8">
                <Link href="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-medium transition-colors">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to fileMind Dashboard
                </Link>
            </div>
        </div>
    );
}
