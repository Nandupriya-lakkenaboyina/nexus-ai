'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';
import {
  FolderArchive,
  Search,
  FileText,
  Image as ImageIcon,
  Database,
  Code,
  Download,
  Trash2,
  ExternalLink,
  Eye,
  Plus,
} from 'lucide-react';
import { LibraryCategory, LibraryItem } from '@/types';

export const LibraryModal: React.FC = () => {
  const { activeModal, closeModal, libraryItems, deleteLibraryItem, addAttachment } = useChat();
  const isOpen = activeModal === 'library';

  const [activeCategory, setActiveCategory] = useState<LibraryCategory | 'all'>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [previewItem, setPreviewItem] = useState<LibraryItem | null>(null);

  const filteredItems = libraryItems.filter((item) => {
    if (activeCategory !== 'all' && item.category !== activeCategory) return false;
    if (searchFilter.trim() && !item.name.toLowerCase().includes(searchFilter.toLowerCase())) return false;
    return true;
  });

  const getCategoryIcon = (cat: LibraryCategory) => {
    switch (cat) {
      case 'documents':
        return <FileText className="w-4 h-4 text-sky-400" />;
      case 'images':
        return <ImageIcon className="w-4 h-4 text-purple-400" />;
      case 'datasets':
        return <Database className="w-4 h-4 text-emerald-400" />;
      case 'generated':
        return <Code className="w-4 h-4 text-amber-400" />;
      case 'saved':
        return <FileText className="w-4 h-4 text-neutral-300" />;
    }
  };

  const handleDownload = (item: LibraryItem) => {
    if (item.url) {
      const a = document.createElement('a');
      a.href = item.url;
      a.download = item.name;
      a.click();
    } else {
      const blob = new Blob([item.content || item.name], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Central Workspace Library" maxWidth="4xl">
      <div className="space-y-4 select-none max-h-[80vh] overflow-y-auto custom-scrollbar pr-1">
        {/* Search & Category Pills */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#1C1C1C]">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#050505] border border-[#1C1C1C] rounded-xl">
            {(
              [
                { id: 'all', label: 'All Items' },
                { id: 'documents', label: 'Documents' },
                { id: 'images', label: 'Images' },
                { id: 'datasets', label: 'Datasets' },
                { id: 'generated', label: 'Generated' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  activeCategory === tab.id
                    ? 'bg-[#1C1C1C] text-white shadow-sm'
                    : 'text-[#8A8A8A] hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8A8A8A]" />
            <input
              type="text"
              value={searchFilter}
              onChange={(e) => setSearchFilter(e.target.value)}
              placeholder="Search library..."
              className="w-full pl-8 pr-3 py-1.5 bg-[#050505] border border-[#1C1C1C] rounded-xl text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#2D3748]"
            />
          </div>
        </div>

        {/* Library Grid View */}
        {filteredItems.length === 0 ? (
          <div className="py-16 text-center text-[#8A8A8A] space-y-2">
            <FolderArchive className="w-10 h-10 mx-auto opacity-40 text-white" />
            <p className="text-xs font-medium">No items found in this library category.</p>
            <span className="text-[11px] block">Uploaded files and generated artwork will appear here.</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-[#080808] hover:bg-[#0E0E0E] border border-[#1C1C1C] hover:border-neutral-700 rounded-xl flex flex-col justify-between transition-all group"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="p-2 rounded-lg bg-[#141414] border border-[#1C1C1C]">
                      {getCategoryIcon(item.category)}
                    </div>
                    <span className="text-[10px] font-mono text-[#8A8A8A] uppercase px-1.5 py-0.5 rounded bg-[#050505]">
                      {item.extension}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-xs font-semibold text-white truncate" title={item.name}>
                      {item.name}
                    </h4>
                    {item.description && (
                      <p className="text-[11px] text-[#8A8A8A] line-clamp-2 mt-0.5 leading-snug">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-2 border-t border-[#141414] text-[10px] text-[#8A8A8A]">
                  <span>{item.size} • {item.date}</span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleDownload(item)}
                      className="p-1 hover:text-white rounded hover:bg-[#1C1C1C] transition-colors cursor-pointer"
                      title="Download"
                    >
                      <Download className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteLibraryItem(item.id)}
                      className="p-1 hover:text-rose-400 rounded hover:bg-rose-500/10 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
