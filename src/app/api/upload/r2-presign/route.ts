import { NextRequest, NextResponse } from 'next/server';
import { getR2PresignedUploadUrl } from '@/lib/cloudflare/r2';
import { createClient } from '@/lib/supabase/server';
import { BOOK_CEILING_BYTES } from '@/lib/compression/types';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify session & role if Supabase user is logged in
    if (supabase) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single();

        if (profile && profile.role !== 'admin') {
          return NextResponse.json(
            { error: 'Forbidden: Admin role required to upload assets.' },
            { status: 403 }
          );
        }
      }
    }

    const body = await req.json();
    const { filename, contentType, sizeBytes, assetType = 'book' } = body;

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: 'filename and contentType are required' },
        { status: 400 }
      );
    }

    // Strict Ceiling Gatekeeper
    if (assetType === 'book' && typeof sizeBytes === 'number') {
      if (sizeBytes > BOOK_CEILING_BYTES) {
        return NextResponse.json(
          {
            error: `Book asset exceeds strict 1.0 MB ceiling (${(sizeBytes / 1024).toFixed(1)} KB received). Please run client-side compression before uploading.`,
            receivedBytes: sizeBytes,
            ceilingBytes: BOOK_CEILING_BYTES,
          },
          { status: 400 }
        );
      }
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const folder = assetType === 'cover' ? 'covers' : 'books';
    const key = `${folder}/${Date.now()}-${cleanFilename}`;

    const { uploadUrl } = await getR2PresignedUploadUrl(key, contentType);

    return NextResponse.json({
      success: true,
      uploadUrl,
      key,
      storagePath: key,
      destination: 'cloudflare-r2',
      ceilingBytes: BOOK_CEILING_BYTES,
      isCompliant: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Presign generation failed' }, { status: 500 });
  }
}
