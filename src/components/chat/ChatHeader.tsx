'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { Dropdown } from '@/components/ui/Dropdown';
import {
  Menu,
  ChevronDown,
  Share2,
  MoreVertical,
  Pin,
  Trash2,
  Download,
  Sparkles,
  GraduationCap,
  Code2,
  BarChart3,
  FileText,
  PenTool,
  Compass,
} from 'lucide-react';
import { NexusModeId } from '@/types';

export const ChatHeader: React.FC = () => {
  const {
    currentConversation,
    toggleSidebar,
    models,
    activeModel,
    setActiveModel,
    activeMode,
    setActiveModeId,
    modes,
    deleteConversation,
    pinConversation,
    exportConversation,
  } = useChat();

  const getModeIcon = (id: NexusModeId) => {
    switch (id) {
      case 'study':
        return <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />;
      case 'coding':
        return <Code2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'data-analyst':
        return <BarChart3 className="w-3.5 h-3.5 text-amber-400" />;
      case 'document-analyst':
        return <FileText className="w-3.5 h-3.5 text-sky-400" />;
      case 'writing':
        return <PenTool className="w-3.5 h-3.5 text-violet-400" />;
      case 'research':
        return <Compass className="w-3.5 h-3.5 text-rose-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-white" />;
    }
  };

  const modeDropdownItems = modes.map((m) => ({
    id: m.id,
    label: m.name,
    icon: getModeIcon(m.id),
    badge: activeMode.id === m.id ? 'Active' : undefined,
    onClick: () => setActiveModeId(m.id),
  }));

  const modelDropdownItems = models.map((m) => ({
    id: m.id,
    label: m.name,
    badge: m.badge,
    onClick: () => setActiveModel(m),
  }));

  const convMenuItems = currentConversation
    ? [
        {
          id: 'pin',
          label: currentConversation.pinned ? 'Unpin Chat' : 'Pin Chat',
          icon: <Pin className="w-3.5 h-3.5 text-neutral-400" />,
          onClick: () => pinConversation(currentConversation.id),
        },
        {
          id: 'export-md',
          label: 'Export Markdown',
          icon: <Download className="w-3.5 h-3.5 text-neutral-400" />,
          onClick: () => exportConversation(currentConversation.id, 'markdown'),
        },
        {
          id: 'export-json',
          label: 'Export JSON',
          icon: <Download className="w-3.5 h-3.5 text-neutral-400" />,
          onClick: () => exportConversation(currentConversation.id, 'json'),
        },
        {
          id: 'share',
          label: 'Share Link',
          icon: <Share2 className="w-3.5 h-3.5 text-neutral-400" />,
          onClick: () => {
            navigator.clipboard.writeText(window.location.href);
            alert('Conversation link copied to clipboard!');
          },
        },
        {
          id: 'delete',
          label: 'Delete Chat',
          icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
          danger: true,
          onClick: () => deleteConversation(currentConversation.id),
        },
      ]
    : [];

  return (
    <header className="flex items-center justify-between gap-3 px-4 sm:px-6 py-2.5 bg-[#000000]/90 backdrop-blur-md border-b border-[#1A1A1A] sticky top-0 z-20 select-none">
      {/* Left: Mobile hamburger + Compact Mode Selector */}
      <div className="flex items-center gap-2 min-w-0">
        <button
          onClick={toggleSidebar}
          className="md:hidden p-1.5 text-neutral-400 hover:text-white hover:bg-[#141414] rounded-lg transition-colors"
          aria-label="Open sidebar"
        >
          <Menu className="w-4 h-4" />
        </button>

        {/* Compact Mode Selector */}
        <Dropdown
          align="left"
          trigger={
            <button
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0A0A0A] hover:bg-[#121212] border border-[#1F1F1F] hover:border-neutral-600 text-xs font-medium text-neutral-200 hover:text-white transition-all shadow-sm"
              title="Change active Nexus Mode"
            >
              <span>{getModeIcon(activeMode.id)}</span>
              <span className="truncate max-w-[120px] sm:max-w-none font-semibold">{activeMode.name}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
          }
          items={modeDropdownItems}
        />
      </div>

      {/* Right: Model Selector & Conversation Options */}
      <div className="flex items-center gap-2">
        {/* Model dropdown */}
        <Dropdown
          align="right"
          trigger={
            <button className="flex items-center gap-2 px-3 py-1.5 bg-[#0A0A0A] hover:bg-[#121212] border border-[#1F1F1F] hover:border-neutral-600 rounded-lg text-xs font-medium text-neutral-200 hover:text-white transition-all shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <span className="truncate max-w-[100px] sm:max-w-none">{activeModel.name}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </button>
          }
          items={modelDropdownItems}
        />

        {/* Conversation Options */}
        {currentConversation && (
          <Dropdown
            align="right"
            trigger={
              <button className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#141414] rounded-lg transition-colors border border-transparent hover:border-[#222222]">
                <MoreVertical className="w-4 h-4" />
              </button>
            }
            items={convMenuItems}
          />
        )}
      </div>
    </header>
  );
};
