'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { ConversationItem } from './ConversationItem';
import { MessageSquareDashed } from 'lucide-react';

export const ConversationList: React.FC = () => {
  const { filteredConversations, activeFolder } = useChat();

  const pinned = filteredConversations.filter((c) => c.pinned);
  const recent = filteredConversations.filter((c) => !c.pinned);

  if (filteredConversations.length === 0) {
    return (
      <div className="py-4 px-2 text-center border border-dashed border-[#1A1A1A] rounded-lg bg-[#080808]/50 my-1">
        <MessageSquareDashed className="w-5 h-5 text-neutral-600 mx-auto mb-1.5" />
        <p className="text-xs text-neutral-300 font-medium">No conversations yet</p>
        <p className="text-[10px] text-neutral-500 mt-0.5">
          {activeFolder !== 'all'
            ? `No chats in ${activeFolder} folder.`
            : 'Start a new conversation to see it here.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 pb-2">
      {/* Pinned Section */}
      {pinned.length > 0 && (
        <div>
          <div className="px-1.5 mb-1 text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
            Pinned
          </div>
          <div className="space-y-0.5">
            {pinned.map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </div>
        </div>
      )}

      {/* Recent Section */}
      {recent.length > 0 && (
        <div>
          {pinned.length > 0 && (
            <div className="px-1.5 mb-1 text-[9px] font-bold text-neutral-500 uppercase tracking-wider">
              Recent
            </div>
          )}
          <div className="space-y-0.5">
            {recent.map((conv) => (
              <ConversationItem key={conv.id} conversation={conv} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
