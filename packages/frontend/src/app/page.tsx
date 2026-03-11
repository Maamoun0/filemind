import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center space-y-12 py-10">

      {/* Hero Section */}
      <section className="space-y-6 animate-slide-up">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Smart, Secure, &amp; Fast <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">
            Utility Platform.
          </span>
        </h1>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto">
          The ultimate suite for PDF conversions, Image processing, and Smart Spreadsheets. <br className="hidden md:block" />
          Powered by a strict <strong>Zero Permanent Storage</strong> architecture.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
          <Link href="#tools" className="btn-primary flex items-center justify-center gap-2 text-lg px-8">
            Explore Tools
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          <Link href="/how-it-works" className="btn-secondary text-lg px-8">
            How it works
          </Link>
        </div>
      </section>

      {/* Trust & Security Badges */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full font-medium text-sm animate-fade-in border border-indigo-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm3.707 9.293a1 1 0 00-1.414-1.414L9 13.586 7.707 12.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          files auto-deleted after 1 hour. fileMind respects your privacy.
        </div>

        {/* AI Double-Check Trust Badge */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-violet-50 to-purple-50 text-violet-700 px-4 py-2 rounded-full font-medium text-sm animate-fade-in border border-violet-200">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
          AI Double-Check™ — Verified by two AI experts
        </div>
      </div>

      {/* Tool Categories Grid */}
      <section id="tools" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-10 text-left">

        {/* PDF to Word */}
        <Link href="/pdf-to-word" className="card hover:-translate-y-1 transition-transform cursor-pointer group h-full block">
          <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-900">PDF to Word</h3>
          <p className="text-slate-600 text-sm">Convert your PDF documents into editable Word formats instantly without losing layout quality.</p>
        </Link>

        {/* Smart Excel Analyzer */}
        <Link href="/excel-analyzer" className="card hover:-translate-y-1 transition-transform cursor-pointer group h-full block">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-900">Smart Excel Analyzer</h3>
          <p className="text-slate-600 text-sm">Detect duplicates, empty cells, and formula errors automatically, and generate summary insights.</p>
        </Link>

        {/* Image OCR */}
        <Link href="/ocr-image" className="card hover:-translate-y-1 transition-transform cursor-pointer group h-full block">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-900">Image OCR</h3>
          <p className="text-slate-600 text-sm">Extract text from images accurately with strong support for multiple languages including Arabic.</p>
        </Link>

        {/* Audio Tools */}
        <Link href="/audio-tools" className="card hover:-translate-y-1 transition-transform cursor-pointer group h-full block">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-orange-600 mb-4 group-hover:bg-orange-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-900">Audio Tools</h3>
          <p className="text-slate-600 text-sm">Convert WhatsApp audio to text, transcribe interviews, and convert between audio formats seamlessly.</p>
        </Link>

        {/* PDF Utilities — Coming Soon */}
        <Link href="/pdf-utilities" className="card hover:-translate-y-1 transition-transform cursor-pointer group h-full block opacity-60">
          <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4 group-hover:bg-red-600 group-hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
          </div>
          <h3 className="font-bold text-lg mb-2 text-slate-900">PDF Utilities</h3>
          <p className="text-slate-600 text-sm italic">Coming soon: Merge multiple PDFs, Split large files, and Compress for email.</p>
        </Link>
      </section>
    </div>
  );
}
