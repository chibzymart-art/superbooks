import { NextRequest, NextResponse } from 'next/server';
import { getStreamPlaybackUrl } from '@/lib/cloudflare/stream';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ uid: string }> }
) {
  try {
    const { uid } = await params;
    const shouldRedirect = req.nextUrl.searchParams.get('redirect') === 'true';

    const playbackUrl = getStreamPlaybackUrl(uid);
    const isMock = uid.startsWith('mock_');

    const streamData = {
      uid,
      provider: 'cloudflare-stream',
      playbackUrl,
      hlsManifestUrl: isMock
        ? playbackUrl
        : `https://videodelivery.net/${uid}/manifest/video.m3u8`,
      dashManifestUrl: isMock
        ? playbackUrl
        : `https://videodelivery.net/${uid}/manifest/video.mpd`,
      iframeEmbedUrl: isMock
        ? playbackUrl
        : `https://iframe.videodelivery.net/${uid}`,
      thumbnailUrl: isMock
        ? 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80'
        : `https://videodelivery.net/${uid}/thumbnails/thumbnail.jpg?height=720`,
      embedCode: `<iframe src="https://iframe.videodelivery.net/${uid}" style="border: none" height="720" width="405" allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture;" allowfullscreen="true"></iframe>`,
      deliveryNetwork: 'Cloudflare Global Anycast Edge (330+ Cities)',
      adaptiveBitrate: '1080p, 720p, 480p, 360p H.264 / AV1',
    };

    if (shouldRedirect) {
      return NextResponse.redirect(playbackUrl, 307);
    }

    return NextResponse.json(streamData, {
      headers: {
        'Cache-Control': 'public, max-age=3600, s-maxage=86400',
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Stream link resolution failed' }, { status: 500 });
  }
}
