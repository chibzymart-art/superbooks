export type UserRole = 'reader' | 'admin';

export interface Profile {
  id: string;
  display_name: string | null;
  avatar_url: string | null;
  role: UserRole;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export type BookStatus = 'draft' | 'published';
export type BookFileType = 'pdf' | 'images';

export interface Book {
  id: string;
  slug: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
  language: string;
  genre: string;
  is_free: boolean;
  rights_status: string;
  file_type: BookFileType;
  source_key: string | null;
  status: BookStatus;
  page_count: number;
  featured: boolean;
  created_at: string;
  updated_at: string;
  chapters?: Chapter[];
  pages?: Page[];
}

export interface Chapter {
  id: string;
  book_id: string;
  number: number;
  title: string;
  content_html: string | null;
  page_range?: string | null;
  audio_key?: string | null;
  duration_seconds: number;
  created_at: string;
}

export interface Page {
  id: string;
  book_id: string;
  page_number: number;
  image_key: string;
  created_at: string;
}

export interface VideoEpisode {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  stream_uid: string;
  book_id: string | null;
  author_name: string | null;
  episode_number: number;
  status: BookStatus;
  view_count: number;
  created_at: string;
  book?: Book;
}

export interface ReadingProgress {
  id: string;
  user_id: string;
  book_id: string;
  chapter_id: string | null;
  page_number: number;
  progress_percentage: number;
  last_read_at: string;
  book?: Book;
  chapter?: Chapter;
}

export interface Bookmark {
  id: string;
  user_id: string;
  book_id: string;
  chapter_id: string | null;
  page_number: number;
  cf_quote: string | null;
  note: string | null;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  user_id: string;
  book_id: string | null;
  title: string;
  content: string;
  likes_count: number;
  created_at: string;
  updated_at: string;
  author?: Profile;
  book?: Book;
  comments?: Comment[];
}

export interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  likes_count: number;
  created_at: string;
  author?: Profile;
}

export interface Like {
  id: string;
  user_id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  created_at: string;
}

export interface Report {
  id: string;
  reporter_id: string;
  target_type: 'post' | 'comment';
  target_id: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  created_at: string;
  reporter?: Profile;
}
