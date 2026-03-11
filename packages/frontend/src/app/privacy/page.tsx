import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'Privacy Policy | fileMind',
    description: 'Learn how fileMind protects your privacy. Zero permanent storage, no accounts, no tracking.',
};

export default function PrivacyPage() {
    return (
        <div className="max-w-3xl mx-auto space-y-8 py-10">
            <section className="animate-slide-up">
                <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Privacy <span className="text-indigo-600">Policy</span>
                </h1>
                <p className="text-slate-500 text-sm">Last updated: February 2026</p>
            </section>

            <article className="prose prose-slate max-w-none space-y-6">
                <section>
                    <h2 className="text-xl font-bold text-slate-900">1. Zero Permanent Storage</h2>
                    <p className="text-slate-600">fileMind is built on a strict Zero Permanent Storage architecture. All uploaded files and processed outputs are <strong>automatically deleted within 1 hour</strong> of upload. We do not retain, archive, or back up any user documents.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">2. No User Accounts</h2>
                    <p className="text-slate-600">fileMind does not require user registration or login. We do not collect email addresses, names, or personal identifiers. Your usage is completely anonymous.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">3. Data Processing</h2>
                    <p className="text-slate-600">When you upload a file, it is processed either in your browser (using Web Workers) or temporarily on our secure servers. Server-side files exist only during active processing and the 1-hour cleanup window.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">4. Analytics & IP Logging</h2>
                    <p className="text-slate-600">For rate-limiting and abuse prevention, we may temporarily log anonymized (SHA-256 hashed) IP addresses. We do not use third-party tracking or advertising scripts.</p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-slate-900">5. Contact</h2>
                    <p className="text-slate-600">If you have questions about this policy, please contact us at <strong>privacy@filemind.click</strong>.</p>
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
