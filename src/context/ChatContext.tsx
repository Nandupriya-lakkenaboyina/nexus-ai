'use client';

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import {
  Conversation,
  Message,
  Attachment,
  AIModel,
  AIResponseStatus,
  GeneratedImage,
  WorkspaceFile,
  UserProfile,
  UserSettings,
  NexusModeId,
  NexusMode,
  MemoryItem,
  LibraryItem,
  ChatFolderType,
} from '@/types';
import {
  INITIAL_MODELS,
  INITIAL_USER_PROFILE,
  DEFAULT_USER_SETTINGS,
  INITIAL_MEMORIES,
  INITIAL_LIBRARY_ITEMS,
} from '@/data/mockData';
import { NEXUS_MODES } from '@/data/nexusModes';
import { generateId, extractInteractiveElements } from '@/lib/utils';
import { useAuth } from '@/context/AuthContext';

function generateTitle(prompt: string): string {
  if (!prompt.trim()) return 'New Conversation';
  const clean = prompt.replace(/[^\w\s]/gi, '').trim();
  const words = clean.split(/\s+/).slice(0, 4);
  if (words.length === 0) return 'New Conversation';
  const title = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
  return title.length > 28 ? title.substring(0, 28) + '...' : title;
}

export type ModalType =
  | null
  | 'library'
  | 'code-runner'
  | 'data-analyst'
  | 'study'
  | 'translate'
  | 'voice-chat'
  | 'web-search'
  | 'image-gen'
  | 'settings'
  | 'manage-memory'
  | 'manage-modes';

interface ChatContextType {
  conversations: Conversation[];
  currentConversationId: string | null;
  currentConversation: Conversation | null;
  activeModel: AIModel;
  setActiveModel: (model: AIModel) => void;
  models: AIModel[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Active Nexus Mode
  activeMode: NexusMode;
  setActiveModeId: (modeId: NexusModeId) => void;
  modes: NexusMode[];

  // Folders & Filtering
  activeFolder: ChatFolderType;
  setActiveFolder: (folder: ChatFolderType) => void;
  setConversationFolder: (id: string, folder: ChatFolderType) => void;
  archiveConversation: (id: string) => void;

  // Thinking & Streaming state
  isThinking: boolean;
  isStreaming: boolean;
  streamingContent: string;
  currentAIStatus: AIResponseStatus;

  // Attachments in composer
  activeAttachments: Attachment[];
  addAttachment: (attachment: Attachment) => void;
  removeAttachment: (id: string) => void;
  clearAttachments: () => void;

  // Modals & Panels
  isSidebarOpen: boolean;
  setIsSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  isRightPanelOpen: boolean;
  setIsRightPanelOpen: (open: boolean) => void;
  toggleRightPanel: () => void;

  activeModal: ModalType;
  setActiveModal: (modal: ModalType) => void;
  openModal: (modal: ModalType) => void;
  closeModal: () => void;

  // Memory Management
  memories: MemoryItem[];
  isMemoryEnabled: boolean;
  setIsMemoryEnabled: (enabled: boolean) => void;
  toggleMemory: () => void;
  addMemory: (content: string, category?: MemoryItem['category']) => void;
  deleteMemory: (id: string) => void;
  clearMemories: () => void;

  // Library Management
  libraryItems: LibraryItem[];
  addLibraryItem: (item: LibraryItem) => void;
  deleteLibraryItem: (id: string) => void;

  // Voice Interaction
  isVoiceListening: boolean;
  setIsVoiceListening: (listening: boolean) => void;

  // Image Generation Modal helper
  isImageGenModalOpen: boolean;
  setIsImageGenModalOpen: (open: boolean) => void;

  // Settings & Profile
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  userSettings: UserSettings;
  updateUserSettings: (newSettings: Partial<UserSettings>) => void;
  userProfile: UserProfile;
  updateUserProfile: (newProfile: Partial<UserProfile>) => void;

  // Core Operations
  selectConversation: (id: string) => void;
  createNewConversation: () => void;
  deleteConversation: (id: string) => void;
  pinConversation: (id: string) => void;
  renameConversation: (id: string, newTitle: string) => void;
  exportConversation: (id?: string, format?: 'markdown' | 'json') => void;
  clearAllConversations: () => void;

  sendMessage: (content: string, customAttachments?: Attachment[], overrideMode?: NexusModeId) => void;
  editAndRegenerateMessage: (messageId: string, newContent: string) => void;
  regenerateLastResponse: () => void;
  stopGeneration: () => void;
  triggerQuickAction: (actionType: 'summarize' | 'study-notes' | 'data-viz' | 'explain' | 'latest-info') => void;

  generateImageAction: (
    prompt: string,
    style: GeneratedImage['style'],
    aspectRatio: GeneratedImage['aspectRatio']
  ) => Promise<GeneratedImage>;

  filteredConversations: Conversation[];
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useAuth();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const [models] = useState<AIModel[]>(INITIAL_MODELS);
  const [activeModel, setActiveModel] = useState<AIModel>(INITIAL_MODELS[0]);
  const [modes] = useState<NexusMode[]>(NEXUS_MODES);
  const [activeModeId, setActiveModeIdState] = useState<NexusModeId>('general');
  const [activeFolder, setActiveFolder] = useState<ChatFolderType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Processing state
  const [isThinking, setIsThinking] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [currentAIStatus, setCurrentAIStatus] = useState<AIResponseStatus>('idle');
  const abortControllerRef = useRef<AbortController | null>(null);

  // Composer attachments
  const [activeAttachments, setActiveAttachments] = useState<Attachment[]>([]);

  // Panels & Modals
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(true);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isImageGenModalOpen, setIsImageGenModalOpen] = useState(false);

  // Memory & Library state
  const [memories, setMemories] = useState<MemoryItem[]>(INITIAL_MEMORIES);
  const [isMemoryEnabled, setIsMemoryEnabled] = useState(true);
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>(INITIAL_LIBRARY_ITEMS);
  const [isVoiceListening, setIsVoiceListening] = useState(false);

  // Settings & Profile
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [userProfile, setUserProfile] = useState<UserProfile>(INITIAL_USER_PROFILE);
  const [isMounted, setIsMounted] = useState(false);

  // Sync user profile when currentUser changes from AuthContext
  useEffect(() => {
    if (currentUser) {
      setUserProfile((prev) => ({
        ...prev,
        name: currentUser.name,
        email: currentUser.email,
        tier: currentUser.tier,
        tokensUsedToday: currentUser.tokensUsedToday || 0,
        tokensTotalToday: currentUser.tokensTotalToday || 100,
      }));
    }
  }, [currentUser]);

  // Load from localStorage on mount (hydration safe)
  useEffect(() => {
    setIsMounted(true);
    try {
      const savedConvs = localStorage.getItem('nexus_conversations');
      if (savedConvs) {
        setConversations(JSON.parse(savedConvs));
      }
      const savedSettings = localStorage.getItem('nexus_settings');
      if (savedSettings) {
        setUserSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }));
      }
      const savedMemories = localStorage.getItem('nexus_memories');
      if (savedMemories) {
        setMemories(JSON.parse(savedMemories));
      }
      const savedLibrary = localStorage.getItem('nexus_library_items');
      if (savedLibrary) {
        setLibraryItems(JSON.parse(savedLibrary));
      }
    } catch (e) {
      console.error('Error loading initial data from localStorage:', e);
    }
  }, []);

  // Persist conversations
  useEffect(() => {
    if (isMounted && userSettings.saveHistory && !userSettings.temporaryChat) {
      try {
        localStorage.setItem('nexus_conversations', JSON.stringify(conversations));
      } catch (e) {
        console.error('Error saving conversations:', e);
      }
    }
  }, [conversations, userSettings.saveHistory, userSettings.temporaryChat, isMounted]);

  // Persist settings
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('nexus_settings', JSON.stringify(userSettings));
      } catch (e) {
        console.error('Error saving settings:', e);
      }
    }
  }, [userSettings, isMounted]);

  // Persist memories
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('nexus_memories', JSON.stringify(memories));
      } catch (e) {
        console.error('Error saving memories:', e);
      }
    }
  }, [memories, isMounted]);

  // Persist library items
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem('nexus_library_items', JSON.stringify(libraryItems));
      } catch (e) {
        console.error('Error saving library items:', e);
      }
    }
  }, [libraryItems, isMounted]);

  const activeMode = modes.find((m) => m.id === activeModeId) || modes[0];

  const setActiveModeId = (modeId: NexusModeId) => {
    setActiveModeIdState(modeId);
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleRightPanel = () => setIsRightPanelOpen((prev) => !prev);

  const openModal = (modal: ModalType) => {
    setActiveModal(modal);
    if (modal === 'settings') setIsSettingsOpen(true);
    if (modal === 'image-gen') setIsImageGenModalOpen(true);
  };

  const closeModal = () => {
    setActiveModal(null);
    setIsSettingsOpen(false);
    setIsImageGenModalOpen(false);
  };

  const toggleMemory = () => setIsMemoryEnabled((prev) => !prev);

  const addMemory = (content: string, category: MemoryItem['category'] = 'preference') => {
    if (!content.trim()) return;
    const newMem: MemoryItem = {
      id: `mem_${Date.now()}`,
      content: content.trim(),
      category,
      createdAt: new Date().toISOString(),
    };
    setMemories((prev) => [newMem, ...prev]);
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const clearMemories = () => {
    setMemories([]);
  };

  const addLibraryItem = (item: LibraryItem) => {
    setLibraryItems((prev) => [item, ...prev]);
  };

  const deleteLibraryItem = (id: string) => {
    setLibraryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateUserSettings = (newSettings: Partial<UserSettings>) => {
    setUserSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const updateUserProfile = (newProfile: Partial<UserProfile>) => {
    setUserProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const currentConversation = conversations.find((c) => c.id === currentConversationId) || null;

  const filteredConversations = conversations.filter((c) => {
    if (c.archived) return false;
    if (activeFolder !== 'All' && c.folder !== activeFolder) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const matchesTitle = c.title.toLowerCase().includes(q);
    const matchesMessage = c.messages.some((m) => m.content.toLowerCase().includes(q));
    return matchesTitle || matchesMessage;
  });

  const selectConversation = (id: string) => {
    stopGeneration();
    setCurrentConversationId(id);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const createNewConversation = () => {
    stopGeneration();
    setCurrentConversationId(null);
    setActiveAttachments([]);
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const pinConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, pinned: !c.pinned } : c))
    );
  };

  const archiveConversation = (id: string) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, archived: !c.archived } : c))
    );
    if (currentConversationId === id) {
      setCurrentConversationId(null);
    }
  };

  const setConversationFolder = (id: string, folder: ChatFolderType) => {
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, folder } : c))
    );
  };

  const renameConversation = (id: string, newTitle: string) => {
    if (!newTitle.trim()) return;
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: newTitle.trim() } : c))
    );
  };

  const exportConversation = (id?: string, format: 'markdown' | 'json' = 'markdown') => {
    const targetId = id || currentConversationId;
    if (!targetId) return;
    const target = conversations.find((c) => c.id === targetId);
    if (!target) return;

    let blob: Blob;
    let filename: string;

    if (format === 'json') {
      const dataStr = JSON.stringify(target, null, 2);
      blob = new Blob([dataStr], { type: 'application/json' });
      filename = `nexus_chat_${target.title.replace(/\s+/g, '_').toLowerCase()}.json`;
    } else {
      let md = `# ${target.title}\n*Exported from Nexus AI on ${new Date().toLocaleString()}*\n\n---\n\n`;
      target.messages.forEach((m) => {
        md += `### ${m.role === 'user' ? 'USER' : 'NEXUS'} (${m.timestamp})\n\n${m.content}\n\n---\n\n`;
      });
      blob = new Blob([md], { type: 'text/markdown' });
      filename = `nexus_chat_${target.title.replace(/\s+/g, '_').toLowerCase()}.md`;
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllConversations = () => {
    setConversations([]);
    setCurrentConversationId(null);
    localStorage.removeItem('nexus_conversations');
  };

  const addAttachment = (attachment: Attachment) => {
    setActiveAttachments((prev) => [...prev, attachment]);
    // Also save into Library for persistent access
    const category: LibraryItem['category'] =
      attachment.type === 'document'
        ? 'documents'
        : attachment.type === 'image'
        ? 'images'
        : 'documents';

    addLibraryItem({
      id: `lib_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`,
      name: attachment.name,
      category,
      extension: attachment.extension,
      size: attachment.size,
      date: 'Just now',
      content: attachment.textContent,
      url: attachment.url,
      description: `Uploaded for multimodal analysis`,
    });
  };

  const removeAttachment = (id: string) => {
    setActiveAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  const clearAttachments = () => {
    setActiveAttachments([]);
  };

  const stopGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsThinking(false);
    setIsStreaming(false);
    setCurrentAIStatus('idle');
  };

  // Execution Engine for AI queries
  const executeRealAIRequest = async (
    targetConvId: string,
    allMessages: Message[],
    attachmentsToSend: Attachment[],
    modeToUse: NexusModeId = activeModeId
  ) => {
    stopGeneration();

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsThinking(true);
    setIsStreaming(false);
    setStreamingContent('');
    setCurrentAIStatus('generating');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: allMessages.map((m) => ({
            role: m.role,
            content: m.content,
            attachments: m.attachments,
          })),
          model: activeModel.id,
          mode: modeToUse,
          apiKey: userSettings.geminiApiKey || undefined,
          attachments: attachmentsToSend,
          language: userSettings.language,
          memories: isMemoryEnabled ? memories.map((m) => m.content) : [],
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('Response body is not readable.');
      }

      setIsThinking(false);
      setIsStreaming(true);
      setCurrentAIStatus('streaming');

      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;
        setStreamingContent(accumulatedText);
      }

      const interactiveElements = extractInteractiveElements(accumulatedText);

      const finalAssistantMsg: Message = {
        id: generateId(),
        role: 'assistant',
        content: accumulatedText || 'Response completed.',
        timestamp: 'Just now',
        status: 'completed',
        interactiveElements,
        modeUsed: modeToUse,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              lastMessagePreview: (accumulatedText || 'Response completed').substring(0, 60) + '...',
              timestamp: 'Just now',
              messages: [...c.messages, finalAssistantMsg],
            };
          }
          return c;
        })
      );

      setIsStreaming(false);
      setStreamingContent('');
      setCurrentAIStatus('idle');
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.log('Stream aborted by user');
      } else {
        console.error('AI Request Error:', err);
        const errorMsg =
          err.message || 'Unable to connect to the AI service. Please verify your connection or try again.';

        const errorAssistantMsg: Message = {
          id: generateId(),
          role: 'assistant',
          content: `⚠️ **Notice**: ${errorMsg}`,
          timestamp: 'Just now',
          status: 'error',
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.id === targetConvId) {
              return {
                ...c,
                messages: [...c.messages, errorAssistantMsg],
              };
            }
            return c;
          })
        );
      }
    } finally {
      setIsThinking(false);
      setIsStreaming(false);
      abortControllerRef.current = null;
    }
  };

  const sendMessage = async (
    content: string,
    customAttachments?: Attachment[],
    overrideMode?: NexusModeId
  ) => {
    if (!content.trim() && (!customAttachments || customAttachments.length === 0)) return;

    const attachmentsToSend = customAttachments || [...activeAttachments];
    const modeToUse = overrideMode || activeModeId;

    const userMsg: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: 'Just now',
      attachments: attachmentsToSend.length > 0 ? attachmentsToSend : undefined,
    };

    let targetConvId = currentConversationId;
    let updatedConversationMessages: Message[] = [];

    if (!targetConvId || !conversations.find((c) => c.id === targetConvId)) {
      const newId = generateId();
      const generatedTitle = generateTitle(content);
      const newConv: Conversation = {
        id: newId,
        title: generatedTitle,
        lastMessagePreview: content,
        timestamp: 'Just now',
        group: 'today',
        pinned: false,
        folder:
          modeToUse === 'coding'
            ? 'Coding'
            : modeToUse === 'study'
            ? 'Study'
            : modeToUse === 'research'
            ? 'Research'
            : 'All',
        model: activeModel.name,
        mode: modeToUse,
        messages: [userMsg],
        hasAttachments: attachmentsToSend.length > 0,
      };
      setConversations((prev) => [newConv, ...prev]);
      setCurrentConversationId(newId);
      targetConvId = newId;
      updatedConversationMessages = [userMsg];
    } else {
      const existingConv = conversations.find((c) => c.id === targetConvId);
      updatedConversationMessages = [...(existingConv?.messages || []), userMsg];

      setConversations((prev) =>
        prev.map((c) => {
          if (c.id === targetConvId) {
            return {
              ...c,
              lastMessagePreview: content,
              timestamp: 'Just now',
              hasAttachments: c.hasAttachments || attachmentsToSend.length > 0,
              messages: updatedConversationMessages,
            };
          }
          return c;
        })
      );
    }

    clearAttachments();
    await executeRealAIRequest(targetConvId, updatedConversationMessages, attachmentsToSend, modeToUse);
  };

  const editAndRegenerateMessage = async (messageId: string, newContent: string) => {
    if (!currentConversationId || !newContent.trim()) return;

    const conv = conversations.find((c) => c.id === currentConversationId);
    if (!conv) return;

    const msgIndex = conv.messages.findIndex((m) => m.id === messageId);
    if (msgIndex === -1) return;

    const updatedMessages = conv.messages.slice(0, msgIndex + 1).map((m, idx) => {
      if (idx === msgIndex) {
        return { ...m, content: newContent, isEdited: true };
      }
      return m;
    });

    setConversations((prev) =>
      prev.map((c) => (c.id === currentConversationId ? { ...c, messages: updatedMessages } : c))
    );

    await executeRealAIRequest(currentConversationId, updatedMessages, [], conv.mode || activeModeId);
  };

  const regenerateLastResponse = async () => {
    if (!currentConversation || currentConversation.messages.length === 0) return;

    const lastUserIdx = currentConversation.messages.findLastIndex((m) => m.role === 'user');
    if (lastUserIdx === -1) return;

    const messagesUpToUser = currentConversation.messages.slice(0, lastUserIdx + 1);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === currentConversationId ? { ...c, messages: messagesUpToUser } : c
      )
    );

    const lastUserMsg = messagesUpToUser[lastUserIdx];
    await executeRealAIRequest(
      currentConversationId!,
      messagesUpToUser,
      lastUserMsg.attachments || [],
      currentConversation.mode || activeModeId
    );
  };

  const triggerQuickAction = (actionType: 'summarize' | 'study-notes' | 'data-viz' | 'explain' | 'latest-info') => {
    switch (actionType) {
      case 'summarize':
        setActiveModeId('document-analyst');
        sendMessage('Please provide an executive summary highlighting the key points, findings, and takeaways.');
        break;
      case 'study-notes':
        setActiveModeId('study');
        sendMessage('Please generate structured study notes with core concepts, bullet points, and key takeaways for this topic.');
        break;
      case 'data-viz':
        setActiveModeId('data-analyst');
        sendMessage('Please analyze this data and generate a clear visualization breakdown with statistics and key trends.');
        break;
      case 'explain':
        setActiveModeId('general');
        sendMessage('Please explain this concept clearly with an intuitive analogy, real-world example, and practical applications.');
        break;
      case 'latest-info':
        setActiveModeId('research');
        sendMessage('Please conduct comprehensive research on the latest developments, findings, and verified sources for this topic.');
        break;
    }
  };

  const generateImageAction = async (
    prompt: string,
    style: GeneratedImage['style'],
    aspectRatio: GeneratedImage['aspectRatio']
  ): Promise<GeneratedImage> => {
    setIsThinking(true);
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, aspectRatio }),
      });

      if (!response.ok) {
        throw new Error('Image generation failed.');
      }

      const data = await response.json();

      const newImage: GeneratedImage = {
        id: generateId(),
        prompt,
        style,
        aspectRatio,
        imageUrl: data.imageUrl,
        createdAt: new Date().toISOString(),
        revisedPrompt: data.revisedPrompt,
      };

      // Add to Library under images
      addLibraryItem({
        id: `lib_img_${Date.now()}`,
        name: `Artwork_${prompt.substring(0, 18).replace(/\s+/g, '_')}.jpg`,
        category: 'images',
        extension: 'jpg',
        size: '1.2 MB',
        date: 'Just now',
        url: data.imageUrl,
        description: `Prompt: ${prompt} (${style})`,
      });

      return newImage;
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        conversations,
        currentConversationId,
        currentConversation,
        activeModel,
        setActiveModel,
        models,
        searchQuery,
        setSearchQuery,
        activeMode,
        setActiveModeId,
        modes,
        activeFolder,
        setActiveFolder,
        setConversationFolder,
        archiveConversation,
        isThinking,
        isStreaming,
        streamingContent,
        currentAIStatus,
        activeAttachments,
        addAttachment,
        removeAttachment,
        clearAttachments,
        isSidebarOpen,
        setIsSidebarOpen,
        toggleSidebar,
        isRightPanelOpen,
        setIsRightPanelOpen,
        toggleRightPanel,
        activeModal,
        setActiveModal,
        openModal,
        closeModal,
        memories,
        isMemoryEnabled,
        setIsMemoryEnabled,
        toggleMemory,
        addMemory,
        deleteMemory,
        clearMemories,
        libraryItems,
        addLibraryItem,
        deleteLibraryItem,
        isVoiceListening,
        setIsVoiceListening,
        isImageGenModalOpen,
        setIsImageGenModalOpen,
        isSettingsOpen,
        setIsSettingsOpen,
        userSettings,
        updateUserSettings,
        userProfile,
        updateUserProfile,
        selectConversation,
        createNewConversation,
        deleteConversation,
        pinConversation,
        renameConversation,
        exportConversation,
        clearAllConversations,
        sendMessage,
        editAndRegenerateMessage,
        regenerateLastResponse,
        stopGeneration,
        triggerQuickAction,
        generateImageAction,
        filteredConversations,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};
