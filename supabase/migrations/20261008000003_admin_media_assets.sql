-- SuperBooks: Migration 03 - Admin Media Assets & Compression Tracking
-- Tracks uploaded books, videos, audios, covers, and real-time compression ratios

CREATE TABLE IF NOT EXISTS public.media_assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    asset_type TEXT NOT NULL CHECK (asset_type IN ('book', 'video', 'audio', 'cover')),
    original_filename TEXT NOT NULL,
    mime_type TEXT NOT NULL,
    original_size_bytes BIGINT NOT NULL,
    compressed_size_bytes BIGINT NOT NULL,
    compression_ratio NUMERIC(5,2) GENERATED ALWAYS AS (
        CASE 
            WHEN original_size_bytes > 0 THEN 
                ROUND(((original_size_bytes - compressed_size_bytes)::numeric / original_size_bytes::numeric) * 100.0, 2)
            ELSE 0 
        END
    ) STORED,
    storage_path TEXT,
    stream_uid TEXT,
    status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('processing', 'ready', 'failed')),
    book_id UUID REFERENCES public.books(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_media_assets_type ON public.media_assets(asset_type);
CREATE INDEX IF NOT EXISTS idx_media_assets_status ON public.media_assets(status);
CREATE INDEX IF NOT EXISTS idx_media_assets_book_id ON public.media_assets(book_id);
CREATE INDEX IF NOT EXISTS idx_media_assets_created ON public.media_assets(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- Overload is_admin to accept optional UUID or default to auth.uid()
CREATE OR REPLACE FUNCTION public.is_admin(user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = user_id AND role = 'admin'
    );
$$;

-- 1. Public can view ready media assets metadata
CREATE POLICY "Public can view ready media assets"
    ON public.media_assets FOR SELECT
    USING (status = 'ready');

-- 2. Admin full access
CREATE POLICY "Admins have full access to media assets"
    ON public.media_assets FOR ALL
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Function for updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$;

-- Trigger for updated_at
CREATE TRIGGER set_media_assets_timestamp
    BEFORE UPDATE ON public.media_assets
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Seed initial records matching our existing books
INSERT INTO public.media_assets (title, asset_type, original_filename, mime_type, original_size_bytes, compressed_size_bytes, storage_path, status)
VALUES 
('The Souls of Black Folk (Complete Manuscript)', 'book', 'the-souls-of-black-folk.epub', 'application/epub+zip', 14680064, 825120, 'books/the-souls-of-black-folk/manuscript-compressed.epub', 'ready'),
('Myths and Legends of the Bantu (Illustrated Volume)', 'book', 'myths-and-legends-bantu.epub', 'application/epub+zip', 28311552, 942080, 'books/myths-and-legends-of-the-bantu/manuscript-compressed.epub', 'ready'),
('Narrative of Frederick Douglass', 'book', 'frederick-douglass.epub', 'application/epub+zip', 8388608, 620400, 'books/narrative-of-the-life-of-frederick-douglass/manuscript-compressed.epub', 'ready'),
('Why African Mythology Matters (Literary Dispatch)', 'video', 'dispatch-mythology-raw.mp4', 'video/mp4', 184549376, 21495808, NULL, 'ready'),
('3 Du Bois Quotes That Shake You', 'video', 'dubois-quotes-4k.mov', 'video/mp4', 314572800, 18874368, NULL, 'ready')
ON CONFLICT DO NOTHING;
