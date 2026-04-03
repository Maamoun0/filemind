import React from 'react';
import KanbanCard from './KanbanCard';

interface KanbanColumnProps {
  title: string;
  items: any[];
  status: string;
}

const KanbanColumn: React.FC<KanbanColumnProps> = ({ title, items, status }) => {
  const getHeaderStyle = (s: string) => {
    switch (s) {
      case 'backlog': return 'bg-slate-100 text-slate-500 border-slate-200';
      case 'planned': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'processing': return 'bg-indigo-50 text-indigo-600 border-indigo-100';
      case 'done': return 'bg-green-50 text-green-600 border-green-100';
      default: return 'bg-slate-100 text-slate-500 border-slate-200';
    }
  };

  return (
    <div className="flex flex-col gap-6 flex-1 min-w-[280px] h-full p-4 rounded-3xl bg-slate-50/50 border border-slate-100/50 shadow-inner">
      <div className={`p-4 rounded-2xl border flex items-center justify-between backdrop-blur-md shadow-sm ${getHeaderStyle(status)}`}>
        <h3 className="font-black text-sm uppercase tracking-[0.2em]">{title}</h3>
        <span className="bg-white/50 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
          {items.length}
        </span>
      </div>
      
      <div className="flex flex-col gap-4 overflow-y-auto pr-1 scrollbar-hide">
        {items.sort((a, b) => a.priority - b.priority).map((item) => (
          <KanbanCard key={item.id} item={item} />
        ))}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-200 rounded-3xl opacity-40">
            <span className="text-[10px] font-black uppercase text-slate-400">Empty Section</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
