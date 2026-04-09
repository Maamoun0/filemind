import React from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import fs from 'fs';
import path from 'path';
import { FileUploader } from '@/components/FileUploader';
import { ToolType, MAX_FILE_SIZES } from '@filemind/shared';
import SEOHead from '@/components/common/SEOHead';
import JsonLDSchema from '@/components/common/JsonLDSchema';
import Link from 'next/link';

interface ToolConfig {
  slug: string;
  title: string;
  description: string;
  h1: string;
  subheading: string;
  faqs: Array<{ question: string; answer: string }>;
  related: string[];
  toolType: string;
}

// Helper to get tool config
const getToolConfig = (slug: string): ToolConfig | null => {
  const configPath = path.join(process.cwd(), 'src/config/tools', `${slug}.json`);
  if (!fs.existsSync(configPath)) return null;
  return JSON.parse(fs.readFileSync(configPath, 'utf8'));
};

const getAvailableSlugs = () => {
    const configDir = path.join(process.cwd(), 'src/config/tools');
    if (!fs.existsSync(configDir)) return [];
    return fs.readdirSync(configDir)
        .filter(f => f.endsWith('.json') && f !== 'template.json')
        .map(f => f.replace('.json', ''));
}

export async function generateStaticParams() {
  const slugs = getAvailableSlugs();
  return slugs.map((slug) => ({ tool: slug }));
}

export async function generateMetadata({ params }: { params: { tool: string } }): Promise<Metadata> {
  const config = getToolConfig(params.tool);
  if (!config) return {};
  
  return {
    title: config.title,
    description: config.description,
    openGraph: {
        title: config.title,
        description: config.description,
    }
  };
}

export default function DynamicToolPage({ params }: { params: { tool: string } }) {
  const config = getToolConfig(params.tool);
  
  if (!config) {
    notFound();
    return null; // TypeScript type narrowing — notFound() throws, but TS doesn't know that
  }

  // Map string to ToolType enum
  const actualToolType = ToolType[config.toolType as keyof typeof ToolType] || ToolType.PDF_TO_WORD;
  const maxMbBytes = MAX_FILE_SIZES[actualToolType as keyof typeof MAX_FILE_SIZES];
  const maxMb = maxMbBytes ? maxMbBytes / (1024 * 1024) : 100;

  // Schema LD+JSON data
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": config.faqs.map(f => ({
      "@type": "Question",
      "name": f.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": f.answer
      }
    }))
  };

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": config.h1,
    "operatingSystem": "All",
    "applicationCategory": "WebApplication",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-16">
      <SEOHead title={config.title} description={config.description} />
      <JsonLDSchema data={faqSchema} />
      <JsonLDSchema data={softwareSchema} />

      <header className="text-center space-y-4 py-12 animate-slide-up">
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary-50 text-sky-700 font-semibold text-sm mb-4 border border-primary-100 backdrop-blur-sm">
          Privacy Secured | يتم حذف الملفات تلقائياً خلال ساعة
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          {config.h1}
        </h1>
        <p className="text-lg text-slate-500 max-w-xl mx-auto font-medium">
          {config.subheading}
        </p>
      </header>

      <div className="animate-fade-in relative z-10 glass-effect p-2 rounded-3xl">
        <FileUploader
          toolType={actualToolType}
          maxSizeMB={maxMb}
          acceptedMimeTypes=".pdf, .jpg, .png, .docx" // Simplified for dynamic use
        />
      </div>

      <section className="mt-24 space-y-16 rtl:text-right">
        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white/40 border border-white/60 shadow-xl backdrop-blur-md">
                <h3 className="font-bold text-xl mb-3 text-slate-800">أمان كامل 🔒</h3>
                <p className="text-slate-500 leading-relaxed">أمانك هو أولويتنا. يتم حذف جميع الملفات تلقائياً من خوادمنا بعد ساعة واحدة لضمان خصوصية بياناتك.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/40 border border-white/60 shadow-xl backdrop-blur-md">
                <h3 className="font-bold text-xl mb-3 text-slate-800">دقة التحويل ✨</h3>
                <p className="text-slate-500 leading-relaxed">نستخدم أحدث تقنيات الـ AI لضمان تحويل ملفاتك بأعلى دقة ممكنة مع الحفاظ على التنسيق الأصلي.</p>
            </div>
            <div className="p-6 rounded-2xl bg-white/40 border border-white/60 shadow-xl backdrop-blur-md">
                <h3 className="font-bold text-xl mb-3 text-slate-800">سهولة الاستخدام 🚀</h3>
                <p className="text-slate-500 leading-relaxed">لا داعي للتسجيل أو تثبيت برامج. ارفع ملفك، حول، وحمل النتيجة بضغطة زر واحدة.</p>
            </div>
        </div>

        {/* FAQ Section */}
        <div className="pt-12 max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl font-black text-slate-900 text-center mb-10">الأسئلة الشائعة</h2>
          <div className="space-y-6">
            {config.faqs.map((faq, idx) => (
              <div key={idx} className="bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <h4 className="font-bold text-slate-800 mb-3 text-lg">{faq.question}</h4>
                <p className="text-slate-500 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Internal Linking / Related Tools */}
        <div className="pt-16 border-t border-slate-100 text-center">
            <h3 className="text-xl font-bold text-slate-800 mb-8">قد يهمك أيضاً</h3>
            <div className="flex flex-wrap justify-center gap-4">
                {config.related.map(rel => (
                    <Link 
                        key={rel} 
                        href={`/${rel}`}
                        className="px-6 py-3 rounded-xl bg-slate-50 text-slate-600 font-bold hover:bg-sky-50 hover:text-sky-600 transition-all border border-slate-100"
                    >
                        {rel.replace(/-/g, ' ').toUpperCase()}
                    </Link>
                ))}
            </div>
        </div>
      </section>
    </div>
  );
}
