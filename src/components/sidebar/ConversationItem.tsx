'use client';

import React, { useState } from 'react';
import { Conversation, ChatFolderType } from '@/types';
import { useChat } from '@/context/ChatContext';
import { Dropdown } from '@/components/ui/Dropdown';
import {
  MessageSquare,
  Pin,
  MoreHorizontal,
  Pencil,
  Trash2,
  Share2,
  Check,
  Folder,
  Archive,
} from 'lucide-react';

interface ConversationItemProps {
  conversation: Conversation;
}

export const ConversationItem: React.FC<ConversationItemProps> = ({ conversation }) => {
  const {
    currentConversationId,
    selectConversation,
    pinConversation,
    renameConversation,
    deleteConversation,
    exportConversation,
    setConversationFolder,
    archiveConversation,
  } = useChat();

  const [isRenaming, setIsRenaming] = useState(false);
  const [newTitle, setNewTitle] = useState(conversation.title);

  const isActive = currentConversationId === conversation.id;

  const handleSaveRename = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (newTitle.trim()) {
      renameConversation(conversation.id, newTitle);
    }
    setIsRenaming(false);
  };

  const handleFolderChange = (folder: ChatFolderType) => {
    setConversationFolder(conversation.id, folder);
  };

  const menuItems = [
    {
      id: 'pin',
      label: conversation.pinned ? 'Unpin' : 'Pin to top',
      icon: <Pin className="w-3.5 h-3.5 text-neutral-400" />,
      onClick: () => pinConversation(conversation.id),
    },
    {
      id: 'rename',
      label: 'Rename',
      icon: <Pencil className="w-3.5 h-3.5 text-neutral-400" />,
      onClick: () => {
        setNewTitle(conversation.title);
        setIsRenaming(true);
      },
    },
    {
      id: 'folder-coding',
      label: 'Move to: Coding',
      icon: <Folder className="w-3.5 h-3.5 text-cyan-400" />,
      onClick: () => handleFolderChange('coding'),
    },
    {
      id: 'folder-study',
      label: 'Move to: Study',
      icon: <Folder className="w-3.5 h-3.5 text-emerald-400" />,
      onClick: () => handleFolderChange('study'),
    },
    {
      id: 'folder-projects',
      label: 'Move to: Projects',
      icon: <Folder className="w-3.5 h-3.5 text-amber-400" />,
      onClick: () => handleFolderChange('projects'),
    },
    {
      id: 'folder-research',
      label: 'Move to: Research',
      icon: <Folder className="w-3.5 h-3.5 text-sky-400" />,
      onClick: () => handleFolderChange('research'),
    },
    {
      id: 'folder-personal',
      label: 'Move to: Personal',
      icon: <Folder className="w-3.5 h-3.5 text-neutral-400" />,
      onClick: () => handleFolderChange('personal'),
    },
    {
      id: 'archive',
      label: conversation.folder === 'archived' ? 'Unarchive' : 'Archive chat',
      icon: <Archive className="w-3.5 h-3.5 text-neutral-400" />,
      onClick: () => archiveConversation(conversation.id),
    },
    {
      id: 'export-md',
      label: 'Export Markdown',
      icon: <Share2 className="w-3.5 h-3.5 text-neutral-400" />,
      onClick: () => exportConversation(conversation.id, 'markdown'),
    },
    {
      id: 'delete',
      label: 'Delete chat',
      icon: <Trash2 className="w-3.5 h-3.5 text-rose-400" />,
      danger: true,
      onClick: () => deleteConversation(conversation.id),
    },
  ];

  if (isRenaming) {
    return (
      <form
        onSubmit={handleSaveRename}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-[#141414] border border-[#2E2E2E] rounded-xl my-0.5"
      >
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          autoFocus
          onBlur={handleSaveRename}
          className="w-full bg-transparent text-xs text-white focus:outline-none"
        />
        <button type="submit" className="p-1 text-emerald-400 hover:text-emerald-300">
          <Check className="w-3.5 h-3.5" />
        </button>
      </form>
    );
  }

  return (
    <div
      onClick={() => selectConversation(conversation.id)}
      className={`group relative flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all my-0.5 border ${
        isActive
          ? 'bg-[#181818] border-[#2A2A2A] text-white shadow-sm'
          : 'bg-transparent border-transparent text-neutral-400 hover:text-neutral-200 hover:bg-[#121212]'
      }`}
    >
      <div className="flex items-center gap-2.5 min-w-0 pr-1">
        <MessageSquare
          className={`w-3.5 h-3.5 flex-shrink-0 ${
            isActive ? 'text-white' : 'text-neutral-500 group-hover:text-neutral-400'
          }`}
        />
        <span className="text-xs truncate font-medium">{conversation.title}</span>
        {conversation.pinned && (
          <Pin className="w-2.5 h-2.5 text-neutral-300 flex-shrink-0" />
        )}
      </div>

      <div
        className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0"
        onClick={(e) => e.stopPropagation()}
      >
        <Dropdown
          align="right"
          trigger={
            <button className="p-1 text-neutral-500 hover:text-white rounded-lg hover:bg-[#202020] transition-colors">
              <MoreHorizontal className="w-3.5 h-3.5" />
            </button>
          }
          items={menuItems}
        />
      </div>
    </div>
  );
};
