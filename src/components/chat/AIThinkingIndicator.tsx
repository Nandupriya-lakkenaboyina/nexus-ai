'use client';

import React from 'react';
import { NexusLogo } from '@/components/ui/NexusLogo';

interface AIThinkingIndicatorProps {
  statusText?: string;
}

export const AIThinkingIndicator: React.FC<AIThinkingIndicatorProps> = ({ statusText }) => {
  return (
    <div className="flex items-start gap-3.5 py-4 select-none border-b border-[#141414]">
      {/* Nexus AI Icon */}
      <div className="w-7 h-7 rounded-lg bg-[#0E0E0E] border border-[#202020] flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
        <NexusLogo size={15} />
      </div>

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            NEXUS
          </span>
          <span className="text-[10px] text-neutral-500 font-medium">
            {statusText || 'Thinking...'}
          </span>
        </div>

        {/* 3 Minimal Pulsing Dots */}
        <div className="flex items-center gap-1.5 py-1">
          <span className="w-2 h-2 rounded-full bg-white animate-[bounce_1.2s_infinite_0ms]" />
          <span className="w-2 h-2 rounded-full bg-white animate-[bounce_1.2s_infinite_200ms]" />
          <span className="w-2 h-2 rounded-full bg-white animate-[bounce_1.2s_infinite_400ms]" />
        </div>
      </div>
    </div>
  );
};
