export type CompressionStage =
  | 'idle'
  | 'analyzing'
  | 'extracting'
  | 'optimizing-images'
  | 'minifying-markup'
  | 'transcoding-frames'
  | 'mixing-audio'
  | 'reassembling'
  | 'verifying'
  | 'completed'
  | 'failed';

export interface CompressionProgress {
  stage: CompressionStage;
  percent: number; // 0 to 100
  message: string;
  currentStep?: string;
  processedBytes: number;
  totalBytes: number;
  elapsedSeconds: number;
  estimatedRemainingSeconds?: number;
}

export interface CompressionResult {
  fileName: string;
  fileType: 'book' | 'video' | 'cover' | 'audio';
  originalSizeBytes: number;
  compressedSizeBytes: number;
  compressionRatio: number; // percentage saved, e.g. 91.5
  targetCeilingBytes: number; // 1MB (1,048,576) or 50MB (52,428,800)
  isCompliant: boolean;
  durationMs: number;
  blob: Blob;
  downloadUrl: string;
  previewUrl?: string;
  metadata: {
    format: string;
    originalDimensions?: { width: number; height: number };
    compressedDimensions?: { width: number; height: number };
    itemCount?: number;
    framesProcessed?: number;
    bitrateKbps?: number;
    warnings?: string[];
  };
}

export const BOOK_CEILING_BYTES = 1024 * 1024; // 1,048,576 bytes = 1 MB max
export const VIDEO_CEILING_BYTES = 50 * 1024 * 1024; // 52,428,800 bytes = 50 MB max
