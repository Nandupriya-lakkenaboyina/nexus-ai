'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';
import {
  Sparkles,
  GraduationCap,
  Code2,
  BarChart3,
  FileText,
  PenTool,
  Search,
  Check,
} from 'lucide-react';
import { NexusModeId } from '@/types';

export const ManageModesModal: React.FC = () => {
  const { activeModal, closeModal, modes, activeMode, setActiveModeId } = useChat();
  const isOpen = activeModal === 'manage-modes';

  const getModeIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-emerald-400" />;
      case 'Code2':
        return <Code2 className="w-4 h-4 text-amber-400" />;
      case 'BarChart3':
        return <BarChart3 className="w-4 h-4 text-sky-400" />;
      case 'FileText':
        return <FileText className="w-4 h-4 text-blue-400" />;
      case 'PenTool':
        return <PenTool className="w-4 h-4 text-purple-400" />;
      case 'Search':
        return <Search className="w-4 h-4 text-cyan-400" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-400" />;
    }
  };

  const handleSelect = (modeId: NexusModeId) => {
    setActiveModeId(modeId);
    closeModal();
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Nexus Intelligence Modes" maxWidth="2xl">
      <div className="space-y-4 select-none max-h-[75vh] overflow-y-auto custom-scrollbar pr-1">
        <p className="text-xs text-[#8A8A8A] leading-relaxed">
          Each Nexus Mode specializes the system prompt, formatting directives, and reasoning pipeline for specific tasks.
        </p>

        <div className="space-y-2.5">
          {modes.map((mode) => {
            const isActive = activeMode.id === mode.id;

            return (
              <div
                key={mode.id}
                onClick={() => handleSelect(mode.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  isActive
                    ? 'bg-[#0E0E0E] border-white/40 ring-1 ring-white/20'
                    : 'bg-[#080808] hover:bg-[#0E0E0E] border-[#1C1C1C] hover:border-neutral-700'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-[#141414] border border-[#1C1C1C] flex-shrink-0 mt-0.5">
                    {getModeIcon(mode.iconName)}
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-white">{mode.name}</h4>
                      <span className="text-[10px] font-mono text-[#8A8A8A] bg-[#050505] px-1.5 py-0.2 rounded border border-[#1C1C1C]">
                        {mode.slashCommand}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#8A8A8A] leading-relaxed">{mode.description}</p>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {isActive ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      <Check className="w-3.5 h-3.5" />
                      Active
                    </span>
                  ) : (
                    <span className="text-[11px] text-[#8A8A8A] hover:text-white px-2 py-1 rounded">
                      Activate
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Modal>
  );
};
