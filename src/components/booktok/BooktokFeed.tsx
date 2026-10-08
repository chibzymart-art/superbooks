'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import { Volume2, VolumeX, Heart, BookOpen, Share2, Play, Pause, ChevronUp, ChevronDown } from 'lucide-react';
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
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const currentVideo = videos[currentIndex];

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

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleLike = (id: string) => {
    setLikedMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const videoSrc = getStreamPlaybackUrl(currentVideo.stream_uid);

  return (
    <div className="relative w-full max-w-sm sm:max-w-md mx-auto h-[82vh] max-h-[820px] bg-[#1B1A17] border border-[#DFD5C6] shadow-2xl rounded-sm overflow-hidden select-none flex flex-col justify-between">
      {/* Video Media Area */}
      <div className="absolute inset-0 z-0 bg-[#1B1A17]" onClick={togglePlay}>
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
            <div className="w-16 h-16 rounded-full bg-[#1B1A17]/80 text-[#FFFDF9] flex items-center justify-center">
              <Play size={28} className="ml-1" />
            </div>
          </div>
        )}

        {/* Gradient Overlay for Top & Bottom readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1B1A17]/70 via-transparent to-[#1B1A17]/90 pointer-events-none" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-10 p-4 flex items-center justify-between text-[#FFFDF9]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#9E3E26] animate-ping" />
          <span className="font-serif font-bold text-sm tracking-wider">SuperBooks Booktok</span>
        </div>

        <button
          onClick={() => setIsMuted(!isMuted)}
          className="p-2 rounded-full bg-[#1B1A17]/60 hover:bg-[#1B1A17] text-[#FFFDF9] transition-colors"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
      </div>

      {/* Right Side Interaction Column */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-5 text-[#FFFDF9]">
        {/* Like Button */}
        <button
          onClick={() => toggleLike(currentVideo.id)}
          className="flex flex-col items-center gap-1 group"
        >
          <div className={`p-3 rounded-full bg-[#1B1A17]/60 group-hover:bg-[#9E3E26] transition-colors ${likedMap[currentVideo.id] ? 'bg-[#9E3E26] text-[#FFFDF9]' : ''}`}>
            <Heart size={20} className={likedMap[currentVideo.id] ? 'fill-current' : ''} />
          </div>
          <span className="text-[11px] font-mono font-bold">
            {(currentVideo.view_count + (likedMap[currentVideo.id] ? 1 : 0)).toLocaleString()}
          </span>
        </button>

        {/* Featured Book Link (if attached) */}
        {currentVideo.book && (
          <Link
            href={`/books/${currentVideo.book.slug}`}
            className="flex flex-col items-center gap-1 group"
            title="Read Featured Book"
          >
            <div className="p-3 rounded-full bg-[#25473A] text-[#FFFDF9] group-hover:scale-110 transition-transform">
              <BookOpen size={20} />
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider">Read</span>
          </Link>
        )}

        {/* Share Button */}
        <button
          onClick={() => {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              alert('Link copied to clipboard!');
            }
          }}
          className="flex flex-col items-center gap-1 group"
          title="Share Episode"
        >
          <div className="p-3 rounded-full bg-[#1B1A17]/60 group-hover:bg-[#1B1A17] transition-colors">
            <Share2 size={20} />
          </div>
          <span className="text-[10px] font-mono">Share</span>
        </button>
      </div>

      {/* Bottom Metadata & Navigation */}
      <div className="relative z-10 p-5 space-y-3 text-[#FFFDF9]">
        <div className="space-y-1 pr-14">
          <div className="inline-flex items-center gap-2 bg-[#9E3E26] text-[#FFFDF9] text-[10px] font-mono uppercase px-2 py-0.5 font-bold">
            <span>Episode {currentVideo.episode_number} of {videos.length}</span>
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
        <div className="pt-2 border-t border-[#DFD5C6]/30 flex items-center justify-between text-xs font-mono">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className={`flex items-center gap-1 px-3 py-1 bg-[#1B1A17]/60 rounded-xs uppercase tracking-wider transition-colors ${
              currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#9E3E26]'
            }`}
          >
            <ChevronUp size={14} />
            <span>Prev</span>
          </button>

          <span className="text-[#8E887E]">
            {currentIndex + 1} / {videos.length}
          </span>

          <button
            onClick={handleNext}
            disabled={currentIndex >= videos.length - 1}
            className={`flex items-center gap-1 px-3 py-1 bg-[#1B1A17]/60 rounded-xs uppercase tracking-wider transition-colors ${
              currentIndex >= videos.length - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#9E3E26]'
            }`}
          >
            <span>Next</span>
            <ChevronDown size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
