'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { NexusLogo } from '@/components/ui/NexusLogo';
import { SearchConversations } from './SearchConversations';
import { ConversationList } from './ConversationList';
import { UserProfileMenu } from './UserProfileMenu';
import {
  Plus,
  X,
  Home,
  FolderArchive,
  Bookmark,
  Settings,
  MessageSquare,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatFolderType } from '@/types';

interface SidebarProps {
  onLogoClick?: () => void;
}

const FOLDERS: { id: ChatFolderType; label: string }[] = [
  { id: 'All', label: 'All' },
  { id: 'Coding', label: 'Coding' },
  { id: 'Study', label: 'Study' },
  { id: 'Projects', label: 'Projects' },
  { id: 'Research', label: 'Research' },
  { id: 'Personal', label: 'Personal' },
];

export const Sidebar: React.FC<SidebarProps> = ({ onLogoClick }) => {
  const {
    isSidebarOpen,
    setIsSidebarOpen,
    createNewConversation,
    openModal,
    activeFolder,
    setActiveFolder,
    setIsSettingsOpen,
    currentConversationId,
    activeModal,
  } = useChat();

  const isHomeActive = currentConversationId === null && activeModal === null;

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#080808] border-r border-[#1C1C1C] select-none text-neutral-200 overflow-hidden">
      {/* Top Branding */}
      <div className="p-4 pb-3.5 flex items-center justify-between border-b border-[#1A1A1A]">
        <div
          onClick={onLogoClick || createNewConversation}
          className="flex items-center gap-2.5 cursor-pointer group px-1 py-0.5 rounded-lg hover:bg-[#121212] transition-colors"
          title="Nexus AI Workspace"
        >
          <div className="w-7 h-7 rounded-lg bg-[#111111] border border-[#282828] flex items-center justify-center text-white group-hover:border-neutral-500 transition-all shadow-sm">
            <NexusLogo size={16} />
          </div>
          <div>
            <h1 className="text-xs font-bold text-white tracking-widest uppercase">
              NEXUS AI
            </h1>
          </div>
        </div>

        {/* Close Drawer Button for mobile */}
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-[#141414] transition-colors"
          aria-label="Close sidebar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Navigation & Chats Scroll Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-3 space-y-4">
        {/* New Chat Action */}
        <button
          onClick={() => {
            createNewConversation();
            if (typeof window !== 'undefined' && window.innerWidth < 768) {
              setIsSidebarOpen(false);
            }
          }}
          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-[#121212] hover:bg-[#181818] text-white border border-[#262626] hover:border-neutral-500 text-xs font-semibold rounded-xl shadow-sm hover:shadow-[0_0_12px_rgba(255,255,255,0.05)] transition-all cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-neutral-200" />
          <span>New Chat</span>
        </button>

        {/* Navigation Section */}
        <div className="space-y-1">
          <div className="px-2 pb-1 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
            Navigation
          </div>

          <button
            onClick={() => {
              createNewConversation();
              if (typeof window !== 'undefined' && window.innerWidth < 768) {
                setIsSidebarOpen(false);
              }
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
              isHomeActive
                ? 'bg-[#181818] text-white border border-[#2E2E2E] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#121212] border border-transparent'
            }`}
          >
            <Home className={`w-3.5 h-3.5 ${isHomeActive ? 'text-white' : 'text-neutral-400'}`} />
            <span>Home</span>
          </button>

          <button
            onClick={() => openModal('library')}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-all text-left ${
              activeModal === 'library'
                ? 'bg-[#181818] text-white border border-[#2E2E2E] shadow-sm'
                : 'text-neutral-400 hover:text-white hover:bg-[#121212] border border-transparent'
            }`}
          >
            <FolderArchive className="w-3.5 h-3.5 text-neutral-400" />
            <span>Library</span>
          </button>

          <button
            onClick={() => openModal('library')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-[#121212] border border-transparent transition-all text-left"
          >
            <Bookmark className="w-3.5 h-3.5 text-neutral-400" />
            <span>Saved</span>
          </button>
        </div>

        {/* Section Divider */}
        <div className="h-px bg-[#181818]" />

        {/* Chats History Section */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between px-2">
            <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center gap-1.5">
              <MessageSquare className="w-3 h-3 text-neutral-500" />
              Chat History
            </span>
          </div>

          {/* Folder Filter Pills */}
          <div className="flex items-center gap-1 overflow-x-auto custom-scrollbar pb-1 px-1">
            {FOLDERS.map((f) => {
              const isSelected = activeFolder === f.id || activeFolder === f.id.toLowerCase();
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveFolder(f.id)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-white text-black font-semibold shadow-sm'
                      : 'bg-[#101010] text-neutral-400 hover:text-neutral-200 border border-[#1E1E1E] hover:border-neutral-700'
                  }`}
                >
                  {f.label}
                </button>
              );
            })}
          </div>

          {/* Search Box */}
          <div className="px-1">
            <SearchConversations />
          </div>

          {/* Conversation List */}
          <div className="min-h-[140px] px-1">
            <ConversationList />
          </div>
        </div>
      </div>

      {/* Bottom Area: Settings & Profile */}
      <div className="p-3 border-t border-[#1A1A1A] bg-[#070707] space-y-1.5">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-neutral-400 hover:text-white hover:bg-[#121212] border border-transparent hover:border-[#222222] transition-all text-left cursor-pointer"
        >
          <Settings className="w-3.5 h-3.5 text-neutral-400" />
          <span>Settings</span>
        </button>

        <UserProfileMenu />
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-60 lg:w-64 flex-shrink-0 h-full">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="relative w-64 max-w-[85vw] h-full z-50"
            >
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
