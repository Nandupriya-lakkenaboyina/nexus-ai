'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { AuthCard } from './AuthCard';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, authModalMode } = useAuth();

  if (!isAuthModalOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto select-none">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsAuthModalOpen(false)}
          className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative z-10 w-full max-w-md my-8"
        >
          {/* Close button */}
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute -top-3 -right-3 z-20 w-8 h-8 rounded-full bg-[#121212] border border-[#2A2A2A] text-neutral-400 hover:text-white flex items-center justify-center shadow-xl transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>

          <AuthCard
            initialMode={authModalMode}
            isModal={true}
            onSuccess={() => setIsAuthModalOpen(false)}
          />
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
