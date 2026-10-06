'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { FileText, Image as ImageIcon, Video, X } from 'lucide-react';

export const AttachmentPreview: React.FC = () => {
  const { activeAttachments, removeAttachment } = useChat();

  if (activeAttachments.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 p-2.5 bg-neutral-900 border-b border-neutral-800 rounded-t-2xl">
      {activeAttachments.map((att) => (
        <div
          key={att.id}
          className="group relative flex items-center gap-2 px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs"
        >
          {att.type === 'image' && att.thumbnail ? (
            <img
              src={att.thumbnail}
              alt={att.name}
              className="w-5 h-5 rounded object-cover flex-shrink-0"
            />
          ) : att.type === 'image' ? (
            <ImageIcon className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
          ) : att.type === 'video' ? (
            <Video className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
          ) : (
            <FileText className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
          )}

          <span className="text-neutral-200 font-medium truncate max-w-[130px]">
            {att.name}
          </span>
          <span className="text-[10px] text-neutral-500">{att.size}</span>

          <button
            onClick={() => removeAttachment(att.id)}
            className="p-0.5 text-neutral-500 hover:text-neutral-200 rounded transition-colors"
            aria-label="Remove attachment"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      ))}
    </div>
  );
};
