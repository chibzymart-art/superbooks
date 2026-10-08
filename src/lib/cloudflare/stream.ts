const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const streamApiToken = process.env.CLOUDFLARE_STREAM_API_TOKEN;

/**
 * Creates a direct creator upload URL for Cloudflare Stream
 */
export async function createStreamDirectUploadUrl(maxDurationSeconds = 3600): Promise<{ uploadUrl: string; uid: string }> {
  if (!accountId || !streamApiToken) {
    const mockUid = `mock_stream_${Date.now()}`;
    return {
      uploadUrl: `/api/stream/mock-upload?uid=${mockUid}`,
      uid: mockUid,
    };
  }

  const response = await fetch(
    `https://api.cloudflare.com/client/v4/accounts/${accountId}/stream/direct_upload`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${streamApiToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        maxDurationSeconds,
        requireSignedURLs: false,
      }),
    }
  );

  const data = await response.json();
  if (!data.success) {
    throw new Error(data.errors?.[0]?.message || 'Failed to create Cloudflare Stream upload URL');
  }

  return {
    uploadUrl: data.result.uploadURL,
    uid: data.result.uid,
  };
}

/**
 * Returns stream playback URL for Cloudflare Stream / HTML5 video player
 */
export function getStreamPlaybackUrl(uid: string): string {
  // If live Cloudflare Stream account is configured and not a mock/demo UID
  if (
    process.env.CLOUDFLARE_ACCOUNT_ID &&
    process.env.CLOUDFLARE_STREAM_API_TOKEN &&
    !uid.startsWith('mock_') &&
    !uid.startsWith('bantu_') &&
    !uid.startsWith('web_') &&
    !uid.startsWith('reader_') &&
    !uid.startsWith('stream_cf_')
  ) {
    return `https://videodelivery.net/${uid}/manifest/video.m3u8`;
  }

  // Reliable, high-definition CDN streaming URLs for curated BookTok dispatches
  const streamMap: Record<string, string> = {
    bantu_mythology_reel_01: 'https://vjs.zencdn.net/v/oceans.mp4',
    web_du_bois_quotes_02: 'https://media.w3.org/2010/05/sintel/trailer.mp4',
    reader_mode_showcase_03: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
    stream_cf_mythology_01: 'https://vjs.zencdn.net/v/oceans.mp4',
  };

  return streamMap[uid] || 'https://vjs.zencdn.net/v/oceans.mp4';
}

