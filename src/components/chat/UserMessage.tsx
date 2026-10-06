'use client';

import React, { useState } from 'react';
import { Message } from '@/types';
import { useChat } from '@/context/ChatContext';
import { Pencil, FileText, User, Check, X } from 'lucide-react';

interface UserMessageProps {
  message: Message;
}

export const UserMessage: React.FC<UserMessageProps> = ({ message }) => {
  const { userProfile, editAndRegenerateMessage } = useChat();
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const handleSave = () => {
    if (editContent.trim()) {
      editAndRegenerateMessage(message.id, editContent.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="flex items-start gap-3.5 py-4 group select-text border-b border-[#141414]">
      {/* User Icon Badge */}
      <div className="w-7 h-7 rounded-lg bg-[#111111] border border-[#222222] flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
        <User className="w-3.5 h-3.5 text-neutral-300" />
      </div>

      <div className="flex-1 min-w-0 space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
              USER
            </span>
            <span className="text-[10px] text-neutral-500">{message.timestamp}</span>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="opacity-0 group-hover:opacity-100 flex items-center gap-1 text-[10px] text-neutral-400 hover:text-white transition-opacity px-2 py-0.5 rounded hover:bg-[#141414]"
              title="Edit prompt"
            >
              <Pencil className="w-3 h-3" />
              <span>Edit</span>
            </button>
          )}
        </div>

        {/* Attachments preview */}
        {message.attachments && message.attachments.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {message.attachments.map((att) => (
              <div
                key={att.id}
                className="flex items-center gap-2 p-1.5 px-2.5 bg-[#0A0A0A] border border-[#1C1C1C] rounded-lg text-xs"
              >
                {att.type === 'image' && att.thumbnail ? (
                  <img
                    src={att.thumbnail}
                    alt={att.name}
                    className="w-6 h-6 rounded object-cover"
                  />
                ) : (
                  <FileText className="w-3.5 h-3.5 text-neutral-400" />
                )}
                <span className="text-neutral-200 font-medium truncate max-w-[180px]">
                  {att.name}
                </span>
                <span className="text-[10px] text-neutral-500">{att.size}</span>
              </div>
            ))}
          </div>
        )}

        {/* Message Body or Edit Box */}
        {isEditing ? (
          <div className="space-y-2 mt-1">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-3 bg-[#0B0B0B] border border-[#333333] rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-white resize-none min-h-[70px]"
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={() => {
                  setEditContent(message.content);
                  setIsEditing(false);
                }}
                className="px-2.5 py-1 bg-[#141414] hover:bg-[#202020] text-neutral-300 text-xs rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-3 py-1 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-lg"
              >
                Save & Regenerate
              </button>
            </div>
          </div>
        ) : (
          <div className="text-xs sm:text-sm text-neutral-100 leading-relaxed whitespace-pre-wrap">
            {message.content}
          </div>
        )}
      </div>
    </div>
  );
};
