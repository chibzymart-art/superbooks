import { NextRequest, NextResponse } from 'next/server';
import { getR2PresignedUploadUrl } from '@/lib/cloudflare/r2';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();

    // Check admin authentication if Supabase is active
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 });
      }

      // Check role
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        return NextResponse.json({ error: 'Forbidden: Admin role required to upload assets.' }, { status: 403 });
      }
    }

    const { filename, contentType } = await req.json();
    if (!filename || !contentType) {
      return NextResponse.json({ error: 'filename and contentType are required' }, { status: 400 });
    }

    const cleanFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const key = `books/${Date.now()}-${cleanFilename}`;

    const { uploadUrl } = await getR2PresignedUploadUrl(key, contentType);

    return NextResponse.json({
      uploadUrl,
      key,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
