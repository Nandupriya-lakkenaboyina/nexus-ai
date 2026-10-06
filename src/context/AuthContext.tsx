'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthUser, AuthState, AuthMode, UserTier } from '@/types/auth';

const STORAGE_USERS_KEY = 'nexus_registered_users';
const STORAGE_SESSION_KEY = 'nexus_auth_session';

export const DEFAULT_USERS: AuthUser[] = [
  {
    id: 'user_alex_01',
    name: 'Alex Rivera',
    email: 'alex@nexus.ai',
    tier: 'Nexus Pro',
    role: 'user',
    tokensUsedToday: 14,
    tokensTotalToday: 100,
    createdAt: '2026-01-15T09:00:00.000Z',
    lastLoginAt: '2026-10-05T08:30:00.000Z',
    bio: 'AI Product Designer & Creative Technologist',
    password: 'password123',
    company: 'Nexus Studio',
  },
  {
    id: 'user_adiseshu_02',
    name: 'Adiseshu',
    email: 'adiseshu@nexus.ai',
    tier: 'Nexus Pro',
    role: 'admin',
    tokensUsedToday: 42,
    tokensTotalToday: 250,
    createdAt: '2026-01-01T00:00:00.000Z',
    lastLoginAt: '2026-10-05T12:00:00.000Z',
    bio: 'Lead Engineer & AI Architect',
    password: 'password123',
    company: 'Nexus Intelligence',
  },
];

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe?: boolean) => Promise<{ success: boolean; error?: string }>;
  register: (
    name: string,
    email: string,
    password: string,
    tier?: UserTier
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  loginAsGuest: () => void;
  switchAccount: (userId: string) => boolean;
  updateUser: (updates: Partial<AuthUser>) => void;
  resetPassword: (email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: AuthMode;
  setAuthModalMode: (mode: AuthMode) => void;
  deleteAccount: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [registeredUsers, setRegisteredUsers] = useState<AuthUser[]>(DEFAULT_USERS);
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<AuthMode>('login');

  // Hydrate users and active session from localStorage
  useEffect(() => {
    try {
      let users = DEFAULT_USERS;
      const storedUsers = localStorage.getItem(STORAGE_USERS_KEY);
      if (storedUsers) {
        const parsed = JSON.parse(storedUsers);
        if (Array.isArray(parsed) && parsed.length > 0) {
          users = parsed;
        }
      } else {
        localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(DEFAULT_USERS));
      }
      setRegisteredUsers(users);

      const storedSession = localStorage.getItem(STORAGE_SESSION_KEY);
      if (storedSession) {
        const sessionUser = JSON.parse(storedSession);
        // Match with latest user data if available
        const matched = users.find((u) => u.id === sessionUser.id || u.email.toLowerCase() === sessionUser.email?.toLowerCase());
        if (matched) {
          setCurrentUser(matched);
        } else if (sessionUser.role === 'guest') {
          setCurrentUser(sessionUser);
        } else {
          setCurrentUser(users[0] || null);
        }
      } else {
        // Default to not authenticated or initial user
        setCurrentUser(null);
      }
    } catch (e) {
      console.error('Failed to load auth state from localStorage:', e);
      setCurrentUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Sync registered users to localStorage whenever updated
  const saveUsers = (users: AuthUser[]) => {
    setRegisteredUsers(users);
    try {
      localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users:', e);
    }
  };

  const setSession = (user: AuthUser | null) => {
    setCurrentUser(user);
    try {
      if (user) {
        localStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  };

  const login = async (
    email: string,
    password: string,
    rememberMe = true
  ): Promise<{ success: boolean; error?: string }> => {
    // Artificial small delay for realistic smooth auth feedback
    await new Promise((res) => setTimeout(res, 400));

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      return { success: false, error: 'Please provide both email and password.' };
    }

    const user = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      return {
        success: false,
        error: 'No account found with this email. Please register first or try the demo account.',
      };
    }

    if (user.password && user.password !== cleanPassword) {
      return { success: false, error: 'Incorrect password. Please verify and try again.' };
    }

    const updatedUser: AuthUser = {
      ...user,
      lastLoginAt: new Date().toISOString(),
    };

    const updatedUsers = registeredUsers.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(updatedUsers);
    setSession(updatedUser);
    setIsAuthModalOpen(false);

    return { success: true };
  };

  const register = async (
    name: string,
    email: string,
    password: string,
    tier: UserTier = 'Free Explorer'
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 500));

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanName) {
      return { success: false, error: 'Please enter your full name.' };
    }

    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return { success: false, error: 'Please enter a valid email address.' };
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' };
    }

    const existingUser = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (existingUser) {
      return {
        success: false,
        error: 'An account with this email already exists. Please sign in instead.',
      };
    }

    const newUser: AuthUser = {
      id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name: cleanName,
      email: cleanEmail,
      tier,
      role: 'user',
      tokensUsedToday: 0,
      tokensTotalToday: tier === 'Nexus Pro' ? 200 : tier === 'Nexus Ultra Enterprise' ? 500 : 100,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      password: cleanPassword,
      bio: 'Nexus AI Explorer',
    };

    const nextUsers = [newUser, ...registeredUsers];
    saveUsers(nextUsers);
    setSession(newUser);
    setIsAuthModalOpen(false);

    return { success: true };
  };

  const logout = () => {
    setSession(null);
  };

  const loginAsGuest = () => {
    const guestUser: AuthUser = {
      id: `guest_${Date.now()}`,
      name: 'Guest Explorer',
      email: 'guest@nexus.ai',
      tier: 'Free Explorer',
      role: 'guest',
      tokensUsedToday: 0,
      tokensTotalToday: 25,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      bio: 'Temporary guest session',
    };
    setSession(guestUser);
    setIsAuthModalOpen(false);
  };

  const switchAccount = (userId: string): boolean => {
    const user = registeredUsers.find((u) => u.id === userId);
    if (user) {
      setSession(user);
      return true;
    }
    return false;
  };

  const updateUser = (updates: Partial<AuthUser>) => {
    if (!currentUser) return;
    const updatedUser: AuthUser = { ...currentUser, ...updates };
    setSession(updatedUser);

    if (currentUser.role !== 'guest') {
      const nextUsers = registeredUsers.map((u) => (u.id === currentUser.id ? updatedUser : u));
      saveUsers(nextUsers);
    }
  };

  const resetPassword = async (
    email: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> => {
    await new Promise((res) => setTimeout(res, 500));
    const cleanEmail = email.trim().toLowerCase();

    const user = registeredUsers.find((u) => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'No account found with this email.' };
    }

    if (newPassword.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters.' };
    }

    const updatedUser: AuthUser = { ...user, password: newPassword };
    const nextUsers = registeredUsers.map((u) => (u.id === user.id ? updatedUser : u));
    saveUsers(nextUsers);

    if (currentUser?.id === user.id) {
      setSession(updatedUser);
    }

    return { success: true };
  };

  const deleteAccount = (userId: string) => {
    const nextUsers = registeredUsers.filter((u) => u.id !== userId);
    saveUsers(nextUsers);
    if (currentUser?.id === userId) {
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        isLoading,
        registeredUsers,
        login,
        register,
        logout,
        loginAsGuest,
        switchAccount,
        updateUser,
        resetPassword,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
