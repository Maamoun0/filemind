import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'fileMind | Smart & Secure File Processing',
  description: 'Fast, secure, and privacy-focused utility platform for PDF, Images, Audio, and Spreadsheets. Zero permanent storage.',
  applicationName: 'fileMind',
  keywords: ['file processing', 'PDF converter', 'secure tools', 'privacy-focused', 'fileMind'],
  openGraph: {
    title: 'fileMind | Smart File Processing',
    description: '100% Secure, Mobile-First Utility tools.',
    siteName: 'fileMind',
    url: 'https://filemind.click',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'fileMind | Smart File Processing',
    description: '100% Secure, Mobile-First Utility tools.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <body className="flex flex-col min-h-screen bg-[#fafbff] text-slate-900 antialiased">
        <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl tracking-tight">
              <span className="text-slate-900">file</span>
              <span className="text-indigo-600">Mind</span>
              <span className="text-indigo-600">.</span>
            </Link>
            <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-600">
              <Link href="/pdf-to-word" className="hover:text-primary-600 transition-colors">PDF Tools</Link>
              <Link href="/ocr-image" className="hover:text-primary-600 transition-colors">Image Utilities</Link>
              <Link href="/excel-analyzer" className="hover:text-primary-600 transition-colors">Smart Excel</Link>
              <Link href="/audio-tools" className="hover:text-primary-600 transition-colors">Audio Tools</Link>
            </nav>
            <button className="md:hidden p-2 text-slate-600">
              {/* Mobile menu icon placeholder */}
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" /></svg>
            </button>
          </div>
        </header>

        <main className="flex-1 container mx-auto px-4 py-8">
          {children}
        </main>

        <footer className="bg-slate-900 text-slate-400 py-12 text-sm mt-auto">
          <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-white font-semibold text-lg mb-4">
                <Link href="/">
                  <span>file</span><span className="text-indigo-400">Mind</span>
                </Link>
              </h4>
              <p>fileMind processes your files securely with a strict Zero Permanent Storage policy. Your files are automatically deleted after 1 hour. We do not store your documents.</p>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Tools</h5>
              <ul className="space-y-2">
                <li><Link href="/pdf-to-word" className="hover:text-white transition">PDF to Word</Link></li>
                <li><Link href="/excel-analyzer" className="hover:text-white transition">Smart Excel Analyzer</Link></li>
                <li><Link href="/audio-tools" className="hover:text-white transition">Audio to Text</Link></li>
                <li><Link href="/ocr-image" className="hover:text-white transition">Arabic OCR</Link></li>
                <li><Link href="/pdf-utilities" className="hover:text-white transition">Split & Merge PDF</Link></li>
              </ul>
            </div>
            <div>
              <h5 className="text-white font-semibold mb-4">Legal</h5>
              <ul className="space-y-2">
                <li><Link href="/privacy" className="hover:text-white transition">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white transition">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
          <div className="container mx-auto px-4 mt-8 pt-8 border-t border-slate-800 text-center">
            &copy; {new Date().getFullYear()} fileMind. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
