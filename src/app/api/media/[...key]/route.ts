import { NextRequest, NextResponse } from 'next/server';
import { getR2PresignedDownloadUrl } from '@/lib/cloudflare/r2';
import { createClient } from '@/lib/supabase/server';
import { getBookBySlug } from '@/lib/books';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  try {
    const { key } = await params;
    const mediaKey = key.join('/');
    const bookSlug = req.nextUrl.searchParams.get('book');
    const shouldRedirect = req.nextUrl.searchParams.get('redirect') === 'true';

    if (bookSlug) {
      const book = await getBookBySlug(bookSlug);
      // If book is not free, require authentication
      if (book && !book.is_free) {
        const supabase = await createClient();
        if (supabase) {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
            return NextResponse.json(
              { error: 'Unauthorized: Premium book asset requires an active reader account.' },
              { status: 401 }
            );
          }
        }
      }
    }

    // Generate short-lived signed URL (15 minutes expiry)
    const signedUrl = await getR2PresignedDownloadUrl(mediaKey, 900);

    if (shouldRedirect) {
      return NextResponse.redirect(signedUrl, 307);
    }

    return NextResponse.json(
      {
        key: mediaKey,
        signedUrl,
        url: signedUrl,
        provider: 'cloudflare-r2',
        uniqueLink: `/api/media/${mediaKey}`,
        directStreamUrl: `/api/media/${mediaKey}?redirect=true`,
        expiresInSeconds: 900,
        egressCost: '$0.00 (Zero Egress R2 Agreement)',
        cdnEdge: 'Cloudflare Global Anycast Network (330+ Cities)',
      },
      {
        headers: {
          'Cache-Control': 'private, max-age=900, stale-while-revalidate=60',
        },
      }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
