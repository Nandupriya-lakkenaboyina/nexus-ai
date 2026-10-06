'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { FileText, Image as ImageIcon, Video, Download, Eye, FileCode } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { LibraryItem } from '@/types';

export const FileList: React.FC = () => {
  const { libraryItems, deleteLibraryItem } = useChat();
  const [previewFile, setPreviewFile] = useState<LibraryItem | null>(null);

  const documentFiles = libraryItems.filter(
    (i) => i.category === 'documents' || i.category === 'datasets'
  );

  const handleDownload = (file: LibraryItem) => {
    const blob = new Blob([file.content || `File: ${file.name}`], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.click();
    URL.revokeObjectURL(url);
  };

  if (documentFiles.length === 0) {
    return (
      <div className="py-12 text-center select-none">
        <FileText className="w-8 h-8 text-neutral-600 mx-auto mb-2" />
        <p className="text-xs text-neutral-400 font-medium">No files uploaded yet</p>
        <p className="text-[11px] text-neutral-600 mt-1">
          Attach files in chat or library to view them here
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-2 select-none">
        {documentFiles.map((file) => (
          <div
            key={file.id}
            className="group flex items-center justify-between p-2.5 bg-[#0B0B0B] hover:bg-[#121212] border border-[#1C1C1C] rounded-xl transition-all"
          >
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-[#141414] border border-[#222222] flex items-center justify-center text-white flex-shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-white truncate">{file.name}</p>
                <p className="text-[10px] text-neutral-500">
                  {file.size} • {file.date}
                </p>
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
              <button
                onClick={() => setPreviewFile(file)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1C1C1C] rounded-lg transition-colors"
                title="Preview file"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => handleDownload(file)}
                className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#1C1C1C] rounded-lg transition-colors"
                title="Download file"
              >
                <Download className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* File Preview Modal */}
      {previewFile && (
        <Modal
          isOpen={!!previewFile}
          onClose={() => setPreviewFile(null)}
          title={`File: ${previewFile.name}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div className="p-4 bg-[#050505] rounded-xl border border-[#1C1C1C] space-y-2">
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-white">Category:</span>
                <span>{previewFile.category}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-white">Size:</span>
                <span>{previewFile.size}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-neutral-400">
                <span className="font-semibold text-white">Extension:</span>
                <span className="uppercase font-mono font-semibold text-white">
                  .{previewFile.extension}
                </span>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => handleDownload(previewFile)}
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl shadow-sm transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download File</span>
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
