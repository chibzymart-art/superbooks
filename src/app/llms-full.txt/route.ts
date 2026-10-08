import { NextResponse } from 'next/server';
import { MOCK_BOOKS } from '@/lib/mock-data';

export async function GET() {
  let content = `# SuperBooks Comprehensive Index & Text Transcripts (llms-full.txt)

This document contains deep metadata, chapter titles, and preview passages for LLM indexing engines.

`;

  for (const book of MOCK_BOOKS) {
    content += `## ${book.title}\n`;
    content += `- Author: ${book.author}\n`;
    content += `- Genre: ${book.genre}\n`;
    content += `- Rights Status: ${book.rights_status}\n`;
    content += `- Free Status: ${book.is_free ? 'Full Book Free' : 'Chapter 1 Preview Free'}\n`;
    content += `- Page Count: ${book.page_count}\n`;
    content += `- Summary: ${book.description}\n`;
    content += `- Chapters:\n`;
    for (const ch of book.chapters || []) {
      content += `  - Chapter ${ch.number}: ${ch.title} (Duration: ${Math.round(ch.duration_seconds / 60)} min)\n`;
      if (ch.content_html) {
        const cleanExcerpt = ch.content_html.replace(/<[^>]*>?/gm, ' ').slice(0, 300);
        content += `    Excerpt: "${cleanExcerpt}..."\n`;
      }
    }
    content += `\n---\n\n`;
  }

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}
