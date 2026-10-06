'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { Modal } from '@/components/ui/Modal';
import { Mic, MicOff, Send, X, Volume2, Sparkles } from 'lucide-react';

export const VoiceChatModal: React.FC = () => {
  const { activeModal, closeModal, sendMessage } = useChat();
  const isOpen = activeModal === 'voice-chat';

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [speechSupported, setSpeechSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        let currentText = '';
        for (let i = 0; i < event.results.length; i++) {
          currentText += event.results[i][0].transcript + ' ';
        }
        setTranscript(currentText.trim());
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    } else {
      setSpeechSupported(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen && speechSupported && recognitionRef.current) {
      startListening();
    } else {
      stopListening();
    }
    return () => {
      stopListening();
    };
  }, [isOpen]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      try {
        setTranscript('');
        recognitionRef.current.start();
        setIsListening(true);
      } catch {
        // ignore already started
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
      setIsListening(false);
    }
  };

  const handleSend = () => {
    if (!transcript.trim()) return;
    const prompt = transcript.trim();
    stopListening();
    closeModal();
    sendMessage(prompt);
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeModal} title="Nexus Voice Intelligence" maxWidth="md">
      <div className="py-6 px-2 text-center space-y-6 select-none">
        {/* Animated Microphone Listening Halo */}
        <div className="relative inline-flex items-center justify-center">
          {isListening && (
            <>
              <div className="absolute w-28 h-28 bg-white/5 rounded-full animate-ping pointer-events-none" />
              <div className="absolute w-20 h-20 bg-sky-400/10 rounded-full animate-pulse pointer-events-none" />
            </>
          )}

          <button
            onClick={isListening ? stopListening : startListening}
            className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-xl ${
              isListening
                ? 'bg-white text-black shadow-white/20 scale-105'
                : 'bg-[#1C1C1C] hover:bg-[#252525] text-white'
            }`}
          >
            {isListening ? <Mic className="w-8 h-8" /> : <MicOff className="w-8 h-8 text-[#8A8A8A]" />}
          </button>
        </div>

        {/* Listening Status & Animated Dots */}
        <div>
          <h3 className="text-sm font-bold text-white flex items-center justify-center gap-2">
            {isListening ? (
              <>
                <span>Listening</span>
                <span className="flex gap-1 text-sky-400 font-mono tracking-widest animate-pulse">
                  ● ● ●
                </span>
              </>
            ) : (
              <span>Microphone Paused</span>
            )}
          </h3>
          <p className="text-xs text-[#8A8A8A] mt-1">
            {isListening
              ? 'Speak naturally into your microphone. Nexus is transcribing in real-time.'
              : 'Click the microphone icon to resume speaking.'}
          </p>
        </div>

        {/* Live Transcribed Text Display */}
        <div className="p-4 bg-[#050505] border border-[#1C1C1C] rounded-2xl min-h-24 max-h-40 overflow-y-auto text-left custom-scrollbar">
          {transcript ? (
            <p className="text-xs text-white leading-relaxed font-sans">{transcript}</p>
          ) : (
            <p className="text-xs text-[#8A8A8A] italic">
              {isListening ? 'Say something like: "Explain quantum computing" or "Write a python script"...' : 'No voice input recorded yet.'}
            </p>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              stopListening();
              closeModal();
            }}
            className="px-4 py-2 bg-[#0B0B0B] hover:bg-[#141414] border border-[#1C1C1C] text-xs font-semibold text-[#8A8A8A] hover:text-white rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={handleSend}
            disabled={!transcript.trim()}
            className="flex items-center gap-2 px-5 py-2 bg-white text-black hover:bg-neutral-200 text-xs font-bold rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <span>Send to Nexus</span>
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </Modal>
  );
};
