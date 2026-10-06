'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Copy, Check, RotateCw, ThumbsUp, ThumbsDown, Share2, MoreHorizontal } from 'lucide-react';
import { Dropdown } from '@/components/ui/Dropdown';

interface MessageActionsProps {
  content: string;
  isAI?: boolean;
}

export const MessageActions: React.FC<MessageActionsProps> = ({ content, isAI = false }) => {
  const { regenerateLastResponse } = useChat();
  const [copied, setCopied] = useState(false);
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const moreItems = [
    {
      id: 'copy-markdown',
      label: 'Copy as Markdown',
      onClick: handleCopy,
    },
    {
      id: 'export-txt',
      label: 'Export as Text file',
      onClick: () => {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'nexus-response.txt';
        a.click();
      },
    },
    {
      id: 'report',
      label: 'Report issue',
      danger: true,
      onClick: () => alert('Feedback submitted. Thank you!'),
    },
  ];

  return (
    <div className="flex items-center gap-1 mt-2 text-neutral-400">
      {/* Copy Button */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-1 px-2 py-1 text-xs hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
        title="Copy message"
      >
        {copied ? (
          <Check className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Copy className="w-3.5 h-3.5" />
        )}
        <span className="hidden sm:inline">{copied ? 'Copied' : 'Copy'}</span>
      </button>

      {isAI && (
        <>
          {/* Regenerate Button */}
          <button
            onClick={regenerateLastResponse}
            className="flex items-center gap-1 px-2 py-1 text-xs hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Regenerate response"
          >
            <RotateCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Regenerate</span>
          </button>

          {/* Like Button */}
          <button
            onClick={() => setLiked(liked === true ? null : true)}
            className={`p-1.5 text-xs hover:bg-neutral-800 rounded-lg transition-colors ${
              liked === true ? 'text-indigo-400 bg-indigo-500/10' : 'hover:text-neutral-200'
            }`}
            title="Good response"
          >
            <ThumbsUp className="w-3.5 h-3.5" />
          </button>

          {/* Dislike Button */}
          <button
            onClick={() => setLiked(liked === false ? null : false)}
            className={`p-1.5 text-xs hover:bg-neutral-800 rounded-lg transition-colors ${
              liked === false ? 'text-rose-400 bg-rose-500/10' : 'hover:text-neutral-200'
            }`}
            title="Bad response"
          >
            <ThumbsDown className="w-3.5 h-3.5" />
          </button>

          {/* Share Button */}
          <button
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }}
            className="flex items-center gap-1 px-2 py-1 text-xs hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors"
            title="Share message"
          >
            <Share2 className="w-3.5 h-3.5" />
          </button>

          {/* More Options */}
          <Dropdown
            trigger={
              <button className="p-1.5 text-xs hover:text-neutral-200 hover:bg-neutral-800 rounded-lg transition-colors">
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>
            }
            items={moreItems}
          />
        </>
      )}
    </div>
  );
};
