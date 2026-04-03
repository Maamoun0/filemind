import React from 'react';
import { Lock, Zap, CheckCircle } from 'lucide-react';

interface LimitReachedModalProps {
  onClose: () => void;
}

const LimitReachedModal: React.FC<LimitReachedModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-[2rem] shadow-2xl max-w-md w-full overflow-hidden animate-in zoom-in-95 duration-300 border border-slate-100">
        <div className="p-8 text-center bg-gradient-to-br from-indigo-50/50 to-white">
          <div className="w-20 h-20 bg-indigo-600/10 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-6">
            <Lock size={40} />
          </div>
          <h3 className="text-3xl font-black text-slate-900 mb-3 tracking-tight">لقد وصلت للحد اليومي</h3>
          <p className="text-slate-500 mb-8 leading-relaxed font-medium">
            بصفتك زائر، يمكنك إجراء 10 عمليات تحويل مجانية يومياً. <br/>
            <span className="text-indigo-600 font-bold">بادر بالتسجيل الآن</span> لرفع القيود والحصول على سعة تخزين سحابية لملفاتك!
          </p>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center gap-3 text-right rtl">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <span className="text-slate-700 font-bold">تحويل غير محدود للملفات</span>
            </div>
            <div className="flex items-center gap-3 text-right rtl">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <span className="text-slate-700 font-bold">معالجة دفعات (Bulk Processing) للمجلدات</span>
            </div>
            <div className="flex items-center gap-3 text-right rtl">
              <CheckCircle className="text-green-500 shrink-0" size={20} />
              <span className="text-slate-700 font-bold">تخزين آمن للملفات حتى 30 يوم</span>
            </div>
          </div>

          <button className="w-full bg-indigo-600 text-white font-black py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 mb-4 text-lg">
            <Zap size={20} fill="currentColor" />
            أنشئ حسابك المجاني الآن
          </button>
          
          <button 
            onClick={onClose}
            className="w-full text-slate-400 font-bold text-sm hover:text-slate-600 transition-colors py-2"
          >
            ربما لاحقاً
          </button>
        </div>
      </div>
    </div>
  );
};

export default LimitReachedModal;
