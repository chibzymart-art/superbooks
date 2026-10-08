import { createClient } from '@/lib/supabase/server';
import { MOCK_BOOKS, MOCK_VIDEOS, MOCK_COMMUNITY_POSTS } from '@/lib/mock-data';
import { Book, Chapter, VideoEpisode, CommunityPost } from '@/types/database';

export async function getBooks(filters?: { genre?: string; query?: string; isFree?: boolean }): Promise<Book[]> {
  const supabase = await createClient();

  if (supabase) {
    let query = supabase
      .from('books')
      .select('*, chapters(*)')
      .eq('status', 'published')
      .order('featured', { ascending: false })
      .order('created_at', { ascending: false });

    if (filters?.genre && filters.genre !== 'All') {
      query = query.eq('genre', filters.genre);
    }
    if (filters?.isFree !== undefined) {
      query = query.eq('is_free', filters.isFree);
    }
    if (filters?.query) {
      query = query.or(`title.ilike.%${filters.query}%,author.ilike.%${filters.query}%`);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as Book[];
    }
  }

  // Graceful fallback to mock data
  let result = [...MOCK_BOOKS];
  if (filters?.genre && filters.genre !== 'All') {
    result = result.filter(b => b.genre.toLowerCase() === filters.genre?.toLowerCase());
  }
  if (filters?.isFree !== undefined) {
    result = result.filter(b => b.is_free === filters.isFree);
  }
  if (filters?.query) {
    const q = filters.query.toLowerCase();
    result = result.filter(b => b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q));
  }
  return result;
}

export async function getBookBySlug(slug: string): Promise<Book | null> {
  const supabase = await createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('books')
      .select('*, chapters(*), pages(*)')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return data as Book;
    }
  }

  return MOCK_BOOKS.find(b => b.slug === slug) || null;
}

export async function getChapter(bookSlug: string, chapterNumber: number): Promise<{ book: Book; chapter: Chapter | null } | null> {
  const book = await getBookBySlug(bookSlug);
  if (!book) return null;

  const chapter = book.chapters?.find(c => c.number === chapterNumber) || null;
  return { book, chapter };
}

/**
 * Server-side gate check:
 * Chapter 1 is always accessible to visitors.
 * Chapter 2+ is only accessible if book is free OR user has an authenticated session.
 */
export async function canAccessChapter(book: Book, chapterNumber: number): Promise<{ allowed: boolean; reason?: string }> {
  if (chapterNumber === 1) {
    return { allowed: true };
  }
  if (book.is_free) {
    return { allowed: true };
  }

  const supabase = await createClient();
  if (supabase) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      return { allowed: true };
    }
  }

  return {
    allowed: false,
    reason: 'Chapter 2 and beyond for this title require a free SuperBooks account. Please sign in or register to continue reading.',
  };
}

export async function getVideos(): Promise<VideoEpisode[]> {
  const supabase = await createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('videos')
      .select('*, book:books(*)')
      .eq('status', 'published')
      .order('episode_number', { ascending: true });

    if (!error && data && data.length > 0) {
      return data as VideoEpisode[];
    }
  }

  return MOCK_VIDEOS;
}

export async function getVideoBySlug(slug: string): Promise<VideoEpisode | null> {
  const supabase = await createClient();

  if (supabase) {
    const { data, error } = await supabase
      .from('videos')
      .select('*, book:books(*)')
      .eq('slug', slug)
      .single();

    if (!error && data) {
      return data as VideoEpisode;
    }
  }

  return MOCK_VIDEOS.find(v => v.slug === slug) || null;
}

export async function getCommunityPosts(bookId?: string): Promise<CommunityPost[]> {
  const supabase = await createClient();

  if (supabase) {
    let query = supabase
      .from('community_posts')
      .select('*, author:profiles(*), book:books(*), comments(*, author:profiles(*))')
      .order('created_at', { ascending: false });

    if (bookId) {
      query = query.eq('book_id', bookId);
    }

    const { data, error } = await query;
    if (!error && data && data.length > 0) {
      return data as CommunityPost[];
    }
  }

  if (bookId) {
    return MOCK_COMMUNITY_POSTS.filter(p => p.book_id === bookId);
  }
  return MOCK_COMMUNITY_POSTS;
}
