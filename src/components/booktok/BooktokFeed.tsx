'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Volume2,
  VolumeX,
  Heart,
  BookOpen,
  Share2,
  Play,
  Pause,
  ChevronUp,
  ChevronDown,
  Globe,
  Copy,
  Check,
  X,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { VideoEpisode } from '@/types/database';
import { getStreamPlaybackUrl } from '@/lib/cloudflare/stream';

interface BooktokFeedProps {
  videos: VideoEpisode[];
}

export function BooktokFeed({ videos }: BooktokFeedProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showCdnInspector, setShowCdnInspector] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentVideo = videos[currentIndex] || videos[0];

  const handleNext = () => {
    if (currentIndex < videos.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  // Keyboard navigation (ArrowUp = prev, ArrowDown = next)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleNext();
      } else if (e.key === ' ') {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const videoSrc = getStreamPlaybackUrl(currentVideo.stream_uid);
  const canonicalLink = `/api/stream/${currentVideo.stream_uid}`;

  const handleCopyLink = () => {
    const fullUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}${canonicalLink}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(fullUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto h-[84vh] max-h-[840px] bg-[#1B1A17] border border-[#DFD5C6] shadow-2xl rounded-2xl overflow-hidden select-none flex flex-col justify-between">
      {/* Video Media Area */}
      <div className="absolute inset-0 z-0 bg-[#1B1A17] cursor-pointer" onClick={togglePlay}>
        <video
          ref={videoRef}
          key={currentVideo.id}
          src={videoSrc}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Play/Pause Center Indicator */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-[#1B1A17]/40 pointer-events-none">
            <div className="w-16 h-16 rounded-full bg-[#1B1A17]/80 text-[#FFFDF9] flex items-center justify-center shadow-lg border border-[#DFD5C6]/20">
              <Play size={28} className="ml-1" />
            </div>
          </div>
        )}

        {/* Gradient Overlay for Top & Bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B1A17]/80 via-transparent to-[#1B1A17]/95 pointer-events-none" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 p-4 flex items-center justify-between text-[#FFFDF9]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#9E3E26] animate-ping" />
          <span className="font-serif font-bold text-sm tracking-wider">SuperBooks Booktok</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Cloudflare Stream CDN Badge */}
          <button
            id="btn-booktok-cdn-pill"
            onClick={() => setShowCdnInspector(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#25473A]/80 hover:bg-[#25473A] text-white text-[10px] font-mono tracking-wider border border-[#25473A] transition-all cursor-pointer shadow-xs"
            title="Inspect Cloudflare Stream CDN Delivery"
          >
            <Globe className="w-3 h-3 text-[#A8D5BA]" />
            <span className="hidden xs:inline">Cloudflare Stream</span>
            <span className="text-[#A8D5BA]">330+ Cities</span>
          </button>

          <button
            id="btn-booktok-mute-toggle"
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-[#1B1A17]/70 hover:bg-[#1B1A17] text-[#FFFDF9] transition-colors border border-white/10"
            title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </div>
      </div>

      {/* Right Side Interaction Column */}
      <div className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-4 text-[#FFFDF9]">
        {/* Like Button */}
        <button
          id="btn-booktok-like"
          onClick={() => toggleLike(currentVideo.id)}
          className="flex flex-col items-center gap-1 group cursor-pointer"
        >
          <div
            className={`p-3 rounded-full bg-[#1B1A17]/70 border border-white/10 group-hover:bg-[#9E3E26] transition-colors ${
              likedMap[currentVideo.id] ? 'bg-[#9E3E26] text-[#FFFDF9]' : ''
            }`}
          >
            <Heart size={18} className={likedMap[currentVideo.id] ? 'fill-current' : ''} />
          </div>
          <span className="text-[10px] font-mono font-bold">
            {(currentVideo.view_count + (likedMap[currentVideo.id] ? 1 : 0)).toLocaleString()}
          </span>
        </button>

        {/* Featured Book Link (if attached) */}
        {currentVideo.book && (
          <Link
            id="link-featured-book"
            href={`/books/${currentVideo.book.slug}`}
            className="flex flex-col items-center gap-1 group"
            title="Read Featured Volume in Reader"
          >
            <div className="p-3 rounded-full bg-[#25473A] text-[#FFFDF9] border border-white/10 group-hover:scale-110 transition-transform shadow-md">
              <BookOpen size={18} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider">Read</span>
          </Link>
        )}

        {/* Unique CDN Link Inspector Button */}
        <button
          id="btn-booktok-inspect-cdn"
          onClick={() => setShowCdnInspector(true)}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          title="Inspect Unique Cloudflare Stream CDN Link"
        >
          <div className="p-3 rounded-full bg-[#1B1A17]/70 border border-white/10 group-hover:bg-[#25473A] transition-colors">
            <Globe size={18} className="text-[#A8D5BA]" />
          </div>
          <span className="text-[10px] font-mono uppercase text-[#DFD5C6]">CDN</span>
        </button>

        {/* Share Button */}
        <button
          id="btn-booktok-share"
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          className="flex flex-col items-center gap-1 group cursor-pointer"
          title="Share Dispatch"
        >
          <div className="p-3 rounded-full bg-[#1B1A17]/70 border border-white/10 group-hover:bg-[#1B1A17] transition-colors">
            <Share2 size={18} />
          </div>
          <span className="text-[10px] font-mono">Share</span>
        </button>
      </div>

      {/* Bottom Metadata & Navigation */}
      <div className="relative z-10 p-5 space-y-3 text-[#FFFDF9]">
        <div className="space-y-1.5 pr-14">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#9E3E26] text-[#FFFDF9] text-[10px] font-mono uppercase px-2 py-0.5 font-bold rounded-xs">
              Episode {currentVideo.episode_number} of {videos.length}
            </span>
            <span className="bg-white/15 text-[#DFD5C6] text-[10px] font-mono px-2 py-0.5 rounded-xs">
              &le;50 MB Lossless
            </span>
          </div>
          <h2 className="font-serif text-lg font-bold leading-tight">
            {currentVideo.title}
          </h2>
          <p className="text-xs text-[#DFD5C6] line-clamp-2 leading-relaxed">
            {currentVideo.description}
          </p>
          <div className="text-xs font-mono text-[#8E887E]">
            Curated by {currentVideo.author_name}
          </div>
        </div>

        {/* Swipe / Switch Controls */}
        <div className="pt-2 border-t border-[#DFD5C6]/20 flex items-center justify-between text-xs font-mono">
          <button
            id="btn-booktok-prev"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 px-3 py-1.5 bg-[#1B1A17]/80 rounded-md border border-white/10 uppercase tracking-wider transition-colors ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#9E3E26] cursor-pointer'
            }`}
          >
            <ChevronUp size={14} />
            <span>Prev</span>
          </button>

          <span className="text-[#DFD5C6] text-xs">
            {currentIndex + 1} / {videos.length}
          </span>

          <button
            id="btn-booktok-next"
            onClick={handleNext}
            disabled={currentIndex >= videos.length - 1}
            className={`flex items-center gap-1 px-3 py-1.5 bg-[#1B1A17]/80 rounded-md border border-white/10 uppercase tracking-wider transition-colors ${
              currentIndex >= videos.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#9E3E26] cursor-pointer'
            }`}
          >
            <span>Next</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>

      {/* Cloudflare Stream CDN Inspector Bottom Sheet */}
      {showCdnInspector && (
        <div className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xs flex flex-col justify-end p-4 animate-in fade-in duration-200">
          <div
            id="booktok-cdn-modal"
            className="bg-[#F9F6F0] text-[#1B1A17] rounded-2xl p-5 border border-[#DFD5C6] shadow-2xl space-y-4"
          >
            <div className="flex items-start justify-between pb-2 border-b border-[#DFD5C6]">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 rounded bg-[#25473A]/10 text-[#25473A] border border-[#25473A]/20">
                  Cloudflare Stream CDN
                </span>
                <h3 className="text-base font-serif font-bold text-[#1B1A17] mt-1 line-clamp-1">
                  {currentVideo.title}
                </h3>
              </div>
              <button
                id="btn-close-cdn-inspector"
                onClick={() => setShowCdnInspector(false)}
                className="p-1 rounded-lg text-[#5C5850] hover:text-[#1B1A17] hover:bg-[#EBE3D5] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs font-serif">
              {/* Canonical Link */}
              <div className="p-3 rounded-xl bg-white border border-[#DFD5C6] space-y-1">
                <div className="text-[11px] font-medium text-[#5C5850] flex items-center justify-between">
                  <span>Unique Stream Link (Canonical)</span>
                  <span className="text-[10px] font-mono text-[#25473A]">Active CDN Node</span>
                </div>
                <div className="flex items-center justify-between gap-2 p-2 rounded bg-[#F9F6F0] border border-[#E5DFD3] font-mono text-[11px]">
                  <span className="truncate">{canonicalLink}</span>
                  <button
                    id="btn-copy-stream-link"
                    onClick={handleCopyLink}
                    className="p-1 rounded hover:bg-[#DFD5C6] text-[#5C5850] cursor-pointer shrink-0"
                    title="Copy Canonical Link"
                  >
                    {copiedLink ? <Check className="w-3.5 h-3.5 text-[#25473A]" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* Streaming Delivery Specifications */}
              <div className="grid grid-cols-3 gap-2 text-center font-mono">
                <div className="p-2 rounded-lg bg-white border border-[#DFD5C6]">
                  <div className="text-[10px] text-[#5C5850]">Edge Network</div>
                  <div className="text-xs font-bold text-[#1B1A17] mt-0.5">330+ Cities</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#DFD5C6]">
                  <div className="text-[10px] text-[#5C5850]">Compression</div>
                  <div className="text-xs font-bold text-[#25473A] mt-0.5">&le;50 MB</div>
                </div>
                <div className="p-2 rounded-lg bg-white border border-[#DFD5C6]">
                  <div className="text-[10px] text-[#5C5850]">Egress Cost</div>
                  <div className="text-xs font-bold text-[#25473A] mt-0.5">$0.00 Egress</div>
                </div>
              </div>

              {/* Direct Playback URL */}
              <div className="flex items-center justify-between pt-1">
                <a
                  id="link-test-stream-api"
                  href={`${canonicalLink}?redirect=true`}
                  target="_blank"
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-[#9E3E26] hover:bg-[#83331F] text-white text-xs font-serif font-medium transition-colors shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Test Direct Stream Endpoint</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
