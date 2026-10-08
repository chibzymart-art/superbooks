'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, ScrollText, ArrowLeft, ArrowRight, Settings2, Bookmark, Check } from 'lucide-react';
import { Chapter, Book } from '@/types/database';
import { AudioPlayerBar } from '@/components/reader/AudioPlayerBar';
import { PageFlipView } from '@/components/reader/PageFlipView';

interface ReaderViewProps {
  book: Book;
  chapter: Chapter;
  totalChapters: number;
  initialMode?: 'scroll' | 'flip';
}

export function ReaderView({ book, chapter, totalChapters, initialMode = 'scroll' }: ReaderViewProps) {
  const [readingMode, setReadingMode] = useState<'scroll' | 'flip'>(initialMode);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'huge'>('normal');
  const [theme, setTheme] = useState<'paper' | 'sepia' | 'night'>('paper');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [bookmarkSaved, setBookmarkSaved] = useState(false);

  // Load saved preferences
  useEffect(() => {
    const savedMode = localStorage.getItem('superbooks_reading_mode') as 'scroll' | 'flip' | null;
    if (savedMode) setReadingMode(savedMode);

    const savedSize = localStorage.getItem('superbooks_font_size') as 'normal' | 'large' | 'huge' | null;
    if (savedSize) setFontSize(savedSize);

    const savedTheme = localStorage.getItem('superbooks_theme') as 'paper' | 'sepia' | 'night' | null;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleModeChange = (mode: 'scroll' | 'flip') => {
    setReadingMode(mode);
    localStorage.setItem('superbooks_reading_mode', mode);
  };

  const handleFontSizeChange = (size: 'normal' | 'large' | 'huge') => {
    setFontSize(size);
    localStorage.setItem('superbooks_font_size', size);
  };

  const handleThemeChange = (t: 'paper' | 'sepia' | 'night') => {
    setTheme(t);
    localStorage.setItem('superbooks_theme', t);
  };

  // Scroll listener for reading progress bar
  useEffect(() => {
    if (readingMode !== 'scroll') return;

    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.round((window.scrollY / totalHeight) * 100));
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [readingMode]);

  const handleSaveBookmark = () => {
    setBookmarkSaved(true);
    setTimeout(() => setBookmarkSaved(false), 2500);
  };

  const themeClasses = {
    paper: 'bg-[#F9F6F0] text-[#1B1A17]',
    sepia: 'bg-[#F4ECD8] text-[#2B231B]',
    night: 'bg-[#1C1B19] text-[#E4DEC9]',
  }[theme];

  const fontSizeClasses = {
    normal: 'text-lg leading-relaxed',
    large: 'text-xl leading-loose',
    huge: 'text-2xl leading-loose',
  }[fontSize];

  return (
    <div className={`min-h-screen transition-colors duration-300 ${themeClasses}`}>
      {/* Scroll Progress Bar */}
      {readingMode === 'scroll' && (
        <div className="fixed top-0 left-0 right-0 h-1 bg-transparent z-50">
          <div
            className="h-full bg-[#9E3E26] transition-all duration-150"
            style={{ width: `${scrollProgress}%` }}
          />
        </div>
      )}

      {/* Reader Control Header */}
      <header className="sticky top-0 z-40 border-b border-[#DFD5C6]/60 backdrop-blur-md bg-inherit/90 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
          {/* Back to book overview */}
          <Link
            href={`/books/${book.slug}`}
            className="text-xs font-mono uppercase tracking-wider text-[#8E887E] hover:text-[#9E3E26] flex items-center gap-1 transition-colors"
          >
            <ArrowLeft size={14} />
            <span className="hidden sm:inline">Volume Index:</span>
            <span className="font-bold text-[#1B1A17]">{book.title}</span>
          </Link>

          {/* Reading Mode Switcher & Controls */}
          <div className="flex items-center gap-3">
            {/* Mode Switcher Buttons */}
            <div className="flex items-center border border-[#DFD5C6] bg-inherit rounded-xs p-0.5 text-xs font-mono">
              <button
                onClick={() => handleModeChange('scroll')}
                className={`px-3 py-1 flex items-center gap-1.5 transition-colors ${
                  readingMode === 'scroll'
                    ? 'bg-[#1B1A17] text-[#FFFDF9] font-bold'
                    : 'text-[#5C5850] hover:text-[#1B1A17]'
                }`}
                title="Continuous Smooth Scroll"
              >
                <ScrollText size={13} />
                <span className="hidden md:inline">Scroll</span>
              </button>
              <button
                onClick={() => handleModeChange('flip')}
                className={`px-3 py-1 flex items-center gap-1.5 transition-colors ${
                  readingMode === 'flip'
                    ? 'bg-[#9E3E26] text-[#FFFDF9] font-bold'
                    : 'text-[#5C5850] hover:text-[#1B1A17]'
                }`}
                title="Physical Page Flip"
              >
                <BookOpen size={13} />
                <span className="hidden md:inline">Page Flip</span>
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center border border-[#DFD5C6] rounded-xs text-xs font-serif">
              <button
                onClick={() => handleFontSizeChange('normal')}
                className={`px-2 py-1 ${fontSize === 'normal' ? 'font-bold text-[#9E3E26]' : 'text-[#8E887E]'}`}
              >
                A
              </button>
              <button
                onClick={() => handleFontSizeChange('large')}
                className={`px-2 py-1 ${fontSize === 'large' ? 'font-bold text-[#9E3E26]' : 'text-[#8E887E]'}`}
              >
                A+
              </button>
              <button
                onClick={() => handleFontSizeChange('huge')}
                className={`px-2 py-1 ${fontSize === 'huge' ? 'font-bold text-[#9E3E26]' : 'text-[#8E887E]'}`}
              >
                A++
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center border border-[#DFD5C6] rounded-xs p-1 gap-1">
              <button
                onClick={() => handleThemeChange('paper')}
                className={`w-4 h-4 rounded-full bg-[#F9F6F0] border border-[#DFD5C6] ${theme === 'paper' ? 'ring-2 ring-[#9E3E26]' : ''}`}
                title="Paper Cream"
              />
              <button
                onClick={() => handleThemeChange('sepia')}
                className={`w-4 h-4 rounded-full bg-[#F4ECD8] border border-[#D9CDB8] ${theme === 'sepia' ? 'ring-2 ring-[#9E3E26]' : ''}`}
                title="Warm Sepia"
              />
              <button
                onClick={() => handleThemeChange('night')}
                className={`w-4 h-4 rounded-full bg-[#1C1B19] border border-[#444] ${theme === 'night' ? 'ring-2 ring-[#9E3E26]' : ''}`}
                title="Night Ink"
              />
            </div>

            {/* Quick Bookmark Button */}
            <button
              onClick={handleSaveBookmark}
              className="p-1.5 border border-[#DFD5C6] hover:border-[#9E3E26] rounded-xs text-xs transition-colors"
              title="Add Bookmark"
            >
              {bookmarkSaved ? <Check size={14} className="text-[#25473A]" /> : <Bookmark size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Reading View Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {readingMode === 'flip' ? (
          <PageFlipView
            contentHtml={chapter.content_html || ''}
            chapterTitle={chapter.title}
            chapterNumber={chapter.number}
          />
        ) : (
          /* Smooth Scroll Mode */
          <article className="space-y-8">
            {/* Chapter Header */}
            <div className="border-b border-[#DFD5C6] pb-8 text-center space-y-3">
              <div className="text-xs font-mono tracking-widest text-[#9E3E26] uppercase font-bold">
                Volume {book.title} • Chapter {chapter.number}
              </div>
              <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">
                {chapter.title}
              </h1>
              <p className="text-sm italic text-[#5C5850]">By {book.author}</p>
            </div>

            {/* Chapter Body Prose */}
            <div
              className={`prose-editorial font-serif ${fontSizeClasses} drop-cap`}
              dangerouslySetInnerHTML={{ __html: chapter.content_html || '' }}
            />
          </article>
        )}

        {/* Chapter Navigation Footer */}
        <div className="mt-16 pt-8 border-t border-[#DFD5C6] flex items-center justify-between text-xs font-mono uppercase">
          {chapter.number > 1 ? (
            <Link
              href={`/read/${book.slug}/${chapter.number - 1}`}
              className="flex items-center gap-2 text-[#9E3E26] hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Chapter {chapter.number - 1}</span>
            </Link>
          ) : (
            <span className="text-[#8E887E]">Opening Chapter</span>
          )}

          <span className="text-[#8E887E]">
            {chapter.number} of {totalChapters} Chapters
          </span>

          {chapter.number < totalChapters ? (
            <Link
              href={`/read/${book.slug}/${chapter.number + 1}`}
              className="flex items-center gap-2 text-[#9E3E26] hover:underline"
            >
              <span>Chapter {chapter.number + 1}</span>
              <ArrowRight size={14} />
            </Link>
          ) : (
            <span className="text-[#8E887E]">Final Chapter</span>
          )}
        </div>
      </main>

      {/* Docked Chapter Audio Player Bar */}
      <div className="sticky bottom-4 z-40 max-w-3xl mx-auto px-4">
        <AudioPlayerBar
          audioKey={chapter.audio_key}
          textToSpeak={chapter.content_html}
          title={chapter.title}
          chapterNumber={chapter.number}
        />
      </div>
    </div>
  );
}
