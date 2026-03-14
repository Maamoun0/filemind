import type { Metadata } from 'next';
import { FileUploader } from '@/components/FileUploader';
import { ToolType } from '@filemind/shared';

export const metadata: Metadata = {
    title: 'Compress PDF Online - High Fidelity & Secure | fileMind',
    description: 'Reduce PDF file size without losing quality. Our smart compression engine optimizes your documents for easy email sharing.',
    keywords: 'compress pdf, reduce pdf size, pdf optimizer, secure pdf compressor, fileMind',
};

export default function CompressPdfPage() {
    return (
        <div className="max-w-4xl mx-auto pb-16">
            <header className="text-center space-y-4 py-12 animate-slide-up">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-teal-50 text-teal-700 font-semibold text-sm mb-4 border border-teal-100">
                    Browser-Side Processing
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Compress <span className="text-teal-600">PDF</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                    Reduce file size significantly while maintaining readable quality. Perfectly optimized for email attachments.
                </p>
            </header>

            <div className="animate-fade-in">
                <FileUploader
                    toolType={ToolType.COMPRESS_PDF}
                    maxSizeMB={100}
                    acceptedMimeTypes="application/pdf"
                />
            </div>

            <section className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-8">
                    <h3 className="font-bold text-xl mb-4 text-slate-900">How it works</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Our compression engine removes redundant metadata, linearizes the document for web viewing, and optimizes internal object streams. No data is lost, just unnecessary weight.
                    </p>
                </div>
                <div className="glass-card p-8">
                    <h3 className="font-bold text-xl mb-4 text-slate-900">Why choose fileMind?</h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                        Unlike other tools, your file never leaves your device for compression. We use high-performance WASM processing directly in your browser, ensuring absolute privacy.
                    </p>
                </div>
            </section>
        </div>
    );
}
