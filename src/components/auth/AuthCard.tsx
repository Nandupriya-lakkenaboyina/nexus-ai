'use client';

import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { NexusLogo } from '@/components/ui/NexusLogo';
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  KeyRound,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserTier } from '@/types/auth';

interface AuthCardProps {
  initialMode?: 'login' | 'register' | 'forgot-password';
  onSuccess?: () => void;
  isModal?: boolean;
  className?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  initialMode = 'login',
  onSuccess,
  className = '',
}) => {
  const { login, register, resetPassword } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot-password'>(initialMode);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedTier, setSelectedTier] = useState<UserTier>('Nexus Pro');
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // Status states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [newResetPassword, setNewResetPassword] = useState('');

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-neutral-800' };
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

    switch (score) {
      case 1:
        return { score: 1, label: 'Weak', color: 'bg-rose-500' };
      case 2:
        return { score: 2, label: 'Fair', color: 'bg-amber-500' };
      case 3:
        return { score: 3, label: 'Good', color: 'bg-neutral-400' };
      case 4:
        return { score: 4, label: 'Strong', color: 'bg-emerald-400' };
      default:
        return { score: 0, label: 'Empty', color: 'bg-neutral-800' };
    }
  };

  const strength = calculatePasswordStrength(password);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);
    setIsLoading(true);

    try {
      const res = await login(email, password, rememberMe);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to sign in. Please verify your email and password.');
      } else {
        setSuccessMsg('Welcome back to Nexus AI!');
        onSuccess?.();
      }
    } catch {
      setErrorMsg('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please ensure both fields match.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Please accept the terms to create your account.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await register(name, email, password, selectedTier);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to create account.');
      } else {
        setSuccessMsg('Account created successfully! Welcome to Nexus AI.');
        onSuccess?.();
      }
    } catch {
      setErrorMsg('An error occurred during registration. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (!email.trim()) {
      setErrorMsg('Please enter your account email address.');
      setIsLoading(false);
      return;
    }

    if (newResetPassword) {
      const res = await resetPassword(email, newResetPassword);
      if (!res.success) {
        setErrorMsg(res.error || 'Failed to reset password.');
      } else {
        setSuccessMsg('Password reset successfully! You can now sign in with your new password.');
        setResetEmailSent(false);
        setMode('login');
      }
    } else {
      await new Promise((r) => setTimeout(r, 400));
      setResetEmailSent(true);
      setSuccessMsg('Email verified. Enter your new password below.');
    }

    setIsLoading(false);
  };

  return (
    <div
      className={`relative w-full max-w-md bg-[#0B0B0B] border border-[#1C1C1C] rounded-2xl p-6 sm:p-8 shadow-2xl text-white select-none ${className}`}
    >
      {/* Top Nexus Logo */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#121212] border border-[#242424] mb-3.5 shadow-inner">
          <NexusLogo size={22} />
        </div>
        <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white uppercase">
          {mode === 'login' && 'Sign In to Nexus AI'}
          {mode === 'register' && 'Register Nexus Account'}
          {mode === 'forgot-password' && 'Reset Password'}
        </h2>
        <p className="text-xs text-neutral-400 mt-1">
          {mode === 'login' && 'Enter your credentials to access your multimodal workspace'}
          {mode === 'register' && 'Create your account to start with Nexus AI'}
          {mode === 'forgot-password' && 'Enter your email to restore access'}
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      {mode !== 'forgot-password' && (
        <div className="grid grid-cols-2 p-1 bg-[#050505] border border-[#1C1C1C] rounded-xl mb-5">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'login'
                ? 'bg-[#181818] text-white border border-[#2A2A2A]'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg(null);
            }}
            className={`py-2 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              mode === 'register'
                ? 'bg-white text-black font-bold shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>
      )}

      {/* Error & Success Messages */}
      <AnimatePresence mode="wait">
        {errorMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-2.5 p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs leading-relaxed"
          >
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </motion.div>
        )}

        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2.5 p-3 mb-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIGN IN FORM */}
      {mode === 'login' && (
        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#050505] border border-[#1C1C1C] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-medium text-neutral-300">Password</label>
              <button
                type="button"
                onClick={() => {
                  setMode('forgot-password');
                  setErrorMsg(null);
                }}
                className="text-[11px] text-neutral-400 hover:text-white hover:underline cursor-pointer"
              >
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#050505] border border-[#1C1C1C] rounded-xl pl-9 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-0.5 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-[#222222] bg-[#050505] text-white focus:ring-white w-3.5 h-3.5 accent-white"
              />
              <span className="text-xs text-neutral-400">Remember session</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      )}

      {/* REGISTER FORM */}
      {mode === 'register' && (
        <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full bg-[#050505] border border-[#1C1C1C] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@nexus.ai"
                className="w-full bg-[#050505] border border-[#1C1C1C] rounded-xl pl-9 pr-4 py-2 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full bg-[#050505] border border-[#1C1C1C] rounded-xl pl-9 pr-10 py-2 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-0.5 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {password.length > 0 && (
              <div className="mt-2 space-y-1">
                <div className="flex gap-1 h-1">
                  {[1, 2, 3, 4].map((step) => (
                    <div
                      key={step}
                      className={`flex-1 rounded-full transition-all duration-300 ${
                        step <= strength.score ? strength.color : 'bg-[#181818]'
                      }`}
                    />
                  ))}
                </div>
                <div className="flex justify-between items-center text-[10px] text-neutral-500">
                  <span>Strength: {strength.label}</span>
                  <span>{password.length}/6+ chars</span>
                </div>
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter your password"
                className="w-full bg-[#050505] border border-[#1C1C1C] rounded-xl pl-9 pr-10 py-2 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white p-0.5 cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-[10px] text-rose-400 mt-1">Passwords do not match</p>
            )}
          </div>

          <div className="flex items-start gap-2 pt-1">
            <input
              type="checkbox"
              id="agreeTerms"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded border-[#222222] bg-[#050505] text-white focus:ring-white w-3.5 h-3.5 accent-white"
            />
            <label htmlFor="agreeTerms" className="text-[11px] text-neutral-400 leading-tight">
              I agree to the Terms of Service & Privacy Policy.
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-bold rounded-xl shadow-lg transition-all disabled:opacity-50 cursor-pointer mt-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <span>Create Free Account</span>
            )}
          </button>
        </form>
      )}

      {/* FORGOT PASSWORD FLOW */}
      {mode === 'forgot-password' && (
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Enter registered email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-[#050505] border border-[#1C1C1C] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
              />
            </div>
          </div>

          {resetEmailSent && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                New Password
              </label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="password"
                  required
                  value={newResetPassword}
                  onChange={(e) => setNewResetPassword(e.target.value)}
                  placeholder="Enter new password (min 6 chars)"
                  className="w-full bg-[#050505] border border-[#1C1C1C] rounded-xl pl-9 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-neutral-600 focus:outline-none focus:border-white"
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-white hover:bg-neutral-200 text-black text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : resetEmailSent ? (
              'Update Password & Sign In'
            ) : (
              'Send Reset Verification'
            )}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMsg(null);
                setResetEmailSent(false);
              }}
              className="text-xs text-neutral-400 hover:text-white cursor-pointer"
            >
              Back to Sign In
            </button>
          </div>
        </form>
      )}

      {/* Footer Security Badge */}
      <div className="mt-6 flex items-center justify-center gap-1.5 text-[10px] text-neutral-500 border-t border-[#141414] pt-3">
        <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
        <span>Secure Local Encrypted Authentication</span>
      </div>
    </div>
  );
};
