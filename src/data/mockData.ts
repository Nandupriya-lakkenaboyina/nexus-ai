import {
  Conversation,
  AIModel,
  UserProfile,
  UserSettings,
  WorkspaceFile,
  GeneratedImage,
  MemoryItem,
  LibraryItem,
} from '@/types';

export const INITIAL_MODELS: AIModel[] = [
  {
    id: 'nexus-pro',
    name: 'Nexus Pro',
    tag: 'Flagship Multimodal',
    description: 'Advanced reasoning, code generation, and multimodal analysis.',
    badge: 'Default',
    iconName: 'Sparkles',
  },
  {
    id: 'nexus-flash',
    name: 'Nexus Flash',
    tag: 'Ultra Fast',
    description: 'Optimized for speed and lightweight queries with minimal latency.',
    badge: 'Fast',
    iconName: 'Zap',
  },
  {
    id: 'nexus-ultra',
    name: 'Nexus Ultra',
    tag: 'Deep Reasoning',
    description: 'High-precision mathematical logic and complex architectural design.',
    badge: 'Pro',
    iconName: 'Brain',
  },
  {
    id: 'nexus-coder',
    name: 'Nexus Coder',
    tag: 'Specialized Code',
    description: 'Specialized model for code refactoring, synthesis, and debugging.',
    badge: 'Code',
    iconName: 'Code',
  },
];

export const INITIAL_USER_PROFILE: UserProfile = {
  name: 'Nexus User',
  email: 'user@nexus.ai',
  avatarUrl: '',
  tier: 'Nexus Pro Member',
  tokensUsedToday: 0,
  tokensTotalToday: 100,
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: 'dark',
  enterToSend: true,
  enableStreaming: true,
  autoTitle: true,
  language: 'English (US)',
  notifications: true,
  saveHistory: true,
  temporaryChat: false,
  defaultMode: 'general',
  isMemoryEnabled: true,
};

export const INITIAL_MEMORIES: MemoryItem[] = [
  {
    id: 'mem_1',
    content: 'Prefers TypeScript with strict typing for frontend and Python for data science.',
    category: 'preference',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'mem_2',
    content: 'Focusing on clean, minimalist black aesthetics with zero excessive colors.',
    category: 'preference',
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_LIBRARY_ITEMS: LibraryItem[] = [
  {
    id: 'lib_1',
    name: 'Quarterly_AI_Research_Report.pdf',
    category: 'documents',
    extension: 'pdf',
    size: '2.4 MB',
    date: 'Just now',
    description: 'State of multimodal intelligence benchmarks and inference scaling.',
  },
  {
    id: 'lib_2',
    name: 'User_Engagement_Metrics_2026.csv',
    category: 'datasets',
    extension: 'csv',
    size: '840 KB',
    date: 'Today',
    description: 'Daily active sessions, retention cohorts, and token throughput analysis.',
  },
];

export const MOCK_CONVERSATIONS: Conversation[] = [];
export const SAMPLE_GENERATED_IMAGES: GeneratedImage[] = [];
export const INITIAL_WORKSPACE_FILES: WorkspaceFile[] = [];
