'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthPage } from '@/components/auth/AuthPage';

function LoginContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <AuthPage
      initialMode="login"
      onAuthSuccess={() => {
        router.push('/');
      }}
    />
  );
}

export default function LoginPage() {
  return (
    <AuthProvider>
      <LoginContent />
    </AuthProvider>
  );
}
