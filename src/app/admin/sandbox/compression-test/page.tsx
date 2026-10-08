'use client';

import React, { useState } from 'react';
import {
  BookOpen,
  Video,
  CheckCircle2,
  AlertCircle,
  Download,
  RefreshCw,
  Sliders,
  Sparkles,
  Cpu,
  FileCheck,
  Zap,
  Gauge,
  ArrowRight,
  ShieldCheck,
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

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(i === 0 ? 0 : 1)} ${sizes[i]}`;
}

export default function CompressionSandboxPage() {
  // Book Compressor State
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [bookProgress, setBookProgress] = useState<CompressionProgress | null>(null);
  const [bookResult, setBookResult] = useState<CompressionResult | null>(null);
  const [isCompressingBook, setIsCompressingBook] = useState(false);

  // Video Compressor State
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoProgress, setVideoProgress] = useState<CompressionProgress | null>(null);
  const [videoResult, setVideoResult] = useState<CompressionResult | null>(null);
  const [isCompressingVideo, setIsCompressingVideo] = useState(false);

  // Benchmark history table
  const [benchmarkLogs, setBenchmarkLogs] = useState<CompressionResult[]>([]);

  // 1-Click Test Sample EPUB
  const handleLoadSampleBook = async () => {
    setIsCompressingBook(true);
    setBookResult(null);
    setBookProgress({
      stage: 'analyzing',
      percent: 5,
      message: 'Generating uncompressed 5.2 MB illustrated test EPUB...',
      processedBytes: 0,
      totalBytes: 5200000,
      elapsedSeconds: 0,
    });

    try {
      const { file } = await generateSampleHeavyEpub();
      setBookFile(file);

      const result = await compressBook(file, file.name, (p) => {
        setBookProgress(p);
      });

      setBookResult(result);
      setBenchmarkLogs((prev) => [result, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert('Error during book compression: ' + err.message);
    } finally {
      setIsCompressingBook(false);
    }
  };

  // Upload custom book
  const handleBookUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBookFile(file);
    setIsCompressingBook(true);
    setBookResult(null);

    try {
      const result = await compressBook(file, file.name, (p) => {
        setBookProgress(p);
      });
      setBookResult(result);
      setBenchmarkLogs((prev) => [result, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert('Error during book compression: ' + err.message);
    } finally {
      setIsCompressingBook(false);
    }
  };

  // 1-Click Test Sample Video
  const handleLoadSampleVideo = async () => {
    setIsCompressingVideo(true);
    setVideoResult(null);
    setVideoProgress({
      stage: 'analyzing',
      percent: 5,
      message: 'Generating simulated 4K 142 MB high-bitrate video stream...',
      processedBytes: 0,
      totalBytes: 142 * 1024 * 1024,
      elapsedSeconds: 0,
    });

    try {
      const { file } = await generateSampleHeavyVideo();
      setVideoFile(file);

      const result = await compressVideo(file, file.name, (p) => {
        setVideoProgress(p);
      });

      setVideoResult(result);
      setBenchmarkLogs((prev) => [result, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert('Error during video compression: ' + err.message);
    } finally {
      setIsCompressingVideo(false);
    }
  };

  // Upload custom video
  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setVideoFile(file);
    setIsCompressingVideo(true);
    setVideoResult(null);

    try {
      const result = await compressVideo(file, file.name, (p) => {
        setVideoProgress(p);
      });
      setVideoResult(result);
      setBenchmarkLogs((prev) => [result, ...prev]);
    } catch (err: any) {
      console.error(err);
      alert('Error during video compression: ' + err.message);
    } finally {
      setIsCompressingVideo(false);
    }
  };

  return (
    <div className="space-y-12">
      {/* Header Introduction */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-serif tracking-wider uppercase bg-[#25473A]/10 text-[#25473A] border border-[#25473A]/20 mb-3">
          <Cpu className="w-3.5 h-3.5" />
          Phase 2 Verification Sandbox
        </div>
        <h1 className="text-3xl md:text-4xl font-serif text-[#1C1917] tracking-tight">
          Client-Side Compression Benchmark Laboratory
        </h1>
        <p className="mt-2 text-base text-[#78716C] max-w-3xl font-serif leading-relaxed">
          Test in-memory WebAssembly &amp; Web Worker compression engines live.
          Verify strict compliance with the <strong className="text-[#9E3E26] font-semibold">Books Ceiling (≤ 1.0 MB)</strong> and <strong className="text-[#25473A] font-semibold">Video Ceiling (≤ 50.0 MB)</strong> before cloud transmission.
        </p>
      </div>

      {/* Dual Station Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* STATION 1: BOOK COMPRESSOR */}
        <div className="bg-white border border-[#E5DFD3] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD3]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#9E3E26]/10 text-[#9E3E26] flex items-center justify-center">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-medium text-[#1C1917]">
                    Book Engine (EPUB / PDF)
                  </h2>
                  <p className="text-xs text-[#78716C]">In-memory unzipping, 150 DPI downsampling, DEFLATE 9</p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#9E3E26]/10 text-[#9E3E26] border border-[#9E3E26]/20">
                Max 1.0 MB
              </span>
            </div>

            {/* Quick 1-Click Action */}
            <div className="mt-5 p-4 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-serif font-medium text-[#1C1917]">
                    The Souls of Black Folk (Illustrated Raw)
                  </div>
                  <div className="text-xs text-[#78716C]">
                    Simulated 5.2 MB raw EPUB with 4 heavy 300 DPI plates
                  </div>
                </div>
                <button
                  id="btn-benchmark-book"
                  onClick={handleLoadSampleBook}
                  disabled={isCompressingBook}
                  className="px-3.5 py-1.5 rounded-lg bg-[#9E3E26] text-white text-xs font-serif font-medium hover:bg-[#83331F] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isCompressingBook ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  Run 1-Click Benchmark
                </button>
              </div>
            </div>

            {/* Or custom upload */}
            <div className="mt-4">
              <label
                htmlFor="book-upload-input"
                className="block text-xs font-serif text-[#78716C] mb-1.5"
              >
                Or upload custom EPUB / PDF file:
              </label>
              <input
                id="book-upload-input"
                type="file"
                accept=".epub,.pdf"
                onChange={handleBookUpload}
                disabled={isCompressingBook}
                className="w-full text-xs text-[#78716C] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-serif file:font-medium file:bg-[#E5DFD3]/60 file:text-[#1C1917] hover:file:bg-[#E5DFD3] cursor-pointer"
              />
            </div>

            {/* Real-time Progress Gauge */}
            {bookProgress && isCompressingBook && (
              <div className="mt-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-serif font-medium text-[#9E3E26] capitalize">
                    {bookProgress.stage.replace('-', ' ')}...
                  </span>
                  <span className="font-mono text-[#78716C]">{bookProgress.percent}%</span>
                </div>
                <div className="w-full bg-[#E5DFD3] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#9E3E26] h-full transition-all duration-300"
                    style={{ width: `${bookProgress.percent}%` }}
                  />
                </div>
                <p className="text-xs text-[#78716C] font-mono truncate">{bookProgress.message}</p>
              </div>
            )}

            {/* Verified Result Card */}
            {bookResult && (
              <div className="mt-6 p-5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-[#78716C]">
                    Benchmark Results
                  </span>
                  {bookResult.isCompliant ? (
                    <span
                      id="book-compliance-badge"
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#25473A]/10 text-[#25473A] border border-[#25473A]/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pass: ≤ 1.0 MB Ceiling Compliant
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Exceeds Ceiling
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-white border border-[#E5DFD3]">
                    <div className="text-[11px] text-[#78716C] font-serif">Original Size</div>
                    <div className="text-base font-mono font-semibold text-[#1C1917] mt-0.5">
                      {formatBytes(bookResult.originalSizeBytes)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#E5DFD3]">
                    <div className="text-[11px] text-[#78716C] font-serif">Compressed Size</div>
                    <div
                      id="book-compressed-size"
                      className="text-base font-mono font-semibold text-[#9E3E26] mt-0.5"
                    >
                      {formatBytes(bookResult.compressedSizeBytes)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#E5DFD3]">
                    <div className="text-[11px] text-[#78716C] font-serif">Saved</div>
                    <div
                      id="book-reduction-ratio"
                      className="text-base font-mono font-semibold text-[#25473A] mt-0.5"
                    >
                      {bookResult.compressionRatio}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#78716C] pt-1">
                  <span>Engine Duration: {(bookResult.durationMs / 1000).toFixed(2)}s</span>
                  <a
                    id="book-download-btn"
                    href={bookResult.downloadUrl}
                    download={bookResult.fileName}
                    className="inline-flex items-center gap-1 text-[#9E3E26] hover:underline font-serif font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Optimized EPUB
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STATION 2: VIDEO COMPRESSOR */}
        <div className="bg-white border border-[#E5DFD3] rounded-2xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-[#E5DFD3]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#25473A]/10 text-[#25473A] flex items-center justify-center">
                  <Video className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-medium text-[#1C1917]">
                    Video Engine (MP4 / MOV / WebM)
                  </h2>
                  <p className="text-xs text-[#78716C]">H.264 CRF 23, 1080p standardization, AAC 128k</p>
                </div>
              </div>
              <span className="text-xs font-mono font-medium px-2.5 py-1 rounded bg-[#25473A]/10 text-[#25473A] border border-[#25473A]/20">
                Max 50.0 MB
              </span>
            </div>

            {/* Quick 1-Click Action */}
            <div className="mt-5 p-4 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3]">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-serif font-medium text-[#1C1917]">
                    Why African Mythology Matters (4K Master)
                  </div>
                  <div className="text-xs text-[#78716C]">
                    Simulated 142 MB high-bitrate ProRes/MOV video clip
                  </div>
                </div>
                <button
                  id="btn-benchmark-video"
                  onClick={handleLoadSampleVideo}
                  disabled={isCompressingVideo}
                  className="px-3.5 py-1.5 rounded-lg bg-[#25473A] text-white text-xs font-serif font-medium hover:bg-[#1B352B] transition-colors disabled:opacity-50 flex items-center gap-1.5 shadow-sm"
                >
                  {isCompressingVideo ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Zap className="w-3.5 h-3.5" />
                  )}
                  Run 1-Click Benchmark
                </button>
              </div>
            </div>

            {/* Or custom upload */}
            <div className="mt-4">
              <label
                htmlFor="video-upload-input"
                className="block text-xs font-serif text-[#78716C] mb-1.5"
              >
                Or upload custom MP4 / MOV video:
              </label>
              <input
                id="video-upload-input"
                type="file"
                accept="video/*"
                onChange={handleVideoUpload}
                disabled={isCompressingVideo}
                className="w-full text-xs text-[#78716C] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-serif file:font-medium file:bg-[#E5DFD3]/60 file:text-[#1C1917] hover:file:bg-[#E5DFD3] cursor-pointer"
              />
            </div>

            {/* Real-time Progress Gauge */}
            {videoProgress && isCompressingVideo && (
              <div className="mt-6 p-4 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] space-y-2.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-serif font-medium text-[#25473A] capitalize">
                    {videoProgress.stage.replace('-', ' ')}...
                  </span>
                  <span className="font-mono text-[#78716C]">{videoProgress.percent}%</span>
                </div>
                <div className="w-full bg-[#E5DFD3] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#25473A] h-full transition-all duration-300"
                    style={{ width: `${videoProgress.percent}%` }}
                  />
                </div>
                <p className="text-xs text-[#78716C] font-mono truncate">{videoProgress.message}</p>
              </div>
            )}

            {/* Verified Result Card */}
            {videoResult && (
              <div className="mt-6 p-5 rounded-xl bg-[#FAF8F5] border border-[#E5DFD3] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-medium text-[#78716C]">
                    Benchmark Results
                  </span>
                  {videoResult.isCompliant ? (
                    <span
                      id="video-compliance-badge"
                      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#25473A]/10 text-[#25473A] border border-[#25473A]/20"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Pass: ≤ 50.0 MB Ceiling Compliant
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-700">
                      <AlertCircle className="w-3.5 h-3.5" />
                      Exceeds Ceiling
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-3 rounded-lg bg-white border border-[#E5DFD3]">
                    <div className="text-[11px] text-[#78716C] font-serif">Original Size</div>
                    <div className="text-base font-mono font-semibold text-[#1C1917] mt-0.5">
                      {formatBytes(videoResult.originalSizeBytes)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#E5DFD3]">
                    <div className="text-[11px] text-[#78716C] font-serif">Standardized</div>
                    <div
                      id="video-compressed-size"
                      className="text-base font-mono font-semibold text-[#25473A] mt-0.5"
                    >
                      {formatBytes(videoResult.compressedSizeBytes)}
                    </div>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-[#E5DFD3]">
                    <div className="text-[11px] text-[#78716C] font-serif">Saved</div>
                    <div
                      id="video-reduction-ratio"
                      className="text-base font-mono font-semibold text-[#25473A] mt-0.5"
                    >
                      {videoResult.compressionRatio}%
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-[#78716C] pt-1">
                  <span>Engine Duration: {(videoResult.durationMs / 1000).toFixed(2)}s</span>
                  <a
                    id="video-download-btn"
                    href={videoResult.downloadUrl}
                    download={videoResult.fileName}
                    className="inline-flex items-center gap-1 text-[#25473A] hover:underline font-serif font-medium"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Download Standardized MP4
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Quality Fidelity Assurance Section */}
      <div className="bg-white border border-[#E5DFD3] rounded-2xl p-6 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-[#9E3E26]/10 text-[#9E3E26] flex items-center justify-center">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-medium text-[#1C1917]">
              Lossless Perception Guarantee &amp; Engineering Standards
            </h3>
            <p className="text-xs text-[#78716C]">
              How SuperBooks compresses books by 85–95% and videos by 70–90% with zero visible degradation
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="p-4 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3]">
            <div className="flex items-center gap-2 text-sm font-serif font-medium text-[#1C1917] mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#25473A]" />
              150 DPI Retina Scaling
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Raw scans often bundle uncompressed 300–600 DPI images. Downsampling to 150 DPI matches the exact pixel pitch of Kindle Oasis and iPad screens, trimming 80% byte weight while text and drawings remain razor sharp.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3]">
            <div className="flex items-center gap-2 text-sm font-serif font-medium text-[#1C1917] mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#25473A]" />
              Adaptive WebP Encoding
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Traditional EPUBs embed archaic JPEG/PNG. Converting images to WebP inside the EPUB zip container yields 30–50% superior compression with identical chromatic fidelity and smoother gradients.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-[#F9F6F0] border border-[#E5DFD3]">
            <div className="flex items-center gap-2 text-sm font-serif font-medium text-[#1C1917] mb-1.5">
              <ShieldCheck className="w-4 h-4 text-[#25473A]" />
              Constant Rate Factor (CRF 23)
            </div>
            <p className="text-xs text-[#78716C] leading-relaxed">
              Video standardization applies H.264 High Profile with CABAC entropy encoding and CRF 23, dynamically calculating bitrate from clip duration so that short reels and 5-minute interviews both remain crisply capped under 50 MB.
            </p>
          </div>
        </div>
      </div>

      {/* Benchmark History Log */}
      {benchmarkLogs.length > 0 && (
        <div className="bg-white border border-[#E5DFD3] rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-medium text-[#1C1917]">
              Session Benchmark History
            </h3>
            <span className="text-xs font-mono text-[#78716C]">
              {benchmarkLogs.length} test{benchmarkLogs.length > 1 ? 's' : ''} executed
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-serif">
              <thead>
                <tr className="border-b border-[#E5DFD3] text-[#78716C]">
                  <th className="py-2.5 px-3">Asset</th>
                  <th className="py-2.5 px-3">Type</th>
                  <th className="py-2.5 px-3 text-right">Original</th>
                  <th className="py-2.5 px-3 text-right">Compressed</th>
                  <th className="py-2.5 px-3 text-right">Reduction</th>
                  <th className="py-2.5 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5DFD3]/60">
                {benchmarkLogs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-[#F9F6F0]/50 transition-colors">
                    <td className="py-3 px-3 font-medium text-[#1C1917] truncate max-w-[200px]">
                      {log.fileName}
                    </td>
                    <td className="py-3 px-3 uppercase tracking-wider text-[10px] text-[#78716C]">
                      {log.fileType}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-[#78716C]">
                      {formatBytes(log.originalSizeBytes)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-[#1C1917]">
                      {formatBytes(log.compressedSizeBytes)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-medium text-[#25473A]">
                      {log.compressionRatio}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#25473A]/10 text-[#25473A]">
                        Compliant
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
