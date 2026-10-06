'use client';

import React, { useState } from 'react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';
import {
  Languages,
  ArrowRightLeft,
  Copy,
  Check,
  Sparkles,
  ArrowRight,
  Volume2,
} from 'lucide-react';

const LANGUAGES = [
  'English',
  'Telugu',
  'Hindi',
  'Tamil',
  'Kannada',
  'Malayalam',
  'Bengali',
  'Marathi',
  'Gujarati',
  'Spanish',
  'French',
  'German',
  'Japanese',
  'Chinese (Mandarin)',
  'Arabic',
  'Portuguese',
  'Russian',
  'Italian',
  'Korean',
];

export const TranslationModal: React.FC = () => {
  const { activeModal, closeModal, sendMessage } = useChat();
  const isOpen = activeModal === 'translate';

  const [fromLang, setFromLang] = useState('English');
  const [toLang, setToLang] = useState('Telugu');
  const [inputText, setInputText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleSwapLanguages = () => {
    const temp = fromLang;
    setFromLang(toLang);
    setToLang(temp);
    setInputText(translatedText);
    setTranslatedText(inputText);
  };

  const handleTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: `Translate the following text from ${fromLang} to ${toLang}. Output ONLY the final translation with no conversational preamble:\n\n${inputText}`,
            },
          ],
        }),
      });

      if (res.ok && res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let result = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          result += decoder.decode(value, { stream: true });
        }
        setTranslatedText(result.trim());
      } else {
        setTranslatedText(`[Translation to ${toLang}]: ${inputText}`);
      }
    } catch {
      setTranslatedText(`[Translation Error]: Unable to complete translation.`);
    } finally {
      setIsTranslating(false);
    }
  };

  const handleCopy = () => {
    if (!translatedText) return;
    navigator.clipboard.writeText(translatedText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSpeak = (text: string, lang: string) => {
    if (!window.speechSynthesis || !text) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleSendToChat = () => {
    if (!inputText.trim()) return;
    closeModal();
    sendMessage(`Please translate the following from ${fromLang} to ${toLang} and provide pronunciation notes and grammatical breakdown:\n\n"${inputText}"`);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Neural Multi-Language Translator" maxWidth="3xl">
      <div className="space-y-4 select-none">
        {/* Language Selection Header */}
        <div className="flex items-center justify-between gap-3 p-2 bg-[#080808] border border-[#1C1C1C] rounded-xl">
          <div className="flex-1">
            <span className="text-[10px] text-[#8A8A8A] font-mono block mb-1">FROM LANGUAGE</span>
            <select
              value={fromLang}
              onChange={(e) => setFromLang(e.target.value)}
              className="w-full p-2 bg-[#050505] border border-[#1C1C1C] rounded-lg text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwapLanguages}
            className="p-2 mt-4 rounded-lg bg-[#0B0B0B] hover:bg-[#141414] border border-[#1C1C1C] text-[#8A8A8A] hover:text-white transition-colors cursor-pointer"
            title="Swap Languages"
          >
            <ArrowRightLeft className="w-4 h-4" />
          </button>

          <div className="flex-1">
            <span className="text-[10px] text-[#8A8A8A] font-mono block mb-1">TO LANGUAGE</span>
            <select
              value={toLang}
              onChange={(e) => setToLang(e.target.value)}
              className="w-full p-2 bg-[#050505] border border-[#1C1C1C] rounded-lg text-xs font-semibold text-white focus:outline-none cursor-pointer"
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Translation Boxes Split */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Input Side */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#8A8A8A] font-mono px-1">
              <span>INPUT ({fromLang.toUpperCase()})</span>
              {inputText && (
                <button
                  onClick={() => handleSpeak(inputText, fromLang)}
                  className="hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Volume2 className="w-3 h-3" />
                  Listen
                </button>
              )}
            </div>
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={`Enter text in ${fromLang} to translate...`}
              className="w-full h-44 p-3 bg-[#050505] border border-[#1C1C1C] rounded-xl text-xs text-white placeholder-[#8A8A8A] focus:outline-none focus:border-[#2D3748] resize-none custom-scrollbar"
            />
          </div>

          {/* Output Side */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-[11px] text-[#8A8A8A] font-mono px-1">
              <span>OUTPUT ({toLang.toUpperCase()})</span>
              {translatedText && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSpeak(translatedText, toLang)}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3 h-3" />
                    Listen
                  </button>
                  <button
                    onClick={handleCopy}
                    className="hover:text-white flex items-center gap-1 cursor-pointer"
                  >
                    {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    Copy
                  </button>
                </div>
              )}
            </div>
            <div className="w-full h-44 p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl text-xs text-neutral-100 overflow-y-auto custom-scrollbar">
              {isTranslating ? (
                <div className="flex items-center gap-2 text-[#8A8A8A] text-xs h-full justify-center">
                  <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  <span>Translating with neural engine...</span>
                </div>
              ) : translatedText ? (
                <p className="whitespace-pre-wrap leading-relaxed">{translatedText}</p>
              ) : (
                <span className="text-[#8A8A8A] text-xs">Translation will appear here.</span>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1C1C1C]">
          <button
            onClick={handleSendToChat}
            disabled={!inputText.trim()}
            className="flex items-center gap-1.5 px-3 py-2 bg-[#0B0B0B] hover:bg-[#141414] border border-[#1C1C1C] text-xs font-medium text-[#8A8A8A] hover:text-white rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-sky-400" />
            <span>Deep Grammar Breakdown in Chat</span>
          </button>

          <button
            onClick={handleTranslate}
            disabled={isTranslating || !inputText.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl shadow-sm transition-all cursor-pointer disabled:opacity-50"
          >
            {isTranslating ? (
              <div className="w-3.5 h-3.5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <Languages className="w-3.5 h-3.5" />
            )}
            <span>Translate Now</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
