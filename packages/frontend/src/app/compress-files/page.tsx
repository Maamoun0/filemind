import type { Metadata } from 'next';
import { FileUploader } from '@/components/FileUploader';
import { ToolType, MAX_FILE_SIZES } from '@filemind/shared';

export const metadata: Metadata = {
    title: 'Smart File Compressor - Reduce Size & Zip Files | fileMind',
    description: 'Compress any file into a high-density ZIP archive instantly. Perfect for large documents, datasets, and mixed media.',
    keywords: 'file compressor, zip files, reduce file size, online zipper, secure compression, fileMind',
};

export default function CompressFilesPage() {
    // @ts-ignore - Handle delay in type detection for new tool type
    const toolType = ToolType.COMPRESS_FILES || ('compress-files' as any);
    const maxMb = (MAX_FILE_SIZES as any)[toolType] / (1024 * 1024) || 100;

    return (
        <div className="max-w-4xl mx-auto pb-16">
            <header className="text-center space-y-4 py-12 animate-slide-up">
                <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm mb-4 border border-blue-100">
                    High Density Compression
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                    Smart File <span className="text-blue-600">Compressor</span>
                </h1>
                <p className="text-lg text-slate-600 max-w-xl mx-auto">
                    Turn large, bulky files into lightweight ZIP archives without losing a single bit of data.
                </p>
            </header>

            <div className="animate-fade-in">
                <FileUploader
                    toolType={toolType}
                    maxSizeMB={maxMb}
                    acceptedMimeTypes="*/*"
                />
            </div>
            
            <div className="mt-8 text-center text-slate-500 text-xs italic">
                Note: Currently supports single-file compression. Multi-file zipping is coming soon!
            </div>

            <section className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="glass-card p-6 border-t-4 border-blue-500">
                    <h3 className="font-bold text-lg mb-2 text-slate-900">Lossless</h3>
                    <p className="text-slate-600 text-sm">
                        Uses industry-standard DEFLATE algorithms to ensure 100% data integrity.
                    </p>
                </div>
                <div className="glass-card p-6 border-t-4 border-teal-500">
                    <h3 className="font-bold text-lg mb-2 text-slate-900">Multi-Purpose</h3>
                    <p className="text-slate-600 text-sm">
                        Works with documents, images, code, and logs. Anything you need to shrink.
                    </p>
                </div>
                <div className="glass-card p-6 border-t-4 border-purple-500">
                    <h3 className="font-bold text-lg mb-2 text-slate-900">Encrypted Path</h3>
                    <p className="text-slate-600 text-sm">
                        Processing is done via secure memory streams and wiped immediately after.
                    </p>
                </div>
            </section>
        </div>
    );
}
