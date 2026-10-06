'use client';

import React from 'react';
import { AIResponseStatus } from '@/types';
import { Sparkles, Check, AlertCircle, Loader2 } from 'lucide-react';

interface AIStatusProps {
  status: AIResponseStatus;
  customText?: string;
  className?: string;
}

export const AIStatus: React.FC<AIStatusProps> = ({ status, customText, className = '' }) => {
  if (status === 'idle') return null;

  const statusConfigs: Record<
    AIResponseStatus,
    { text: string; icon: React.ReactNode; color: string }
  > = {
    idle: { text: '', icon: null, color: '' },
    uploading: {
      text: 'Uploading your file...',
      icon: <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />,
      color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    },
    analyzing: {
      text: 'Analyzing your request...',
      icon: <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-400" />,
      color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    },
    'file-analysis': {
      text: 'Reading uploaded file...',
      icon: <Loader2 className="w-3.5 h-3.5 animate-spin text-purple-400" />,
      color: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
    },
    generating: {
      text: 'Generating response...',
      icon: <Sparkles className="w-3.5 h-3.5 animate-bounce text-cyan-400" />,
      color: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
    },
    streaming: {
      text: 'Generating...',
      icon: <Sparkles className="w-3.5 h-3.5 animate-spin text-indigo-400" />,
      color: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20',
    },
    completed: {
      text: 'Response complete',
      icon: <Check className="w-3.5 h-3.5 text-emerald-400" />,
      color: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
    },
    error: {
      text: 'Something went wrong.',
      icon: <AlertCircle className="w-3.5 h-3.5 text-rose-400" />,
      color: 'bg-rose-500/10 text-rose-300 border-rose-500/20',
    },
  };

  const current = statusConfigs[status];
  const displayText = customText || current.text;

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium backdrop-blur-sm transition-all duration-200 ${current.color} ${className}`}
    >
      <span>✦</span>
      <span className="flex items-center gap-1.5">{displayText}</span>
    </div>
  );
};
