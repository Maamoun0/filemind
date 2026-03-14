import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'PDF Utilities — Merge, Split & Compress | fileMind',
    description: 'Merge multiple PDFs, split large files, and compress documents for email. All processing happens in your browser using pdf-lib WASM.',
    keywords: ['merge pdf', 'split pdf', 'compress pdf', 'pdf tools', 'fileMind'],
};

export default function PdfUtilitiesPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10">
            <section className="text-center space-y-4 animate-slide-up">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    PDF <span className="text-indigo-600">Utilities</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Merge, split, and compress your PDF files — all processed entirely <span className="font-semibold text-indigo-600">in your browser</span> using pdf-lib. No server uploads needed for basic operations.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in">
                <Link href="/pdf-utilities/merge" className="card group text-center p-8 hover:border-red-500 transition-all">
                    <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-red-600 group-hover:text-white transition-all">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Merge PDF</h3>
                    <p className="text-slate-500 text-sm mb-4">Combine multiple PDF files into a single document.</p>
                    <span className="text-red-600 font-semibold text-xs flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                        Launch <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </span>
                </Link>

                <Link href="/pdf-utilities/split" className="card group text-center p-8 hover:border-amber-500 transition-all">
                    <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-amber-600 group-hover:text-white transition-all">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Split PDF</h3>
                    <p className="text-slate-500 text-sm mb-4">Extract specific pages or split large PDFs into smaller parts.</p>
                    <span className="text-amber-600 font-semibold text-xs flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                        Launch <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </span>
                </Link>

                <Link href="/pdf-utilities/compress" className="card group text-center p-8 hover:border-teal-500 transition-all">
                    <div className="w-14 h-14 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-600 group-hover:text-white transition-all">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Compress PDF</h3>
                    <p className="text-slate-500 text-sm mb-4">Reduce file size for easy sharing and email attachments.</p>
                    <span className="text-teal-600 font-semibold text-xs flex items-center justify-center gap-1 group-hover:translate-x-1 transition-transform">
                        Launch <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
                    </span>
                </Link>
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
