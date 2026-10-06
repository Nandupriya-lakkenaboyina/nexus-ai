'use client';

import React from 'react';
import { Message } from '@/types';
import { UserMessage } from './UserMessage';
import { AIMessage } from './AIMessage';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  if (message.role === 'user') {
    return <UserMessage message={message} />;
  }
  return <AIMessage message={message} />;
};
