'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NexusLogo } from './NexusLogo';

interface IntroSplashProps {
  onComplete?: () => void;
  durationMs?: number;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({
  onComplete,
  durationMs = 1500,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => {
        onComplete?.();
      }, 500);
    }, durationMs);

    return () => clearTimeout(timer);
  }, [durationMs, onComplete]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950 select-none overflow-hidden"
        >
          {/* Subtle Ambient Radial Glow */}
          <div className="absolute w-96 h-96 rounded-full bg-white/[0.02] blur-3xl pointer-events-none" />

          {/* Centered ChatGPT-style Logo Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.82 }}
            animate={{
              opacity: 1,
              scale: [0.82, 1.02, 1],
            }}
            transition={{
              duration: 0.85,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="relative flex flex-col items-center justify-center z-10"
          >
            {/* Elegant Logo Emblem with Breathing Ring */}
            <div className="relative flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.08, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 2,
                  ease: 'easeInOut',
                }}
                className="absolute w-20 h-20 rounded-3xl bg-neutral-800/40 blur-md pointer-events-none"
              />

              <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-100 shadow-2xl relative z-10">
                <NexusLogo size={32} />
              </div>
            </div>

            {/* Subtle App Name */}
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.6 }}
              className="mt-5 text-center"
            >
              <h1 className="text-sm font-semibold tracking-wider text-neutral-200 uppercase">
                Nexus AI
              </h1>
            </motion.div>

            {/* Minimalist 3-dot Breathing Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="mt-6 flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-pulse" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-pulse"
                style={{ animationDelay: '180ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-neutral-500 animate-pulse"
                style={{ animationDelay: '360ms' }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
