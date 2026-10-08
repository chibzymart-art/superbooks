'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteHeader() {
  const pathname = usePathname();

  // Distraction-free reading experience: hide global header when reading a chapter
  if (pathname.startsWith('/read/')) {
    return null;
  }

  return (
    <>
      {/* Editorial Top Utility Bar */}
      <div className="border-b border-[#DFD5C6] bg-[#F3ECE1] py-1.5 px-4 text-[10px] sm:text-xs tracking-wider uppercase flex justify-between items-center text-[#5C5850]">
        <div className="flex items-center gap-2 truncate">
          <span className="w-1.5 h-1.5 rounded-full bg-[#9E3E26] shrink-0" />
          <span className="truncate">Vol. 2026 • Literary Gazette & Reading Room</span>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          <span className="hidden md:inline">Direct browser presigned reading</span>
          <Link
            href="/library"
            className="hover:text-[#9E3E26] transition-colors underline decoration-[#9E3E26]/40"
          >
            5 Curated Classics
          </Link>
        </div>
      </div>

      {/* Studio Editorial Header */}
      <header className="border-b border-[#DFD5C6] bg-[#F9F6F0]/95 backdrop-blur-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2 group shrink-0">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-[#1B1A17] group-hover:text-[#9E3E26] transition-colors">
              SuperBooks<span className="text-[#9E3E26]">.</span>
            </span>
            <span className="text-[11px] font-mono tracking-widest text-[#8E887E] uppercase hidden md:inline">
              Reading Studio
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-3 sm:gap-6 lg:gap-8 text-xs sm:text-sm font-medium tracking-wide">
            <Link
              href="/library"
              className="text-[#1B1A17] hover:text-[#9E3E26] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#9E3E26] hover:after:w-full after:transition-all"
            >
              Library
            </Link>
            <Link
              href="/booktok"
              className="text-[#1B1A17] hover:text-[#9E3E26] transition-colors py-1 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-[#9E3E26] animate-pulse" />
              <span>Booktok</span>
            </Link>
            <Link
              href="/community"
              className="text-[#5C5850] hover:text-[#1B1A17] transition-colors hidden sm:inline"
            >
              Discussions
            </Link>
            <Link
              href="/admin"
              className="text-[#5C5850] hover:text-[#1B1A17] transition-colors text-[11px] font-mono border border-[#DFD5C6] px-2 py-0.5 rounded-sm bg-[#F3ECE1] hover:border-[#1B1A17] hidden xs:inline"
            >
              Admin
            </Link>
            <Link
              href="/library?free=true"
              className="bg-[#9E3E26] text-[#FFFDF9] px-2.5 sm:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs uppercase tracking-widest font-semibold hover:bg-[#822F1B] transition-colors shadow-xs"
            >
              Read Free
            </Link>
          </nav>
        </div>
      </header>
    </>
  );
}
