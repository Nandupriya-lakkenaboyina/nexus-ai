export type UserRole = 'user' | 'admin' | 'guest';

export type UserTier = 'Free Explorer' | 'Nexus Pro' | 'Nexus Ultra Enterprise';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  tier: UserTier;
  role: UserRole;
  tokensUsedToday: number;
  tokensTotalToday: number;
  createdAt: string;
  lastLoginAt: string;
  bio?: string;
  password?: string; // stored locally in mock database
  company?: string;
}

export interface AuthState {
  currentUser: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  registeredUsers: AuthUser[];
}

export type AuthMode = 'login' | 'register' | 'forgot-password';
