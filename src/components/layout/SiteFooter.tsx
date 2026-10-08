'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function SiteFooter() {
  const pathname = usePathname();

  // Hide global footer when inside the reading experience
  if (pathname.startsWith('/read/')) {
    return null;
  }

  return (
    <footer className="border-t border-[#DFD5C6] bg-[#F3ECE1] mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2 space-y-4">
            <span className="font-serif text-2xl font-bold tracking-tight text-[#1B1A17]">
              SuperBooks<span className="text-[#9E3E26]">.</span>
            </span>
            <p className="text-sm text-[#5C5850] max-w-md leading-relaxed">
              A sanctuary for deliberate reading. We restore, curate, and present literature from Africa and across the world with tangible typography, acoustic page turns, and per-chapter narration.
            </p>
            <div className="pt-2 text-xs font-mono text-[#8E887E]">
              Typeset in Newsreader & Plus Jakarta Sans • Built with Next.js, Supabase & Cloudflare R2
            </div>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#1B1A17] mb-4">Reading Rooms</h4>
            <ul className="space-y-2 text-sm text-[#5C5850]">
              <li><Link href="/library" className="hover:text-[#9E3E26]">Complete Library</Link></li>
              <li><Link href="/library?genre=African+Folklore+%26+Mythology" className="hover:text-[#9E3E26]">African Folklore</Link></li>
              <li><Link href="/library?genre=Pan-African+%26+Social+Thought" className="hover:text-[#9E3E26]">Pan-African Thought</Link></li>
              <li><Link href="/booktok" className="hover:text-[#9E3E26]">Vertical Video Feed</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest font-bold text-[#1B1A17] mb-4">Platform & Engine</h4>
            <ul className="space-y-2 text-sm text-[#5C5850]">
              <li><Link href="/llms.txt" className="hover:text-[#9E3E26]">AI Index (llms.txt)</Link></li>
              <li><Link href="/robots.txt" className="hover:text-[#9E3E26]">Crawler Rules</Link></li>
              <li><Link href="/sitemap.xml" className="hover:text-[#9E3E26]">XML Sitemap</Link></li>
              <li><Link href="/admin" className="hover:text-[#9E3E26]">Studio Admin Desk</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-[#DFD5C6] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#8E887E] gap-4">
          <p>© 2026 SuperBooks Reading Platform. Public domain works curated with care.</p>
          <p className="font-serif italic text-center sm:text-right">“Between me and the other world there is ever an unasked question.”</p>
        </div>
      </div>
    </footer>
  );
}
