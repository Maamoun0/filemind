import React from 'react';
import { Share2, Facebook, Twitter, Link as LinkIcon, X, Check } from 'lucide-react';
import { useState } from 'react';

interface ShareModalProps {
  onClose: () => void;
  url: string;
}

const ShareModal: React.FC<ShareModalProps> = ({ onClose, url = "https://filemind.click" }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=Try%20fileMind%20for%20secure%20PDF%20tools!`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden border border-slate-100 p-8 shadow-indigo-100/50">
        <div className="flex items-center justify-between mb-8">
            <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Share2 className="text-indigo-600" size={24} />
                شارك النتيجة 🚀
            </h3>
            <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-50 rounded-xl transition-colors">
                <X size={20} />
            </button>
        </div>

        <p className="text-slate-500 mb-8 font-medium leading-relaxed">
            ساعد أصدقاءك على اكتشاف أسرع وأكثر أدوات الملفات أماناً!
        </p>

        <div className="grid grid-cols-2 gap-4 mb-8">
            <button 
                onClick={shareFacebook}
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-all shadow-sm"
            >
                <Facebook size={24} />
                فيسبوك
            </button>
            <button 
                onClick={shareTwitter}
                className="flex items-center justify-center gap-3 py-4 rounded-2xl bg-sky-50 text-sky-600 font-bold hover:bg-sky-600 hover:text-white transition-all shadow-sm"
            >
                <Twitter size={24} />
                تويتر
            </button>
        </div>

        <div className="relative">
            <div className="flex items-center bg-slate-50 rounded-2xl p-4 pr-16 border border-slate-100 transition-colors focus-within:border-indigo-100">
                <input 
                    type="text" 
                    readOnly 
                    value={url} 
                    className="w-full bg-transparent overflow-hidden text-slate-400 text-sm font-medium outline-none"
                />
            </div>
            <button 
                onClick={copyToClipboard}
                className={`absolute right-2 top-2 p-2 px-4 rounded-xl font-bold flex items-center gap-2 transition-all ${
                    copied ? 'bg-green-500 text-white shadow-lg shadow-green-100' : 'bg-white text-indigo-600 hover:bg-indigo-600 hover:text-white'
                }`}
            >
                {copied ? <Check size={18} /> : <LinkIcon size={18} />}
                {copied ? 'تم!' : 'نسخ'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;
