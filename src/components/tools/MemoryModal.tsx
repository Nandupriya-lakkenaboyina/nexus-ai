'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';
import {
  Brain,
  Plus,
  Trash2,
  Check,
  Shield,
  Sparkles,
} from 'lucide-react';

export const MemoryModal: React.FC = () => {
  const {
    activeModal,
    closeModal,
    memories,
    isMemoryEnabled,
    toggleMemory,
    addMemory,
    deleteMemory,
    clearMemories,
  } = useChat();

  const isOpen = activeModal === 'manage-memory';
  const [newMemoryText, setNewMemoryText] = useState('');

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemoryText.trim()) return;
    addMemory(newMemoryText.trim(), 'preference');
    setNewMemoryText('');
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Nexus Memory Management" maxWidth="lg">
      <div className="space-y-5 select-none max-h-[75vh] overflow-y-auto custom-scrollbar pr-1">
        {/* Memory Active Status Banner */}
        <div className="p-3.5 bg-[#080808] border border-[#1C1C1C] rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#141414] border border-[#1C1C1C] text-sky-400">
              <Brain className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">Nexus Adaptive Memory</h4>
              <p className="text-[11px] text-[#8A8A8A]">
                Remembers user preferences and project context across conversations.
              </p>
            </div>
          </div>

          <button
            onClick={toggleMemory}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
              isMemoryEnabled
                ? 'bg-white text-black hover:bg-neutral-200'
                : 'bg-[#1C1C1C] text-[#8A8A8A] hover:text-white'
            }`}
          >
            {isMemoryEnabled ? 'Active (ON)' : 'Disabled (OFF)'}
          </button>
        </div>

        {/* Add Memory Form */}
        <form onSubmit={handleAdd} className="space-y-2">
          <label className="text-xs font-medium text-white block">Add Memory Entry</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newMemoryText}
              onChange={(e) => setNewMemoryText(e.target.value)}
              placeholder="e.g. Always generate code with strict TypeScript and Tailwind CSS..."
              className="flex-1 px-3.5 py-2 bg-[#050505] border border-[#1C1C1C] rounded-xl text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#2D3748] transition-colors"
            />
            <button
              type="submit"
              disabled={!newMemoryText.trim()}
              className="flex items-center gap-1.5 px-4 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>
        </form>

        {/* Stored Memories List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#8A8A8A] font-mono px-1">
            <span>STORED MEMORY ENTRIES ({memories.length})</span>
            {memories.length > 0 && (
              <button
                onClick={clearMemories}
                className="hover:text-rose-400 flex items-center gap-1 cursor-pointer transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Clear All
              </button>
            )}
          </div>

          {memories.length === 0 ? (
            <div className="py-8 text-center text-[#8A8A8A] bg-[#050505] border border-[#1C1C1C] rounded-xl text-xs">
              No custom memories stored yet.
            </div>
          ) : (
            <div className="space-y-2">
              {memories.map((mem) => (
                <div
                  key={mem.id}
                  className="p-3 bg-[#080808] hover:bg-[#0E0E0E] border border-[#1C1C1C] rounded-xl flex items-center justify-between gap-3 transition-colors group"
                >
                  <div className="space-y-0.5 min-w-0">
                    <p className="text-xs text-neutral-200 leading-relaxed font-sans">{mem.content}</p>
                    <span className="text-[10px] text-[#8A8A8A] font-mono uppercase">
                      {mem.category || 'General'}
                    </span>
                  </div>

                  <button
                    onClick={() => deleteMemory(mem.id)}
                    className="p-1.5 text-[#8A8A8A] hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer flex-shrink-0"
                    title="Delete Memory"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Privacy badge */}
        <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8A8A8A] pt-2 border-t border-[#1C1C1C]">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Memories are stored locally on your device with zero cloud tracking.</span>
        </div>
      </div>
    </Modal>
  );
};
