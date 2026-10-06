'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface DropdownItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  danger?: boolean;
  badge?: string;
  onClick: () => void;
}

interface DropdownProps {
  trigger: React.ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  items,
  align = 'right',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <div onClick={() => setIsOpen((prev) => !prev)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${
              align === 'right' ? 'right-0' : 'left-0'
            } mt-1.5 w-56 rounded-xl bg-[#0B0B0B] border border-[#1C1C1C] shadow-2xl py-1 z-50 overflow-hidden`}
          >
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium text-left transition-colors cursor-pointer ${
                  item.danger
                    ? 'text-rose-400 hover:bg-rose-500/10'
                    : 'text-neutral-300 hover:bg-[#141414] hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {item.icon && <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>}
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span className="px-1.5 py-0.5 text-[9px] uppercase font-semibold bg-[#181818] border border-[#252525] text-neutral-300 rounded">
                    {item.badge}
                  </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
