import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Terms of Service | fileMind',
    description: 'Terms and conditions for using the fileMind file processing platform.',
};

export default function TermsPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 py-10">
            <section className="animate-slide-up">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Terms of <span className="text-indigo-600">Service</span>
                </h1>
                <p className="text-slate-500 text-sm">Last updated: February 2026</p>
            </section>

            <article className="prose prose-slate max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-slate-900">1. Acceptance of Terms</h2>
                    <p className="text-slate-600">By using fileMind, you agree to these Terms of Service. If you do not agree, please do not use our platform.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">2. Service Description</h2>
                    <p className="text-slate-600">fileMind provides free, privacy-focused file processing utilities including PDF conversion, image OCR, spreadsheet analysis, and audio tools. Services are provided &quot;as-is&quot; without warranty.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">3. Acceptable Use</h2>
                    <p className="text-slate-600">You agree not to upload illegal, malicious, or harmful content. You are responsible for ensuring you have the rights to process any files you upload.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">4. File Handling</h2>
                    <p className="text-slate-600">All files are automatically deleted within 1 hour of upload. fileMind is not responsible for data loss — please keep local copies of your original files.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">5. Rate Limits</h2>
                    <p className="text-slate-600">To ensure fair access, usage is rate-limited. Abuse of the platform may result in temporary access restrictions.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">6. Contact</h2>
                    <p className="text-slate-600">For questions about these terms, contact us at <strong>legal@filemind.click</strong>.</p>
                </section>
            </article>

            <div className="pt-4">
                <Link href="/" className="btn-secondary inline-flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Home
                </Link>
            </div>
        </div>
    );
}
