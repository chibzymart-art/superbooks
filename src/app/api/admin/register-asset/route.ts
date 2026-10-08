import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BOOK_CEILING_BYTES, VIDEO_CEILING_BYTES } from '@/lib/compression/types';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    const body = await req.json();
    const {
      title,
      assetType,
      originalFilename,
      mimeType,
      originalSizeBytes,
      compressedSizeBytes,
      storagePath,
      streamUid,
      author = 'SuperBooks Editorial',
      genre = 'African & World Classics',
      description = '',
      coverUrl = '/covers/default.jpg',
      bookId = null,
      publishToCatalog = true,
    } = body;

    if (!title || !assetType) {
      return NextResponse.json({ error: 'Title and assetType are required.' }, { status: 400 });
    }

    // Server-Side Strict Ceiling Enforcement
    if (assetType === 'book' && compressedSizeBytes > BOOK_CEILING_BYTES) {
      return NextResponse.json(
        { error: `Ceiling Exceeded: Book (${(compressedSizeBytes / 1024).toFixed(1)} KB) exceeds 1.0 MB ceiling.` },
        { status: 400 }
      );
    }

    if (assetType === 'video' && compressedSizeBytes > VIDEO_CEILING_BYTES) {
      return NextResponse.json(
        { error: `Ceiling Exceeded: Video (${(compressedSizeBytes / (1024 * 1024)).toFixed(1)} MB) exceeds 50.0 MB ceiling.` },
        { status: 400 }
      );
    }

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '') + `-${Date.now().toString().slice(-4)}`;

    let createdBook = null;
    let createdVideo = null;

    if (supabase) {
      // 1. Insert into public.media_assets
      const { data: assetData, error: assetErr } = await supabase
        .from('media_assets')
        .insert({
          title,
          asset_type: assetType,
          original_filename: originalFilename || `${slug}.${assetType === 'book' ? 'epub' : 'mp4'}`,
          mime_type: mimeType || (assetType === 'book' ? 'application/epub+zip' : 'video/mp4'),
          original_size_bytes: originalSizeBytes,
          compressed_size_bytes: compressedSizeBytes,
          storage_path: storagePath || null,
          stream_uid: streamUid || null,
          status: 'ready',
          book_id: bookId || null,
        })
        .select()
        .single();

      if (assetErr) {
        console.warn('media_assets insert notice:', assetErr.message);
      }

      // 2. Publish to books table if requested
      if (publishToCatalog && assetType === 'book') {
        const { data: bookRecord, error: bookErr } = await supabase
          .from('books')
          .insert({
            slug,
            title,
            author,
            description: description || `Curated editorial edition of ${title}.`,
            cover_url: coverUrl,
            genre,
            is_free: true,
            rights_status: 'Public Domain / Open Access',
            file_type: 'pdf',
            source_key: storagePath,
            status: 'published',
            featured: true,
          })
          .select()
          .single();

        if (!bookErr) createdBook = bookRecord;
      }

      // 3. Publish to videos table if requested
      if (publishToCatalog && assetType === 'video') {
        const { data: videoRecord, error: videoErr } = await supabase
          .from('videos')
          .insert({
            slug,
            title,
            description: description || `Visual editorial commentary for ${title}.`,
            stream_uid: streamUid || `mock_stream_${Date.now()}`,
            author_name: author,
            book_id: bookId || null,
            status: 'published',
            episode_number: 1,
          })
          .select()
          .single();

        if (!videoErr) createdVideo = videoRecord;
      }

      return NextResponse.json({
        success: true,
        asset: assetData,
        book: createdBook,
        video: createdVideo,
        cdnLink: storagePath
          ? `https://r2.superbooks.org/${storagePath}`
          : streamUid
          ? `https://iframe.videodelivery.net/${streamUid}`
          : null,
      });
    }

    // Mock fallback response for offline testing
    return NextResponse.json({
      success: true,
      asset: {
        id: `mock-asset-${Date.now()}`,
        title,
        asset_type: assetType,
        original_size_bytes: originalSizeBytes,
        compressed_size_bytes: compressedSizeBytes,
        storage_path: storagePath,
        stream_uid: streamUid,
        status: 'ready',
      },
      cdnLink: storagePath
        ? `https://r2.superbooks.org/${storagePath}`
        : streamUid
        ? `https://iframe.videodelivery.net/${streamUid}`
        : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Asset registration failed' }, { status: 500 });
  }
}
