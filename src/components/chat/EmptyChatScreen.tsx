'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { NexusLogo } from '@/components/ui/NexusLogo';
import {
  FileText,
  BarChart3,
  Code2,
  Image as ImageIcon,
  Globe2,
  GraduationCap,
  Mic,
  Languages,
} from 'lucide-react';
import { motion } from 'framer-motion';

export const EmptyChatScreen: React.FC = () => {
  const {
    openModal,
    setActiveModeId,
    createNewConversation,
    setIsImageGenModalOpen,
  } = useChat();

  const featureCards = [
    {
      id: 'files',
      title: 'Chat with Files',
      desc: 'Upload PDF, DOCX, & text files for summaries and deep Q&A',
      icon: <FileText className="w-4 h-4 text-white" />,
      action: () => {
        setActiveModeId('document-analyst');
        createNewConversation();
      },
    },
    {
      id: 'data',
      title: 'Analyze Data',
      desc: 'Process CSV & Excel sheets with statistical charts & metrics',
      icon: <BarChart3 className="w-4 h-4 text-white" />,
      action: () => openModal('data-analyst'),
    },
    {
      id: 'code',
      title: 'Write & Run Code',
      desc: 'Write, debug, and execute Python, JavaScript, and more',
      icon: <Code2 className="w-4 h-4 text-white" />,
      action: () => openModal('code-runner'),
    },
    {
      id: 'image',
      title: 'Create Images',
      desc: 'Generate photorealistic visuals and digital artwork from prompts',
      icon: <ImageIcon className="w-4 h-4 text-white" />,
      action: () => setIsImageGenModalOpen(true),
    },
    {
      id: 'web',
      title: 'Search the Web',
      desc: 'Real-time web search with verified citations and sources',
      icon: <Globe2 className="w-4 h-4 text-white" />,
      action: () => openModal('web-search'),
    },
    {
      id: 'study',
      title: 'Study Mode',
      desc: 'Generate smart study notes, MCQs, and interactive flashcards',
      icon: <GraduationCap className="w-4 h-4 text-white" />,
      action: () => openModal('study'),
    },
    {
      id: 'voice',
      title: 'Voice Chat',
      desc: 'Talk hands-free and listen to natural conversational responses',
      icon: <Mic className="w-4 h-4 text-white" />,
      action: () => openModal('voice-chat'),
    },
    {
      id: 'translate',
      title: 'Translate',
      desc: 'Translate text accurately across Indian and global languages',
      icon: <Languages className="w-4 h-4 text-white" />,
      action: () => openModal('translate'),
    },
  ];

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-10 text-center max-w-4xl mx-auto my-auto select-none w-full">
      {/* Central Nexus AI Welcome Section */}
      <motion.div
        initial={{ scale: 0.94, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center mb-6 sm:mb-8"
      >
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-[#0D0D0D] border border-[#222222] flex items-center justify-center text-white mb-4 shadow-[0_0_30px_rgba(255,255,255,0.06)] ring-1 ring-white/5">
          <NexusLogo size={30} />
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-widest text-white uppercase">
          NEXUS AI
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 font-medium mt-1.5">
          Your Multimodal AI Assistant
        </p>
        <p className="text-[11px] sm:text-xs text-neutral-500 tracking-wider mt-0.5">
          Ask. Analyze. Create. Explore.
        </p>
      </motion.div>

      {/* 2-Column Feature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-3xl">
        {featureCards.map((card, idx) => (
          <motion.button
            key={card.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03, duration: 0.2 }}
            onClick={card.action}
            className="group flex items-start gap-3.5 p-3.5 sm:p-4 bg-[#0A0A0A] hover:bg-[#121212] border border-[#1C1C1C] hover:border-neutral-600 rounded-2xl transition-all duration-200 text-left cursor-pointer hover:shadow-[0_4px_20px_rgba(0,0,0,0.5),0_0_15px_rgba(255,255,255,0.03)] hover:-translate-y-0.5"
          >
            <div className="w-9 h-9 rounded-xl bg-[#111111] border border-[#242424] flex items-center justify-center flex-shrink-0 group-hover:border-neutral-500 group-hover:bg-[#181818] transition-all shadow-sm">
              {card.icon}
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xs sm:text-sm font-semibold text-neutral-100 group-hover:text-white transition-colors">
                {card.title}
              </h3>
              <p className="text-[11px] sm:text-xs text-neutral-400 group-hover:text-neutral-300 leading-snug mt-0.5 transition-colors">
                {card.desc}
              </p>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};
