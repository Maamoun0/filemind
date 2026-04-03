import type { Metadata } from 'next';
import { FileUploader } from '@/components/FileUploader';
import { ToolType, MAX_FILE_SIZES } from '@filemind/shared';

// High SEO Metadata per page requirements
export const metadata: Metadata = {
    title: 'PDF to Word Converter Online - Free & Secure | fileMind',
    description: 'Convert PDF documents to editable Microsoft Word documents instantly with fileMind. 100% Secure, strictly private, files auto-deleted after 1 hour.',
    keywords: 'pdf to word, convert pdf, editable docx, secure pdf converter, zero storage pdf tool, fileMind pdf',
};

// SSG Generation
export default function PdfToWordPage() {
    const maxMb = MAX_FILE_SIZES[ToolType.PDF_TO_WORD] / (1024 * 1024);

    return (
        <div className="max-w-4xl mx-auto pb-16">
            <header className="text-center space-y-4 py-12 animate-slide-up">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 font-semibold text-sm mb-4 border border-primary-100">
                    Strictly Private
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    PDF & OCR to Word Converter
                </h1>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                    Convert digital PDFs or scanned documents to editable Word files flawlessly in seconds with <span className="text-indigo-600 font-bold">fileMind</span>, whilst maintaining superior security.
                </p>
            </header>

            {/* Main interactive Uploader Tool */}
            <div className="animate-fade-in">
                <FileUploader
                    toolType={ToolType.PDF_TO_WORD}
                    alternateToolType={ToolType.OCR_PDF_TO_WORD}
                    maxSizeMB={maxMb}
                    acceptedMimeTypes="application/pdf, .pdf"
                />
            </div>

            {/* SEO Optimized Content Section */}
            <section className="mt-24 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="card p-6">
                        <h3 className="font-bold text-lg mb-2 text-slate-800">100% Secure & Private</h3>
                        <p className="text-slate-600 text-sm">
                            We utilize fileMind&apos;s strict Zero Permanent Storage architecture. Your PDFs and generated Word files are automatically wiped after 1 hour. We don&apos;t read or store your content.
                        </p>
                    </div>
                    <div className="card p-6">
                        <h3 className="font-bold text-lg mb-2 text-slate-800">High Precision</h3>
                        <p className="text-slate-600 text-sm">
                            Maintains fonts, structured layouts, bullet points, and tables effectively. Enjoy a seamless transfer to an editable DOCX format.
                        </p>
                    </div>
                    <div className="card p-6">
                        <h3 className="font-bold text-lg mb-2 text-slate-800">Lightning Fast</h3>
                        <p className="text-slate-600 text-sm">
                            Powered by fileMind&apos;s specialized cloud worker queues, ensuring your conversion is prompt and reliable without tying up your device&apos;s resources.
                        </p>
                    </div>
                </div>

                {/* JSON-LD structure using Script tag for semantic SEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "FAQPage",
                            "mainEntity": [{
                                "@type": "Question",
                                "name": "Is this PDF to Word converter secure?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": "Yes. fileMind utilizes a Zero Permanent Storage policy. All uploaded PDFs and converted output files are permanently deleted automatically after precisely 1 hour. We process via secure isolated queues without ever reading your data manually."
                                }
                            }, {
                                "@type": "Question",
                                "name": "Are there any file limits?",
                                "acceptedAnswer": {
                                    "@type": "Answer",
                                    "text": `Yes, we support PDF sizes up to ${maxMb}MB to ensure highly responsive and efficient conversions without performance degradation.`
                                }
                            }]
                        }),
                    }}
                />

                {/* User FAQ */}
                <div className="pt-8 border-t border-slate-200 max-w-3xl mx-auto">
                    <h2 className="text-2xl font-bold mb-6 text-slate-900 text-center">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-800 mb-2">Is my data safe and private?</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">Absolutely! Security is our #1 objective. Standard free tools often cache data, but fileMind uses strict time-bound cron jobs preventing access, alongside memory-safe queues. Files vanish within an hour.</p>
                        </div>
                        <div className="bg-white p-5 rounded-xl border border-slate-100 shadow-sm">
                            <h4 className="font-bold text-slate-800 mb-2">Can I perform multiple conversions?</h4>
                            <p className="text-slate-600 text-sm leading-relaxed">Yes, you can utilize the tool completely free multiple times within reasonable strict rate-limits set by our backend API defenses protecting against abuse algorithms.</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
