export type AIResponseStatus =
  | 'idle'
  | 'uploading'
  | 'analyzing'
  | 'file-analysis'
  | 'generating'
  | 'streaming'
  | 'completed'
  | 'error';

export type AttachmentType = 'image' | 'video' | 'document' | 'audio' | 'code';

export interface Attachment {
  id: string;
  name: string;
  type: AttachmentType;
  extension: string;
  size: string;
  url?: string;
  thumbnail?: string;
  base64?: string;
  mimeType?: string;
  textContent?: string;
  dimensions?: string;
  duration?: string;
}

export interface GeneratedImage {
  id: string;
  prompt: string;
  style: 'Realistic' | 'Cinematic' | '3D' | 'Anime' | 'Illustration' | 'Product Photography' | 'Minimal' | 'Cyberpunk' | 'Watercolor' | 'Custom';
  aspectRatio: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
  imageUrl: string;
  createdAt: string;
  revisedPrompt?: string;
}

export interface CodeBlockItem {
  id: string;
  language: string;
  code: string;
  title?: string;
}

export interface TableItem {
  headers: string[];
  rows: string[][];
}

export interface WebSourceItem {
  title: string;
  url: string;
  snippet?: string;
  domain?: string;
}

export interface InteractiveElements {
  codeBlocks?: CodeBlockItem[];
  tables?: TableItem[];
  suggestedFollowups?: string[];
  webSources?: WebSourceItem[];
  callout?: {
    type: 'info' | 'warning' | 'tip';
    title: string;
    message: string;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  attachments?: Attachment[];
  isEdited?: boolean;
  status?: AIResponseStatus;
  generatedImage?: GeneratedImage;
  interactiveElements?: InteractiveElements;
  sources?: WebSourceItem[];
  feedback?: 'like' | 'dislike' | null;
  modeUsed?: string;
}

export type ConversationGroup = 'today' | 'yesterday' | 'previous-7-days' | 'older';

export type ChatFolderType =
  | 'all'
  | 'coding'
  | 'study'
  | 'projects'
  | 'research'
  | 'personal'
  | 'archived'
  | 'All'
  | 'Coding'
  | 'Study'
  | 'Projects'
  | 'Research'
  | 'Personal'
  | 'Archived';

export interface Conversation {
  id: string;
  title: string;
  lastMessagePreview: string;
  timestamp: string;
  group: ConversationGroup;
  pinned: boolean;
  archived?: boolean;
  folder?: ChatFolderType;
  model: string;
  mode?: NexusModeId;
  messages: Message[];
  hasAttachments?: boolean;
}

export interface AIModel {
  id: string;
  name: string;
  tag: string;
  description: string;
  badge?: string;
  iconName: string;
}

export type NexusModeId =
  | 'general'
  | 'study'
  | 'coding'
  | 'data-analyst'
  | 'document-analyst'
  | 'writing'
  | 'research';

export interface NexusMode {
  id: NexusModeId;
  name: string;
  tagline: string;
  description: string;
  iconName: string;
  systemPrompt: string;
  slashCommand: string;
}

export interface MemoryItem {
  id: string;
  content: string;
  createdAt: string;
  category?: 'preference' | 'personal' | 'project' | 'general';
}

export type LibraryCategory = 'documents' | 'images' | 'datasets' | 'generated' | 'saved';

export interface LibraryItem {
  id: string;
  name: string;
  category: LibraryCategory;
  extension: string;
  size: string;
  date: string;
  url?: string;
  content?: string;
  description?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  score: number;
  total: number;
  answers: { questionId: string; selectedOption: number; isCorrect: boolean }[];
  completedAt: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category?: string;
}

export interface DataAnalysisSummary {
  rowCount: number;
  columnCount: number;
  columns: { name: string; type: 'string' | 'number' | 'date' | 'boolean'; nullCount: number; uniqueCount: number }[];
  duplicateRows: number;
  sampleRows: Record<string, any>[];
  numericStats?: Record<string, { min: number; max: number; mean: number; median: number }>;
}

export interface WorkspaceFile {
  id: string;
  name: string;
  type: string;
  extension: string;
  size: string;
  date: string;
  url?: string;
  sourceConversationId?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  avatarUrl: string;
  tier: string;
  tokensUsedToday: number;
  tokensTotalToday: number;
}

export interface UserSettings {
  theme: 'dark'; // Pure Black theme
  enterToSend: boolean;
  enableStreaming: boolean;
  autoTitle: boolean;
  language: string;
  notifications: boolean;
  saveHistory: boolean;
  temporaryChat: boolean;
  geminiApiKey?: string;
  defaultMode: NexusModeId;
  isMemoryEnabled: boolean;
}

export * from './auth';
