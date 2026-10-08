import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Metadata } from 'next';
import { getBookBySlug, getBooks } from '@/lib/books';

import { MOCK_BOOKS } from '@/lib/mock-data';

export async function generateStaticParams() {
  return MOCK_BOOKS.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const book = await getBookBySlug(slug);
  if (!book) return { title: 'Book Not Found' };

  return {
    title: `${book.title} by ${book.author}`,
    description: book.description,
    openGraph: {
      title: `${book.title} — SuperBooks Reading Platform`,
      description: book.description,
      images: [{ url: book.cover_url }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${book.title} — SuperBooks`,
      description: book.description,
      images: [book.cover_url],
    },
  };
}

export default async function BookDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const book = await getBookBySlug(slug);

  if (!book) {
    notFound();
  }

  const jsonLdBook = {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: book.title,
    author: {
      '@type': 'Person',
      name: book.author,
    },
    description: book.description,
    genre: book.genre,
    inLanguage: book.language,
    numberOfPages: book.page_count,
    isAccessibleForFree: book.is_free,
    license: book.rights_status,
    url: `https://superbooks.vercel.app/books/${book.slug}`,
    workExample: book.chapters?.map((ch) => ({
      '@type': 'Chapter',
      position: ch.number,
      name: ch.title,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBook) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="text-xs font-mono text-[#8E887E] flex items-center gap-2">
        <Link href="/" className="hover:text-[#9E3E26]">Home</Link>
        <span>/</span>
        <Link href="/library" className="hover:text-[#9E3E26]">Library</Link>
        <span>/</span>
        <span className="text-[#1B1A17]">{book.title}</span>
      </nav>

      {/* Book Hero Section */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-12 items-start border-b border-[#DFD5C6] pb-16">
        {/* Cover Column */}
        <div className="md:col-span-5 lg:col-span-4 flex justify-center">
          <div className="relative w-64 sm:w-72 aspect-4/5 bg-[#FFFDF9] border border-[#DFD5C6] shadow-book-spine rounded-xs overflow-hidden">
            <Image
              src={book.cover_url}
              alt={book.title}
              fill
              className="object-cover"
              priority
              sizes="320px"
            />
          </div>
        </div>

        {/* Metadata & Actions Column */}
        <div className="md:col-span-7 lg:col-span-8 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2">
              <span className={`text-xs font-mono uppercase tracking-widest px-2.5 py-0.5 font-bold ${
                book.is_free ? 'bg-[#25473A] text-[#FFFDF9]' : 'bg-[#C68936] text-[#FFFDF9]'
              }`}>
                {book.is_free ? 'Free Full Read' : 'Members / Preview Only'}
              </span>
              <span className="text-xs font-mono text-[#8E887E] uppercase">{book.genre}</span>
            </div>
            
            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-[#1B1A17] leading-tight">
              {book.title}
            </h1>
            <p className="text-lg italic text-[#5C5850]">By {book.author}</p>
          </div>

          <p className="text-base text-[#1B1A17] leading-relaxed max-w-2xl font-normal">
            {book.description}
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <Link
              href={`/read/${book.slug}/1`}
              className="px-8 py-4 bg-[#9E3E26] hover:bg-[#822F1B] text-[#FFFDF9] font-medium tracking-wide text-xs uppercase transition-all shadow-md hover:shadow-lg inline-flex items-center gap-2"
            >
              <span>Open Reader (Chapter 1)</span>
              <span>→</span>
            </Link>

            <Link
              href={`/read/${book.slug}/1?mode=flip`}
              className="px-6 py-4 border border-[#DFD5C6] bg-[#FFFDF9] hover:bg-[#F3ECE1] text-[#1B1A17] font-medium tracking-wide text-xs uppercase transition-colors"
            >
              Launch in Page Flip Mode
            </Link>
          </div>

          {/* Book Fact Sheet */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-[#DFD5C6] text-xs font-mono">
            <div>
              <div className="text-[#8E887E] uppercase">Language</div>
              <div className="font-bold text-[#1B1A17]">{book.language}</div>
            </div>
            <div>
              <div className="text-[#8E887E] uppercase">Page Count</div>
              <div className="font-bold text-[#1B1A17]">{book.page_count} Pages</div>
            </div>
            <div>
              <div className="text-[#8E887E] uppercase">Format</div>
              <div className="font-bold text-[#1B1A17]">{book.file_type.toUpperCase()} / Digital Text</div>
            </div>
            <div>
              <div className="text-[#8E887E] uppercase">Rights Status</div>
              <div className="font-bold text-[#1B1A17] line-clamp-1" title={book.rights_status}>
                {book.rights_status}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chapters Index Section */}
      <section className="space-y-6">
        <div className="border-b border-[#DFD5C6] pb-4 flex justify-between items-baseline">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B1A17]">
            Table of Contents
          </h2>
          <span className="text-xs font-mono text-[#8E887E]">
            {book.chapters?.length || 0} Chapters in Archive
          </span>
        </div>

        <div className="divide-y divide-[#DFD5C6] border border-[#DFD5C6] bg-[#FFFDF9] rounded-xs">
          {book.chapters?.map((chapter) => {
            const isPreviewChapter = chapter.number === 1;
            const isGated = !book.is_free && !isPreviewChapter;

            return (
              <div
                key={chapter.id}
                className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#F9F6F0] transition-colors"
              >
                <div className="space-y-1">
                  <div className="text-xs font-mono text-[#8E887E]">
                    CHAPTER {chapter.number}
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#1B1A17]">
                    {chapter.title}
                  </h3>
                  <div className="text-xs text-[#5C5850]">
                    Approx. {Math.round(chapter.duration_seconds / 60)} min audio narration
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {isGated ? (
                    <span className="text-xs font-mono bg-[#E6DCCE] text-[#5C5850] px-3 py-1 rounded-xs">
                      🔒 Members Only
                    </span>
                  ) : (
                    <span className="text-xs font-mono bg-[#25473A]/10 text-[#25473A] px-3 py-1 rounded-xs font-medium">
                      ✓ Free Reading
                    </span>
                  )}
                  <Link
                    href={`/read/${book.slug}/${chapter.number}`}
                    className="text-xs font-mono uppercase tracking-wider text-[#9E3E26] hover:text-[#822F1B] font-bold px-3 py-1 border border-[#DFD5C6] bg-[#FFFDF9] hover:border-[#9E3E26] transition-colors"
                  >
                    {isGated ? 'Preview / Gate' : 'Read Chapter'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Answer-Style Content Blocks for GEO & AI Search Engines */}
      <section className="border border-[#DFD5C6] bg-[#F3ECE1] p-8 sm:p-12 rounded-xs space-y-8">
        <div className="border-b border-[#DFD5C6] pb-4">
          <span className="text-xs font-mono uppercase tracking-widest text-[#9E3E26]">Editorial Synopsis & Reference</span>
          <h2 className="font-serif text-2xl font-bold text-[#1B1A17] mt-1">
            Critical Context & Reader Notes on {book.title}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-sm text-[#5C5850] leading-relaxed">
          <div>
            <h3 className="font-bold text-[#1B1A17] text-xs uppercase tracking-wider mb-2">Who is this volume for?</h3>
            <p>
              Students, scholars of African literature, historians of sociology, and readers seeking foundational texts that examine identity, racial consciousness, and cultural resilience.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#1B1A17] text-xs uppercase tracking-wider mb-2">Key Themes & Concepts</h3>
            <p>
              Explores double consciousness, the spiritual resilience of marginalized communities, the power of oral narrative, and the struggle for genuine intellectual freedom.
            </p>
          </div>
          <div>
            <h3 className="font-bold text-[#1B1A17] text-xs uppercase tracking-wider mb-2">Format & Reading Advice</h3>
            <p>
              Best experienced with chapter audio enabled at 1.0x to hear the deliberate rhythm of the prose. Switch to Page Flip mode for a tactile, bookshop-like physical sensation.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
