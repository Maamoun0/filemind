import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'How It Works | fileMind',
    description: 'Learn how fileMind processes your files securely with client-side Web Workers, a FastAPI backend with magic bytes validation, and a strict Zero Permanent Storage policy.',
};

export default function HowItWorksPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10">
            <section className="text-center space-y-4 animate-slide-up">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    How <span className="text-indigo-600">fileMind</span> Works
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    A three-step process designed for maximum privacy and speed.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-extrabold">1</div>
                    <h3 className="font-bold text-lg text-slate-900">Upload Your File</h3>
                    <p className="text-slate-500 text-sm">Select or drag & drop your file. We validate file types using <strong>magic bytes</strong> analysis — not just extensions — for maximum security.</p>
                </div>
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-violet-100 text-violet-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-extrabold">2</div>
                    <h3 className="font-bold text-lg text-slate-900">Browser-First Processing</h3>
                    <p className="text-slate-500 text-sm">Simple tasks (PDF merge, format conversion) run <strong>entirely in your browser</strong> using Web Workers and WASM. Complex tasks are securely sent to our server.</p>
                </div>
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center mx-auto text-2xl font-extrabold">3</div>
                    <h3 className="font-bold text-lg text-slate-900">Download & Auto-Delete</h3>
                    <p className="text-slate-500 text-sm">Download your result instantly. All server-side files are <strong>automatically deleted after 1 hour</strong>. We never store your documents.</p>
                </div>
            </section>

            <div className="text-center pt-6 space-y-4">
                <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full font-medium text-sm border border-green-200">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                    Zero Permanent Storage Architecture
                </div>
                <div className="block">
                    <Link href="/" className="btn-primary inline-flex items-center gap-2 text-lg px-8">
                        Start Using fileMind
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                    </Link>
                </div>
            </div>
        </div>
    );
}
