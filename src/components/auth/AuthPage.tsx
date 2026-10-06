'use client';

import React from 'react';
import { AuthCard } from './AuthCard';
import { NexusLogo } from '@/components/ui/NexusLogo';
import { motion } from 'framer-motion';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
  onAuthSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onAuthSuccess,
}) => {
  return (
    <div className="min-h-screen w-full bg-[#000000] text-white flex flex-col justify-between relative overflow-hidden font-sans select-none">
      {/* Subtle Monochrome Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] bg-white/[0.03] blur-[140px] rounded-full pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Clean Minimal Header */}
      <header className="relative z-10 w-full max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0B0B0B] border border-[#1C1C1C] flex items-center justify-center text-white shadow-sm">
            <NexusLogo size={18} />
          </div>
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-white block leading-tight">
              NEXUS AI
            </span>
            <span className="text-[10px] text-neutral-500 block leading-tight">
              Think • Create • Achieve
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <span className="w-1.5 h-1.5 rounded-full bg-white inline-block animate-pulse" />
          <span className="text-neutral-400 text-[11px] font-mono">SYSTEM READY</span>
        </div>
      </header>

      {/* Main Centered Login / Register Card */}
      <main className="relative z-10 w-full max-w-md mx-auto px-4 py-8 flex-1 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full"
        >
          <AuthCard
            initialMode={initialMode}
            onSuccess={onAuthSuccess}
            className="w-full"
          />
        </motion.div>
      </main>

      {/* Clean Minimal Footer */}
      <footer className="relative z-10 w-full max-w-5xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-600 border-t border-[#141414]">
        <div>© 2026 Nexus AI. All rights reserved.</div>
        <div className="flex items-center gap-4 mt-2 sm:mt-0 text-neutral-500">
          <span>Multimodal AI Workspace</span>
        </div>
      </footer>
    </div>
  );
};
