import { NextRequest, NextResponse } from 'next/server';
import { createStreamDirectUploadUrl } from '@/lib/cloudflare/stream';
import { createClient } from '@/lib/supabase/server';
import { VIDEO_CEILING_BYTES } from '@/lib/compression/types';

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
    const { filename, sizeBytes, maxDurationSeconds = 1800 } = body;

    // Strict Ceiling Gatekeeper
    if (typeof sizeBytes === 'number') {
      if (sizeBytes > VIDEO_CEILING_BYTES) {
        return NextResponse.json(
          {
            error: `Video asset exceeds strict 50.0 MB ceiling (${(sizeBytes / (1024 * 1024)).toFixed(1)} MB received). Please run client-side compression before uploading.`,
            receivedBytes: sizeBytes,
            ceilingBytes: VIDEO_CEILING_BYTES,
          },
          { status: 400 }
        );
      }
    }

    const { uploadUrl, uid } = await createStreamDirectUploadUrl(maxDurationSeconds);

    return NextResponse.json({
      success: true,
      uploadUrl,
      streamUid: uid,
      destination: 'cloudflare-stream',
      ceilingBytes: VIDEO_CEILING_BYTES,
      isCompliant: true,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Stream direct creator upload URL failed' }, { status: 500 });
  }
}
