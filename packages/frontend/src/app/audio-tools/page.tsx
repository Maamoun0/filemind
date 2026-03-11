import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Audio Tools — Transcription & Conversion | fileMind',
    description: 'Convert WhatsApp voice notes to text, transcribe interviews, and convert between audio formats (OGG, MP3, WAV, M4A). Privacy-first, zero storage.',
    keywords: ['audio to text', 'whatsapp audio', 'audio converter', 'transcription', 'fileMind'],
};

export default function AudioToolsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10">
            <section className="text-center space-y-4 animate-slide-up">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Audio <span className="text-indigo-600">Tools</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Transcribe voice recordings, convert WhatsApp audio, and change audio formats — all processed <span className="font-semibold text-indigo-600">in your browser</span> using FFmpeg WASM.
                </p>
            </section>

            <section className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
                <div className="card text-center p-8">
                    <div className="w-14 h-14 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Audio to Text</h3>
                    <p className="text-slate-500 text-sm mb-4">Convert voice recordings and WhatsApp audio messages to readable text.</p>
                    <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">Coming Soon</span>
                </div>

                <div className="card text-center p-8">
                    <div className="w-14 h-14 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                    </div>
                    <h3 className="font-bold text-lg text-slate-900 mb-2">Format Converter</h3>
                    <p className="text-slate-500 text-sm mb-4">Convert between OGG, MP3, WAV, and M4A formats directly in your browser.</p>
                    <span className="inline-block bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-semibold">Coming Soon</span>
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
