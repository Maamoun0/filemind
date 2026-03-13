'use client';

import React, { useState } from 'react';
import { FileSpreadsheet, AlertCircle, CheckCircle2, ListFilter, Table, BarChart3, Info } from 'lucide-react';
import { ToolType } from '@filemind/shared';

interface ColumnStats {
    dtype: string;
    nulls: number;
    unique: number;
    mean?: number;
    min?: number;
    max?: number;
    std?: number;
}

interface ExcelAnalysisResult {
    totalRows: number;
    totalColumns: number;
    duplicateRows: number;
    emptyCells: number;
    columnStats: Record<string, ColumnStats>;
    message: string;
}

export const ExcelAnalyzer: React.FC = () => {
    const [file, setFile] = useState<File | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [result, setResult] = useState<ExcelAnalysisResult | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(null);
            setResult(null);
        }
    };

    const runAnalysis = async () => {
        if (!file) return;

        setIsAnalyzing(true);
        setError(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/api/excel/analyze`, {
                method: 'POST',
                body: formData,
            });

            let data;
            const text = await response.text();
            try {
                data = JSON.parse(text);
            } catch {
                throw new Error(`Server returned an invalid response: ${response.status} ${response.statusText}`);
            }

            if (!response.ok) {
                throw new Error(data.detail || data.error || 'Failed to analyze spreadsheet');
            }

            setResult(data);
        } catch (err: any) {
            console.error('[fileMind] Excel Analysis Error:', err);
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {!result ? (
                <div className="bg-white border-2 border-dashed border-slate-300 rounded-3xl p-12 flex flex-col items-center justify-center text-center transition-all hover:border-indigo-400 group">
                    <div className="w-20 h-20 bg-violet-50 text-violet-600 rounded-3xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:bg-violet-600 group-hover:text-white transition-all duration-500">
                        <FileSpreadsheet size={36} />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 mb-2 font-outfit">Upload your Spreadsheet</h3>
                    <p className="text-slate-500 mb-8 text-sm max-w-sm leading-relaxed">
                        Supports .xlsx and .csv files. <br />
                        Analyze your data for duplicates and quality issues instantly.
                    </p>
                    
                    <input
                        type="file"
                        accept=".xlsx, .csv"
                        onChange={handleFileChange}
                        className="hidden"
                        id="excel-upload"
                    />
                    
                    {!file ? (
                        <label
                            htmlFor="excel-upload"
                            className="btn-primary cursor-pointer px-10 py-3 text-lg flex items-center gap-2"
                        >
                            Select File
                        </label>
                    ) : (
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
                                <span className="font-semibold text-slate-700">{file.name}</span>
                                <button onClick={() => setFile(null)} className="text-slate-400 hover:text-red-500">
                                    <AlertCircle size={18} />
                                </button>
                            </div>
                            <button
                                onClick={runAnalysis}
                                disabled={isAnalyzing}
                                className="btn-primary px-12 py-3 text-lg relative overflow-hidden"
                            >
                                {isAnalyzing ? (
                                    <>
                                        <span className="opacity-0">Analyzing...</span>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-6 h-6 border-3 border-white/20 border-t-white rounded-full animate-spin" />
                                        </div>
                                    </>
                                ) : 'Run Smart Analysis'}
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <div className="space-y-8 animate-fade-in">
                    {/* Summary Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="text-slate-500 text-sm font-medium">Total Rows</span>
                                <Table className="text-indigo-500" size={20} />
                            </div>
                            <span className="text-3xl font-bold text-slate-900">{result.totalRows?.toLocaleString() ?? 0}</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="text-slate-500 text-sm font-medium">Columns</span>
                                <ListFilter className="text-violet-500" size={20} />
                            </div>
                            <span className="text-3xl font-bold text-slate-900">{result.totalColumns ?? 0}</span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="text-slate-500 text-sm font-medium">Duplicates</span>
                                <AlertCircle className={(result.duplicateRows ?? 0) > 0 ? "text-amber-500" : "text-green-500"} size={20} />
                            </div>
                            <span className={`text-3xl font-bold ${(result.duplicateRows ?? 0) > 0 ? "text-amber-600" : "text-slate-900"}`}>
                                {result.duplicateRows ?? 0}
                            </span>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-1">
                            <div className="flex justify-between items-start">
                                <span className="text-slate-500 text-sm font-medium">Empty Cells</span>
                                <Info className={(result.emptyCells ?? 0) > 0 ? "text-blue-500" : "text-green-500"} size={20} />
                            </div>
                            <span className="text-3xl font-bold text-slate-900">{result.emptyCells ?? 0}</span>
                        </div>
                    </div>

                    {/* Result Message */}
                    <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-center gap-3 text-indigo-700">
                        <CheckCircle2 size={20} />
                        <span className="font-medium">{result.message}</span>
                    </div>

                    {/* Column Details Table */}
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50 flex items-center gap-2">
                            <BarChart3 size={20} className="text-slate-500" />
                            <h4 className="font-bold text-slate-800">Column-by-Column Analysis</h4>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-bold">
                                        <th className="px-6 py-3">Column Name</th>
                                        <th className="px-6 py-3">Type</th>
                                        <th className="px-6 py-3">Unique</th>
                                        <th className="px-6 py-3">Missing</th>
                                        <th className="px-6 py-3">Avg / Stats</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {Object.entries(result.columnStats || {}).map(([name, stats]) => (
                                        <tr key={name} className="hover:bg-slate-50/50 transition-colors">
                                            <td className="px-6 py-4 font-semibold text-slate-800">{name}</td>
                                            <td className="px-6 py-4 text-sm text-slate-600">
                                                <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">{stats.dtype}</code>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-600">{stats.unique.toLocaleString()}</td>
                                            <td className="px-6 py-4">
                                                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stats.nulls > 0 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'}`}>
                                                    {stats.nulls} missing
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-xs text-slate-500">
                                                {stats.mean !== undefined ? (
                                                    <div className="flex flex-col gap-0.5">
                                                        <span>Mean: <strong>{stats.mean}</strong></span>
                                                        <span>Range: <strong>{stats.min}</strong> - <strong>{stats.max}</strong></span>
                                                    </div>
                                                ) : '-'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <button 
                        onClick={() => {setResult(null); setFile(null);}} 
                        className="btn-secondary w-full py-3"
                    >
                        Analyze Another Spreadsheet
                    </button>
                </div>
            )}

            {error && (
                <div className="mt-4 p-4 bg-red-50 text-red-700 border border-red-200 rounded-xl flex items-start gap-3 animate-fade-in">
                    <AlertCircle className="shrink-0 mt-0.5" size={20} />
                    <div className="text-sm font-medium">{error}</div>
                </div>
            )}
        </div>
    );
};
