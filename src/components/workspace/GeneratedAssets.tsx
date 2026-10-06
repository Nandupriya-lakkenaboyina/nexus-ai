'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Download, Sparkles, Copy, Check, Maximize2 } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { LibraryItem } from '@/types';

export const GeneratedAssets: React.FC = () => {
  const { libraryItems, openModal } = useChat();
  const [selectedImage, setSelectedImage] = useState<LibraryItem | null>(null);
  const [copied, setCopied] = useState(false);

  const images = libraryItems.filter(
    (i) => i.category === 'images' || i.category === 'generated'
  );

  const handleCopyPrompt = (prompt: string) => {
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (images.length === 0) {
    return (
      <div className="py-12 text-center select-none">
        <Sparkles className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-xs text-neutral-400 font-medium">No generated images yet</p>
        <p className="text-[11px] text-neutral-600 mt-1">
          Use the Create Images tool to generate AI artwork
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2 select-none">
        {images.map((img) => (
          <div
            key={img.id}
            onClick={() => setSelectedImage(img)}
            className="group relative rounded-xl overflow-hidden bg-[#0A0A0A] border border-[#1C1C1C] aspect-square cursor-pointer hover:border-neutral-500 transition-all"
          >
            {img.url ? (
              <img
                src={img.url}
                alt={img.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-[#111111] text-white">
                <Sparkles className="w-6 h-6 text-neutral-400" />
              </div>
            )}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
              <div className="self-end p-1 bg-[#1A1A1A] rounded-lg text-white">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
              <p className="text-[10px] text-neutral-200 line-clamp-2 leading-tight">
                {img.description || img.name}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Inspector Modal */}
      <Modal
        isOpen={!!selectedImage}
        onClose={() => setSelectedImage(null)}
        title="AI Generated Asset Inspector"
        maxWidth="xl"
      >
        {selectedImage && (
          <div className="space-y-4">
            {selectedImage.url && (
              <div className="relative rounded-xl overflow-hidden bg-black border border-[#1C1C1C]">
                <img
                  src={selectedImage.url}
                  alt={selectedImage.name}
                  className="w-full max-h-[420px] object-contain"
                />
              </div>
            )}

            <div className="p-3.5 bg-[#080808] border border-[#1C1C1C] rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs text-neutral-400">
                <span className="font-semibold text-white">Asset Details:</span>
                <button
                  onClick={() => handleCopyPrompt(selectedImage.description || selectedImage.name)}
                  className="flex items-center gap-1 text-white hover:underline"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copied ? 'Copied' : 'Copy Description'}</span>
                </button>
              </div>
              <p className="text-xs text-neutral-300 leading-relaxed">
                {selectedImage.description || selectedImage.name}
              </p>
            </div>

            {selectedImage.url && (
              <div className="flex justify-end gap-2 pt-2">
                <a
                  href={selectedImage.url}
                  target="_blank"
                  rel="noreferrer"
                  download
                  className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl shadow-md transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Image</span>
                </a>
              </div>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};
