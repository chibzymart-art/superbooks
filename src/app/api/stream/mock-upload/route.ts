import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const uid = req.nextUrl.searchParams.get('uid') || `stream_${Date.now()}`;
    const blob = await req.blob();

    return NextResponse.json({
      success: true,
      result: {
        uid,
        creator: 'superbooks-admin',
        readyToStream: true,
        bytesReceived: blob.size,
      },
      message: 'Direct Cloudflare Stream upload simulated successfully.',
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  return POST(req);
}
