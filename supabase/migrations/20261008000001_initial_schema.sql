-- SuperBooks: Production Migration 01 - Initial Schema & RLS
-- Creates all tables, relations, triggers, indexes, and comprehensive RLS policies

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    display_name TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'reader' CHECK (role IN ('reader', 'admin')),
    bio TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Index for profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Helper function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

-- Automatically create reader profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, display_name, avatar_url, role)
    VALUES (
        new.id,
        COALESCE(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
        COALESCE(new.raw_user_meta_data->>'avatar_url', ''),
        'reader'
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN new;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. BOOKS TABLE
CREATE TABLE IF NOT EXISTS public.books (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    title TEXT NOT NULL,
    author TEXT NOT NULL,
    description TEXT NOT NULL,
    cover_url TEXT NOT NULL,
    language TEXT NOT NULL DEFAULT 'en',
    genre TEXT NOT NULL,
    is_free BOOLEAN NOT NULL DEFAULT false,
    rights_status TEXT NOT NULL CHECK (rights_status <> ''),
    file_type TEXT NOT NULL DEFAULT 'pdf' CHECK (file_type IN ('pdf', 'images')),
    source_key TEXT,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    page_count INT NOT NULL DEFAULT 0,
    featured BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_books_slug ON public.books(slug);
CREATE INDEX IF NOT EXISTS idx_books_status ON public.books(status);
CREATE INDEX IF NOT EXISTS idx_books_genre ON public.books(genre);
CREATE INDEX IF NOT EXISTS idx_books_is_free ON public.books(is_free);

-- 3. CHAPTERS TABLE
CREATE TABLE IF NOT EXISTS public.chapters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    number INT NOT NULL,
    title TEXT NOT NULL,
    content_html TEXT,
    page_range INT4RANGE,
    audio_key TEXT,
    duration_seconds INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_book_chapter_number UNIQUE(book_id, number)
);

CREATE INDEX IF NOT EXISTS idx_chapters_book_id ON public.chapters(book_id);
CREATE INDEX IF NOT EXISTS idx_chapters_number ON public.chapters(number);

-- 4. PAGES TABLE (For image sets and rasterized PDF pages)
CREATE TABLE IF NOT EXISTS public.pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    page_number INT NOT NULL,
    image_key TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_book_page_number UNIQUE(book_id, page_number)
);

CREATE INDEX IF NOT EXISTS idx_pages_book_id ON public.pages(book_id);

-- 5. VIDEOS TABLE (Booktok Episodes)
CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    stream_uid TEXT NOT NULL,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    author_name TEXT,
    episode_number INT NOT NULL DEFAULT 1,
    status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
    view_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_videos_slug ON public.videos(slug);
CREATE INDEX IF NOT EXISTS idx_videos_book_id ON public.videos(book_id);

-- 6. READING PROGRESS TABLE
CREATE TABLE IF NOT EXISTS public.reading_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    page_number INT NOT NULL DEFAULT 1,
    progress_percentage NUMERIC(5, 2) NOT NULL DEFAULT 0.00,
    last_read_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_book_progress UNIQUE(user_id, book_id)
);

CREATE INDEX IF NOT EXISTS idx_reading_progress_user ON public.reading_progress(user_id);

-- 7. BOOKMARKS TABLE
CREATE TABLE IF NOT EXISTS public.bookmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID NOT NULL REFERENCES public.books(id) ON DELETE CASCADE,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE SET NULL,
    page_number INT NOT NULL DEFAULT 1,
    cf_quote TEXT,
    note TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_book ON public.bookmarks(book_id);

-- 8. COMMUNITY POSTS
CREATE TABLE IF NOT EXISTS public.community_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_community_posts_book ON public.community_posts(book_id);
CREATE INDEX IF NOT EXISTS idx_community_posts_created ON public.community_posts(created_at DESC);

-- 9. COMMENTS TABLE
CREATE TABLE IF NOT EXISTS public.comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_comments_post_id ON public.comments(post_id);

-- 10. LIKES TABLE
CREATE TABLE IF NOT EXISTS public.likes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id UUID NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_user_target_like UNIQUE(user_id, target_type, target_id)
);

CREATE INDEX IF NOT EXISTS idx_likes_target ON public.likes(target_type, target_id);

-- 11. REPORTS TABLE (Admin moderation)
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    reporter_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    target_type TEXT NOT NULL CHECK (target_type IN ('post', 'comment')),
    target_id UUID NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'resolved', 'dismissed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE INDEX IF NOT EXISTS idx_reports_status ON public.reports(status);


-- ========================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ========================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by everyone" 
    ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Books Policies
CREATE POLICY "Published books are viewable by everyone" 
    ON public.books FOR SELECT 
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Only admins can insert books" 
    ON public.books FOR INSERT 
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update books" 
    ON public.books FOR UPDATE 
    USING (public.is_admin());

CREATE POLICY "Only admins can delete books" 
    ON public.books FOR DELETE 
    USING (public.is_admin());

-- 3. Chapters Policies
-- Visitors can read chapter 1 of any book, or all chapters of free books, or all chapters if logged in
CREATE POLICY "Chapter 1 or free books viewable by visitors, full chapters for logged in" 
    ON public.chapters FOR SELECT 
    USING (
        number = 1 
        OR EXISTS (
            SELECT 1 FROM public.books b 
            WHERE b.id = chapters.book_id 
            AND (b.is_free = true OR auth.uid() IS NOT NULL)
        )
        OR public.is_admin()
    );

CREATE POLICY "Only admins can insert chapters" 
    ON public.chapters FOR INSERT 
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can update chapters" 
    ON public.chapters FOR UPDATE 
    USING (public.is_admin());

CREATE POLICY "Only admins can delete chapters" 
    ON public.chapters FOR DELETE 
    USING (public.is_admin());

-- 4. Pages Policies
CREATE POLICY "Pages viewable if book is free or user authenticated" 
    ON public.pages FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.books b 
            WHERE b.id = pages.book_id 
            AND (b.is_free = true OR auth.uid() IS NOT NULL)
        )
        OR public.is_admin()
    );

CREATE POLICY "Only admins can insert pages" 
    ON public.pages FOR INSERT 
    WITH CHECK (public.is_admin());

CREATE POLICY "Only admins can delete pages" 
    ON public.pages FOR DELETE 
    USING (public.is_admin());

-- 5. Videos Policies
CREATE POLICY "Published videos viewable by everyone" 
    ON public.videos FOR SELECT 
    USING (status = 'published' OR public.is_admin());

CREATE POLICY "Only admins can manage videos" 
    ON public.videos FOR ALL 
    USING (public.is_admin());

-- 6. Reading Progress Policies
CREATE POLICY "Users can manage own reading progress" 
    ON public.reading_progress FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7. Bookmarks Policies
CREATE POLICY "Users can manage own bookmarks" 
    ON public.bookmarks FOR ALL 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 8. Community Posts Policies
CREATE POLICY "Community posts viewable by everyone" 
    ON public.community_posts FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can create posts" 
    ON public.community_posts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own posts or admin can moderate" 
    ON public.community_posts FOR UPDATE 
    USING (auth.uid() = user_id OR public.is_admin());

CREATE POLICY "Users can delete own posts or admin can moderate" 
    ON public.community_posts FOR DELETE 
    USING (auth.uid() = user_id OR public.is_admin());

-- 9. Comments Policies
CREATE POLICY "Comments viewable by everyone" 
    ON public.comments FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can comment" 
    ON public.comments FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own comments or admin can moderate" 
    ON public.comments FOR DELETE 
    USING (auth.uid() = user_id OR public.is_admin());

-- 10. Likes Policies
CREATE POLICY "Likes viewable by everyone" 
    ON public.likes FOR SELECT 
    USING (true);

CREATE POLICY "Authenticated users can like" 
    ON public.likes FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove own like" 
    ON public.likes FOR DELETE 
    USING (auth.uid() = user_id);

-- 11. Reports Policies
CREATE POLICY "Authenticated users can submit reports" 
    ON public.reports FOR INSERT 
    WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "Only admins can view and manage reports" 
    ON public.reports FOR ALL 
    USING (public.is_admin());
