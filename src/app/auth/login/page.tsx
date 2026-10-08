'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { BookOpen, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get('next') || '/library';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    const supabase = createClient();
    if (!supabase) {
      // Local demo mode: simulate instant login
      router.push(nextUrl);
      return;
    }

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        });
        if (error) throw error;
        alert('Check your email for the confirmation link!');
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err: unknown) {
      setErrorMsg(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-[#FFFDF9] border border-[#DFD5C6] shadow-book-spine p-8 sm:p-10 rounded-xs space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full bg-[#F3ECE1] border border-[#DFD5C6] text-[#9E3E26] flex items-center justify-center mx-auto">
          <BookOpen size={20} />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#1B1A17]">
          {isSignUp ? 'Join the Reading Room' : 'Reader Sign In'}
        </h1>
        <p className="text-xs text-[#5C5850]">
          Access members volumes, bookmark progress, and join community discussions.
        </p>
      </div>

      {errorMsg && (
        <div className="p-3 bg-[#9E3E26]/10 border border-[#9E3E26] text-[#9E3E26] text-xs font-mono">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="reader@superbooks.studio"
            className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••••••"
            className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-[#9E3E26] hover:bg-[#822F1B] text-[#FFFDF9] text-xs font-mono uppercase tracking-widest font-bold transition-colors shadow-xs flex items-center justify-center gap-2"
        >
          <span>{loading ? 'Processing...' : isSignUp ? 'Create Reader Account' : 'Enter Reading Room'}</span>
          <ArrowRight size={14} />
        </button>
      </form>

      <div className="text-center pt-2 border-t border-[#DFD5C6]">
        <button
          onClick={() => setIsSignUp(!isSignUp)}
          className="text-xs font-mono text-[#5C5850] hover:text-[#9E3E26] transition-colors"
        >
          {isSignUp ? 'Already a reader? Sign in instead →' : "New to SuperBooks? Join free →"}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={<div className="font-mono text-xs text-[#8E887E]">Loading reader authentication...</div>}>
        <LoginFormContent />
      </Suspense>
    </div>
  );
}
