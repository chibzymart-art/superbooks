'use client';

import React from 'react';
import Link from 'next/link';
import { Lock, BookOpen, ArrowLeft } from 'lucide-react';

interface GatedChapterModalProps {
  bookTitle: string;
  bookAuthor: string;
  bookSlug: string;
  chapterNumber: number;
}

export function GatedChapterModal({ bookTitle, bookAuthor, bookSlug, chapterNumber }: GatedChapterModalProps) {
  return (
    <div className="max-w-2xl mx-auto my-12 bg-[#FFFDF9] border border-[#DFD5C6] shadow-book-spine p-8 sm:p-12 text-center rounded-xs space-y-6">
      <div className="w-14 h-14 rounded-full bg-[#F3ECE1] border border-[#DFD5C6] text-[#9E3E26] flex items-center justify-center mx-auto shadow-xs">
        <Lock size={24} />
      </div>

      <div className="space-y-2">
        <div className="text-xs font-mono text-[#9E3E26] uppercase tracking-widest font-bold">
          Reader Gate • Chapter {chapterNumber}
        </div>
        <h2 className="font-serif text-3xl font-bold text-[#1B1A17]">
          Continue Reading {bookTitle}
        </h2>
        <p className="text-sm italic text-[#5C5850]">By {bookAuthor}</p>
      </div>

      <p className="text-base text-[#5C5850] leading-relaxed max-w-lg mx-auto">
        Chapter 1 of this volume is offered as a public reading preview. To preserve literary copyrights and continue with Chapter 2 through the final page, please sign in with your SuperBooks account.
      </p>

      <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
        <Link
          href={`/auth/login?next=/read/${bookSlug}/${chapterNumber}`}
          className="w-full sm:w-auto px-8 py-3 bg-[#9E3E26] hover:bg-[#822F1B] text-[#FFFDF9] text-xs font-mono uppercase tracking-widest font-bold transition-colors shadow-xs"
        >
          Sign In to Unlock
        </Link>
        <Link
          href={`/read/${bookSlug}/1`}
          className="w-full sm:w-auto px-6 py-3 border border-[#DFD5C6] bg-[#FFFDF9] hover:bg-[#F3ECE1] text-[#1B1A17] text-xs font-mono uppercase tracking-widest font-bold transition-colors flex items-center justify-center gap-2"
        >
          <BookOpen size={14} />
          <span>Return to Chapter 1 Preview</span>
        </Link>
      </div>

      <div className="pt-6 border-t border-[#DFD5C6] text-xs text-[#8E887E]">
        <Link href="/library" className="hover:text-[#9E3E26] inline-flex items-center gap-1">
          <ArrowLeft size={12} />
          <span>Browse all 100% Free Complete Books</span>
        </Link>
      </div>
    </div>
  );
}
