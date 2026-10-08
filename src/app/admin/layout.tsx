import React from 'react';
import Link from 'next/link';
import { Shield, Sparkles, HardDrive, UploadCloud, Cpu, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'SuperBooks Studio Desk — Media Compression & Admin Portal',
  description: 'Editorial administration desk for direct-to-cloud media compression, Cloudflare R2 manuscript storage, and Cloudflare Stream video dispatches.',
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#F9F6F0] text-[#1B1A17] flex flex-col">
      {/* Studio Header Bar */}
      <header className="border-b border-[#DFD5C6] bg-[#F3ECE1]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-widest text-[#5C5850] hover:text-[#9E3E26] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Sanctuary</span>
            </Link>
            <span className="text-[#DFD5C6]">|</span>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#25473A] animate-pulse" />
              <Link href="/admin" className="font-serif text-lg font-bold tracking-tight text-[#1B1A17] hover:text-[#9E3E26] transition-colors">
                SuperBooks <span className="font-sans text-xs tracking-widest uppercase font-semibold text-[#9E3E26] bg-[#9E3E26]/10 px-2 py-0.5 rounded">Studio Desk</span>
              </Link>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="hidden md:flex items-center gap-2 text-xs font-mono text-[#5C5850] border border-[#DFD5C6] bg-[#EBE3D5] px-2.5 py-1 rounded">
              <HardDrive className="w-3.5 h-3.5 text-[#25473A]" />
              <span>R2 + Stream: Active</span>
            </div>
            
            <div className="flex items-center gap-1.5 text-xs font-mono bg-[#25473A] text-[#F9F6F0] px-3 py-1.5 rounded-md font-semibold tracking-wider uppercase">
              <Shield className="w-3.5 h-3.5 text-[#C68936]" />
              <span>Admin Role</span>
            </div>
          </div>
        </div>

        {/* Secondary Subnav */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#DFD5C6]/60 flex items-center gap-6 text-xs font-mono uppercase tracking-wider overflow-x-auto py-2">
          <Link 
            href="/admin" 
            className="text-[#1B1A17] font-semibold hover:text-[#9E3E26] transition-colors whitespace-nowrap"
          >
            Telemetry & Assets
          </Link>
          <Link 
            href="/admin/upload" 
            className="text-[#5C5850] hover:text-[#9E3E26] transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            Upload Station
          </Link>
          <Link 
            href="/admin/sandbox/compression-test" 
            className="text-[#5C5850] hover:text-[#9E3E26] transition-colors whitespace-nowrap flex items-center gap-1"
          >
            <Cpu className="w-3.5 h-3.5" />
            Compression Sandbox
          </Link>
          <span className="text-[#DFD5C6] ml-auto hidden sm:inline">•</span>
          <span className="text-[#5C5850] text-[11px] lowercase hidden sm:inline">
            books: &le;1mb &bull; videos: &le;50mb &bull; r2 egress: $0
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Studio Footer */}
      <footer className="border-t border-[#DFD5C6] bg-[#F3ECE1] py-6 text-center text-xs font-mono text-[#5C5850]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>SuperBooks Studio Desk &bull; Digital Preservation Architecture</div>
          <div>Direct-to-Cloud Uploads &bull; Perceptually Lossless WASM Pipeline</div>
        </div>
      </footer>
    </div>
  );
}
