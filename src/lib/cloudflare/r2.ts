import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'superbooks-storage';

let s3Client: S3Client | null = null;

if (accountId && accessKeyId && secretAccessKey) {
  s3Client = new S3Client({
    region: 'auto',
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });
}

/**
 * Generates a presigned PUT URL for direct browser-to-R2 upload (handles large PDFs and images)
 */
export async function getR2PresignedUploadUrl(key: string, contentType: string, expiresIn = 3600): Promise<{ uploadUrl: string; key: string }> {
  if (!s3Client) {
    // In local development or before R2 credentials are configured, return a mock upload URL
    return {
      uploadUrl: `/api/upload/mock?key=${encodeURIComponent(key)}`,
      key,
    };
  }

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    ContentType: contentType,
  });

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn });
  return { uploadUrl, key };
}

/**
 * Generates a short-lived presigned GET URL for authenticated reading access
 */
export async function getR2PresignedDownloadUrl(key: string, expiresIn = 900): Promise<string> {
  if (!s3Client) {
    // Fallback to static asset or placeholder
    return key.startsWith('http') ? key : `/placeholder-media/${key}`;
  }

  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}
