import Link from 'next/link';
import Image from 'next/image';
import { getBooks } from '@/lib/books';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Library Catalog — Browse African & World Literature',
  description: 'Search and filter the complete collection of African and world literature on SuperBooks. Access full free volumes and chapter previews.',
};

export default async function LibraryPage({
  searchParams,
}: {
  searchParams: Promise<{ genre?: string; q?: string; free?: string }>;
}) {
  const params = await searchParams;
  const selectedGenre = params.genre || 'All';
  const query = params.q || '';
  const isFreeOnly = params.free === 'true';

  const books = await getBooks({
    genre: selectedGenre !== 'All' ? selectedGenre : undefined,
    query: query || undefined,
    isFree: isFreeOnly ? true : undefined,
  });

  const genres = [
    'All',
    'Pan-African & Social Thought',
    'African Folklore & Mythology',
    'Historical Autobiography',
    'Philosophy & Poetry',
    'Classic Literature & Romance',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="border-b border-[#DFD5C6] pb-8 space-y-4">
        <div className="inline-flex items-center gap-2 border border-[#DFD5C6] bg-[#F3ECE1] px-3 py-1 text-xs font-mono tracking-widest uppercase text-[#5C5850]">
          <span>Archive Catalog</span>
          <span className="text-[#9E3E26]">/</span>
          <span>{books.length} Works Available</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#1B1A17]">
          The SuperBooks Library
        </h1>
        <p className="text-base text-[#5C5850] max-w-2xl leading-relaxed">
          Delve into our curated collection. Every public domain volume is free for instant reading without account creation; premium selections offer complete first-chapter previews.
        </p>
      </div>

      {/* Filter and Search Controls */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center bg-[#F3ECE1] p-4 border border-[#DFD5C6] rounded-xs">
        {/* Genre Pill Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-xs font-mono text-[#8E887E] mr-2 uppercase">Genre:</span>
          {genres.map((g) => {
            const isActive = selectedGenre === g;
            return (
              <Link
                key={g}
                href={`/library?genre=${encodeURIComponent(g)}${isFreeOnly ? '&free=true' : ''}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                className={`text-xs px-3 py-1.5 transition-colors font-medium ${
                  isActive
                    ? 'bg-[#1B1A17] text-[#FFFDF9]'
                    : 'bg-[#FFFDF9] text-[#1B1A17] border border-[#DFD5C6] hover:border-[#1B1A17]'
                }`}
              >
                {g}
              </Link>
            );
          })}
        </div>

        {/* Free Toggle and Search */}
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link
            href={`/library?genre=${encodeURIComponent(selectedGenre)}${isFreeOnly ? '' : '&free=true'}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
            className={`text-xs px-3 py-1.5 border transition-colors font-mono uppercase whitespace-nowrap ${
              isFreeOnly
                ? 'bg-[#25473A] text-[#FFFDF9] border-[#25473A]'
                : 'bg-[#FFFDF9] text-[#5C5850] border-[#DFD5C6] hover:border-[#25473A]'
            }`}
          >
            {isFreeOnly ? '✓ Free Books Only' : 'Filter: Free Only'}
          </Link>
        </div>
      </div>

      {/* Books Grid */}
      {books.length === 0 ? (
        <div className="bg-[#FFFDF9] border border-[#DFD5C6] p-12 text-center space-y-4">
          <h3 className="font-serif text-2xl font-bold text-[#1B1A17]">No volumes matched your inquiry</h3>
          <p className="text-sm text-[#5C5850]">
            Try adjusting your genre filter or clearing the search parameter to explore the full archive.
          </p>
          <Link
            href="/library"
            className="inline-block px-4 py-2 bg-[#9E3E26] text-[#FFFDF9] text-xs font-mono uppercase tracking-wider"
          >
            Reset Filters
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map((book) => (
            <article
              key={book.id}
              className="group bg-[#FFFDF9] border border-[#DFD5C6] p-6 rounded-xs shadow-book-spine hover:-translate-y-1 transition-all flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="relative aspect-4/5 w-full overflow-hidden bg-[#F3ECE1] border border-[#DFD5C6]">
                  <Image
                    src={book.cover_url}
                    alt={book.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 350px"
                  />
                  <div className="absolute top-2 left-2">
                    <span className={`text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 font-bold ${
                      book.is_free ? 'bg-[#25473A] text-[#FFFDF9]' : 'bg-[#C68936] text-[#FFFDF9]'
                    }`}>
                      {book.is_free ? 'Free Complete Read' : 'Chapter 1 Preview'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="text-[11px] font-mono text-[#8E887E] uppercase tracking-wider">
                    {book.genre}
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#1B1A17] group-hover:text-[#9E3E26] transition-colors">
                    <Link href={`/books/${book.slug}`}>
                      {book.title}
                    </Link>
                  </h3>
                  <p className="text-sm italic text-[#5C5850]">By {book.author}</p>
                </div>

                <p className="text-xs text-[#5C5850] line-clamp-3 leading-relaxed">
                  {book.description}
                </p>

                <div className="text-[11px] font-mono text-[#8E887E] pt-2 border-t border-[#DFD5C6]/60">
                  Rights: {book.rights_status}
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-[#DFD5C6] flex items-center justify-between">
                <span className="text-xs font-mono text-[#8E887E]">
                  {book.page_count} pages • {book.file_type.toUpperCase()}
                </span>
                <Link
                  href={`/books/${book.slug}`}
                  className="text-xs uppercase tracking-widest font-semibold text-[#9E3E26] hover:text-[#822F1B] transition-colors"
                >
                  Read Book →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
