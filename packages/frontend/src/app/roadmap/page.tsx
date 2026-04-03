"use client";

import React, { useState, useEffect } from 'react';
import KanbanColumn from '@/components/roadmap/KanbanColumn';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: number;
  category: string;
}

export default function RoadmapPage() {
  const [items, setItems] = useState<RoadmapItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetching from local config for now, then can move to API
    const fetchRoadmap = async () => {
      try {
        // In Next.js, we can import JSON or fetch it if it's in public. 
        // For now, using hardcoded matching the spec config.
        const data = [
          {id: "1", title: "Advanced AI OCR", description: "Support for handwritten Arabic text detection.", status: "processing", priority: 1, category: "Core"},
          {id: "2", title: "Mobile App (iOS/Android)", description: "Native mobile experience for on-the-go scanning.", status: "planned", priority: 2, category: "UI"},
          {id: "3", title: "Bulk PDF Processing", description: "Convert hundreds of PDFs in a single click.", status: "backlog", priority: 1, category: "Infra"},
          {id: "4", title: "Excel Styling Engine", description: "Export beautiful formatted spreadsheets from AI data.", status: "done", priority: 3, category: "Smart"},
          {id: "5", title: "Programmatic SEO Engine", description: "Automated landing pages for 50+ tool categories.", status: "done", priority: 1, category: "Growth"},
          {id: "6", title: "Usage Limit & Viral Loop", description: "10-op daily limit and simplix_ prefixing.", status: "processing", priority: 1, category: "Conversion"}
        ];
        
        setItems(data);
      } catch (error) {
        console.error("Failed to load roadmap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRoadmap();
  }, []);

  const getItemsByStatus = (status: string) => items.filter(i => i.status === status);

  return (
    <div className="min-h-screen bg-[#fafbff]">
      {/* Header section with premium typography */}
      <section className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-6 border border-indigo-100 shadow-sm">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          Live Roadmap
        </div>
        <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter leading-tight">
          Evolution of <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">fileMind (فيلميند)</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium leading-relaxed">
          نحن نبني مستقبل معالجة الملفات بشفافية كاملة. تتبع تقدم تطوير الميزات الجديدة وشاركنا تطلعاتك.
        </p>
      </section>

      {/* Kanban Board section - Horizontal Scroll on Mobile */}
      <main className="max-w-[1400px] mx-auto px-6 pb-24">
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-indigo-600 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-nowrap md:flex-row gap-8 overflow-x-auto pb-8 scrollbar-hide items-stretch">
            <KanbanColumn 
              title="Backlog | قيد الانتظار" 
              items={getItemsByStatus('backlog')} 
              status="backlog" 
            />
            <KanbanColumn 
              title="Planned | المخطط له" 
              items={getItemsByStatus('planned')} 
              status="planned" 
            />
            <KanbanColumn 
              title="In Progress | قيد التنفيذ" 
              items={getItemsByStatus('processing')} 
              status="processing" 
            />
            <KanbanColumn 
              title="Done | المنجز" 
              items={getItemsByStatus('done')} 
              status="done" 
            />
          </div>
        )}
      </main>

      {/* Footer hint */}
      <footer className="text-center py-12 px-6 border-t border-slate-200/50 text-slate-400 text-sm bg-white/50">
        <p>© 2026 fileMind (فيلميند) Growth Engine - Precision & Transparency</p>
      </footer>
    </div>
  );
}
