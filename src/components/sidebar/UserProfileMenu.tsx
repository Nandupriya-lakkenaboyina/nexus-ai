'use client';

import React from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Dropdown } from '@/components/ui/Dropdown';
import {
  LogOut,
  Sliders,
  Zap,
  UserPlus,
  Users,
  Sparkles,
} from 'lucide-react';
import { getTranslation } from '@/lib/translations';

export const UserProfileMenu: React.FC = () => {
  const { userProfile, userSettings, setIsSettingsOpen } = useChat();
  const {
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    registeredUsers,
    switchAccount,
  } = useAuth();

  const t = getTranslation(userSettings.language);

  const activeName = currentUser?.name || userProfile.name || 'Nexus User';
  const activeEmail = currentUser?.email || userProfile.email || 'user@nexus.ai';
  const activeTier = currentUser?.tier || userProfile.tier || 'Free Explorer';
  const isGuest = currentUser?.role === 'guest';
  const initials = activeName ? activeName.charAt(0).toUpperCase() : 'U';

  // Other accounts registered on this browser
  const otherAccounts = registeredUsers.filter((u) => u.id !== currentUser?.id);

  const profileMenuItems = [
    {
      id: 'profile',
      label: t.profile || 'Account & Preferences',
      icon: <Sliders className="w-3.5 h-3.5 text-indigo-400" />,
      onClick: () => setIsSettingsOpen(true),
    },
    {
      id: 'usage',
      label: `Daily Usage: ${currentUser?.tokensUsedToday || 0}/${currentUser?.tokensTotalToday || 100} Tokens`,
      icon: <Zap className="w-3.5 h-3.5 text-amber-400" />,
      onClick: () => setIsSettingsOpen(true),
    },
    // If not guest and other accounts exist, offer quick switch
    ...(otherAccounts.length > 0
      ? [
          {
            id: 'switch',
            label: `Switch: ${otherAccounts[0].name.split(' ')[0]}`,
            icon: <Users className="w-3.5 h-3.5 text-cyan-400" />,
            onClick: () => switchAccount(otherAccounts[0].id),
          },
        ]
      : []),
    {
      id: 'add-account',
      label: 'Register New Account',
      icon: <UserPlus className="w-3.5 h-3.5 text-emerald-400" />,
      onClick: () => {
        setAuthModalMode('register');
        setIsAuthModalOpen(true);
      },
    },
    {
      id: 'logout',
      label: isGuest ? 'Exit Guest Session' : 'Log out',
      icon: <LogOut className="w-3.5 h-3.5 text-rose-400" />,
      danger: true,
      onClick: () => {
        logout();
      },
    },
  ];

  return (
    <div className="w-full">
      {/* Profile Row with initials badge & active tier */}
      <Dropdown
        align="left"
        className="w-full"
        trigger={
          <div className="flex items-center justify-between p-2 rounded-xl bg-[#090909] hover:bg-[#121212] cursor-pointer transition-all border border-[#1A1A1A] hover:border-neutral-700 w-full group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-xs font-bold text-indigo-300 flex-shrink-0 shadow-sm group-hover:border-indigo-400 transition-colors">
                {initials}
              </div>
              <div className="min-w-0 text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-semibold text-neutral-200 group-hover:text-white truncate block leading-tight">
                    {activeName}
                  </span>
                  {activeTier.includes('Pro') && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold flex items-center gap-0.5">
                      <Sparkles className="w-2.5 h-2.5" />
                      PRO
                    </span>
                  )}
                  {isGuest && (
                    <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-semibold">
                      GUEST
                    </span>
                  )}
                </div>
                <span className="text-[10px] text-neutral-500 truncate block leading-tight">
                  {activeEmail}
                </span>
              </div>
            </div>
          </div>
        }
        items={profileMenuItems}
      />
    </div>
  );
};
