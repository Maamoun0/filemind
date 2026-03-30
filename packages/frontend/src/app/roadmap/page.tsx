"use client";

import React, { useState, useEffect } from 'react';
import KanbanColumn from '@/components/roadmap/KanbanColumn';

interface StatusColumn {
  id: string;
  label: string;
  items: any[];
}

export default function RoadmapPage() {
  const [board, setBoard] = useState<StatusColumn[]>([]);
  const [loading, setLoading] = useState(true);

  // Mock data for initial presentation
  const mockBoard: StatusColumn[] = [
    {
      id: 'bac-001',
      label: 'Backlog',
      items: [
        { id: '1', title: 'Batch File Processing', description: 'Allow processing multiple files at once', priority: 3, category: 'Core' },
        { id: '2', title: 'User Profiles', description: 'Enable users to save their history', priority: 3, category: 'Account' }
      ]
    },
    {
      id: 'pla-001',
      label: 'Planned',
      items: [
        { id: '3', title: 'PDF to Word Conversion', description: 'High-fidelity conversion using AI-OCR', priority: 1, category: 'Feature' },
        { id: '4', title: 'Global Theme System', description: 'Dynamic Dark Mode', priority: 2, category: 'UI' }
      ]
    },
    {
      id: 'ip-001',
      label: 'In Progress',
      items: [
        { id: '5', title: 'Kanban Roadmap', description: 'Modern roadmap visualization for transparency', priority: 1, category: 'UI' }
      ]
    },
    {
      id: 'don-001',
      label: 'Done',
      items: [
        { id: '6', title: '100MB Upload Increase', description: 'Scaling storage from 10MB to 100MB', priority: 1, category: 'Infra' }
      ]
    }
  ];

  useEffect(() => {
    // In a real scenario, we would fetch from: process.env.NEXT_PUBLIC_BACKEND_URL + "/roadmap/board"
    const timer = setTimeout(() => {
      setBoard(mockBoard);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header section */}
      <section className="pt-20 pb-12 px-6 max-w-7xl mx-auto text-center border-b border-slate-50">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
          Evolution of <span className="text-blue-600">Simplix</span>
        </h1>
        <p className="text-slate-500 text-lg max-w-2xl mx-auto font-medium">
          Transparent development progress. Every status update, and future feature is tracked here in real-time.
        </p>
      </section>

      {/* Kanban Board section */}
      <main className="max-w-full overflow-x-auto px-6 py-12 bg-white/50 backdrop-blur-sm">
        {loading ? (
          <div className="flex justify-center items-center py-40">
            <div className="w-8 h-8 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin" />
          </div>
        ) : (
          <div className="flex gap-6 min-w-max md:min-w-0 max-w-7xl mx-auto h-[70vh] items-stretch">
            {board.map((col) => (
              <KanbanColumn key={col.id} label={col.label} items={col.items} />
            ))}
          </div>
        )}
      </main>

      {/* Footer hint */}
      <footer className="text-center py-12 px-6 border-t border-slate-50 text-slate-400 text-sm">
        <p>© 2026 Simplix V2 - Built with transparency on Railway & Vercel</p>
      </footer>
    </div>
  );
}
