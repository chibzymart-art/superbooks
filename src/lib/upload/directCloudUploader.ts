import { BOOK_CEILING_BYTES, VIDEO_CEILING_BYTES } from '@/lib/compression/types';

export interface UploadProgress {
  stage: 'initiating' | 'uploading' | 'verifying' | 'completed' | 'failed';
  percent: number; // 0 to 100
  bytesUploaded: number;
  totalBytes: number;
  speedMbps: number;
  destination: 'cloudflare-r2' | 'cloudflare-stream';
  message: string;
}

export interface BookUploadResult {
  success: boolean;
  storagePath: string;
  key: string;
  destination: 'cloudflare-r2';
  bytesUploaded: number;
  publicUrl?: string;
}

export interface VideoUploadResult {
  success: boolean;
  streamUid: string;
  destination: 'cloudflare-stream';
  bytesUploaded: number;
}

/**
 * Uploads a compressed book directly to Cloudflare R2 via presigned PUT URL.
 * Guarantees zero byte relay through Vercel serverless functions.
 */
export async function uploadBookToCloud(
  blob: Blob | File,
  filename: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<BookUploadResult> {
  const totalBytes = blob.size;

  if (totalBytes > BOOK_CEILING_BYTES) {
    throw new Error(
      `Cannot upload: Book size (${(totalBytes / 1024).toFixed(1)} KB) exceeds 1.0 MB ceiling. Compress asset first.`
    );
  }

  const emit = (
    stage: UploadProgress['stage'],
    percent: number,
    bytesUploaded: number,
    speedMbps: number,
    message: string
  ) => {
    if (onProgress) {
      onProgress({
        stage,
        percent,
        bytesUploaded,
        totalBytes,
        speedMbps,
        destination: 'cloudflare-r2',
        message,
      });
    }
  };

  emit('initiating', 5, 0, 0, 'Requesting secure Cloudflare R2 presigned PUT token...');

  // 1. Request presigned upload URL
  const contentType = blob.type || (filename.endsWith('.pdf') ? 'application/pdf' : 'application/epub+zip');
  const presignRes = await fetch('/api/upload/r2-presign', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      contentType,
      sizeBytes: totalBytes,
      assetType: 'book',
    }),
  });

  if (!presignRes.ok) {
    const errorData = await presignRes.json();
    throw new Error(errorData.error || 'Failed to acquire Cloudflare R2 upload URL');
  }

  const { uploadUrl, key, storagePath } = await presignRes.json();

  // 2. Direct browser-to-R2 upload with XHR tracking
  emit('uploading', 10, 0, 0, 'Dispatching bytes directly to Cloudflare R2 edge...');

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', uploadUrl, true);
    xhr.setRequestHeader('Content-Type', contentType);

    const startTime = Date.now();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.min(95, 10 + Math.round((e.loaded / e.total) * 85));
        const elapsedSec = (Date.now() - startTime) / 1000;
        const speedMbps = elapsedSec > 0 ? (e.loaded * 8) / (elapsedSec * 1024 * 1024) : 0;
        emit(
          'uploading',
          percent,
          e.loaded,
          Math.round(speedMbps * 10) / 10,
          `Transmitting: ${(e.loaded / 1024).toFixed(0)} KB / ${(e.total / 1024).toFixed(0)} KB (${speedMbps.toFixed(1)} Mbps)`
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Cloudflare R2 PUT returned status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during direct Cloudflare R2 transmission'));
    xhr.send(blob);
  });

  emit('completed', 100, totalBytes, 0, `Direct-to-R2 storage verified: ${key}`);

  return {
    success: true,
    storagePath: storagePath || key,
    key,
    destination: 'cloudflare-r2',
    bytesUploaded: totalBytes,
  };
}

/**
 * Uploads a standardized video directly to Cloudflare Stream via Direct Creator Upload.
 * Guarantees zero byte relay through Vercel serverless functions.
 */
export async function uploadVideoToCloud(
  blob: Blob | File,
  filename: string,
  onProgress?: (progress: UploadProgress) => void
): Promise<VideoUploadResult> {
  const totalBytes = blob.size;

  if (totalBytes > VIDEO_CEILING_BYTES) {
    throw new Error(
      `Cannot upload: Video size (${(totalBytes / (1024 * 1024)).toFixed(1)} MB) exceeds 50.0 MB ceiling. Standardize asset first.`
    );
  }

  const emit = (
    stage: UploadProgress['stage'],
    percent: number,
    bytesUploaded: number,
    speedMbps: number,
    message: string
  ) => {
    if (onProgress) {
      onProgress({
        stage,
        percent,
        bytesUploaded,
        totalBytes,
        speedMbps,
        destination: 'cloudflare-stream',
        message,
      });
    }
  };

  emit('initiating', 5, 0, 0, 'Acquiring Cloudflare Stream Direct Creator Upload URL...');

  // 1. Request Direct Creator Upload URL
  const streamRes = await fetch('/api/upload/stream-direct', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      filename,
      sizeBytes: totalBytes,
    }),
  });

  if (!streamRes.ok) {
    const errorData = await streamRes.json();
    throw new Error(errorData.error || 'Failed to acquire Cloudflare Stream upload token');
  }

  const { uploadUrl, streamUid } = await streamRes.json();

  // 2. Direct browser-to-Stream upload with XHR tracking
  emit('uploading', 10, 0, 0, 'Streaming chunks directly to Cloudflare global video network...');

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', uploadUrl, true);

    const formData = new FormData();
    formData.append('file', blob, filename);

    const startTime = Date.now();

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.min(95, 10 + Math.round((e.loaded / e.total) * 85));
        const elapsedSec = (Date.now() - startTime) / 1000;
        const speedMbps = elapsedSec > 0 ? (e.loaded * 8) / (elapsedSec * 1024 * 1024) : 0;
        emit(
          'uploading',
          percent,
          e.loaded,
          Math.round(speedMbps * 10) / 10,
          `Streaming: ${(e.loaded / (1024 * 1024)).toFixed(1)} MB / ${(e.total / (1024 * 1024)).toFixed(1)} MB (${speedMbps.toFixed(1)} Mbps)`
        );
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Cloudflare Stream upload returned status ${xhr.status}: ${xhr.statusText}`));
      }
    };

    xhr.onerror = () => reject(new Error('Network error during direct Cloudflare Stream transmission'));
    xhr.send(formData);
  });

  emit('completed', 100, totalBytes, 0, `Direct-to-Stream ingestion confirmed: UID ${streamUid}`);

  return {
    success: true,
    streamUid,
    destination: 'cloudflare-stream',
    bytesUploaded: totalBytes,
  };
}
