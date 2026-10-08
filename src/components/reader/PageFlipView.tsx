'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';

interface PageFlipViewProps {
  contentHtml: string;
  chapterTitle: string;
  chapterNumber: number;
}

export function PageFlipView({ contentHtml, chapterTitle, chapterNumber }: PageFlipViewProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [pages, setPages] = useState<string[]>([]);
  const [isFlipping, setIsFlipping] = useState(false);

  // Divide chapter HTML into simulated physical book pages based on paragraph chunks
  useEffect(() => {
    // Split HTML by closing paragraph tag </p>
    const rawParagraphs = contentHtml.split('</p>').map((p) => p.trim()).filter(Boolean);
    const pagesList: string[] = [];
    const paragraphsPerPage = 2; // Clean editorial pagination

    for (let i = 0; i < rawParagraphs.length; i += paragraphsPerPage) {
      const chunk = rawParagraphs.slice(i, i + paragraphsPerPage).map((p) => `${p}</p>`).join('');
      pagesList.push(chunk);
    }

    if (pagesList.length === 0) {
      pagesList.push(contentHtml);
    }

    setPages(pagesList);
  }, [contentHtml]);

  // Subtle acoustic paper rustle sound synthesis via Web Audio API
  const playPageTurnSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const bufferSize = ctx.sampleRate * 0.08; // 80ms quick whisper
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.value = 800;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
    } catch {
      // AudioContext policy or unsupported
    }
  };

  const handleNext = () => {
    if (currentPage < pages.length - 1) {
      playPageTurnSound();
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev + 1);
        setIsFlipping(false);
      }, 200);
    }
  };

  const handlePrev = () => {
    if (currentPage > 0) {
      playPageTurnSound();
      setIsFlipping(true);
      setTimeout(() => {
        setCurrentPage((prev) => prev - 1);
        setIsFlipping(false);
      }, 200);
    }
  };

  // Keyboard navigation: Left/Right Arrow
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="w-full max-w-4xl mx-auto py-6 select-none">
      {/* Book Exterior Frame */}
      <div className="relative bg-[#FFFDF9] border border-[#DFD5C6] shadow-book-spine rounded-xs p-8 sm:p-12 min-h-[560px] flex flex-col justify-between">
        {/* Book Spine Center Gutter Shadow */}
        <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-8 bg-gradient-to-r from-transparent via-[#1B1A17]/5 to-transparent pointer-events-none hidden md:block" />

        {/* Page Header */}
        <div className="border-b border-[#DFD5C6] pb-3 mb-8 flex justify-between items-baseline text-xs font-mono text-[#8E887E]">
          <div className="flex items-center gap-2">
            <BookOpen size={14} className="text-[#9E3E26]" />
            <span className="uppercase tracking-widest">CHAPTER {chapterNumber}</span>
          </div>
          <div className="truncate max-w-xs uppercase tracking-wider text-[#1B1A17] font-semibold">
            {chapterTitle}
          </div>
          <div>
            Leaf {currentPage + 1} of {pages.length}
          </div>
        </div>

        {/* Page Content with Flip Transition */}
        <div
          className={`flex-1 transition-opacity duration-200 prose-editorial font-serif text-[#1B1A17] ${
            isFlipping ? 'opacity-30' : 'opacity-100'
          }`}
          dangerouslySetInnerHTML={{ __html: pages[currentPage] || '' }}
        />

        {/* Page Footer Navigation */}
        <div className="border-t border-[#DFD5C6] pt-6 mt-8 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={currentPage === 0}
            className={`px-4 py-2 border border-[#DFD5C6] font-mono text-xs uppercase tracking-wider flex items-center gap-1 transition-colors ${
              currentPage === 0
                ? 'opacity-40 cursor-not-allowed bg-[#F9F6F0]'
                : 'hover:bg-[#F3ECE1] bg-[#FFFDF9] text-[#1B1A17]'
            }`}
          >
            <ChevronLeft size={16} />
            <span>Turn Back</span>
          </button>

          <span className="font-mono text-xs text-[#8E887E]">
            Tap margins or press ← → arrows to flip
          </span>

          <button
            onClick={handleNext}
            disabled={currentPage >= pages.length - 1}
            className={`px-4 py-2 border border-[#DFD5C6] font-mono text-xs uppercase tracking-wider flex items-center gap-1 transition-colors ${
              currentPage >= pages.length - 1
                ? 'opacity-40 cursor-not-allowed bg-[#F9F6F0]'
                : 'hover:bg-[#9E3E26] hover:text-[#FFFDF9] bg-[#1B1A17] text-[#FFFDF9]'
            }`}
          >
            <span>Next Page</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
