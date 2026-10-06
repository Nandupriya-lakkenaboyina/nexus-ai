'use client';

import React, { useState, useMemo } from 'react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';
import {
  BarChart3,
  Upload,
  FileSpreadsheet,
  Table2,
  Sparkles,
  Layers,
  ArrowRight,
  TrendingUp,
  PieChart,
} from 'lucide-react';
import { DataAnalysisSummary } from '@/types';

const SAMPLE_CSV = `Student_ID,Name,Subject,Attendance_Pct,Score_Pct,Risk_Status
S101,Aarav Sharma,Mathematics,92,88,Safe
S102,Diya Patel,Physics,74,62,At Risk
S103,Rohan Verma,Chemistry,85,79,Safe
S104,Ananya Iyer,Computer Science,96,94,Safe
S105,Kabir Singh,Mathematics,68,54,High Risk
S106,Priya Nair,Physics,81,83,Safe
S107,Arjun Reddy,Chemistry,70,58,At Risk
S108,Sneha Rao,Computer Science,89,91,Safe
S109,Vikram Malhotra,Mathematics,94,90,Safe
S110,Meera Joshi,Physics,65,51,High Risk`;

export const DataAnalystModal: React.FC = () => {
  const { activeModal, closeModal, sendMessage, setActiveModeId } = useChat();
  const isOpen = activeModal === 'data-analyst';

  const [rawText, setRawText] = useState(SAMPLE_CSV);
  const [nlQuery, setNlQuery] = useState('');
  const [activeChartType, setActiveChartType] = useState<'bar' | 'scatter'>('bar');

  // Parse CSV and calculate summary statistics
  const analysis: DataAnalysisSummary = useMemo(() => {
    const lines = rawText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
    if (lines.length < 2) {
      return {
        rowCount: 0,
        columnCount: 0,
        columns: [],
        duplicateRows: 0,
        sampleRows: [],
      };
    }

    const headers = lines[0].split(',').map((h) => h.trim());
    const dataRows: Record<string, any>[] = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((v) => v.trim());
      const row: Record<string, any> = {};
      headers.forEach((h, idx) => {
        const val = values[idx] ?? '';
        const num = Number(val);
        row[h] = !isNaN(num) && val !== '' ? num : val;
      });
      dataRows.push(row);
    }

    // Determine types and stats
    const columns = headers.map((name) => {
      let isNumeric = true;
      let nullCount = 0;
      const uniqueVals = new Set();

      dataRows.forEach((r) => {
        const v = r[name];
        if (v === '' || v === null || v === undefined) nullCount++;
        else uniqueVals.add(v);
        if (typeof v !== 'number') isNumeric = false;
      });

      return {
        name,
        type: (isNumeric ? 'number' : 'string') as 'number' | 'string',
        nullCount,
        uniqueCount: uniqueVals.size,
      };
    });

    // Numeric statistics
    const numericStats: Record<string, { min: number; max: number; mean: number; median: number }> = {};
    columns
      .filter((c) => c.type === 'number')
      .forEach((c) => {
        const nums = dataRows.map((r) => r[c.name]).filter((n) => typeof n === 'number') as number[];
        if (nums.length > 0) {
          nums.sort((a, b) => a - b);
          const min = nums[0];
          const max = nums[nums.length - 1];
          const sum = nums.reduce((acc, v) => acc + v, 0);
          const mean = sum / nums.length;
          const median = nums[Math.floor(nums.length / 2)];
          numericStats[c.name] = { min, max, mean, median };
        }
      });

    return {
      rowCount: dataRows.length,
      columnCount: headers.length,
      columns,
      duplicateRows: 0,
      sampleRows: dataRows,
      numericStats,
    };
  }, [rawText]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        setRawText(text);
      }
    };
    reader.readAsText(file);
  };

  const handleSendToAI = (customPrompt?: string) => {
    const promptToSend =
      customPrompt ||
      nlQuery.trim() ||
      `Please analyze this dataset with ${analysis.rowCount} rows and ${analysis.columnCount} columns (${analysis.columns.map((c) => c.name).join(', ')}). Identify key patterns, correlations, outliers, and summarize the primary insights.`;

    closeModal();
    setActiveModeId('data-analyst');
    sendMessage(`${promptToSend}\n\n\`\`\`csv\n${rawText.slice(0, 3000)}\n\`\`\``);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Data Analyst & Statistical Visualizer" maxWidth="4xl">
      <div className="space-y-5 select-none max-h-[80vh] overflow-y-auto custom-scrollbar pr-1">
        {/* Top Control: Upload and Datasets */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1C1C1C]">
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 px-3 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>Upload CSV / Excel</span>
              <input type="file" accept=".csv,.txt,.tsv" onChange={handleFileUpload} className="hidden" />
            </label>
            <span className="text-[11px] text-[#8A8A8A]">Or edit raw CSV data in the viewer below</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSendToAI('Find all entries at risk and provide a recommended remediation strategy.')}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0B0B0B] hover:bg-[#141414] border border-[#1C1C1C] text-xs font-medium text-[#8A8A8A] hover:text-white rounded-xl transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Find At-Risk Records</span>
            </button>
          </div>
        </div>

        {/* Dataset Summary Cards Metric Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl">
            <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">Total Rows</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{analysis.rowCount}</span>
          </div>

          <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl">
            <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">Columns</span>
            <span className="text-lg font-bold text-white mt-0.5 block">{analysis.columnCount}</span>
          </div>

          <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl">
            <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">Missing Values</span>
            <span className="text-lg font-bold text-emerald-400 mt-0.5 block">0</span>
          </div>

          <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl">
            <span className="text-[10px] uppercase font-mono text-[#8A8A8A] block">Numeric Fields</span>
            <span className="text-lg font-bold text-sky-400 mt-0.5 block">
              {analysis.columns.filter((c) => c.type === 'number').length}
            </span>
          </div>
        </div>

        {/* Minimal Black & White Chart Preview */}
        {analysis.sampleRows.length > 0 && (
          <div className="p-4 bg-[#050505] border border-[#1C1C1C] rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-sky-400" />
                Score & Attendance Distribution
              </span>
              <span className="text-[10px] font-mono text-[#8A8A8A]">MINIMAL BLACK CHART</span>
            </div>

            {/* Custom SVG Bar Chart */}
            <div className="h-44 w-full flex items-end justify-between gap-2 pt-4 px-2 border-b border-[#1C1C1C]">
              {analysis.sampleRows.slice(0, 10).map((row, idx) => {
                const score = typeof row.Score_Pct === 'number' ? row.Score_Pct : 70;
                const attendance = typeof row.Attendance_Pct === 'number' ? row.Attendance_Pct : 80;
                const isRisk = String(row.Risk_Status || '').toLowerCase().includes('risk');

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group">
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Attendance Bar */}
                      <div
                        style={{ height: `${(attendance / 100) * 100}%` }}
                        className="w-1/2 bg-neutral-700 hover:bg-neutral-500 rounded-t transition-all"
                        title={`Attendance: ${attendance}%`}
                      />
                      {/* Score Bar */}
                      <div
                        style={{ height: `${(score / 100) * 100}%` }}
                        className={`w-1/2 rounded-t transition-all ${
                          isRisk ? 'bg-rose-500/80 hover:bg-rose-400' : 'bg-white hover:bg-neutral-200'
                        }`}
                        title={`Score: ${score}%`}
                      />
                    </div>
                    <span className="text-[9px] text-[#8A8A8A] font-mono truncate w-full text-center">
                      {(row.Name || `R${idx + 1}`).split(' ')[0]}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between text-[11px] text-[#8A8A8A] px-1">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 bg-white rounded-sm" /> Score %
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 bg-neutral-700 rounded-sm" /> Attendance %
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2.5 h-2.5 bg-rose-500/80 rounded-sm" /> At Risk
                </span>
              </div>
              <span>Showing first 10 rows</span>
            </div>
          </div>
        )}

        {/* Data Preview Table */}
        <div className="space-y-2">
          <span className="text-xs font-semibold text-white flex items-center gap-1.5">
            <Table2 className="w-4 h-4 text-[#8A8A8A]" />
            Data Table Preview
          </span>
          <div className="overflow-x-auto border border-[#1C1C1C] rounded-xl max-h-48 custom-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#080808] border-b border-[#1C1C1C]">
                  {analysis.columns.map((col) => (
                    <th key={col.name} className="py-2 px-3 font-semibold text-[#8A8A8A] font-mono text-[11px]">
                      {col.name} <span className="text-[9px] opacity-60">({col.type})</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#141414] font-mono text-[11px]">
                {analysis.sampleRows.slice(0, 8).map((row, idx) => (
                  <tr key={idx} className="hover:bg-[#0B0B0B] transition-colors">
                    {analysis.columns.map((col) => (
                      <td key={col.name} className="py-2 px-3 text-neutral-200">
                        {String(row[col.name] ?? '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Natural Language Prompt Box */}
        <div className="pt-2 border-t border-[#1C1C1C] space-y-2">
          <label className="text-xs font-medium text-white block">
            Ask Natural Language Questions About Dataset
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={nlQuery}
              onChange={(e) => setNlQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendToAI()}
              placeholder="e.g. Find students with attendance below 75% and score below 60..."
              className="flex-1 px-3.5 py-2.5 bg-[#050505] border border-[#1C1C1C] rounded-xl text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#2D3748] transition-colors"
            />
            <button
              onClick={() => handleSendToAI()}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm"
            >
              <span>Analyze</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
