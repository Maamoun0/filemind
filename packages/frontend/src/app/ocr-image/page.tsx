import type { Metadata } from 'next';
import { FileUploader } from '@/components/FileUploader';
import { ToolType } from '@filemind/shared';

export const metadata: Metadata = {
    title: 'Image OCR - Extract Text from Images Online | fileMind',
    description: 'Free, secure, and fast OCR tool. Extract text from images (JPG, PNG) accurately with support for multiple languages. 100% private, no file storage.',
    keywords: ['OCR', 'image to text', 'extract text from image', 'arabic ocr', 'secure ocr', 'fileMind'],
};

export default function OCRPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 py-10">
            {/* Page Header */}
            <section className="text-center space-y-4 animate-slide-up">
                <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Image <span className="text-indigo-600">OCR</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                    Turn your images into editable text instantly. Our tool processes your files <span className="font-semibold text-indigo-600">locally in your browser</span> and on our secure, temporary server.
                </p>
            </section>

            {/* Tool Component */}
            <section className="animate-fade-in">
                <FileUploader
                    toolType={ToolType.OCR_IMAGE}
                    maxSizeMB={10}
                    acceptedMimeTypes="image/jpeg,image/png,image/webp"
                />
            </section>

            {/* Information Section */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-10 border-t border-slate-100">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-slate-900">Why use fileMind OCR?</h2>
                    <ul className="space-y-3 text-slate-600">
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">✓</div>
                            <p><strong>Privacy First:</strong> Your images are never stored permanently. Our Zero Permanent Storage policy ensures deletion after 1 hour.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">✓</div>
                            <p><strong>Hybrid Processing:</strong> We use Web Workers to handle initial analysis in your browser, saving time and keeping your data local when possible.</p>
                        </li>
                        <li className="flex items-start gap-3">
                            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">✓</div>
                            <p><strong>High Accuracy:</strong> Powered by Tesseract.js and specialized backend engines for the best text extraction results.</p>
                        </li>
                    </ul>
                </div>
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                    <h3 className="text-xl font-bold text-slate-900 mb-4">Frequently Asked Questions</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-slate-800">Which formats are supported?</h4>
                            <p className="text-sm text-slate-600">We currently support JPG, PNG, and WebP images up to 10MB.</p>
                        </div>
                        <div>
                            <h4 className="font-semibold text-slate-800">Is my data safe?</h4>
                            <p className="text-sm text-slate-600">Absolutely. fileMind is built with security as a priority. No accounts, no logs, only smart processing.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* SEO Schema */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        '@context': 'https://schema.org',
                        '@type': 'WebApplication',
                        'name': 'fileMind Image OCR',
                        'url': 'https://filemind.click/ocr-image',
                        'description': 'Extract text from images accurately and securely with fileMind.',
                        'applicationCategory': 'UtilityApplication',
                        'operatingSystem': 'All',
                        'offers': {
                            '@type': 'Offer',
                            'price': '0',
                        },
                    }),
                }}
            />
        </div>
    );
}
