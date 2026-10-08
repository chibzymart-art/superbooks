import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getChapter, canAccessChapter } from '@/lib/books';
import { ReaderView } from '@/components/reader/ReaderView';
import { GatedChapterModal } from '@/components/reader/GatedChapterModal';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; chapter: string }>;
}): Promise<Metadata> {
  const { slug, chapter } = await params;
  const chapterNumber = parseInt(chapter, 10) || 1;
  const data = await getChapter(slug, chapterNumber);

  if (!data || !data.chapter) {
    return { title: 'Chapter Not Found' };
  }

  return {
    title: `${data.chapter.title} — ${data.book.title}`,
    description: `Read Chapter ${chapterNumber} of ${data.book.title} by ${data.book.author} on SuperBooks.`,
  };
}

export default async function ReadChapterPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string; chapter: string }>;
  searchParams: Promise<{ mode?: 'scroll' | 'flip' }>;
}) {
  const { slug, chapter } = await params;
  const sParams = await searchParams;
  const chapterNumber = parseInt(chapter, 10);

  if (isNaN(chapterNumber) || chapterNumber < 1) {
    notFound();
  }

  const data = await getChapter(slug, chapterNumber);
  if (!data || !data.chapter) {
    notFound();
  }

  const { book, chapter: currentChapter } = data;

  // Server-side gating verification (STRICT REQUIREMENT)
  const access = await canAccessChapter(book, chapterNumber);

  if (!access.allowed) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <GatedChapterModal
          bookTitle={book.title}
          bookAuthor={book.author}
          bookSlug={book.slug}
          chapterNumber={chapterNumber}
        />
      </div>
    );
  }

  const totalChapters = book.chapters?.length || 1;

  return (
    <ReaderView
      book={book}
      chapter={currentChapter}
      totalChapters={totalChapters}
      initialMode={sParams.mode === 'flip' ? 'flip' : 'scroll'}
    />
  );
}
