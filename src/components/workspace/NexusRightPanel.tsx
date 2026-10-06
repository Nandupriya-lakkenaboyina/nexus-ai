'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import {
  Sparkles,
  GraduationCap,
  Code2,
  BarChart3,
  FileText,
  PenTool,
  Compass,
  Play,
  FileSpreadsheet,
  BookOpen,
  HelpCircle,
  Brain,
  X,
  ExternalLink,
  Plus,
  Zap,
  CheckCircle2,
  FileCode,
  Layers,
  Search,
  Bookmark,
  ChevronRight,
  Sliders,
} from 'lucide-react';

export const NexusRightPanel: React.FC = () => {
  const {
    isRightPanelOpen,
    setIsRightPanelOpen,
    activeMode,
    currentConversation,
    openModal,
    triggerQuickAction,
    sendMessage,
    isMemoryEnabled,
    toggleMemory,
    memories,
    activeAttachments,
  } = useChat();

  const [selectedLanguage, setSelectedLanguage] = useState('Python');
  const [selectedTone, setSelectedTone] = useState('Professional');
  const [studyTopic, setStudyTopic] = useState('Data Structures & Algorithms');

  if (!isRightPanelOpen) return null;

  // Extract any code blocks from current conversation
  const codeBlocks =
    currentConversation?.messages.flatMap((m) => m.interactiveElements?.codeBlocks || []) || [];

  // Extract any web sources from current conversation
  const webSources =
    currentConversation?.messages.flatMap((m) => m.sources || []) || [];

  return (
    <aside className="w-72 lg:w-80 h-full bg-[#070707] border-l border-[#1C1C1C] flex flex-col justify-between p-3.5 select-none overflow-y-auto custom-scrollbar flex-shrink-0 text-white">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-2.5 border-b border-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-[#111111] border border-[#222222] text-white">
              {activeMode.id === 'study' && <GraduationCap className="w-3.5 h-3.5" />}
              {activeMode.id === 'coding' && <Code2 className="w-3.5 h-3.5" />}
              {activeMode.id === 'data-analyst' && <BarChart3 className="w-3.5 h-3.5" />}
              {activeMode.id === 'document-analyst' && <FileText className="w-3.5 h-3.5" />}
              {activeMode.id === 'writing' && <PenTool className="w-3.5 h-3.5" />}
              {activeMode.id === 'research' && <Compass className="w-3.5 h-3.5" />}
              {activeMode.id === 'general' && <Sparkles className="w-3.5 h-3.5" />}
            </span>
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block leading-tight">
                {activeMode.name} Context
              </span>
              <span className="text-[10px] text-neutral-500 block leading-tight">
                Context-Aware Panel
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsRightPanelOpen(false)}
            className="p-1 text-neutral-400 hover:text-white hover:bg-[#141414] rounded transition-colors"
            title="Collapse Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* =========================================================================
            1. STUDY MODE CONTEXT
            ========================================================================= */}
        {activeMode.id === 'study' && (
          <div className="space-y-3">
            {/* Current Topic */}
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-1.5">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                Active Topic
              </label>
              <input
                type="text"
                value={studyTopic}
                onChange={(e) => setStudyTopic(e.target.value)}
                className="w-full bg-[#050505] border border-[#1C1C1C] rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-500"
                placeholder="Enter study topic..."
              />
            </div>

            {/* Attached Study Materials */}
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Study Materials
              </span>
              {activeAttachments.length > 0 ? (
                <div className="space-y-1">
                  {activeAttachments.map((att) => (
                    <div key={att.id} className="text-xs text-neutral-300 truncate">
                      • {att.name}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-neutral-500 italic">
                  No files attached. Attach notes or PDFs below.
                </p>
              )}
            </div>

            {/* Study Actions */}
            <div className="space-y-1.5 pt-1">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-1">
                Study Actions
              </span>
              <button
                onClick={() => triggerQuickAction('study-notes')}
                className="w-full flex items-center justify-between p-2.5 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] hover:border-neutral-600 rounded-xl text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Generate Notes</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              <button
                onClick={() => sendMessage(`Generate 5 challenging multiple choice questions on ${studyTopic} with detailed explanations.`)}
                className="w-full flex items-center justify-between p-2.5 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] hover:border-neutral-600 rounded-xl text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
                  <span>Generate MCQs</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              <button
                onClick={() => openModal('study')}
                className="w-full flex items-center justify-between p-2.5 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] hover:border-neutral-600 rounded-xl text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                <div className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Flashcards & Quiz Studio</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            2. CODING MODE CONTEXT
            ========================================================================= */}
        {activeMode.id === 'coding' && (
          <div className="space-y-3">
            {/* Language Selector */}
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Programming Language
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {['Python', 'JavaScript', 'Java', 'TypeScript', 'C++', 'SQL'].map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setSelectedLanguage(lang)}
                    className={`py-1 px-2 rounded-lg text-xs font-mono transition-colors ${
                      selectedLanguage === lang
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#050505] text-neutral-400 hover:text-white border border-[#1C1C1C]'
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Run Code Sandbox Launcher */}
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Execution Sandbox</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#161616] text-emerald-400 font-mono">
                  READY
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Execute and test algorithms directly in isolated environment.
              </p>
              <button
                onClick={() => openModal('code-runner')}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open Code Sandbox</span>
              </button>
            </div>

            {/* Thread Snippets */}
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Code Blocks ({codeBlocks.length})
              </span>
              {codeBlocks.length > 0 ? (
                <div className="space-y-1.5 max-h-36 overflow-y-auto custom-scrollbar">
                  {codeBlocks.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => openModal('code-runner')}
                      className="p-2 bg-[#050505] border border-[#1C1C1C] hover:border-neutral-500 rounded-lg text-xs font-mono cursor-pointer transition-colors truncate"
                    >
                      <span className="text-neutral-400 mr-2">[{c.language}]</span>
                      <span className="text-white">{c.title || 'snippet'}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-neutral-500 italic">
                  No snippets generated in this conversation yet.
                </p>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            3. DATA ANALYST CONTEXT
            ========================================================================= */}
        {activeMode.id === 'data-analyst' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Dataset Studio</span>
                <span className="text-[10px] text-neutral-400">CSV / Excel</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Upload tabular data to calculate statistics, distributions, and charts.
              </p>
              <button
                onClick={() => openModal('data-analyst')}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-lg transition-colors"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Launch Data Analyst</span>
              </button>
            </div>

            {/* Quick Natural Queries */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-1">
                Quick Analysis Requests
              </span>
              {[
                'Summarize dataset statistics',
                'Find missing values & anomalies',
                'Generate distribution chart',
                'Find highest and lowest outliers',
              ].map((query, qIdx) => (
                <button
                  key={qIdx}
                  onClick={() => sendMessage(query)}
                  className="w-full p-2 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] hover:border-neutral-600 rounded-lg text-xs text-neutral-300 hover:text-white transition-colors text-left"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            4. DOCUMENT ANALYST CONTEXT
            ========================================================================= */}
        {activeMode.id === 'document-analyst' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-2">
              <span className="text-xs font-bold text-white block">Document Intelligence</span>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Extract summaries, section breakdowns, and structured points from uploaded files.
              </p>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-1">
                Extraction Actions
              </span>
              <button
                onClick={() => triggerQuickAction('summarize')}
                className="w-full flex items-center justify-between p-2.5 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] rounded-xl text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                <span>Summarize Document</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              <button
                onClick={() => sendMessage('Extract the key action items and critical findings from this document.')}
                className="w-full flex items-center justify-between p-2.5 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] rounded-xl text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                <span>Extract Key Action Items</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              <button
                onClick={() => sendMessage('Generate a 5-question comprehension quiz based on this document.')}
                className="w-full flex items-center justify-between p-2.5 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] rounded-xl text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                <span>Generate Questions</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            5. RESEARCH MODE CONTEXT
            ========================================================================= */}
        {activeMode.id === 'research' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white">Web Intelligence</span>
                <span className="text-[10px] font-mono text-emerald-400">ONLINE</span>
              </div>
              <p className="text-[11px] text-neutral-400 leading-tight">
                Search real-time sources with verified citations and links.
              </p>
              <button
                onClick={() => openModal('web-search')}
                className="w-full flex items-center justify-center gap-2 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-bold rounded-lg transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search Web Engine</span>
              </button>
            </div>

            {/* Sources in this chat */}
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-2">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Retrieved Sources ({webSources.length})
              </span>
              {webSources.length > 0 ? (
                <div className="space-y-1.5 max-h-40 overflow-y-auto custom-scrollbar">
                  {webSources.map((src, sIdx) => (
                    <a
                      key={sIdx}
                      href={src.url}
                      target="_blank"
                      rel="noreferrer"
                      className="block p-2 bg-[#050505] border border-[#1C1C1C] hover:border-neutral-500 rounded-lg text-xs transition-colors"
                    >
                      <div className="text-white truncate font-medium">{src.title}</div>
                      <div className="text-[10px] text-neutral-500 truncate">{src.url}</div>
                    </a>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-neutral-500 italic">
                  Sources will be listed here after web search responses.
                </p>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            6. WRITING MODE CONTEXT
            ========================================================================= */}
        {activeMode.id === 'writing' && (
          <div className="space-y-3">
            <div className="p-3 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-2">
              <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                Tone Preset
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {['Professional', 'Concise', 'Creative', 'Academic'].map((tone) => (
                  <button
                    key={tone}
                    onClick={() => setSelectedTone(tone)}
                    className={`py-1 px-2 rounded-lg text-xs transition-colors ${
                      selectedTone === tone
                        ? 'bg-white text-black font-semibold'
                        : 'bg-[#050505] text-neutral-400 hover:text-white border border-[#1C1C1C]'
                    }`}
                  >
                    {tone}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-1">
                Writing Tools
              </span>
              <button
                onClick={() => sendMessage(`Proofread and polish the above text with a ${selectedTone} tone.`)}
                className="w-full p-2 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] rounded-lg text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                ✨ Polish & Fix Grammar
              </button>
              <button
                onClick={() => sendMessage('Make the above response more concise and punchy.')}
                className="w-full p-2 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] rounded-lg text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                ✂️ Shorten & Simplify
              </button>
            </div>
          </div>
        )}

        {/* =========================================================================
            7. GENERAL MODE CONTEXT
            ========================================================================= */}
        {activeMode.id === 'general' && (
          <div className="space-y-3">
            {/* Memory Overview */}
            <div className="p-3.5 bg-[#0B0B0B] border border-[#1C1C1C] rounded-xl space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Brain className="w-3.5 h-3.5 text-neutral-300" />
                  <span className="text-xs font-bold text-white">Memory</span>
                </div>
                <button
                  onClick={toggleMemory}
                  className={`px-2 py-0.5 rounded text-[9px] font-mono font-bold transition-colors ${
                    isMemoryEnabled
                      ? 'bg-white text-black'
                      : 'bg-[#1C1C1C] text-neutral-500'
                  }`}
                >
                  {isMemoryEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              <p className="text-[11px] text-neutral-400 leading-relaxed">
                Nexus retains cross-session preferences and project patterns.
              </p>
              <div className="flex items-center justify-between pt-1 border-t border-[#141414] text-[11px]">
                <span className="text-neutral-500">{memories.length} memories</span>
                <button
                  onClick={() => openModal('manage-memory')}
                  className="text-white hover:underline font-medium"
                >
                  Manage ↗
                </button>
              </div>
            </div>

            {/* Quick General Actions */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block px-1">
                Actions
              </span>
              <button
                onClick={() => triggerQuickAction('explain')}
                className="w-full flex items-center justify-between p-2.5 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] rounded-xl text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                <span>Explain a Concept</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>
              <button
                onClick={() => triggerQuickAction('latest-info')}
                className="w-full flex items-center justify-between p-2.5 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] rounded-xl text-xs text-neutral-200 hover:text-white transition-colors text-left"
              >
                <span>Find Latest Information</span>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-500" />
              </button>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
