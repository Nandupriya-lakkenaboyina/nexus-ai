'use client';

import React, { useState, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Modal } from '@/components/ui/Modal';
import {
  User,
  Moon,
  Sliders,
  Cpu,
  Brain,
  Bell,
  Shield,
  Database,
  Keyboard,
  Check,
  Download,
  Trash2,
  LogOut,
  UserPlus,
  Users,
  KeyRound,
  ExternalLink,
} from 'lucide-react';
import { getTranslation, SupportedLanguage } from '@/lib/translations';

type SettingsTab =
  | 'account'
  | 'appearance'
  | 'ai-preferences'
  | 'memory'
  | 'notifications'
  | 'privacy'
  | 'data'
  | 'shortcuts';

export const SettingsModal: React.FC = () => {
  const {
    isSettingsOpen,
    setIsSettingsOpen,
    userSettings,
    updateUserSettings,
    userProfile,
    updateUserProfile,
    clearAllConversations,
    conversations,
    models,
    activeModel,
    setActiveModel,
    isMemoryEnabled,
    setIsMemoryEnabled,
    memories,
    clearMemories,
    openModal,
  } = useChat();

  const {
    currentUser,
    updateUser,
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    registeredUsers,
    switchAccount,
    resetPassword,
  } = useAuth();

  const t = getTranslation(userSettings.language);

  const [activeTab, setActiveTab] = useState<SettingsTab>('account');
  const [nameInput, setNameInput] = useState(currentUser?.name || userProfile.name || 'You');
  const [emailInput, setEmailInput] = useState(currentUser?.email || userProfile.email || 'user@nexus.ai');
  const [isProfileSaved, setIsProfileSaved] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordChangeError, setPasswordChangeError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser) {
      setNameInput(currentUser.name);
      setEmailInput(currentUser.email);
    }
  }, [currentUser]);

  const handleSaveProfile = (e?: React.FormEvent) => {
    e?.preventDefault();
    const cleanName = nameInput.trim() || 'You';
    const cleanEmail = emailInput.trim() || 'user@nexus.ai';

    updateUserProfile({
      name: cleanName,
      email: cleanEmail,
    });

    if (currentUser) {
      updateUser({
        name: cleanName,
        email: cleanEmail,
      });
    }

    setIsProfileSaved(true);
    setTimeout(() => setIsProfileSaved(false), 2000);
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError(null);
    if (!currentUser?.email) return;

    if (newPasswordInput.length < 6) {
      setPasswordChangeError('Password must be at least 6 characters long.');
      return;
    }

    const res = await resetPassword(currentUser.email, newPasswordInput);
    if (res.success) {
      setPasswordChangeSuccess(true);
      setNewPasswordInput('');
      setTimeout(() => setPasswordChangeSuccess(false), 3000);
    } else {
      setPasswordChangeError(res.error || 'Failed to change password.');
    }
  };

  const handleExportAll = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(conversations, null, 2));
    const dlAnchor = document.createElement('a');
    dlAnchor.setAttribute('href', dataStr);
    dlAnchor.setAttribute('download', `nexus_all_chats_${Date.now()}.json`);
    dlAnchor.click();
  };

  const handleClearHistory = () => {
    if (confirm('Are you sure you want to delete all conversations? This action cannot be undone.')) {
      clearAllConversations();
      setIsSettingsOpen(false);
    }
  };

  const languageOptions: { label: string; value: SupportedLanguage }[] = [
    { label: 'English (US)', value: 'English (US)' },
    { label: 'Telugu (తెలుగు)', value: 'Telugu' },
    { label: 'Hindi (हिन्दी)', value: 'Hindi' },
    { label: 'Spanish (Español)', value: 'Spanish' },
    { label: 'French (Français)', value: 'French' },
    { label: 'German (Deutsch)', value: 'German' },
    { label: 'Japanese (日本語)', value: 'Japanese' },
    { label: 'Chinese (中文)', value: 'Chinese' },
    { label: 'Arabic (العربية)', value: 'Arabic' },
  ];

  const initials = (currentUser?.name || userProfile.name || 'U').charAt(0).toUpperCase();

  const navTabs: { id: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { id: 'account', label: 'Account', icon: <User className="w-3.5 h-3.5" /> },
    { id: 'appearance', label: 'Appearance', icon: <Moon className="w-3.5 h-3.5" /> },
    { id: 'ai-preferences', label: 'AI Preferences', icon: <Cpu className="w-3.5 h-3.5" /> },
    { id: 'memory', label: 'Memory', icon: <Brain className="w-3.5 h-3.5" /> },
    { id: 'notifications', label: 'Notifications', icon: <Bell className="w-3.5 h-3.5" /> },
    { id: 'privacy', label: 'Privacy', icon: <Shield className="w-3.5 h-3.5" /> },
    { id: 'data', label: 'Data & Storage', icon: <Database className="w-3.5 h-3.5" /> },
    { id: 'shortcuts', label: 'Shortcuts', icon: <Keyboard className="w-3.5 h-3.5" /> },
  ];

  return (
    <Modal
      isOpen={isSettingsOpen}
      onClose={() => setIsSettingsOpen(false)}
      title="Nexus AI Settings"
      maxWidth="2xl"
    >
      <div className="flex flex-col md:flex-row gap-5 min-h-[420px] select-none text-white">
        {/* Left Navigation Tabs */}
        <div className="w-full md:w-44 space-y-1 border-b md:border-b-0 md:border-r border-[#1C1C1C] pb-3 md:pb-0 md:pr-3 flex-shrink-0">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg text-left transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#151515] text-white border border-[#262626] font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-[#0E0E0E]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Right Content Panels */}
        <div className="flex-1 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar pr-1">
          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-[#080808] border border-[#1C1C1C] rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#141414] border border-[#252525] flex items-center justify-center text-xs font-bold text-white shadow-sm">
                    {initials}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">
                        {currentUser?.name || userProfile.name}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#181818] text-neutral-300 font-semibold border border-[#2A2A2A]">
                        {currentUser?.tier || 'Nexus Pro'}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-500">
                      {currentUser?.email || userProfile.email}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setIsSettingsOpen(false);
                  }}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-[11px] font-medium text-rose-400 transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Log out</span>
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="space-y-3">
                <h4 className="text-xs font-semibold text-neutral-300">Profile Details</h4>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Display Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full p-2.5 bg-[#080808] border border-[#1C1C1C] focus:border-neutral-400 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs text-neutral-400 mb-1">Email Address</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full p-2.5 bg-[#080808] border border-[#1C1C1C] focus:border-neutral-400 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="flex items-center gap-1.5 px-4 py-2 bg-white hover:bg-neutral-200 text-black text-xs font-semibold rounded-lg transition-colors"
                  >
                    {isProfileSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </>
                    ) : (
                      <span>Save Changes</span>
                    )}
                  </button>
                </div>
              </form>

              {currentUser?.role !== 'guest' && (
                <form onSubmit={handleChangePassword} className="space-y-2.5 pt-3 border-t border-[#1C1C1C]">
                  <h4 className="text-xs font-semibold text-neutral-300 flex items-center gap-1.5">
                    <KeyRound className="w-3.5 h-3.5 text-neutral-400" />
                    Change Password
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      value={newPasswordInput}
                      onChange={(e) => setNewPasswordInput(e.target.value)}
                      placeholder="New password (min 6 chars)"
                      className="flex-1 p-2 bg-[#080808] border border-[#1C1C1C] focus:border-neutral-400 rounded-lg text-xs text-white placeholder-neutral-600 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="px-3 py-2 bg-[#141414] hover:bg-[#222222] text-xs font-medium text-white rounded-lg transition-colors"
                    >
                      Update
                    </button>
                  </div>
                  {passwordChangeSuccess && (
                    <p className="text-[11px] text-emerald-400">Password updated successfully.</p>
                  )}
                  {passwordChangeError && (
                    <p className="text-[11px] text-rose-400">{passwordChangeError}</p>
                  )}
                </form>
              )}
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-semibold text-neutral-300 mb-1">Color Theme</h4>
                <p className="text-[11px] text-neutral-500 mb-3">
                  Nexus AI is optimized exclusively for pitch black `#000000` futuristic contrast.
                </p>
                <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-md bg-black border border-white flex items-center justify-center">
                      <Moon className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-white">Pure Black (Active)</div>
                      <div className="text-[10px] text-neutral-500">
                        OLED dark palette with subtle white focus glows
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    Selected
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* AI Preferences Tab */}
          {activeTab === 'ai-preferences' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-white">Real-Time Streaming</p>
                  <p className="text-[10px] text-neutral-500">
                    Stream tokens instantaneously as AI outputs response
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.enableStreaming}
                  onChange={(e) => updateUserSettings({ enableStreaming: e.target.checked })}
                  className="w-4 h-4 accent-white rounded"
                />
              </div>

              <div className="flex items-center justify-between p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-white">Enter Key to Send</p>
                  <p className="text-[10px] text-neutral-500">
                    Press Enter to send message, Shift+Enter for newline
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.enterToSend}
                  onChange={(e) => updateUserSettings({ enterToSend: e.target.checked })}
                  className="w-4 h-4 accent-white rounded"
                />
              </div>

              <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl space-y-2">
                <label className="block text-xs font-semibold text-white">Active AI Model</label>
                <div className="grid grid-cols-2 gap-2">
                  {models.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveModel(m)}
                      className={`p-2 rounded-lg border text-left text-xs transition-all ${
                        activeModel.id === m.id
                          ? 'bg-[#151515] border-white text-white font-semibold'
                          : 'bg-[#0E0E0E] border-[#1C1C1C] text-neutral-400 hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{m.name}</span>
                        {m.badge && (
                          <span className="text-[9px] px-1 py-0.5 rounded bg-black border border-[#222222] font-mono text-neutral-400">
                            {m.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-neutral-500 mt-0.5 truncate">{m.tag}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Memory Tab */}
          {activeTab === 'memory' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-white">Adaptive Nexus Memory</p>
                  <p className="text-[10px] text-neutral-500">
                    Nexus remembers your preferences and projects across conversations
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={isMemoryEnabled}
                  onChange={(e) => setIsMemoryEnabled(e.target.checked)}
                  className="w-4 h-4 accent-white rounded"
                />
              </div>

              <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-white">
                    Stored Memories ({memories.length})
                  </span>
                  <button
                    onClick={() => openModal('manage-memory')}
                    className="text-xs text-neutral-300 hover:text-white underline"
                  >
                    Manage Detailed Memory ↗
                  </button>
                </div>
                <button
                  onClick={clearMemories}
                  className="text-xs text-rose-400 hover:underline pt-1 block"
                >
                  Clear all stored memories
                </button>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-3">
              <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl space-y-1">
                <p className="text-xs font-semibold text-white">Generation Audio Alerts</p>
                <p className="text-[10px] text-neutral-500">
                  Play subtle chime when long code execution or image completes
                </p>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl">
                <div>
                  <p className="text-xs font-semibold text-white">Local History Storage</p>
                  <p className="text-[10px] text-neutral-500">
                    Persist your chats strictly in your local browser sandbox
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={userSettings.saveHistory}
                  onChange={(e) => updateUserSettings({ saveHistory: e.target.checked })}
                  className="w-4 h-4 accent-white rounded"
                />
              </div>

              <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-semibold text-white">Google Gemini API Key</label>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-2.5 h-2.5" />
                      Active
                    </span>
                  </div>
                  <a
                    href="https://aistudio.google.com/app/apikey"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-neutral-400 hover:text-white inline-flex items-center gap-1"
                  >
                    Get Free Key <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <input
                  type="password"
                  value={userSettings.geminiApiKey || ''}
                  onChange={(e) => updateUserSettings({ geminiApiKey: e.target.value.trim() })}
                  placeholder="Configured in .env.local (or enter custom key)"
                  className="w-full p-2 bg-[#050505] border border-[#1C1C1C] focus:border-white rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none"
                />
                <p className="text-[10px] text-neutral-500">
                  Nexus AI automatically reads your API key from .env.local and browser settings for cloud reasoning.
                </p>
              </div>
            </div>
          )}

          {/* Data & Storage Tab */}
          {activeTab === 'data' && (
            <div className="space-y-3">
              <div className="p-3.5 bg-[#080808] border border-[#1C1C1C] rounded-xl space-y-2.5">
                <p className="text-xs font-semibold text-white">Backup & Data Portability</p>
                <p className="text-[10px] text-neutral-500">
                  Export all your conversations and files as JSON.
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={handleExportAll}
                    className="flex items-center gap-1.5 px-3 py-2 bg-[#121212] hover:bg-[#1C1C1C] border border-[#222222] rounded-lg text-xs text-white font-medium transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export All Chats (JSON)</span>
                  </button>

                  <button
                    onClick={handleClearHistory}
                    className="flex items-center gap-1.5 px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-lg text-xs text-rose-400 font-medium transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear All Conversations</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Shortcuts Tab */}
          {activeTab === 'shortcuts' && (
            <div className="space-y-2.5">
              <div className="p-3 bg-[#080808] border border-[#1C1C1C] rounded-xl space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-[#181818]">
                  <span className="text-neutral-300">Quick Command Menu</span>
                  <kbd className="px-2 py-0.5 bg-[#141414] border border-[#242424] rounded font-mono text-[10px] text-white">
                    /
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#181818]">
                  <span className="text-neutral-300">Send Message</span>
                  <kbd className="px-2 py-0.5 bg-[#141414] border border-[#242424] rounded font-mono text-[10px] text-white">
                    Enter
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#181818]">
                  <span className="text-neutral-300">Newline in input</span>
                  <kbd className="px-2 py-0.5 bg-[#141414] border border-[#242424] rounded font-mono text-[10px] text-white">
                    Shift + Enter
                  </kbd>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-[#181818]">
                  <span className="text-neutral-300">Stop AI Generation</span>
                  <kbd className="px-2 py-0.5 bg-[#141414] border border-[#242424] rounded font-mono text-[10px] text-white">
                    Esc
                  </kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};
