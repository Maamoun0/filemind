"use client";

import React from 'react';

interface RoadmapItem {
  id: string;
  title: string;
  description?: string;
  priority: number;
  category?: string;
}

const RoadmapCard = ({ item }: { item: RoadmapItem }) => {
  const priorityColors = {
    1: 'bg-red-100 text-red-700 border-red-200',
    2: 'bg-yellow-100 text-yellow-700 border-yellow-200',
    3: 'bg-blue-100 text-blue-700 border-blue-200',
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow mb-3 cursor-default">
      <div className="flex justify-between items-start mb-2">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${priorityColors[item.priority as keyof typeof priorityColors] || priorityColors[3]}`}>
          P{item.priority}
        </span>
        {item.category && (
          <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
            {item.category}
          </span>
        )}
      </div>
      <h4 className="text-sm font-semibold text-slate-800 mb-1">{item.title}</h4>
      <p className="text-xs text-slate-500 line-clamp-3">{item.description}</p>
    </div>
  );
};

export default RoadmapCard;
