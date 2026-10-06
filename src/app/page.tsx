'use client';

import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { ChatProvider } from '@/context/ChatContext';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { ImageGenerationModal } from '@/components/image-generation/ImageGenerationModal';
import { SettingsModal } from '@/components/settings/SettingsModal';
import { IntroSplash } from '@/components/ui/IntroSplash';
import { NexusLogo } from '@/components/ui/NexusLogo';
import { AuthPage } from '@/components/auth/AuthPage';
import { AuthModal } from '@/components/auth/AuthModal';

// Modal Suite
import { CodeRunnerModal } from '@/components/tools/CodeRunnerModal';
import { DataAnalystModal } from '@/components/tools/DataAnalystModal';
import { StudyModeModal } from '@/components/tools/StudyModeModal';
import { TranslationModal } from '@/components/tools/TranslationModal';
import { LibraryModal } from '@/components/tools/LibraryModal';
import { VoiceChatModal } from '@/components/tools/VoiceChatModal';
import { WebSearchModal } from '@/components/tools/WebSearchModal';
import { MemoryModal } from '@/components/tools/MemoryModal';
import { ManageModesModal } from '@/components/tools/ManageModesModal';

function MainApp() {
  const [showIntro, setShowIntro] = useState(false);
  const { isAuthenticated, isLoading } = useAuth();

  // Loading state while checking localStorage session
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#000000] text-neutral-400 select-none">
        <div className="flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-[#0D0D0D] border border-[#222222] flex items-center justify-center text-white mb-3.5 shadow-[0_0_25px_rgba(255,255,255,0.06)] ring-1 ring-white/5">
            <NexusLogo size={28} />
          </div>
          <h1 className="text-xl font-bold tracking-widest text-white uppercase">
            NEXUS AI
          </h1>
          <div className="flex items-center gap-1.5 mt-3.5">
            <span className="w-2 h-2 rounded-full bg-white/80 animate-[bounce_1.2s_infinite_0ms]" />
            <span className="w-2 h-2 rounded-full bg-white/80 animate-[bounce_1.2s_infinite_200ms]" />
            <span className="w-2 h-2 rounded-full bg-white/80 animate-[bounce_1.2s_infinite_400ms]" />
          </div>
        </div>
      </div>
    );
  }

  // If not logged in, present the clean pure black Auth / Registration Page
  if (!isAuthenticated) {
    return <AuthPage initialMode="login" />;
  }

  // Authenticated workspace
  return (
    <ChatProvider>
      {/* Initial Electric Logo Intro Splash when requested */}
      {showIntro && <IntroSplash onComplete={() => setShowIntro(false)} />}

      <div className="flex h-screen w-screen overflow-hidden bg-[#000000] font-sans antialiased text-neutral-100">
        {/* Left Sidebar */}
        <Sidebar onLogoClick={() => setShowIntro(true)} />

        {/* Center Chat Area */}
        <ChatWindow />

        {/* Complete Multimodal Tool Suite Modals */}
        <CodeRunnerModal />
        <DataAnalystModal />
        <StudyModeModal />
        <TranslationModal />
        <LibraryModal />
        <VoiceChatModal />
        <WebSearchModal />
        <MemoryModal />
        <ManageModesModal />
        <ImageGenerationModal />
        <SettingsModal />
        <AuthModal />
      </div>
    </ChatProvider>
  );
}

export default function Home() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
