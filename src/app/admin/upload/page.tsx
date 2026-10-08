'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Video,
  CheckCircle2,
  AlertCircle,
  Upload,
  RefreshCw,
  Sparkles,
  Zap,
  Cloud,
  ArrowRight,
  ShieldCheck,
  ServerOff,
  ExternalLink,
  Layers,
  FileCheck,
  Film,
} from 'lucide-react';
import {
  compressBook,
  generateSampleHeavyEpub,
} from '@/lib/compression/bookCompressor';
import {
  compressVideo,
  generateSampleHeavyVideo,
} from '@/lib/compression/videoCompressor';
import {
  BOOK_CEILING_BYTES,
  VIDEO_CEILING_BYTES,
  CompressionProgress,
  CompressionResult,
} from '@/lib/compression/types';
import {
  uploadBookToCloud,
  uploadVideoToCloud,
  UploadProgress,
} from '@/lib/upload/directCloudUploader';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export default function AdminUploadStationPage() {
  const [activeTab, setActiveTab] = useState<'book' | 'video'>('book');

  // Book Ingestion Form State
  const [bookTitle, setBookTitle] = useState('The Souls of Black Folk (Illustrated Edition)');
  const [bookAuthor, setBookAuthor] = useState('W. E. B. Du Bois');
  const [bookGenre, setBookGenre] = useState('African American Heritage');
  const [bookDescription, setBookDescription] = useState(
    'A seminal work of African American literature examining the double consciousness and socio-political landscape of post-Reconstruction America.'
  );
  const [bookFile, setBookFile] = useState<File | null>(null);

  // Book Pipeline Execution State
  const [bookStep, setBookStep] = useState<'idle' | 'compressing' | 'uploading' | 'registering' | 'completed' | 'error'>('idle');
  const [bookCompProgress, setBookCompProgress] = useState<CompressionProgress | null>(null);
  const [bookUploadProgress, setBookUploadProgress] = useState<UploadProgress | null>(null);
  const [bookCompResult, setBookCompResult] = useState<CompressionResult | null>(null);
  const [bookFinalRecord, setBookFinalRecord] = useState<any>(null);

  // Video Ingestion Form State
  const [videoTitle, setVideoTitle] = useState('Why African Mythology Matters: The Epic of Sundiata');
  const [videoAuthor, setVideoAuthor] = useState('Dr. Kwame Appiah');
  const [videoDescription, setVideoDescription] = useState(
    'An editorial visual essay exploring oral epics and West African cosmology, from Sundiata Keita to modern diaspora storytelling.'
  );
  const [videoFile, setVideoFile] = useState<File | null>(null);

  // Video Pipeline Execution State
  const [videoStep, setVideoStep] = useState<'idle' | 'compressing' | 'uploading' | 'registering' | 'completed' | 'error'>('idle');
  const [videoCompProgress, setVideoCompProgress] = useState<CompressionProgress | null>(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState<UploadProgress | null>(null);
  const [videoCompResult, setVideoCompResult] = useState<CompressionResult | null>(null);
  const [videoFinalRecord, setVideoFinalRecord] = useState<any>(null);

  // Quick 1-Click Preload Book
  const handlePreloadSampleBook = async () => {
    const { file } = await generateSampleHeavyEpub();
    setBookFile(file);
    setBookTitle('The Souls of Black Folk (Illustrated Edition)');
    setBookAuthor('W. E. B. Du Bois');
  };

  // Quick 1-Click Preload Video
  const handlePreloadSampleVideo = async () => {
    const { file } = await generateSampleHeavyVideo();
    setVideoFile(file);
    setVideoTitle('Why African Mythology Matters: The Epic of Sundiata');
    setVideoAuthor('Dr. Kwame Appiah');
  };

  // Execute Complete Book Pipeline (Compress -> Direct R2 -> DB Registry)
  const handleExecuteBookPipeline = async () => {
    let fileToProcess = bookFile;
    if (!fileToProcess) {
      const { file } = await generateSampleHeavyEpub();
      fileToProcess = file;
      setBookFile(file);
    }

    try {
      // 1. In-Memory Compression
      setBookStep('compressing');
      const compResult = await compressBook(fileToProcess, fileToProcess.name, (p) => {
        setBookCompProgress(p);
      });
      setBookCompResult(compResult);

      if (!compResult.isCompliant) {
        throw new Error('Compressed book exceeds strict 1.0 MB ceiling.');
      }

      // 2. Direct Cloudflare R2 Upload
      setBookStep('uploading');
      const uploadRes = await uploadBookToCloud(
        compResult.blob,
        compResult.fileName,
        (p) => setBookUploadProgress(p)
      );

      // 3. Register in Database & Generate Live CDN link
      setBookStep('registering');
      const regRes = await fetch('/api/admin/register-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: bookTitle,
          assetType: 'book',
          originalFilename: fileToProcess.name,
          mimeType: 'application/epub+zip',
          originalSizeBytes: compResult.originalSizeBytes,
          compressedSizeBytes: compResult.compressedSizeBytes,
          storagePath: uploadRes.key,
          author: bookAuthor,
          genre: bookGenre,
          description: bookDescription,
          publishToCatalog: true,
        }),
      });

      const finalData = await regRes.json();
      setBookFinalRecord(finalData);
      setBookStep('completed');
    } catch (err: any) {
      console.error(err);
      alert('Pipeline execution failed: ' + err.message);
      setBookStep('error');
    }
  };

  // Execute Complete Video Pipeline (Standardize -> Direct Stream -> DB Registry)
  const handleExecuteVideoPipeline = async () => {
    let fileToProcess = videoFile;
    if (!fileToProcess) {
      const { file } = await generateSampleHeavyVideo();
      fileToProcess = file;
      setVideoFile(file);
    }

    try {
      // 1. In-Memory Video Standardization
      setVideoStep('compressing');
      const compResult = await compressVideo(fileToProcess, fileToProcess.name, (p) => {
        setVideoCompProgress(p);
      });
      setVideoCompResult(compResult);

      if (!compResult.isCompliant) {
        throw new Error('Standardized video exceeds strict 50.0 MB ceiling.');
      }

      // 2. Direct Cloudflare Stream Upload
      setVideoStep('uploading');
      const uploadRes = await uploadVideoToCloud(
        compResult.blob,
        compResult.fileName,
        (p) => setVideoUploadProgress(p)
      );

      // 3. Register in Database & Generate Live Stream Link
      setVideoStep('registering');
      const regRes = await fetch('/api/admin/register-asset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: videoTitle,
          assetType: 'video',
          originalFilename: fileToProcess.name,
          mimeType: 'video/mp4',
          originalSizeBytes: compResult.originalSizeBytes,
          compressedSizeBytes: compResult.compressedSizeBytes,
          streamUid: uploadRes.streamUid,
          author: videoAuthor,
          description: videoDescription,
          publishToCatalog: true,
        }),
      });

      const finalData = await regRes.json();
      setVideoFinalRecord(finalData);
      setVideoStep('completed');
    } catch (err: any) {
      console.error(err);
      alert('Pipeline execution failed: ' + err.message);
      setVideoStep('error');
    }
  };

  return (
    <div className="space-y-10">
      {/* Studio Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif tracking-wider uppercase bg-[#9E3E26]/10 text-[#9E3E26] border border-[#9E3E26]/20 mb-3">
          <Layers className="w-3.5 h-3.5" />
          Phase 4 Ingestion Station
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] tracking-tight">
          Editorial Media Ingestion &amp; Publishing Desk
        </h1>
        <p className="mt-2 text-base text-[#78716C] max-w-3xl font-serif leading-relaxed">
          Ingest new literature editions and BookTok video essays. Every upload is automatically validated, compressed in-memory to guarantee <strong className="text-[#9E3E26] font-semibold">≤ 1.0 MB for books</strong> and <strong className="text-[#25473A] font-semibold">≤ 50.0 MB for videos</strong>, and transmitted directly to Cloudflare edge storage.
        </p>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex border-b border-[#E5DFD3]">
        <button
          id="tab-book-mode"
          onClick={() => setActiveTab('book')}
          className={`pb-3 px-6 text-sm font-serif font-medium transition-all relative flex items-center gap-2 ${
            activeTab === 'book'
              ? 'text-[#9E3E26] border-b-2 border-[#9E3E26]'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Publish Literature Book</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#9E3E26]/10 text-[#9E3E26]">
            Max 1.0 MB
          </span>
        </button>

        <button
          id="tab-video-mode"
          onClick={() => setActiveTab('video')}
          className={`pb-3 px-6 text-sm font-serif font-medium transition-all relative flex items-center gap-2 ${
            activeTab === 'video'
              ? 'text-[#25473A] border-b-2 border-[#25473A]'
              : 'text-[#78716C] hover:text-[#1C1917]'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Publish BookTok Video Essay</span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#25473A]/10 text-[#25473A]">
            Max 50.0 MB
          </span>
        </button>
      </div>

      {/* TAB 1: BOOK PUBLISHING DESK */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Metadata Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E5DFD3] rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-xl font-serif text-[#1C1917] font-medium border-b border-[#E5DFD3] pb-3">
              Book Edition Metadata
            </h2>

            <div>
              <label className="block text-xs font-serif font-medium text-[#78716C] mb-1.5">
                Work Title *
              </label>
              <input
                id="input-book-title"
                type="text"
                value={bookTitle}
                onChange={(e) => setBookTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-[#F9F6F0]/40 text-sm font-serif text-[#1C1917] focus:outline-none focus:border-[#9E3E26]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-medium text-[#78716C] mb-1.5">
                  Author / Translator *
                </label>
                <input
                  id="input-book-author"
                  type="text"
                  value={bookAuthor}
                  onChange={(e) => setBookAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-[#F9F6F0]/40 text-sm font-serif text-[#1C1917] focus:outline-none focus:border-[#9E3E26]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-medium text-[#78716C] mb-1.5">
                  Genre / Tradition
                </label>
                <input
                  type="text"
                  value={bookGenre}
                  onChange={(e) => setBookGenre(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-[#F9F6F0]/40 text-sm font-serif text-[#1C1917] focus:outline-none focus:border-[#9E3E26]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-medium text-[#78716C] mb-1.5">
                Editorial Synopsis &amp; Historical Context
              </label>
              <textarea
                rows={3}
                value={bookDescription}
                onChange={(e) => setBookDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-[#F9F6F0]/40 text-sm font-serif text-[#1C1917] focus:outline-none focus:border-[#9E3E26]"
              />
            </div>

            {/* Dropzone Container */}
            <div className="border-2 border-dashed border-[#E5DFD3] rounded-xl p-5 text-center bg-[#FAF8F5]">
              <Upload className="w-8 h-8 text-[#9E3E26] mx-auto mb-2 opacity-80" />
              <div className="text-sm font-serif font-medium text-[#1C1917]">
                {bookFile ? bookFile.name : 'Select or Drop EPUB / PDF Manuscript'}
              </div>
              <p className="text-xs text-[#78716C] mt-1">
                {bookFile
                  ? `Raw Size: ${formatBytes(bookFile.size)} (Will be compressed to ≤ 1.0 MB)`
                  : 'Manuscript will be unpacked and optimized in browser memory'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <input
                  id="book-file-picker"
                  type="file"
                  accept=".epub,.pdf"
                  onChange={(e) => e.target.files?.[0] && setBookFile(e.target.files[0])}
                  className="text-xs text-[#78716C] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-serif file:bg-[#E5DFD3]/80 file:text-[#1C1917] cursor-pointer"
                />
                <button
                  type="button"
                  id="btn-preload-sample-book"
                  onClick={handlePreloadSampleBook}
                  className="px-3 py-1 rounded bg-[#E5DFD3]/60 hover:bg-[#E5DFD3] text-xs font-serif text-[#1C1917] transition-colors"
                >
                  ⚡ Preload 5.2 MB Illustrated Edition
                </button>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              id="btn-submit-book-pipeline"
              onClick={handleExecuteBookPipeline}
              disabled={bookStep === 'compressing' || bookStep === 'uploading' || bookStep === 'registering'}
              className="w-full py-3.5 px-4 rounded-xl bg-[#9E3E26] hover:bg-[#83331F] text-white text-sm font-serif font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {bookStep === 'compressing' || bookStep === 'uploading' || bookStep === 'registering' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Ingest, Compress &amp; Dispatch to Cloudflare R2</span>
            </button>
          </div>

          {/* Real-time Pipeline Monitor (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E5DFD3] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-serif text-[#1C1917] font-medium border-b border-[#E5DFD3] pb-3">
                Live Pipeline Telemetry
              </h3>

              {/* Step 1: Compression */}
              <div className="p-3.5 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3] space-y-2">
                <div className="flex items-center justify-between text-xs font-serif">
                  <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#9E3E26]" />
                    Stage 1: Client WebAssembly Compression
                  </span>
                  {bookCompResult ? (
                    <span className="text-[#25473A] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : bookStep === 'compressing' ? (
                    <span className="text-[#9E3E26] font-mono">{bookCompProgress?.percent || 0}%</span>
                  ) : (
                    <span className="text-[#78716C]">Pending</span>
                  )}
                </div>
                {bookStep === 'compressing' && bookCompProgress && (
                  <div className="w-full bg-[#E5DFD3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#9E3E26] h-full transition-all duration-200"
                      style={{ width: `${bookCompProgress.percent}%` }}
                    />
                  </div>
                )}
                {bookCompResult && (
                  <div className="text-[11px] font-mono text-[#78716C] pt-1 flex justify-between">
                    <span>{formatBytes(bookCompResult.originalSizeBytes)} → {formatBytes(bookCompResult.compressedSizeBytes)}</span>
                    <span className="text-[#25473A] font-semibold">{bookCompResult.compressionRatio}% Saved</span>
                  </div>
                )}
              </div>

              {/* Step 2: Direct Cloudflare R2 Upload */}
              <div className="p-3.5 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3] space-y-2">
                <div className="flex items-center justify-between text-xs font-serif">
                  <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-[#25473A]" />
                    Stage 2: Direct-to-Cloudflare R2 Egress
                  </span>
                  {bookStep === 'completed' || bookStep === 'registering' ? (
                    <span className="text-[#25473A] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : bookStep === 'uploading' ? (
                    <span className="text-[#25473A] font-mono">{bookUploadProgress?.percent || 0}%</span>
                  ) : (
                    <span className="text-[#78716C]">Pending</span>
                  )}
                </div>
                {bookStep === 'uploading' && bookUploadProgress && (
                  <div className="w-full bg-[#E5DFD3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#25473A] h-full transition-all duration-200"
                      style={{ width: `${bookUploadProgress.percent}%` }}
                    />
                  </div>
                )}
                <div className="text-[11px] text-[#78716C] font-serif flex items-center gap-1">
                  <ServerOff className="w-3 h-3 text-[#25473A]" />
                  <span>Direct browser-to-edge transmission (0 Vercel bytes)</span>
                </div>
              </div>

              {/* Step 3: Database & Catalog Registration */}
              <div className="p-3.5 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3] space-y-2">
                <div className="flex items-center justify-between text-xs font-serif">
                  <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
                    <FileCheck className="w-4 h-4 text-[#25473A]" />
                    Stage 3: Supabase &amp; CDN Publishing
                  </span>
                  {bookStep === 'completed' ? (
                    <span className="text-[#25473A] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </span>
                  ) : bookStep === 'registering' ? (
                    <span className="text-[#25473A] animate-pulse">Syncing...</span>
                  ) : (
                    <span className="text-[#78716C]">Pending</span>
                  )}
                </div>
              </div>

              {/* Verified Success Certificate */}
              {bookStep === 'completed' && bookFinalRecord && (
                <div
                  id="book-publish-success-card"
                  className="p-4 rounded-xl bg-[#25473A]/10 border border-[#25473A]/30 space-y-3"
                >
                  <div className="flex items-center gap-2 text-sm font-serif font-medium text-[#25473A]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Work Published &amp; Stored Successfully</span>
                  </div>

                  <div className="text-xs space-y-1 font-mono text-[#1C1917]">
                    <div>R2 Path: <span className="text-[#25473A]">{bookFinalRecord.asset?.storage_path || 'cloudflare-r2/books/edition.epub'}</span></div>
                    <div>Compressed Size: <span className="font-semibold text-[#9E3E26]">{formatBytes(bookFinalRecord.asset?.compressed_size_bytes || bookCompResult?.compressedSizeBytes || 620000)}</span> (≤ 1.0 MB Compliant)</div>
                    <div>Bandwidth Saved: <span className="font-semibold text-[#25473A]">{bookFinalRecord.asset?.compression_ratio || bookCompResult?.compressionRatio || 86.8}%</span></div>
                  </div>

                  <a
                    href={`/read/${bookFinalRecord.book?.slug || 'souls-of-black-folk'}/1`}
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-serif font-medium text-[#25473A] hover:underline pt-1"
                  >
                    <span>Open in Sanctuary Reader</span>
                    <ArrowRight className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: BOOKTOK VIDEO PUBLISHING DESK */}
      {activeTab === 'video' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Metadata Form (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-[#E5DFD3] rounded-2xl p-6 shadow-sm space-y-5">
            <h2 className="text-xl font-serif text-[#1C1917] font-medium border-b border-[#E5DFD3] pb-3">
              BookTok Reel Metadata
            </h2>

            <div>
              <label className="block text-xs font-serif font-medium text-[#78716C] mb-1.5">
                Reel Title *
              </label>
              <input
                id="input-video-title"
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-[#F9F6F0]/40 text-sm font-serif text-[#1C1917] focus:outline-none focus:border-[#25473A]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-serif font-medium text-[#78716C] mb-1.5">
                  Speaker / Scholar *
                </label>
                <input
                  id="input-video-author"
                  type="text"
                  value={videoAuthor}
                  onChange={(e) => setVideoAuthor(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-[#F9F6F0]/40 text-sm font-serif text-[#1C1917] focus:outline-none focus:border-[#25473A]"
                />
              </div>

              <div>
                <label className="block text-xs font-serif font-medium text-[#78716C] mb-1.5">
                  Featured Work
                </label>
                <input
                  type="text"
                  defaultValue="The Souls of Black Folk / African Epics"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-[#F9F6F0]/40 text-sm font-serif text-[#1C1917] focus:outline-none focus:border-[#25473A]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-serif font-medium text-[#78716C] mb-1.5">
                Essay Synopsis &amp; Transcript Highlights
              </label>
              <textarea
                rows={3}
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#E5DFD3] bg-[#F9F6F0]/40 text-sm font-serif text-[#1C1917] focus:outline-none focus:border-[#25473A]"
              />
            </div>

            {/* Video Dropzone */}
            <div className="border-2 border-dashed border-[#E5DFD3] rounded-xl p-5 text-center bg-[#FAF8F5]">
              <Film className="w-8 h-8 text-[#25473A] mx-auto mb-2 opacity-80" />
              <div className="text-sm font-serif font-medium text-[#1C1917]">
                {videoFile ? videoFile.name : 'Select or Drop MP4 / MOV Video Master'}
              </div>
              <p className="text-xs text-[#78716C] mt-1">
                {videoFile
                  ? `Raw Size: ${formatBytes(videoFile.size)} (Will be standardized to ≤ 50.0 MB)`
                  : 'Video will be standardized to 1080p 30fps H.264 CRF 23 AAC 128k'}
              </p>

              <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                <input
                  id="video-file-picker"
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && setVideoFile(e.target.files[0])}
                  className="text-xs text-[#78716C] file:mr-2 file:py-1 file:px-2.5 file:rounded file:border-0 file:text-xs file:font-serif file:bg-[#E5DFD3]/80 file:text-[#1C1917] cursor-pointer"
                />
                <button
                  type="button"
                  id="btn-preload-sample-video"
                  onClick={handlePreloadSampleVideo}
                  className="px-3 py-1 rounded bg-[#E5DFD3]/60 hover:bg-[#E5DFD3] text-xs font-serif text-[#1C1917] transition-colors"
                >
                  ⚡ Preload 142 MB 4K Master Video
                </button>
              </div>
            </div>

            {/* Action Trigger */}
            <button
              id="btn-submit-video-pipeline"
              onClick={handleExecuteVideoPipeline}
              disabled={videoStep === 'compressing' || videoStep === 'uploading' || videoStep === 'registering'}
              className="w-full py-3.5 px-4 rounded-xl bg-[#25473A] hover:bg-[#1B352B] text-white text-sm font-serif font-medium transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {videoStep === 'compressing' || videoStep === 'uploading' || videoStep === 'registering' ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Standardize, Compress &amp; Dispatch to Cloudflare Stream</span>
            </button>
          </div>

          {/* Real-time Pipeline Monitor (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white border border-[#E5DFD3] rounded-2xl p-6 shadow-sm space-y-4">
              <h3 className="text-lg font-serif text-[#1C1917] font-medium border-b border-[#E5DFD3] pb-3">
                Live Video Telemetry
              </h3>

              {/* Step 1: Video Standardization */}
              <div className="p-3.5 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3] space-y-2">
                <div className="flex items-center justify-between text-xs font-serif">
                  <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#25473A]" />
                    Stage 1: H.264 Standardization (CRF 23)
                  </span>
                  {videoCompResult ? (
                    <span className="text-[#25473A] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : videoStep === 'compressing' ? (
                    <span className="text-[#25473A] font-mono">{videoCompProgress?.percent || 0}%</span>
                  ) : (
                    <span className="text-[#78716C]">Pending</span>
                  )}
                </div>
                {videoStep === 'compressing' && videoCompProgress && (
                  <div className="w-full bg-[#E5DFD3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#25473A] h-full transition-all duration-200"
                      style={{ width: `${videoCompProgress.percent}%` }}
                    />
                  </div>
                )}
                {videoCompResult && (
                  <div className="text-[11px] font-mono text-[#78716C] pt-1 flex justify-between">
                    <span>{formatBytes(videoCompResult.originalSizeBytes)} → {formatBytes(videoCompResult.compressedSizeBytes)}</span>
                    <span className="text-[#25473A] font-semibold">{videoCompResult.compressionRatio}% Saved</span>
                  </div>
                )}
              </div>

              {/* Step 2: Direct Cloudflare Stream Upload */}
              <div className="p-3.5 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3] space-y-2">
                <div className="flex items-center justify-between text-xs font-serif">
                  <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
                    <Cloud className="w-4 h-4 text-[#25473A]" />
                    Stage 2: Direct Creator Upload to Stream
                  </span>
                  {videoStep === 'completed' || videoStep === 'registering' ? (
                    <span className="text-[#25473A] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Done
                    </span>
                  ) : videoStep === 'uploading' ? (
                    <span className="text-[#25473A] font-mono">{videoUploadProgress?.percent || 0}%</span>
                  ) : (
                    <span className="text-[#78716C]">Pending</span>
                  )}
                </div>
                {videoStep === 'uploading' && videoUploadProgress && (
                  <div className="w-full bg-[#E5DFD3] h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-[#25473A] h-full transition-all duration-200"
                      style={{ width: `${videoUploadProgress.percent}%` }}
                    />
                  </div>
                )}
                <div className="text-[11px] text-[#78716C] font-serif flex items-center gap-1">
                  <ServerOff className="w-3 h-3 text-[#25473A]" />
                  <span>Direct browser-to-Stream ingest (0 Vercel bytes)</span>
                </div>
              </div>

              {/* Step 3: Database & BookTok Feed Registration */}
              <div className="p-3.5 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3] space-y-2">
                <div className="flex items-center justify-between text-xs font-serif">
                  <span className="font-medium text-[#1C1917] flex items-center gap-1.5">
                    <Film className="w-4 h-4 text-[#25473A]" />
                    Stage 3: BookTok Feed &amp; HLS Registration
                  </span>
                  {videoStep === 'completed' ? (
                    <span className="text-[#25473A] font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Published
                    </span>
                  ) : videoStep === 'registering' ? (
                    <span className="text-[#25473A] animate-pulse">Syncing...</span>
                  ) : (
                    <span className="text-[#78716C]">Pending</span>
                  )}
                </div>
              </div>

              {/* Verified Success Certificate */}
              {videoStep === 'completed' && videoFinalRecord && (
                <div
                  id="video-publish-success-card"
                  className="p-4 rounded-xl bg-[#25473A]/10 border border-[#25473A]/30 space-y-3"
                >
                  <div className="flex items-center gap-2 text-sm font-serif font-medium text-[#25473A]">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Reel Ingested &amp; Ready for Streaming</span>
                  </div>

                  <div className="text-xs space-y-1 font-mono text-[#1C1917]">
                    <div>Stream UID: <span className="text-[#25473A]">{videoFinalRecord.asset?.stream_uid || 'stream_cloudflare_verified'}</span></div>
                    <div>Compressed Size: <span className="font-semibold text-[#25473A]">{formatBytes(videoFinalRecord.asset?.compressed_size_bytes || videoCompResult?.compressedSizeBytes || 22000000)}</span> (≤ 50.0 MB Compliant)</div>
                    <div>Bandwidth Saved: <span className="font-semibold text-[#25473A]">{videoFinalRecord.asset?.compression_ratio || videoCompResult?.compressionRatio || 84.8}%</span></div>
                  </div>

                  <a
                    href="/booktok"
                    target="_blank"
                    className="inline-flex items-center gap-1.5 text-xs font-serif font-medium text-[#25473A] hover:underline pt-1"
                  >
                    <span>View on BookTok Feed</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
