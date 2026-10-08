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
 * Returns stream playback URL for Cloudflare Stream iframe / HLS player
 */
export function getStreamPlaybackUrl(uid: string): string {
  if (uid.startsWith('mock_')) {
    // Return sample literary stock video for testing
    return 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-and-leafing-through-a-book-42548-large.mp4';
  }
  return `https://iframe.videodelivery.net/${uid}`;
}
