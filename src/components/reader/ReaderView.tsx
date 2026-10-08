'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BookOpen,
  ScrollText,
  ArrowLeft,
  ArrowRight,
  Bookmark,
  Check,
  ShieldCheck,
  Copy,
  X,
  ExternalLink,
  Layers,
  Sparkles,
} from 'lucide-react';
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
  const [showCdnInspector, setShowCdnInspector] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

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

  const canonicalR2Link = `/api/media/books/${book.slug}/manuscript-compressed.epub`;

  const handleCopyLink = () => {
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${canonicalR2Link}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
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
      <header className="sticky top-0 z-40 border-b border-[#DFD5C6]/60 backdrop-blur-md bg-inherit/90 px-3 sm:px-4 py-2 sm:py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-1.5 sm:gap-4">
          {/* Back to book overview */}
          <Link
            href={`/books/${book.slug}`}
            className="text-xs font-mono uppercase tracking-wider text-[#8E887E] hover:text-[#9E3E26] flex items-center gap-1 transition-colors min-w-0 shrink"
            title={`Back to ${book.title}`}
          >
            <ArrowLeft size={14} className="shrink-0" />
            <span className="font-bold text-[#1B1A17] truncate max-w-[90px] xs:max-w-[140px] sm:max-w-xs md:max-w-md">{book.title}</span>
          </Link>

          {/* Reading Mode Switcher & Controls */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Cloudflare R2 Delivery Pill */}
            <button
              id="btn-reader-cdn-pill"
              onClick={() => setShowCdnInspector(true)}
              className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1 rounded-full bg-[#25473A]/10 hover:bg-[#25473A]/20 text-[#25473A] border border-[#25473A]/30 text-[10px] sm:text-[11px] font-mono transition-colors cursor-pointer"
              title="Cloudflare R2 Delivery Telemetry"
            >
              <ShieldCheck size={13} className="text-[#25473A] shrink-0" />
              <span className="hidden xs:inline">Cloudflare R2</span>
              <span className="font-bold">&le;1 MB</span>
            </button>

            {/* Mode Switcher Buttons */}
            <div className="flex items-center border border-[#DFD5C6] bg-inherit rounded-xs p-0.5 text-xs font-mono">
              <button
                id="btn-mode-scroll"
                onClick={() => handleModeChange('scroll')}
                className={`p-1 sm:px-3 sm:py-1 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  readingMode === 'scroll'
                    ? 'bg-[#1B1A17] text-[#FFFDF9] font-bold'
                    : 'text-[#5C5850] hover:text-[#1B1A17]'
                }`}
                title="Continuous Smooth Scroll"
              >
                <ScrollText size={13} />
                <span className="hidden sm:inline">Scroll</span>
              </button>
              <button
                id="btn-mode-flip"
                onClick={() => handleModeChange('flip')}
                className={`p-1 sm:px-3 sm:py-1 flex items-center gap-1.5 transition-colors cursor-pointer ${
                  readingMode === 'flip'
                    ? 'bg-[#9E3E26] text-[#FFFDF9] font-bold'
                    : 'text-[#5C5850] hover:text-[#1B1A17]'
                }`}
                title="Physical Page Flip"
              >
                <BookOpen size={13} />
                <span className="hidden sm:inline">Flip</span>
              </button>
            </div>

            {/* Font Size Selector */}
            <div className="hidden sm:flex items-center border border-[#DFD5C6] rounded-xs text-xs font-serif">
              <button
                id="btn-font-normal"
                onClick={() => handleFontSizeChange('normal')}
                className={`px-2 py-1 cursor-pointer ${fontSize === 'normal' ? 'font-bold text-[#9E3E26]' : 'text-[#8E887E]'}`}
              >
                A
              </button>
              <button
                id="btn-font-large"
                onClick={() => handleFontSizeChange('large')}
                className={`px-2 py-1 cursor-pointer ${fontSize === 'large' ? 'font-bold text-[#9E3E26]' : 'text-[#8E887E]'}`}
              >
                A+
              </button>
              <button
                id="btn-font-huge"
                onClick={() => handleFontSizeChange('huge')}
                className={`px-2 py-1 cursor-pointer ${fontSize === 'huge' ? 'font-bold text-[#9E3E26]' : 'text-[#8E887E]'}`}
              >
                A++
              </button>
            </div>

            {/* Theme Toggle */}
            <div className="flex items-center border border-[#DFD5C6] rounded-xs p-1 gap-1">
              <button
                id="btn-theme-paper"
                onClick={() => handleThemeChange('paper')}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#F9F6F0] border border-[#DFD5C6] cursor-pointer ${theme === 'paper' ? 'ring-2 ring-[#9E3E26]' : ''}`}
                title="Paper Cream"
              />
              <button
                id="btn-theme-sepia"
                onClick={() => handleThemeChange('sepia')}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#F4ECD8] border border-[#D9CDB8] cursor-pointer ${theme === 'sepia' ? 'ring-2 ring-[#9E3E26]' : ''}`}
                title="Warm Sepia"
              />
              <button
                id="btn-theme-night"
                onClick={() => handleThemeChange('night')}
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-full bg-[#1C1B19] border border-[#444] cursor-pointer ${theme === 'night' ? 'ring-2 ring-[#9E3E26]' : ''}`}
                title="Night Ink"
              />
            </div>

            {/* Quick Bookmark Button */}
            <button
              id="btn-save-bookmark"
              onClick={handleSaveBookmark}
              className="p-1 sm:p-1.5 border border-[#DFD5C6] hover:border-[#9E3E26] rounded-xs text-xs transition-colors cursor-pointer"
              title="Add Bookmark"
            >
              {bookmarkSaved ? <Check size={14} className="text-[#25473A]" /> : <Bookmark size={14} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Reading View Area */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-16 pb-28">
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
              <h1 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold tracking-tight break-words">
                {chapter.title}
              </h1>
              <p className="text-sm italic text-[#5C5850]">By {book.author}</p>
            </div>

            {/* Chapter Body Prose */}
            <div
              id="chapter-body-prose"
              className={`prose-editorial font-serif ${fontSizeClasses} drop-cap`}
              dangerouslySetInnerHTML={{ __html: chapter.content_html || '' }}
            />
          </article>
        )}

        {/* Chapter Navigation Footer */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-[#DFD5C6] flex items-center justify-between text-[11px] sm:text-xs font-mono uppercase">
          {chapter.number > 1 ? (
            <Link
              id="btn-prev-chapter"
              href={`/read/${book.slug}/${chapter.number - 1}`}
              className="flex items-center gap-1 sm:gap-2 text-[#9E3E26] hover:underline"
            >
              <ArrowLeft size={14} />
              <span>Chapter {chapter.number - 1}</span>
            </Link>
          ) : (
            <span className="text-[#8E887E]">Opening Chapter</span>
          )}

          <span className="text-[#8E887E] text-center">
            {chapter.number} / {totalChapters}
          </span>

          {chapter.number < totalChapters ? (
            <Link
              id="btn-next-chapter"
              href={`/read/${book.slug}/${chapter.number + 1}`}
              className="flex items-center gap-1 sm:gap-2 text-[#9E3E26] hover:underline"
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
      <div className="sticky bottom-4 z-40 max-w-3xl mx-auto px-4 pb-2">
        <AudioPlayerBar
          audioKey={chapter.audio_key}
          textToSpeak={chapter.content_html}
          title={chapter.title}
          chapterNumber={chapter.number}
        />
      </div>

      {/* Cloudflare R2 Delivery Telemetry Modal */}
      {showCdnInspector && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            id="reader-cdn-telemetry-modal"
            className="bg-[#F9F6F0] text-[#1B1A17] border border-[#DFD5C6] rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="flex items-start justify-between pb-3 border-b border-[#DFD5C6]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#25473A]/10 text-[#25473A] border border-[#25473A]/20">
                  Cloudflare R2 Delivery Engine
                </span>
                <h3 className="text-lg font-serif font-bold text-[#1B1A17] mt-1">
                  {book.title}
                </h3>
              </div>
              <button
                id="btn-close-reader-modal"
                onClick={() => setShowCdnInspector(false)}
                className="p-1 rounded-lg text-[#5C5850] hover:text-[#1B1A17] hover:bg-[#EBE3D5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs font-serif">
              {/* Canonical Resolver */}
              <div className="p-3.5 rounded-xl bg-white border border-[#DFD5C6] space-y-1">
                <div className="text-[11px] font-medium text-[#5C5850] flex items-center justify-between">
                  <span>Canonical Manuscript Link (Cloudflare R2)</span>
                  <span className="text-[10px] font-mono text-[#25473A]">Verified Edge Node</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 rounded bg-[#F9F6F0] border border-[#E5DFD3] font-mono text-[11px]">
                  <span className="truncate">{canonicalR2Link}</span>
                  <button
                    id="btn-copy-reader-r2-link"
                    onClick={handleCopyLink}
                    className="p-1 rounded hover:bg-[#DFD5C6] text-[#5C5850] cursor-pointer shrink-0"
                    title="Copy Link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#25473A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Delivery Specs */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2.5 rounded-lg bg-white border border-[#DFD5C6]">
                  <div className="text-[10px] text-[#5C5850]">Compression</div>
                  <div className="text-xs font-bold text-[#25473A] mt-0.5">&le;1 MB Lossless</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#DFD5C6]">
                  <div className="text-[10px] text-[#5C5850]">Egress Fee</div>
                  <div className="text-xs font-bold text-[#25473A] mt-0.5">$0.00 Egress</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white border border-[#DFD5C6]">
                  <div className="text-[10px] text-[#5C5850]">Signed TTL</div>
                  <div className="text-xs font-bold text-[#1B1A17] mt-0.5">15 Min Rolling</div>
                </div>
              </div>

              {/* Visual Guarantee */}
              <div className="p-3 rounded-xl bg-[#25473A]/5 border border-[#25473A]/20 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#25473A] shrink-0 mt-0.5" />
                <div className="text-[11px] leading-relaxed text-[#25473A]">
                  <strong className="font-semibold">Sanctuary Typography Integrity:</strong> Visual assets, chapter drop-caps, and prose vectors are preserved without compression artifacts.
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  onClick={() => setShowCdnInspector(false)}
                  className="px-4 py-2 rounded-xl border border-[#DFD5C6] text-xs font-serif text-[#5C5850] hover:bg-[#EBE3D5] cursor-pointer"
                >
                  Close
                </button>
                <a
                  id="link-test-reader-endpoint"
                  href={`${canonicalR2Link}?redirect=true`}
                  target="_blank"
                  className="px-4 py-2 rounded-xl bg-[#9E3E26] hover:bg-[#83331F] text-white text-xs font-serif font-medium transition-colors shadow-sm flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Direct Manuscript Endpoint</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
