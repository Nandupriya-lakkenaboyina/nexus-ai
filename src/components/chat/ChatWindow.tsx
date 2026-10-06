'use client';

import React, { useEffect, useRef } from 'react';
import { useChat } from '@/context/ChatContext';
import { ChatHeader } from './ChatHeader';
import { EmptyChatScreen } from './EmptyChatScreen';
import { ChatMessage } from './ChatMessage';
import { AIThinkingIndicator } from './AIThinkingIndicator';
import { StreamingMessage } from './StreamingMessage';
import { ChatInput } from './ChatInput';

export const ChatWindow: React.FC = () => {
  const { currentConversation, isThinking, isStreaming } = useChat();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages, isThinking, isStreaming]);

  const hasMessages = currentConversation && currentConversation.messages.length > 0;

  return (
    <main className="flex-1 flex flex-col h-full min-w-0 bg-[#000000] overflow-hidden relative">
      {/* Top Header */}
      <ChatHeader />

      {/* Main Message Stream or Empty Welcome State */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6 custom-scrollbar flex flex-col">
        {hasMessages ? (
          <div className="max-w-3xl sm:max-w-4xl mx-auto w-full space-y-2">
            {currentConversation.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}

            {/* AI Thinking Indicator (3 Animated Dots) */}
            {isThinking && <AIThinkingIndicator />}

            {/* Progressive Streaming Token View */}
            <StreamingMessage />

            {/* Scroll Anchor */}
            <div ref={messagesEndRef} className="h-6" />
          </div>
        ) : (
          <EmptyChatScreen />
        )}
      </div>

      {/* Persistent Bottom Chat Composer */}
      <ChatInput />
    </main>
  );
};
