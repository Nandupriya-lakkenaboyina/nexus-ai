'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { NexusLogo } from '@/components/ui/NexusLogo';

export const StreamingMessage: React.FC = () => {
  const { isStreaming, streamingContent } = useChat();

  if (!isStreaming) return null;

  return (
    <div className="flex items-start gap-3.5 py-4 select-text border-b border-[#141414]">
      {/* Nexus AI Icon */}
      <div className="w-7 h-7 rounded-lg bg-[#0E0E0E] border border-[#202020] flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
        <NexusLogo size={15} />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            NEXUS
          </span>
          <span className="text-[10px] text-neutral-500">Generating response...</span>
        </div>

        {/* Streamed text with glowing cursor */}
        <div className="text-xs sm:text-sm text-neutral-100 whitespace-pre-wrap leading-relaxed">
          {streamingContent}
          <span className="inline-block w-1.5 h-3.5 ml-1 bg-white animate-pulse align-middle" />
        </div>
      </div>
    </div>
  );
};
