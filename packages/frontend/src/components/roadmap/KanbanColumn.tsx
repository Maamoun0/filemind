"use client";

import React from 'react';
import RoadmapCard from './RoadmapCard';

interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  priority: number;
  category?: string;
}

interface ColumnProps {
  label: string;
  items: RoadmapItem[];
}

const KanbanColumn = ({ label, items }: ColumnProps) => {
  return (
    <div className="flex-1 min-w-[280px] bg-slate-50/50 rounded-2xl p-4 border border-slate-100 flex flex-col h-full max-h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-6 sticky top-0 bg-slate-50 pb-2 z-10">
        <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
          {label}
          <span className="bg-slate-200 text-slate-600 text-[10px] px-2 py-0.5 rounded-full">
            {items.length}
          </span>
        </h3>
      </div>
      
      <div className="flex-1 space-y-3 pb-8">
        {items.length > 0 ? (
          items.map((item) => (
            <RoadmapCard key={item.id} item={item} />
          ))
        ) : (
          <div className="py-12 flex flex-col items-center justify-center text-center opacity-40">
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-slate-300 mb-3" />
            <p className="text-xs font-medium text-slate-400">No items planned</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;
