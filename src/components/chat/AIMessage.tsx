'use client';

import React, { useState, useEffect } from 'react';
import { Message } from '@/types';
import { NexusLogo } from '@/components/ui/NexusLogo';
import {
  Copy,
  Check,
  RotateCw,
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  Volume2,
  VolumeX,
  Play,
  ExternalLink,
  Info,
  AlertTriangle,
  Lightbulb,
  ShieldAlert,
  Maximize2,
} from 'lucide-react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';

interface AIMessageProps {
  message: Message;
}

export const AIMessage: React.FC<AIMessageProps> = ({ message }) => {
  const { regenerateLastResponse, setIsImageGenModalOpen, openModal } = useChat();
  const [copied, setCopied] = useState(false);
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleCopyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 1800);
  };

  const handleDownloadResponse = () => {
    const blob = new Blob([message.content], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexus-response-${Date.now()}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      alert('Text-to-speech is not supported in this browser.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    window.speechSynthesis.cancel();
    const cleanText = message.content
      .replace(/```[\s\S]*?```/g, ' Code block omitted. ')
      .replace(/[#*`_~>\[\]]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    if (!cleanText) return;

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const formatInlineMarkdown = (str: string) => {
    return str
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-white">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-neutral-300">$1</em>')
      .replace(
        /`(.*?)`/g,
        '<code class="px-1.5 py-0.5 bg-[#141414] text-neutral-200 border border-[#222222] rounded text-xs font-mono font-medium">$1</code>'
      )
      .replace(
        /\[(.*?)\]\((.*?)\)/g,
        '<a href="$2" target="_blank" rel="noreferrer" class="text-white hover:underline font-medium inline-flex items-center gap-0.5">$1</a>'
      );
  };

  const renderFormattedContent = (content: string) => {
    const rawLines = content.split(/\r?\n/);
    const elements: React.ReactNode[] = [];

    let i = 0;
    while (i < rawLines.length) {
      const line = rawLines[i];

      // Code blocks
      if (line.startsWith('```')) {
        const lang = line.replace('```', '').trim() || 'code';
        const codeLines: string[] = [];
        i++;
        while (i < rawLines.length && !rawLines[i].startsWith('```')) {
          codeLines.push(rawLines[i]);
          i++;
        }
        i++;

        const fullCode = codeLines.join('\n');
        const blockId = `code-block-${i}-${Math.random().toString(36).substring(2, 6)}`;
        elements.push(
          <div
            key={blockId}
            className="my-3 overflow-hidden rounded-xl border border-[#202020] bg-[#070707] shadow-lg"
          >
            <div className="flex items-center justify-between px-3.5 py-2 bg-[#0E0E0E] border-b border-[#1C1C1C] text-[11px] text-neutral-400 font-mono">
              <span className="font-semibold text-neutral-300 uppercase tracking-wider text-[10px]">
                {lang}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openModal('code-runner')}
                  className="flex items-center gap-1 text-neutral-400 hover:text-white px-2 py-0.5 rounded bg-[#161616] hover:bg-[#202020] transition-colors text-[10px]"
                  title="Run in Code Sandbox"
                >
                  <Play className="w-3 h-3" />
                  <span>Run Sandbox</span>
                </button>
                <button
                  onClick={() => handleCopyCode(fullCode, blockId)}
                  className="flex items-center gap-1.5 hover:text-white transition-colors text-[11px]"
                >
                  {copiedCodeId === blockId ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-medium">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
            <pre className="p-4 text-xs font-mono text-neutral-200 overflow-x-auto leading-relaxed custom-scrollbar bg-[#050505]">
              <code>{fullCode}</code>
            </pre>
          </div>
        );
        continue;
      }

      // Markdown Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        const tableLines: string[] = [];
        while (i < rawLines.length && rawLines[i].trim().startsWith('|') && rawLines[i].trim().endsWith('|')) {
          tableLines.push(rawLines[i].trim());
          i++;
        }

        if (tableLines.length >= 2) {
          const cleanCols = (row: string) =>
            row
              .split('|')
              .map((c) => c.trim())
              .slice(1, -1);

          const headers = cleanCols(tableLines[0]);
          const rows: string[][] = [];
          for (let j = 2; j < tableLines.length; j++) {
            const cols = cleanCols(tableLines[j]);
            if (cols.length > 0) rows.push(cols);
          }

          const tableKey = `table-${i}-${Math.random().toString(36).substring(2, 6)}`;
          elements.push(
            <div key={tableKey} className="my-3 overflow-x-auto rounded-xl border border-[#202020] bg-[#0A0A0A] custom-scrollbar">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#202020] bg-[#111111] text-white font-semibold">
                    {headers.map((h, hIdx) => (
                      <th key={hIdx} className="p-3">
                        <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(h) }} />
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, rIdx) => (
                    <tr
                      key={rIdx}
                      className="border-b border-[#181818] hover:bg-[#121212] transition-colors"
                    >
                      {r.map((c, cIdx) => (
                        <td key={cIdx} className="p-3 text-neutral-300">
                          <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(c) }} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
          continue;
        }
      }

      // Callouts: > [!NOTE], > [!TIP], > [!WARNING], > [!IMPORTANT]
      if (line.startsWith('> [!')) {
        const typeMatch = line.match(/> \[!(NOTE|TIP|WARNING|IMPORTANT|CAUTION)\]/i);
        const calloutType = typeMatch ? typeMatch[1].toUpperCase() : 'NOTE';
        const calloutLines: string[] = [];
        i++;
        while (i < rawLines.length && rawLines[i].startsWith('>')) {
          calloutLines.push(rawLines[i].replace(/^>\s?/, ''));
          i++;
        }

        elements.push(
          <div
            key={`callout-${i}`}
            className="my-3 p-3.5 rounded-xl border border-[#282828] bg-[#0C0C0C] flex items-start gap-3"
          >
            <Info className="w-4 h-4 text-white flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-xs sm:text-sm text-neutral-200 space-y-1">
              <span className="font-semibold uppercase text-[10px] tracking-wider block text-white">
                {calloutType}
              </span>
              <p dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(calloutLines.join(' ')) }} />
            </div>
          </div>
        );
        continue;
      }

      // Blockquotes
      if (line.startsWith('> ')) {
        elements.push(
          <blockquote
            key={i}
            className="border-l-2 border-neutral-600 pl-3.5 py-1 my-2 text-neutral-400 text-xs italic bg-[#080808]/40 rounded-r"
          >
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line.replace('> ', '')) }} />
          </blockquote>
        );
        i++;
        continue;
      }

      // Headings
      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={i} className="text-sm font-bold text-white mt-4 mb-1.5">
            {line.replace('### ', '')}
          </h3>
        );
        i++;
        continue;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={i} className="text-base font-bold text-white mt-5 mb-2 border-b border-[#1A1A1A] pb-1">
            {line.replace('## ', '')}
          </h2>
        );
        i++;
        continue;
      }

      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={i} className="text-lg font-bold text-white mt-5 mb-2.5">
            {line.replace('# ', '')}
          </h1>
        );
        i++;
        continue;
      }

      // Horizontal Rule
      if (line.trim() === '---' || line.trim() === '***') {
        elements.push(<hr key={i} className="my-3 border-[#202020]" />);
        i++;
        continue;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const itemText = line.trim().substring(2);
        elements.push(
          <li key={i} className="ml-4 list-disc text-neutral-300 text-xs sm:text-sm py-0.5">
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(itemText) }} />
          </li>
        );
        i++;
        continue;
      }

      // Numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s(.*)/);
      if (numMatch) {
        elements.push(
          <div key={i} className="flex items-start gap-2 ml-1 text-neutral-300 text-xs sm:text-sm py-0.5">
            <span className="font-semibold text-white text-xs flex-shrink-0">{numMatch[1]}.</span>
            <span dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(numMatch[2]) }} />
          </div>
        );
        i++;
        continue;
      }

      // Empty spacing
      if (!line.trim()) {
        elements.push(<div key={i} className="h-1.5" />);
        i++;
        continue;
      }

      // Paragraph
      elements.push(
        <p
          key={i}
          className="text-xs sm:text-sm text-neutral-200 leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(line) }}
        />
      );
      i++;
    }

    return elements;
  };

  return (
    <>
      <div className="flex items-start gap-3.5 py-4 group select-text border-b border-[#141414]">
        {/* Nexus AI Icon */}
        <div className="w-7 h-7 rounded-lg bg-[#0E0E0E] border border-[#202020] flex items-center justify-center text-white flex-shrink-0 mt-0.5 shadow-sm">
          <NexusLogo size={15} />
        </div>

        {/* Message Content Area */}
        <div className="flex-1 min-w-0 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                NEXUS
              </span>
              <span className="text-[10px] text-neutral-500">{message.timestamp}</span>
            </div>
          </div>

          {/* Formatted Markdown Content */}
          <div className="space-y-0.5 leading-relaxed text-neutral-200">
            {renderFormattedContent(message.content)}
          </div>

          {/* Web Search Sources / Citations if available */}
          {message.sources && message.sources.length > 0 && (
            <div className="mt-3 p-3 rounded-xl border border-[#1C1C1C] bg-[#070707] space-y-2">
              <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                Retrieved Sources & Citations
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {message.sources.map((source, sIdx) => (
                  <a
                    key={sIdx}
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-between p-2 rounded-lg bg-[#0E0E0E] border border-[#1C1C1C] hover:border-neutral-500 transition-colors group/src"
                  >
                    <div className="min-w-0 pr-2">
                      <div className="text-xs text-white font-medium truncate group-hover/src:underline">
                        {source.title}
                      </div>
                      <div className="text-[10px] text-neutral-500 truncate">{source.url}</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500 group-hover/src:text-white flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Generated Image Card if any */}
          {message.generatedImage && (
            <div className="mt-3 overflow-hidden rounded-xl border border-[#202020] bg-[#0B0B0B] max-w-lg shadow-lg">
              <div
                className="relative cursor-pointer group/img"
                onClick={() => setLightboxImage(message.generatedImage!.imageUrl)}
              >
                <img
                  src={message.generatedImage.imageUrl}
                  alt={message.generatedImage.prompt}
                  className="w-full object-cover max-h-[340px] transition-transform duration-200 group-hover/img:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-[#121212] text-white rounded-lg text-xs font-medium border border-neutral-700 shadow-xl">
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>View Full Size</span>
                  </span>
                </div>
              </div>
              <div className="p-3 flex items-center justify-between border-t border-[#1C1C1C] bg-[#080808]">
                <span className="text-xs text-neutral-400 truncate max-w-[240px]">
                  {message.generatedImage.prompt}
                </span>
                <div className="flex items-center gap-1">
                  <a
                    href={message.generatedImage.imageUrl}
                    target="_blank"
                    rel="noreferrer"
                    download
                    className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#181818] rounded-lg text-xs transition-colors"
                    title="Download"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Clean Action Bar */}
          <div className="flex items-center gap-1 pt-1.5 opacity-70 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopyMessage}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#141414] rounded-md text-xs transition-colors"
              title="Copy message"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={handleToggleSpeech}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                isSpeaking
                  ? 'text-white bg-[#222222]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
              }`}
              title={isSpeaking ? 'Stop speech' : 'Read aloud'}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={regenerateLastResponse}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#141414] rounded-md text-xs transition-colors"
              title="Regenerate response"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleDownloadResponse}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#141414] rounded-md text-xs transition-colors"
              title="Download Markdown"
            >
              <Download className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setLiked(liked === true ? null : true)}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                liked === true
                  ? 'text-white bg-[#222222]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
              }`}
              title="Good response"
            >
              <ThumbsUp className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => setLiked(liked === false ? null : false)}
              className={`p-1.5 rounded-md text-xs transition-colors ${
                liked === false
                  ? 'text-white bg-[#222222]'
                  : 'text-neutral-400 hover:text-white hover:bg-[#141414]'
              }`}
              title="Bad response"
            >
              <ThumbsDown className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert('Conversation link copied');
              }}
              className="p-1.5 text-neutral-400 hover:text-white hover:bg-[#141414] rounded-md text-xs transition-colors"
              title="Share"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <Modal
          isOpen={!!lightboxImage}
          onClose={() => setLightboxImage(null)}
          title="Image Preview"
          maxWidth="3xl"
        >
          <div className="space-y-3">
            <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center p-2 border border-[#1C1C1C]">
              <img
                src={lightboxImage}
                alt="AI Generated"
                className="max-h-[75vh] w-auto object-contain rounded-lg"
              />
            </div>
            <div className="flex justify-end gap-2">
              <a
                href={lightboxImage}
                target="_blank"
                rel="noreferrer"
                download
                className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-xl transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res</span>
              </a>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};
