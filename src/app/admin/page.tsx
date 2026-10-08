'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Upload, BookOpen, Video, ShieldAlert, BarChart3, CheckCircle, AlertCircle } from 'lucide-react';
import { MOCK_BOOKS, MOCK_VIDEOS } from '@/lib/mock-data';

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<'stats' | 'upload_book' | 'upload_video' | 'moderation'>('stats');

  // Book form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [genre, setGenre] = useState('Pan-African & Social Thought');
  const [description, setDescription] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isFree, setIsFree] = useState(true);
  const [rightsStatus, setRightsStatus] = useState('');
  const [fileType, setFileType] = useState<'pdf' | 'images'>('pdf');
  const [bookSuccess, setBookSuccess] = useState(false);
  const [bookError, setBookError] = useState('');

  // Video form state
  const [videoTitle, setVideoTitle] = useState('');
  const [videoDesc, setVideoDesc] = useState('');
  const [streamUid, setStreamUid] = useState('');
  const [videoSuccess, setVideoSuccess] = useState(false);

  // Moderation state
  const [reports, setReports] = useState([
    {
      id: 'rep-1',
      type: 'post',
      title: 'Off-topic spam link regarding non-literary promotions',
      reason: 'Spam and promotional violation',
      status: 'pending',
      date: '2 hours ago',
    },
    {
      id: 'rep-2',
      type: 'comment',
      title: 'Disrespectful language in chapter discussion thread',
      reason: 'Harassment / abusive tone',
      status: 'pending',
      date: '1 day ago',
    },
  ]);

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBookError('');

    // STRICT REQUIREMENT: Require a rights_status field before publish!
    if (!rightsStatus.trim()) {
      setBookError('Error: A verified rights_status field is strictly required before any book can be published.');
      return;
    }

    if (!title.trim() || !author.trim() || !description.trim()) {
      setBookError('Please fill out all required volume metadata fields.');
      return;
    }

    setBookSuccess(true);
    setTimeout(() => {
      setBookSuccess(false);
      setTitle('');
      setAuthor('');
      setDescription('');
      setRightsStatus('');
      setCoverUrl('');
    }, 3000);
  };

  const handleVideoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim() || !streamUid.trim()) return;

    setVideoSuccess(true);
    setTimeout(() => {
      setVideoSuccess(false);
      setVideoTitle('');
      setVideoDesc('');
      setStreamUid('');
    }, 3000);
  };

  const dismissReport = (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Editorial Admin Header */}
      <div className="border-b border-[#DFD5C6] pb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 border border-[#DFD5C6] bg-[#F3ECE1] px-3 py-1 text-xs font-mono tracking-widest uppercase text-[#5C5850]">
            <span className="w-2 h-2 rounded-full bg-[#25473A]" />
            <span>SuperBooks Studio Desk</span>
            <span className="text-[#9E3E26]">/</span>
            <span>Role: Administrator</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-[#1B1A17] mt-2">
            Curator & Publishing Console
          </h1>
          <p className="text-sm text-[#5C5850]">
            Manage literary volumes, upload PDFs directly to Cloudflare R2, dispatch Booktok episodes, and review community reports.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border border-[#DFD5C6] bg-[#F3ECE1] p-1 rounded-xs text-xs font-mono">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
              activeTab === 'stats' ? 'bg-[#1B1A17] text-[#FFFDF9] font-bold' : 'text-[#5C5850] hover:text-[#1B1A17]'
            }`}
          >
            <BarChart3 size={14} />
            <span>Overview</span>
          </button>
          <button
            onClick={() => setActiveTab('upload_book')}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
              activeTab === 'upload_book' ? 'bg-[#9E3E26] text-[#FFFDF9] font-bold' : 'text-[#5C5850] hover:text-[#1B1A17]'
            }`}
          >
            <BookOpen size={14} />
            <span>Publish Book</span>
          </button>
          <button
            onClick={() => setActiveTab('upload_video')}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
              activeTab === 'upload_video' ? 'bg-[#1B1A17] text-[#FFFDF9] font-bold' : 'text-[#5C5850] hover:text-[#1B1A17]'
            }`}
          >
            <Video size={14} />
            <span>Booktok Video</span>
          </button>
          <button
            onClick={() => setActiveTab('moderation')}
            className={`px-3 py-1.5 flex items-center gap-1.5 transition-colors ${
              activeTab === 'moderation' ? 'bg-[#1B1A17] text-[#FFFDF9] font-bold' : 'text-[#5C5850] hover:text-[#1B1A17]'
            }`}
          >
            <ShieldAlert size={14} />
            <span>Moderation ({reports.length})</span>
          </button>
        </div>
      </div>

      {/* 1. OVERVIEW & STATS TAB */}
      {activeTab === 'stats' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#FFFDF9] border border-[#DFD5C6] p-6 rounded-xs shadow-book-spine space-y-2">
              <span className="text-xs font-mono uppercase text-[#8E887E]">Catalog Volumes</span>
              <div className="font-serif text-3xl font-bold text-[#1B1A17]">{MOCK_BOOKS.length} Titles</div>
              <div className="text-xs text-[#25473A] font-mono">3 Free • 2 Members</div>
            </div>

            <div className="bg-[#FFFDF9] border border-[#DFD5C6] p-6 rounded-xs shadow-book-spine space-y-2">
              <span className="text-xs font-mono uppercase text-[#8E887E]">Booktok Dispatches</span>
              <div className="font-serif text-3xl font-bold text-[#1B1A17]">{MOCK_VIDEOS.length} Episodes</div>
              <div className="text-xs text-[#8E887E] font-mono">Stream adaptive HLS</div>
            </div>

            <div className="bg-[#FFFDF9] border border-[#DFD5C6] p-6 rounded-xs shadow-book-spine space-y-2">
              <span className="text-xs font-mono uppercase text-[#8E887E]">Presigned Uploads</span>
              <div className="font-serif text-3xl font-bold text-[#1B1A17]">Active</div>
              <div className="text-xs text-[#25473A] font-mono">Cloudflare R2 Bucket</div>
            </div>

            <div className="bg-[#FFFDF9] border border-[#DFD5C6] p-6 rounded-xs shadow-book-spine space-y-2">
              <span className="text-xs font-mono uppercase text-[#8E887E]">Moderation Queue</span>
              <div className="font-serif text-3xl font-bold text-[#9E3E26]">{reports.length} Flags</div>
              <div className="text-xs text-[#8E887E] font-mono">Pending review</div>
            </div>
          </div>

          <div className="border border-[#DFD5C6] bg-[#F3ECE1] p-6 rounded-xs space-y-3">
            <h3 className="font-serif text-xl font-bold text-[#1B1A17]">Storage Pipeline Architecture</h3>
            <p className="text-xs text-[#5C5850] leading-relaxed max-w-2xl">
              Admin uploads transfer directly from browser to Cloudflare R2 using AWS S3 presigned PUT URLs, preventing Vercel function timeout limits on large PDFs. PDF pages are converted to WebP image sets for high-speed page-flip rendering.
            </p>
          </div>
        </div>
      )}

      {/* 2. PUBLISH BOOK TAB */}
      {activeTab === 'upload_book' && (
        <div className="max-w-3xl bg-[#FFFDF9] border border-[#DFD5C6] p-8 sm:p-12 shadow-book-spine rounded-xs space-y-6">
          <div className="border-b border-[#DFD5C6] pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#1B1A17]">
              Publish New Literary Volume
            </h2>
            <p className="text-xs text-[#5C5850] mt-1">
              Add metadata, declare legal copyright status, and attach files directly to R2.
            </p>
          </div>

          {bookSuccess && (
            <div className="p-4 bg-[#25473A]/10 border border-[#25473A] text-[#25473A] text-xs font-mono flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Volume successfully registered and scheduled for catalog indexing!</span>
            </div>
          )}

          {bookError && (
            <div className="p-4 bg-[#9E3E26]/10 border border-[#9E3E26] text-[#9E3E26] text-xs font-mono flex items-center gap-2">
              <AlertCircle size={16} />
              <span>{bookError}</span>
            </div>
          )}

          <form onSubmit={handleBookSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Book Title *</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Things Fall Apart"
                  className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Author *</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="e.g. Chinua Achebe"
                  className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Genre</label>
                <select
                  value={genre}
                  onChange={(e) => setGenre(e.target.value)}
                  className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
                >
                  <option value="Pan-African & Social Thought">Pan-African & Social Thought</option>
                  <option value="African Folklore & Mythology">African Folklore & Mythology</option>
                  <option value="Historical Autobiography">Historical Autobiography</option>
                  <option value="Philosophy & Poetry">Philosophy & Poetry</option>
                  <option value="Classic Literature & Romance">Classic Literature & Romance</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Access Rights Type</label>
                <div className="flex items-center gap-4 pt-2 text-xs font-mono">
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={isFree}
                      onChange={() => setIsFree(true)}
                      className="accent-[#25473A]"
                    />
                    <span>100% Free Full Book</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input
                      type="radio"
                      checked={!isFree}
                      onChange={() => setIsFree(false)}
                      className="accent-[#9E3E26]"
                    />
                    <span>Paid / Members (Ch. 1 Preview)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* MANDATORY RIGHTS STATUS FIELD */}
            <div className="space-y-1 bg-[#F3ECE1] p-4 border border-[#DFD5C6]">
              <label className="text-xs font-mono uppercase text-[#9E3E26] font-bold flex items-center gap-1">
                <span>Rights Status (Mandatory Verification Before Publish) *</span>
              </label>
              <input
                type="text"
                value={rightsStatus}
                onChange={(e) => setRightsStatus(e.target.value)}
                placeholder="e.g. Public Domain (pre-1928), CC-BY-SA 4.0, or Author Licensed Agreement #SB-2026"
                className="w-full p-2.5 bg-[#FFFDF9] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
                required
              />
              <p className="text-[11px] text-[#5C5850] mt-1">
                Publishing policy requires positive copyright documentation to guarantee safe reading distribution.
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Description / Editorial Synopsis *</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                placeholder="Summary of the book, historical context, and key thematic elements..."
                className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Cover Image URL</label>
              <input
                type="url"
                value={coverUrl}
                onChange={(e) => setCoverUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
              />
            </div>

            {/* File Upload Mode */}
            <div className="border border-dashed border-[#DFD5C6] p-6 bg-[#F9F6F0] text-center space-y-3 rounded-xs">
              <Upload size={24} className="mx-auto text-[#9E3E26]" />
              <div className="text-xs font-mono uppercase text-[#1B1A17] font-bold">
                Direct Browser-to-R2 Upload (PDF or Picture Sets)
              </div>
              <p className="text-xs text-[#5C5850] max-w-md mx-auto">
                Files are uploaded directly to your Cloudflare R2 bucket via presigned S3 URLs, handling multi-hundred-megabyte files smoothly.
              </p>
              <div className="flex justify-center gap-4 text-xs font-mono">
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="file_type"
                    checked={fileType === 'pdf'}
                    onChange={() => setFileType('pdf')}
                    className="accent-[#9E3E26]"
                  />
                  <span>PDF Book</span>
                </label>
                <label className="flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name="file_type"
                    checked={fileType === 'images'}
                    onChange={() => setFileType('images')}
                    className="accent-[#9E3E26]"
                  />
                  <span>Picture Book / Image Set</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#9E3E26] hover:bg-[#822F1B] text-[#FFFDF9] text-xs font-mono uppercase tracking-widest font-bold transition-colors shadow-xs"
            >
              Verify Rights & Publish Volume
            </button>
          </form>
        </div>
      )}

      {/* 3. BOOKTOK VIDEO TAB */}
      {activeTab === 'upload_video' && (
        <div className="max-w-2xl bg-[#FFFDF9] border border-[#DFD5C6] p-8 sm:p-12 shadow-book-spine rounded-xs space-y-6">
          <div className="border-b border-[#DFD5C6] pb-4">
            <h2 className="font-serif text-2xl font-bold text-[#1B1A17]">
              Dispatch Booktok Episode to Cloudflare Stream
            </h2>
            <p className="text-xs text-[#5C5850] mt-1">
              Add vertical short-form video essays linked to catalogue books.
            </p>
          </div>

          {videoSuccess && (
            <div className="p-4 bg-[#25473A]/10 border border-[#25473A] text-[#25473A] text-xs font-mono flex items-center gap-2">
              <CheckCircle size={16} />
              <span>Episode published to vertical Booktok feed!</span>
            </div>
          )}

          <form onSubmit={handleVideoSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Episode Title</label>
              <input
                type="text"
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="e.g. 3 Quotes from Du Bois that resonate today"
                className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Cloudflare Stream UID</label>
              <input
                type="text"
                value={streamUid}
                onChange={(e) => setStreamUid(e.target.value)}
                placeholder="e.g. a1b2c3d4e5f67890 or mock_stream_01"
                className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm font-mono focus:outline-[#9E3E26]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Episode Description</label>
              <textarea
                value={videoDesc}
                onChange={(e) => setVideoDesc(e.target.value)}
                rows={2}
                placeholder="Brief takeaway explaining the excerpt..."
                className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-[#1B1A17] hover:bg-[#9E3E26] text-[#FFFDF9] text-xs font-mono uppercase tracking-widest font-bold transition-colors shadow-xs"
            >
              Publish to Booktok Feed
            </button>
          </form>
        </div>
      )}

      {/* 4. MODERATION QUEUE TAB */}
      {activeTab === 'moderation' && (
        <div className="max-w-4xl space-y-6">
          <div className="border-b border-[#DFD5C6] pb-4 flex justify-between items-baseline">
            <h2 className="font-serif text-2xl font-bold text-[#1B1A17]">
              Community Reports & Moderation Queue
            </h2>
            <span className="text-xs font-mono text-[#8E887E]">
              {reports.length} pending inquiries
            </span>
          </div>

          {reports.length === 0 ? (
            <div className="bg-[#FFFDF9] border border-[#DFD5C6] p-8 text-center text-xs font-mono text-[#5C5850]">
              All flagged items have been reviewed and cleared!
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((r) => (
                <div
                  key={r.id}
                  className="bg-[#FFFDF9] border border-[#DFD5C6] p-6 rounded-xs shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
                >
                  <div className="space-y-1">
                    <div className="inline-flex items-center gap-2">
                      <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 bg-[#9E3E26] text-[#FFFDF9] font-bold">
                        {r.type.toUpperCase()}
                      </span>
                      <span className="text-xs font-mono text-[#8E887E]">{r.date}</span>
                    </div>
                    <h3 className="font-serif text-base font-bold text-[#1B1A17]">
                      {r.title}
                    </h3>
                    <p className="text-xs text-[#5C5850]">Reason: {r.reason}</p>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-auto text-xs font-mono">
                    <button
                      onClick={() => dismissReport(r.id)}
                      className="px-3 py-1.5 border border-[#DFD5C6] hover:bg-[#F3ECE1] text-[#5C5850]"
                    >
                      Dismiss
                    </button>
                    <button
                      onClick={() => dismissReport(r.id)}
                      className="px-3 py-1.5 bg-[#9E3E26] hover:bg-[#822F1B] text-[#FFFDF9] font-bold"
                    >
                      Remove Content
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
