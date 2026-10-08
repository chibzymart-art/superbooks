'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { MessageSquare, Heart, Flag, BookOpen, CheckCircle } from 'lucide-react';
import { CommunityPost } from '@/types/database';

interface CommunityViewProps {
  initialPosts: CommunityPost[];
}

export function CommunityView({ initialPosts }: CommunityViewProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [likesMap, setLikesMap] = useState<Record<string, boolean>>({});
  const [reportedMap, setReportedMap] = useState<Record<string, boolean>>({});
  const [showNewPostModal, setShowNewPostModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const toggleLike = (postId: string) => {
    setLikesMap((prev) => {
      const isLiked = !prev[postId];
      setPosts((currentPosts) =>
        currentPosts.map((p) =>
          p.id === postId
            ? { ...p, likes_count: p.likes_count + (isLiked ? 1 : -1) }
            : p
        )
      );
      return { ...prev, [postId]: isLiked };
    });
  };

  const handleReport = (postId: string) => {
    setReportedMap((prev) => ({ ...prev, [postId]: true }));
    alert('Thank you. This post has been submitted to the admin moderation queue.');
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newPost: CommunityPost = {
      id: `p-${Date.now()}`,
      user_id: 'current-user',
      book_id: null,
      title: newTitle,
      content: newContent,
      likes_count: 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      author: {
        id: 'current-user',
        display_name: 'You (Reader)',
        avatar_url: null,
        role: 'reader',
        bio: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      comments: [],
    };

    setPosts([newPost, ...posts]);
    setNewTitle('');
    setNewContent('');
    setShowNewPostModal(false);
    setSuccessMsg('Your note was pinned to the community discussion board!');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-8">
      {/* Action Header */}
      <div className="border-b border-[#DFD5C6] pb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 border border-[#DFD5C6] bg-[#F3ECE1] px-3 py-1 text-xs font-mono tracking-widest uppercase text-[#5C5850]">
            <span>Reading Circle</span>
            <span className="text-[#9E3E26]">/</span>
            <span>Discussions & Margin Notes</span>
          </div>
          <h1 className="font-serif text-4xl font-bold text-[#1B1A17]">
            Literary Community
          </h1>
          <p className="text-sm text-[#5C5850] max-w-xl">
            Thoughtful exchanges, textual margin notes, and philosophical inquiries centered on the SuperBooks archive.
          </p>
        </div>

        <button
          onClick={() => setShowNewPostModal(true)}
          className="px-6 py-3 bg-[#9E3E26] hover:bg-[#822F1B] text-[#FFFDF9] text-xs font-mono uppercase tracking-widest font-bold transition-colors shadow-xs shrink-0"
        >
          + Write Margin Note
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-[#25473A]/10 border border-[#25473A] text-[#25473A] text-xs font-mono flex items-center gap-2">
          <CheckCircle size={16} />
          <span>{successMsg}</span>
        </div>
      )}

      {/* New Post Modal */}
      {showNewPostModal && (
        <div className="bg-[#FFFDF9] border border-[#DFD5C6] p-6 sm:p-8 rounded-xs shadow-book-spine space-y-4">
          <h3 className="font-serif text-xl font-bold text-[#1B1A17]">
            Author a Discussion Note
          </h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Topic or Question</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Symbolism of the reed in Bantu mythology"
                className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-mono uppercase text-[#1B1A17] font-bold">Your Commentary</label>
              <textarea
                value={newContent}
                onChange={(e) => setNewContent(e.target.value)}
                rows={3}
                placeholder="Share your reflection or quote a passage from the volume..."
                className="w-full p-2.5 bg-[#F9F6F0] border border-[#DFD5C6] text-sm focus:outline-[#9E3E26]"
                required
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#9E3E26] hover:bg-[#822F1B] text-[#FFFDF9] text-xs font-mono uppercase font-bold"
              >
                Publish Note
              </button>
              <button
                type="button"
                onClick={() => setShowNewPostModal(false)}
                className="px-4 py-2.5 border border-[#DFD5C6] text-xs font-mono uppercase text-[#5C5850]"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Feed list */}
      <div className="space-y-6">
        {posts.map((post) => (
          <article
            key={post.id}
            className="bg-[#FFFDF9] border border-[#DFD5C6] p-6 sm:p-8 rounded-xs shadow-book-spine space-y-4"
          >
            {/* Post Header */}
            <div className="flex items-center justify-between gap-4 border-b border-[#DFD5C6]/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-[#F3ECE1] border border-[#DFD5C6] flex items-center justify-center font-serif font-bold text-sm text-[#9E3E26]">
                  {post.author?.display_name?.charAt(0) || 'R'}
                </div>
                <div>
                  <div className="text-sm font-bold text-[#1B1A17]">
                    {post.author?.display_name || 'Anonymous Reader'}
                  </div>
                  <div className="text-xs font-mono text-[#8E887E]">
                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>

              {/* Book Link if attached */}
              {post.book && (
                <Link
                  href={`/books/${post.book.slug}`}
                  className="inline-flex items-center gap-1.5 text-xs font-mono bg-[#F9F6F0] border border-[#DFD5C6] px-2.5 py-1 text-[#9E3E26] hover:border-[#9E3E26] transition-colors"
                >
                  <BookOpen size={12} />
                  <span className="truncate max-w-[140px] sm:max-w-none">{post.book.title}</span>
                </Link>
              )}
            </div>

            {/* Post Title & Content */}
            <div className="space-y-2">
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#1B1A17]">
                {post.title}
              </h2>
              <p className="text-sm text-[#5C5850] leading-relaxed whitespace-pre-line">
                {post.content}
              </p>
            </div>

            {/* Comments Thread (if present) */}
            {post.comments && post.comments.length > 0 && (
              <div className="pt-4 mt-4 border-t border-[#DFD5C6]/40 space-y-3 bg-[#F9F6F0] p-4 rounded-xs">
                <div className="text-xs font-mono uppercase tracking-wider text-[#8E887E]">
                  Responses ({post.comments.length})
                </div>
                {post.comments.map((comment) => (
                  <div key={comment.id} className="text-xs space-y-1 border-l-2 border-[#DFD5C6] pl-3 py-1">
                    <div className="font-bold text-[#1B1A17]">
                      {comment.author?.display_name || 'Reader'}:
                    </div>
                    <p className="text-[#5C5850]">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Post Actions & Moderation */}
            <div className="pt-4 border-t border-[#DFD5C6]/60 flex items-center justify-between text-xs font-mono text-[#8E887E]">
              <div className="flex items-center gap-6">
                <button
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 transition-colors ${
                    likesMap[post.id] ? 'text-[#9E3E26] font-bold' : 'hover:text-[#9E3E26]'
                  }`}
                >
                  <Heart size={14} className={likesMap[post.id] ? 'fill-current' : ''} />
                  <span>{post.likes_count} Likes</span>
                </button>
                <button
                  onClick={() => alert('Reply dialog opened')}
                  className="flex items-center gap-1.5 hover:text-[#1B1A17] transition-colors"
                >
                  <MessageSquare size={14} />
                  <span>Reply</span>
                </button>
              </div>

              {/* Report button */}
              <button
                onClick={() => handleReport(post.id)}
                disabled={reportedMap[post.id]}
                className="flex items-center gap-1 hover:text-[#9E3E26] transition-colors text-[11px]"
                title="Report inappropriate content"
              >
                <Flag size={12} />
                <span>{reportedMap[post.id] ? 'Flagged' : 'Report'}</span>
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
