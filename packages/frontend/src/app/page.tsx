import Link from 'next/link';

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto space-y-24 py-16">

      {/* Hero Section */}
      <section className="relative text-center space-y-8 animate-slide-up">
        {/* Decorative background glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] -z-10" />

        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-semibold mb-4 animate-fade-in shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Next Generation File Hub
        </div>

        <h1 className="text-5xl md:text-7xl font-extrabold hero-gradient tracking-tight leading-[1.1] font-outfit">
          Smart, Secure, &amp; Fast <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 animate-gradient-x">
            Utility Platform.
          </span>
        </h1>

        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          The ultimate suite for PDF conversions, Image processing, and Smart Spreadsheets. <br className="hidden md:block" />
          Built on a <span className="text-indigo-600 font-semibold underline decoration-indigo-200 underline-offset-4">Zero Permanent Storage</span> foundation.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-6 pt-8">
          <Link href="#tools" className="btn-primary text-lg px-10 py-4 shadow-xl shadow-indigo-200 hover:shadow-indigo-300 transform transition">
            Explore All Tools
            <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
          </Link>
          <Link href="/how-it-works" className="btn-secondary text-lg px-10 py-4 flex items-center justify-center gap-2">
            See how it works
          </Link>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap justify-center gap-4 pt-12 opacity-80">
          <div className="flex items-center gap-2 bg-white/50 border border-slate-100 px-4 py-2 rounded-2xl text-slate-600 text-sm font-medium backdrop-blur-sm">
            <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            1-Hour Self Destroy
          </div>
          <div className="flex items-center gap-2 bg-white/50 border border-slate-100 px-4 py-2 rounded-2xl text-slate-600 text-sm font-medium backdrop-blur-sm">
            <svg className="w-5 h-5 text-indigo-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
            AI Verified Results
          </div>
        </div>
      </section>

      {/* Tool Categories Grid */}
      <section id="tools" className="space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-bold font-outfit text-slate-900">Popular Services</h2>
          <p className="text-slate-500">Pick a tool and get started in seconds</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* PDF to Word */}
          <Link href="/pdf-to-word" className="glass-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150" />
            <div className="w-14 h-14 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900 font-outfit">PDF to Word</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Convert your documents with extreme precision. We preserve your layout using AI-enhanced formatting.</p>
            <div className="mt-6 flex items-center text-indigo-600 font-semibold text-sm gap-1 group-hover:translate-x-2 transition-transform">
              Launch Tool <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

          {/* Smart Excel Analyzer */}
          <Link href="/excel-analyzer" className="glass-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-violet-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150" />
            <div className="w-14 h-14 bg-violet-50 rounded-2xl flex items-center justify-center text-violet-600 mb-6 group-hover:bg-violet-600 group-hover:text-white transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900 font-outfit">Smart Excel Analyzer</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Instantly clean your spreadsheets. Detect duplicates and hidden errors with one click.</p>
            <div className="mt-6 flex items-center text-violet-600 font-semibold text-sm gap-1 group-hover:translate-x-2 transition-transform">
              Launch Tool <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

          {/* Image OCR */}
          <Link href="/ocr-image" className="glass-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150" />
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900 font-outfit">Image OCR</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Extract text from images accurately. Pro-level support for Arabic and multi-language scripts.</p>
            <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm gap-1 group-hover:translate-x-2 transition-transform">
              Launch Tool <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

          {/* Audio Tools */}
          <Link href="/audio-tools" className="glass-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150" />
            <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-6 group-hover:bg-orange-600 group-hover:text-white transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900 font-outfit">Audio Tools</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Transcribe audio into text seamlessly. Perfect for WhatsApp notes, interviews, and logs.</p>
            <div className="mt-6 flex items-center text-orange-600 font-semibold text-sm gap-1 group-hover:translate-x-2 transition-transform">
              Launch Tool <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

          {/* PDF Utilities */}
          <Link href="/pdf-utilities" className="glass-card group relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150" />
            <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center text-red-600 mb-6 group-hover:bg-red-600 group-hover:text-white transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" /></svg>
            </div>
            <h3 className="font-bold text-xl mb-3 text-slate-900 font-outfit">PDF Utilities</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Merge, split, and compress your PDF files without compromising quality. All on-device.</p>
            <div className="mt-6 flex items-center text-red-600 font-semibold text-sm gap-1 group-hover:translate-x-2 transition-transform">
              Launch Tool <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>

          {/* Universal Compressor */}
          <Link href="/compress-files" className="glass-card group relative overflow-hidden ring-2 ring-blue-500/20">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-8 -mt-8 transition-all group-hover:scale-150" />
            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-6 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
            </div>
            <div className="inline-block px-2 py-0.5 rounded-lg bg-blue-100 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-2">New Tool</div>
            <h3 className="font-bold text-xl mb-3 text-slate-900 font-outfit">Smart Compressor</h3>
            <p className="text-slate-600 text-sm leading-relaxed">Reduce any file size by up to 80% with our smart high-density ZIP compression engine.</p>
            <div className="mt-6 flex items-center text-blue-600 font-semibold text-sm gap-1 group-hover:translate-x-2 transition-transform">
              Launch Tool <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
            </div>
          </Link>
        </div>
      </section>
    </div>
  );
}
