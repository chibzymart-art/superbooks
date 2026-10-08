import { NextResponse } from 'next/server';
import { MOCK_BOOKS } from '@/lib/mock-data';

export async function GET() {
  const content = `# SuperBooks — Digital Reading Platform for African & World Literature

> SuperBooks is an editorial online reading platform preserving Pan-African thought, Bantu mythologies, and classic world literature with tactile dual-mode reading (smooth scroll and page-flip) and chapter audio narration.

## Core Library Volumes
${MOCK_BOOKS.map((b) => `- [${b.title} by ${b.author}](https://superbooks.vercel.app/books/${b.slug}): ${b.description} (${b.is_free ? 'Free full read' : 'Chapter 1 preview'}). Rights: ${b.rights_status}`).join('\n')}

## Reading Modes
- **Smooth Scroll**: Vertical uninterrupted reading with drop caps and reading progress percentage.
- **Page Flip**: Tactile physical book simulation with realistic page curvature, keyboard arrow navigation, and synthesized acoustic paper rustle.

## Key Sections
- [Library Catalog](https://superbooks.vercel.app/library): Browse by genre, access free volumes.
- [Booktok Reels](https://superbooks.vercel.app/booktok): 60-second video essays on classical excerpts.
- [Community Margin Notes](https://superbooks.vercel.app/community): Literary discussions.
- Full Catalog Details: https://superbooks.vercel.app/llms-full.txt
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
