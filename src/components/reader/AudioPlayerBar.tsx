'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, Moon, Clock } from 'lucide-react';

interface AudioPlayerBarProps {
  audioKey?: string | null;
  textToSpeak?: string | null;
  title: string;
  chapterNumber: number;
}

export function AudioPlayerBar({ audioKey, textToSpeak, title, chapterNumber }: AudioPlayerBarProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [sleepTimerMinutes, setSleepTimerMinutes] = useState<number | null>(null);
  const [sleepTimerRemaining, setSleepTimerRemaining] = useState<number | null>(null);
  const [isUsingTTS, setIsUsingTTS] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
  const sleepTimerOptions = [5, 15, 30, 60];

  // Initialize playback method
  useEffect(() => {
    if (!audioKey && textToSpeak && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setIsUsingTTS(true);
      // Clean HTML tags from text
      const cleanText = textToSpeak.replace(/<[^>]*>?/gm, ' ');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = speed;
      utterance.onend = () => setIsPlaying(false);
      speechUtteranceRef.current = utterance;
    }
  }, [audioKey, textToSpeak]);

  // Handle SpeechSynthesis rate change
  useEffect(() => {
    if (speechUtteranceRef.current) {
      speechUtteranceRef.current.rate = speed;
    }
    if (audioRef.current) {
      audioRef.current.playbackRate = speed;
    }
  }, [speed]);

  // Sleep Timer countdown
  useEffect(() => {
    if (sleepTimerRemaining === null || sleepTimerRemaining <= 0) return;

    const timer = setInterval(() => {
      setSleepTimerRemaining((prev) => {
        if (prev !== null && prev <= 1) {
          // Pause playback when timer hits 0
          handlePause();
          clearInterval(timer);
          return null;
        }
        return prev !== null ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sleepTimerRemaining]);

  const handlePlay = () => {
    if (isUsingTTS && speechUtteranceRef.current) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(speechUtteranceRef.current);
      setIsPlaying(true);
    } else if (audioRef.current) {
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const handlePause = () => {
    if (isUsingTTS) {
      window.speechSynthesis.pause();
    } else if (audioRef.current) {
      audioRef.current.pause();
    }
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      handlePause();
    } else {
      handlePlay();
    }
  };

  const seekRelative = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.duration || 0, audioRef.current.currentTime + seconds));
    }
  };

  const setSleepTimer = (minutes: number | null) => {
    setSleepTimerMinutes(minutes);
    setSleepTimerRemaining(minutes ? minutes * 60 : null);
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = Math.floor(secs % 60);
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  return (
    <div className="bg-[#FFFDF9] border border-[#DFD5C6] shadow-md p-4 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4">
      {/* Audio element for uploaded key */}
      {audioKey && (
        <audio
          ref={audioRef}
          src={audioKey}
          onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
          onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
          onEnded={() => setIsPlaying(false)}
        />
      )}

      {/* Track Details */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <button
          onClick={togglePlay}
          className="w-10 h-10 rounded-full bg-[#9E3E26] hover:bg-[#822F1B] text-[#FFFDF9] flex items-center justify-center shrink-0 transition-colors shadow-xs"
          title={isPlaying ? 'Pause Narration' : 'Play Narration'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
        </button>

        <div className="truncate">
          <div className="text-xs font-mono uppercase tracking-widest text-[#9E3E26] font-bold">
            {isUsingTTS ? 'SpeechSynthesis Narration' : 'Studio Master Audio'}
          </div>
          <div className="text-sm font-serif font-bold text-[#1B1A17] truncate">
            Chapter {chapterNumber}: {title}
          </div>
        </div>
      </div>

      {/* Progress & Time */}
      {!isUsingTTS && duration > 0 && (
        <div className="w-full sm:w-64 flex items-center gap-2 text-xs font-mono text-[#5C5850]">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => {
              if (audioRef.current) {
                audioRef.current.currentTime = Number(e.target.value);
              }
            }}
            className="w-full h-1 bg-[#DFD5C6] rounded-lg appearance-none cursor-pointer accent-[#9E3E26]"
          />
          <span>{formatTime(duration)}</span>
        </div>
      )}

      {/* Controls: Speed & Sleep Timer */}
      <div className="flex items-center gap-4 text-xs font-mono text-[#5C5850] self-end sm:self-auto">
        {/* Speed Selector */}
        <div className="flex items-center gap-1 border border-[#DFD5C6] px-2 py-1 bg-[#F9F6F0] rounded-xs">
          <span className="text-[10px] text-[#8E887E]">SPEED:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="bg-transparent font-bold text-[#1B1A17] cursor-pointer outline-hidden"
          >
            {speeds.map((s) => (
              <option key={s} value={s}>
                {s}x
              </option>
            ))}
          </select>
        </div>

        {/* Sleep Timer */}
        <div className="flex items-center gap-1 border border-[#DFD5C6] px-2 py-1 bg-[#F9F6F0] rounded-xs">
          <Moon size={12} className="text-[#9E3E26]" />
          <select
            value={sleepTimerMinutes || ''}
            onChange={(e) => setSleepTimer(e.target.value ? Number(e.target.value) : null)}
            className="bg-transparent font-bold text-[#1B1A17] cursor-pointer outline-hidden"
          >
            <option value="">Timer: Off</option>
            {sleepTimerOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}m
              </option>
            ))}
          </select>
          {sleepTimerRemaining !== null && (
            <span className="text-[10px] text-[#9E3E26] font-bold">
              ({formatTime(sleepTimerRemaining)})
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
