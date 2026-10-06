'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthProvider, useAuth } from '@/context/AuthContext';
import { AuthPage } from '@/components/auth/AuthPage';

function RegisterContent() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <AuthPage
      initialMode="register"
      onAuthSuccess={() => {
        router.push('/');
      }}
    />
  );
}

export default function RegisterPage() {
  return (
    <AuthProvider>
      <RegisterContent />
    </AuthProvider>
  );
}
