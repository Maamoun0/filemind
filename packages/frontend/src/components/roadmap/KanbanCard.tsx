import React from 'react';
import { Clock, CheckCircle2, Circle, PlayCircle } from 'lucide-react';

interface KanbanCardProps {
  item: {
    id: string;
    title: string;
    description: string;
    status: string;
    priority: number;
    category: string;
  };
}

const KanbanCard: React.FC<KanbanCardProps> = ({ item }) => {
  const getPriorityColor = (p: number) => {
    if (p === 1) return 'bg-red-50 text-red-600 border-red-100';
    if (p === 2) return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-blue-50 text-blue-600 border-blue-100';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'done': return <CheckCircle2 size={16} className="text-green-500" />;
      case 'processing': return <PlayCircle size={16} className="text-indigo-500 animate-pulse" />;
      case 'planned': return <Clock size={16} className="text-amber-500" />;
      default: return <Circle size={16} className="text-slate-300" />;
    }
  };

  return (
    <div className="group bg-white/70 backdrop-blur-sm p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-200 transition-all duration-300 animate-in slide-in-from-bottom-2 fade-in">
      <div className="flex items-start justify-between mb-3">
        <span className={`text-[10px] uppercase tracking-widest font-black px-2.5 py-1 rounded-lg border ${getPriorityColor(item.priority)}`}>
          P{item.priority}
        </span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest bg-slate-50 px-2.5 py-1 rounded-lg">
          {item.category}
        </span>
      </div>
      
      <h4 className="font-bold text-slate-800 mb-2 group-hover:text-indigo-600 transition-colors">
        {item.title}
      </h4>
      <p className="text-sm text-slate-500 leading-relaxed mb-4">
        {item.description}
      </p>
      
      <div className="flex items-center gap-2 pt-4 border-t border-slate-100 mt-auto">
        {getStatusIcon(item.status)}
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">
          {item.status.replace(/-/g, ' ')}
        </span>
      </div>
    </div>
  );
};

export default KanbanCard;
