'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { AttachmentPreview } from './AttachmentPreview';
import {
  Paperclip,
  Image as ImageIcon,
  FileText,
  ArrowUp,
  Square,
  Mic,
  MicOff,
  Code2,
  BarChart3,
  BookOpen,
  Languages,
  Sparkles,
  Search,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { generateId } from '@/lib/utils';
import { Attachment } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';

interface SlashCommand {
  command: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
}

export const ChatInput: React.FC = () => {
  const {
    sendMessage,
    isStreaming,
    isThinking,
    stopGeneration,
    addAttachment,
    setIsImageGenModalOpen,
    activeAttachments,
    setActiveModeId,
    openModal,
  } = useChat();

  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const [selectedSlashIndex, setSelectedSlashIndex] = useState(0);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const recognitionRef = useRef<any>(null);
  const toolsMenuRef = useRef<HTMLDivElement>(null);

  const slashCommands: SlashCommand[] = [
    {
      command: '/code',
      name: 'Code Mode',
      description: 'Write, debug & run code in Python, Java, JS',
      icon: <Code2 className="w-3.5 h-3.5 text-emerald-400" />,
      action: () => {
        setActiveModeId('coding');
        setInput('');
      },
    },
    {
      command: '/study',
      name: 'Study Assistant',
      description: 'Generate study notes & practice questions',
      icon: <BookOpen className="w-3.5 h-3.5 text-indigo-400" />,
      action: () => {
        setActiveModeId('study');
        openModal('study');
        setInput('');
      },
    },
    {
      command: '/analyze',
      name: 'Data Analyst',
      description: 'Analyze CSV & Excel datasets with charts',
      icon: <BarChart3 className="w-3.5 h-3.5 text-amber-400" />,
      action: () => {
        setActiveModeId('data-analyst');
        openModal('data-analyst');
        setInput('');
      },
    },
    {
      command: '/summarize',
      name: 'Summarize Document',
      description: 'Summarize files & extract key insights',
      icon: <FileText className="w-3.5 h-3.5 text-sky-400" />,
      action: () => {
        setActiveModeId('document-analyst');
        setInput('');
      },
    },
    {
      command: '/research',
      name: 'Web Research',
      description: 'Real-time verified information with sources',
      icon: <Search className="w-3.5 h-3.5 text-cyan-400" />,
      action: () => {
        setActiveModeId('research');
        openModal('web-search');
        setInput('');
      },
    },
    {
      command: '/translate',
      name: 'Neural Translation',
      description: 'Translate across Indian & global languages',
      icon: <Languages className="w-3.5 h-3.5 text-violet-400" />,
      action: () => {
        openModal('translate');
        setInput('');
      },
    },
    {
      command: '/image',
      name: 'Create Images',
      description: 'Generate high resolution neural AI art',
      icon: <Sparkles className="w-3.5 h-3.5 text-pink-400" />,
      action: () => {
        setIsImageGenModalOpen(true);
        setInput('');
      },
    },
    {
      command: '/quiz',
      name: 'Take MCQ Quiz',
      description: 'Practice interactive quizzes with scoring',
      icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
      action: () => {
        openModal('study');
        setInput('');
      },
    },
  ];

  const toolsOptions = [
    {
      label: 'Analyze File',
      desc: 'PDF, DOCX, PPT, TXT, CSV, XLSX',
      icon: <FileText className="w-4 h-4 text-sky-400" />,
      action: () => {
        setActiveModeId('document-analyst');
        handleFileUpload('document', '.pdf,.docx,.pptx,.txt,.csv,.xlsx');
        setShowToolsMenu(false);
      },
    },
    {
      label: 'Analyze Image',
      desc: 'OCR, diagrams, charts, photos',
      icon: <ImageIcon className="w-4 h-4 text-pink-400" />,
      action: () => {
        handleFileUpload('image', 'image/*');
        setShowToolsMenu(false);
      },
    },
    {
      label: 'Generate Image',
      desc: 'Text-to-image neural studio',
      icon: <Sparkles className="w-4 h-4 text-amber-400" />,
      action: () => {
        setIsImageGenModalOpen(true);
        setShowToolsMenu(false);
      },
    },
    {
      label: 'Web Search',
      desc: 'Live web intelligence with citations',
      icon: <Search className="w-4 h-4 text-cyan-400" />,
      action: () => {
        openModal('web-search');
        setShowToolsMenu(false);
      },
    },
    {
      label: 'Translate',
      desc: 'Multi-language neural translator',
      icon: <Languages className="w-4 h-4 text-violet-400" />,
      action: () => {
        openModal('translate');
        setShowToolsMenu(false);
      },
    },
    {
      label: 'Study Tools',
      desc: 'Notes, MCQs, and Flashcards',
      icon: <BookOpen className="w-4 h-4 text-indigo-400" />,
      action: () => {
        openModal('study');
        setShowToolsMenu(false);
      },
    },
    {
      label: 'Code Sandbox',
      desc: 'Python, Java, JavaScript runner',
      icon: <Code2 className="w-4 h-4 text-emerald-400" />,
      action: () => {
        openModal('code-runner');
        setShowToolsMenu(false);
      },
    },
  ];

  const filteredCommands = slashCommands.filter(
    (c) => input.startsWith('/') && c.command.toLowerCase().includes(input.toLowerCase())
  );

  useEffect(() => {
    if (input.startsWith('/') && !input.includes(' ')) {
      setShowSlashMenu(true);
      setSelectedSlashIndex(0);
    } else {
      setShowSlashMenu(false);
    }
  }, [input]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  // Handle click outside tools menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (toolsMenuRef.current && !toolsMenuRef.current.contains(event.target as Node)) {
        setShowToolsMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSend = () => {
    if ((input.trim() || activeAttachments.length > 0) && !isStreaming && !isThinking) {
      sendMessage(input);
      setInput('');
      setShowSlashMenu(false);
      setShowToolsMenu(false);
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (showSlashMenu && filteredCommands.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedSlashIndex((prev) => (prev + 1) % filteredCommands.length);
        return;
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedSlashIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
        return;
      }
      if (e.key === 'Enter' || e.key === 'Tab') {
        e.preventDefault();
        filteredCommands[selectedSlashIndex].action();
        return;
      }
      if (e.key === 'Escape') {
        e.preventDefault();
        setShowSlashMenu(false);
        return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else if (e.key === 'Escape' && (isStreaming || isThinking)) {
      e.preventDefault();
      stopGeneration();
    }
  };

  const toggleVoiceInput = () => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      openModal('voice-chat');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        if (transcript) {
          setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        }
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
    }
  };

  const processFileAttachment = (file: File, type: Attachment['type']) => {
    const ext = (file.name.split('.').pop() || '').toLowerCase();
    const reader = new FileReader();

    const isImage = file.type.startsWith('image/');
    const isText =
      file.type.startsWith('text/') ||
      ['csv', 'json', 'md', 'ts', 'tsx', 'js', 'jsx', 'py', 'html', 'css', 'sql', 'yaml', 'yml', 'xml', 'env'].includes(
        ext
      );

    if (isImage || file.type === 'application/pdf') {
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        const newAtt: Attachment = {
          id: generateId(),
          name: file.name,
          type: isImage ? 'image' : 'document',
          extension: ext,
          size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
          thumbnail: isImage ? result : undefined,
          base64: base64Data,
          mimeType: file.type || (ext === 'pdf' ? 'application/pdf' : 'image/jpeg'),
        };
        addAttachment(newAtt);
      };
      reader.readAsDataURL(file);
    } else if (isText) {
      reader.onload = () => {
        const text = reader.result as string;
        const newAtt: Attachment = {
          id: generateId(),
          name: file.name,
          type: 'code',
          extension: ext,
          size: (file.size / 1024).toFixed(1) + ' KB',
          textContent: text,
          mimeType: file.type || 'text/plain',
        };
        addAttachment(newAtt);
      };
      reader.readAsText(file);
    } else {
      const newAtt: Attachment = {
        id: generateId(),
        name: file.name,
        type,
        extension: ext,
        size: (file.size / (1024 * 1024)).toFixed(1) + ' MB',
        mimeType: file.type || 'application/octet-stream',
      };
      addAttachment(newAtt);
    }
  };

  const handleFileUpload = (type: Attachment['type'], accept: string) => {
    const inputEl = document.createElement('input');
    inputEl.type = 'file';
    inputEl.accept = accept;
    inputEl.onchange = (e: Event) => {
      const target = e.target as HTMLInputElement;
      if (target.files && target.files[0]) {
        processFileAttachment(target.files[0], type);
      }
    };
    inputEl.click();
  };

  const isBusy = isStreaming || isThinking;
  const canSend = (input.trim() || activeAttachments.length > 0) && !isBusy;

  return (
    <div className="relative max-w-3xl sm:max-w-4xl mx-auto w-full px-4 sm:px-6 pb-4 sm:pb-6 pt-1 select-none">
      {/* Slash Command Bar Popover */}
      <AnimatePresence>
        {showSlashMenu && filteredCommands.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-full mb-3 left-4 sm:left-6 right-4 sm:right-6 bg-[#0E0E0E] border border-[#262626] rounded-2xl shadow-2xl p-2 z-30 max-h-64 overflow-y-auto custom-scrollbar backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Nexus Quick Commands
            </div>
            {filteredCommands.map((cmd, index) => (
              <button
                key={cmd.command}
                onClick={cmd.action}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                  index === selectedSlashIndex
                    ? 'bg-[#1C1C1C] text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-lg bg-[#141414] border border-[#282828] flex items-center justify-center flex-shrink-0">
                    {cmd.icon}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white mr-2">{cmd.command}</span>
                    <span className="text-xs text-neutral-400">{cmd.name}</span>
                  </div>
                </div>
                <span className="text-[11px] text-neutral-500 hidden sm:inline">{cmd.description}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Tools Menu Popover */}
      <AnimatePresence>
        {showToolsMenu && (
          <motion.div
            ref={toolsMenuRef}
            initial={{ opacity: 0, scale: 0.95, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full mb-3 left-4 sm:left-6 w-72 bg-[#0E0E0E] border border-[#262626] rounded-2xl shadow-2xl p-2 z-30 overflow-hidden backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[10px] font-bold text-neutral-500 uppercase tracking-wider">
              Nexus Advanced Tools
            </div>
            <div className="space-y-0.5">
              {toolsOptions.map((tool, idx) => (
                <button
                  key={idx}
                  onClick={tool.action}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left text-neutral-300 hover:text-white hover:bg-[#161616] transition-colors cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-lg bg-[#141414] border border-[#262626] flex items-center justify-center flex-shrink-0">
                    {tool.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-xs font-semibold text-white block leading-tight">
                      {tool.label}
                    </span>
                    <span className="text-[10px] text-neutral-400 block leading-tight truncate mt-0.5">
                      {tool.desc}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Rounded Prominent Chat Input Container */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            Array.from(e.dataTransfer.files).forEach((file) => {
              const isImg = file.type.startsWith('image/');
              processFileAttachment(file, isImg ? 'image' : 'document');
            });
          }
        }}
        className={`relative rounded-3xl bg-[#0B0B0B] border transition-all duration-200 shadow-[0_8px_30px_rgba(0,0,0,0.7)] ${
          isDragging
            ? 'border-white ring-2 ring-white/20 bg-[#141414]'
            : 'border-[#222222] hover:border-[#2C2C2C] focus-within:border-neutral-500 focus-within:shadow-[0_0_25px_rgba(255,255,255,0.06)]'
        }`}
      >
        <AttachmentPreview />

        {/* Text Input Area */}
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Nexus anything... (e.g. analyze files, code, write, study)"
          rows={1}
          className="w-full px-5 pt-4 pb-2 bg-transparent text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none resize-none min-h-[46px] max-h-40 custom-scrollbar leading-relaxed"
        />

        {/* Controls Bar: Attachment, Tools, Voice, Send */}
        <div className="flex items-center justify-between px-3.5 pb-3 pt-0.5">
          {/* Left Action Buttons */}
          <div className="flex items-center gap-1.5 text-neutral-400">
            {/* Tools Menu Button */}
            <button
              onClick={() => setShowToolsMenu((prev) => !prev)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                showToolsMenu
                  ? 'bg-white text-black shadow-sm'
                  : 'bg-[#141414] hover:bg-[#1E1E1E] text-neutral-300 hover:text-white border border-[#242424]'
              }`}
              title="Open Tools Menu"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tools</span>
            </button>

            {/* File Attachment */}
            <button
              onClick={() =>
                handleFileUpload(
                  'document',
                  '.pdf,.doc,.docx,.ppt,.pptx,.txt,.csv,.xlsx,.json,.md,.py,.js,.java'
                )
              }
              className="p-2 hover:text-white hover:bg-[#161616] rounded-xl text-neutral-400 transition-colors cursor-pointer"
              title="Attach File"
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Image Upload */}
            <button
              onClick={() => handleFileUpload('image', 'image/*')}
              className="p-2 hover:text-white hover:bg-[#161616] rounded-xl text-neutral-400 transition-colors cursor-pointer"
              title="Upload Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Microphone Voice Button */}
            <button
              onClick={toggleVoiceInput}
              className={`p-2 rounded-xl text-xs transition-all cursor-pointer ${
                isListening
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                  : 'text-neutral-400 hover:text-white hover:bg-[#161616]'
              }`}
              title={isListening ? 'Stop listening' : 'Voice Input'}
            >
              {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </button>

            {/* Send or Stop Button */}
            {isBusy ? (
              <button
                onClick={stopGeneration}
                className="w-8 h-8 rounded-xl bg-[#222222] hover:bg-[#2C2C2C] text-white flex items-center justify-center transition-all cursor-pointer shadow-md"
                title="Stop generating"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                onClick={handleSend}
                disabled={!canSend}
                className={`w-8 h-8 rounded-xl flex items-center justify-center transition-all ${
                  canSend
                    ? 'bg-white hover:bg-neutral-200 text-black shadow-[0_0_15px_rgba(255,255,255,0.2)] font-semibold cursor-pointer active:scale-95'
                    : 'bg-[#161616] text-neutral-600 cursor-not-allowed'
                }`}
                title="Send message"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
