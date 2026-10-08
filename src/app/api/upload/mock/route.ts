import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
  try {
    const key = req.nextUrl.searchParams.get('key') || 'mock-file';
    const blob = await req.blob();

    return NextResponse.json({
      success: true,
      destination: 'cloudflare-r2',
      key,
      bytesReceived: blob.size,
      message: 'Direct Cloudflare R2 upload simulated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PUT(req);
}
