'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { getTranslation } from '@/lib/translations';

export const SearchConversations: React.FC = () => {
  const { searchQuery, setSearchQuery, userSettings } = useChat();
  const t = getTranslation(userSettings.language);

  return (
    <div className="relative mb-2">
      <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-neutral-500">
        <Search className="w-3.5 h-3.5" />
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={t.searchChats || 'Search conversations...'}
        className="w-full pl-8 pr-7 py-1.5 bg-[#0F0F0F] border border-[#1E1E1E] hover:border-[#2A2A2A] rounded-xl text-xs text-neutral-200 placeholder-neutral-500 focus:outline-none focus:border-neutral-600 transition-colors"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-neutral-500 hover:text-white"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
};
