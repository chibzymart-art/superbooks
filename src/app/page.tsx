import Link from 'next/link';
import Image from 'next/image';
import { getBooks, getVideos } from '@/lib/books';

export default async function HomePage() {
  const books = await getBooks();
  const videos = await getVideos();
  const featuredBook = books[0];
  const secondaryBooks = books.slice(1, 4);

  return (
    <div className="space-y-24 sm:space-y-32">
      {/* 1. EDITORIAL HERO */}
      <section className="relative pt-12 sm:pt-20 pb-16 overflow-hidden border-b border-[#DFD5C6]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Column: Asymmetric Editorial Copy */}
            <div className="lg:col-span-7 space-y-8">
              <div className="inline-flex items-center gap-2 border border-[#DFD5C6] bg-[#F3ECE1] px-3.5 py-1 text-xs font-mono tracking-widest uppercase text-[#5C5850]">
                <span>African & World Diaspora Literature</span>
                <span className="text-[#9E3E26]">/</span>
                <span>Open Reading Sanctuary</span>
              </div>

              <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-[#1B1A17] leading-[1.08]">
                Where African <br className="hidden sm:inline" />
                <span className="italic font-normal">thought</span> meets the <br className="hidden sm:inline" />
                tactile <span className="relative inline-block text-[#9E3E26]">
                  printed page
                  <svg className="absolute -bottom-2 left-0 w-full h-3 text-[#9E3E26]" viewBox="0 0 240 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9C50 3 170 3 237 8" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                  </svg>
                </span>.
              </h1>

              <p className="text-lg sm:text-xl text-[#5C5850] max-w-2xl leading-relaxed font-normal">
                SuperBooks is a dedicated reading platform crafted for deliberate attention. Revisit W.E.B. Du Bois, Bantu oral cosmologies, and Frederick Douglass with authentic page-flip physics, audible paper rustle, and synchronized chapter audio.
              </p>

              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <Link
                  href="/books/the-souls-of-black-folk"
                  className="inline-flex justify-center items-center px-8 py-4 bg-[#9E3E26] hover:bg-[#822F1B] text-[#FFFDF9] font-medium tracking-wide text-xs uppercase transition-all shadow-md hover:shadow-lg"
                >
                  Start Reading Free
                </Link>
                <Link
                  href="/library"
                  className="inline-flex justify-center items-center px-8 py-4 border border-[#DFD5C6] bg-[#FFFDF9] hover:bg-[#F3ECE1] text-[#1B1A17] font-medium tracking-wide text-xs uppercase transition-colors"
                >
                  Browse Library ({books.length} Works)
                </Link>
              </div>

              {/* Handcrafted Microcopy Metrics */}
              <div className="pt-6 grid grid-cols-3 gap-6 border-t border-[#DFD5C6] max-w-lg">
                <div>
                  <div className="font-serif text-2xl font-bold text-[#1B1A17]">100%</div>
                  <div className="text-xs text-[#5C5850] uppercase tracking-wider font-mono">Server-Rendered</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#1B1A17]">0</div>
                  <div className="text-xs text-[#5C5850] uppercase tracking-wider font-mono">Sign-up for Free Books</div>
                </div>
                <div>
                  <div className="font-serif text-2xl font-bold text-[#1B1A17]">Dual</div>
                  <div className="text-xs text-[#5C5850] uppercase tracking-wider font-mono">Scroll & Flip Modes</div>
                </div>
              </div>
            </div>

            {/* Right Column: Physical Layered Book Cluster */}
            <div className="lg:col-span-5 relative flex justify-center items-center py-8">
              <div className="relative w-[300px] sm:w-[340px] h-[450px]">
                {/* Background Book 3: Terracotta Vintage Volume */}
                <div className="absolute top-12 -left-8 w-[240px] h-[340px] bg-[#9E3E26] border border-[#DFD5C6] rounded-xs -rotate-8 shadow-book-stacked flex flex-col justify-between p-4 text-[#FFFDF9]/80 font-serif">
                  <div className="text-[10px] font-mono tracking-widest uppercase">Vol. III</div>
                  <div className="text-sm font-bold leading-tight">Narrative of Frederick Douglass</div>
                  <div className="text-[10px] font-mono">1845 Classic</div>
                </div>
                
                {/* Background Book 2: Laurel Green Hardcover */}
                <div className="absolute top-6 left-6 w-[250px] h-[370px] bg-[#25473A] border border-[#DFD5C6] rounded-xs rotate-4 shadow-book-stacked flex flex-col justify-between p-5 text-[#FFFDF9]/90 font-serif">
                  <div className="text-[10px] font-mono tracking-widest uppercase text-[#C68936]">Bantu Lore</div>
                  <div className="text-base font-bold leading-tight">Myths and Legends of the Bantu</div>
                  <div className="text-[10px] font-mono text-[#FFFDF9]/60">Oral Cosmologies</div>
                </div>

                {/* Foreground Hero Book (W.E.B. Du Bois) */}
                <Link
                  href={`/books/${featuredBook.slug}`}
                  className="group absolute top-0 left-0 w-[280px] sm:w-[300px] h-[420px] bg-[#FFFDF9] border border-[#DFD5C6] rounded-xs shadow-book-spine hover:-translate-y-2 transition-transform duration-300 overflow-hidden block z-10"
                >
                  {/* Bookmark Ribbon */}
                  <div className="absolute -top-1 right-6 w-3.5 h-10 bg-[#9E3E26] shadow-sm z-30 rounded-b-xs" />

                  {/* Spine simulated lighting */}
                  <div className="absolute top-0 left-0 bottom-0 w-4 bg-gradient-to-r from-[#1B1A17]/25 via-transparent to-transparent z-20 pointer-events-none" />
                  
                  <div className="relative w-full h-[250px] overflow-hidden bg-[#F3ECE1]">
                    <Image
                      src={featuredBook.cover_url}
                      alt={featuredBook.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                      priority
                      sizes="300px"
                    />
                    <div className="absolute top-3 left-3 bg-[#25473A] text-[#FFFDF9] text-[10px] font-mono uppercase tracking-widest px-2.5 py-0.5 font-bold z-20">
                      Free Volume
                    </div>
                  </div>

                  <div className="p-5 space-y-1.5 bg-[#FFFDF9]">
                    <div className="text-[10px] font-mono text-[#9E3E26] uppercase tracking-widest font-bold">
                      Seminal Pan-African Work
                    </div>
                    <h3 className="font-serif text-xl font-bold text-[#1B1A17] line-clamp-1 group-hover:text-[#9E3E26] transition-colors">
                      {featuredBook.title}
                    </h3>
                    <p className="text-xs italic text-[#5C5850]">By {featuredBook.author}</p>
                    <p className="text-xs text-[#8E887E] line-clamp-2 pt-1 leading-relaxed">
                      {featuredBook.description}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. THE EDITORIAL SHELF: RESTORED WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#DFD5C6] pb-4">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-[#9E3E26]">Selected Archive</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1A17] mt-1">
              Currently on the Reading Table
            </h2>
          </div>
          <Link href="/library" className="mt-4 sm:mt-0 text-xs font-mono font-bold text-[#9E3E26] hover:underline uppercase tracking-widest">
            View All Volumes ({books.length}) →
          </Link>
        </div>

        {/* Asymmetrical Book Grid with Real Spacing Rhythm */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {secondaryBooks.map((book, index) => (
            <article
              key={book.id}
              className={`group flex flex-col justify-between bg-[#FFFDF9] border border-[#DFD5C6] p-6 rounded-xs shadow-book-spine hover:-translate-y-1 transition-all ${
                index === 1 ? 'md:-translate-y-4' : ''
              }`}
            >
              <div className="space-y-4">
                <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#F3ECE1] border border-[#DFD5C6]">
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
              </div>

              <div className="pt-6 mt-6 border-t border-[#DFD5C6] flex items-center justify-between">
                <span className="text-xs font-mono text-[#8E887E]">
                  {book.page_count} pages
                </span>
                <Link
                  href={`/books/${book.slug}`}
                  className="text-xs uppercase tracking-widest font-semibold text-[#9E3E26] hover:text-[#822F1B] transition-colors"
                >
                  Open Reader →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. DUAL READING MODE & AUDIO SHOWCASE */}
      <section className="bg-[#F3ECE1] border-y border-[#DFD5C6] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="text-xs font-mono uppercase tracking-widest text-[#9E3E26]">Reader Mechanics</span>
              <h2 className="font-serif text-3xl sm:text-5xl font-bold text-[#1B1A17] leading-tight">
                Designed for tactile pleasure, not screen fatigue.
              </h2>
              <p className="text-[#5C5850] leading-relaxed text-base">
                Whether you prefer uninterrupted vertical flow or the dimensional rustle of turning paper, SuperBooks remembers your cadence. Switch with a single click, customize typography, and listen to synchronized per-chapter narration.
              </p>

              <div className="space-y-4 pt-2">
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#9E3E26] text-[#FFFDF9] flex items-center justify-center font-serif text-sm font-bold shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1A17] text-sm uppercase tracking-wider">Dual Reading Modes</h4>
                    <p className="text-xs text-[#5C5850] mt-1">Default smooth scroll with drop caps, or switch to realistic touch-friendly StPageFlip with simulated paper physics and acoustic rustle.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#25473A] text-[#FFFDF9] flex items-center justify-center font-serif text-sm font-bold shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1A17] text-sm uppercase tracking-wider">Chapter Audio & Sleep Timer</h4>
                    <p className="text-xs text-[#5C5850] mt-1">Listen to studio recordings or natural Web SpeechSynthesis voice fallback. Variable playback speeds (0.75x to 2x) with auto-resume bookmarks.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-[#C68936] text-[#FFFDF9] flex items-center justify-center font-serif text-sm font-bold shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <h4 className="font-bold text-[#1B1A17] text-sm uppercase tracking-wider">Server-Enforced Access</h4>
                    <p className="text-xs text-[#5C5850] mt-1">Visitors read full free books and chapter 1 preview of premium titles. Assets served only through short-lived presigned tokens.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Reader Preview Mockup */}
            <div className="bg-[#FFFDF9] border border-[#DFD5C6] p-8 shadow-book-spine rounded-xs relative">
              <div className="border-b border-[#DFD5C6] pb-4 mb-6 flex justify-between items-baseline text-xs font-mono text-[#8E887E]">
                <span>CHAPTER I • OF OUR SPIRITUAL STRIVINGS</span>
                <span className="text-[#9E3E26] font-bold">Leaf 1 / 18</span>
              </div>
              
              <div className="font-serif space-y-4 text-[#1B1A17]">
                <p className="drop-cap text-base leading-relaxed">
                  Between me and the other world there is ever an unasked question: unasked by some through feelings of delicacy; by others through the half-embarrassed terror of framing it. All, nevertheless, flutter round it.
                </p>
                <p className="text-sm text-[#5C5850] italic border-l-2 border-[#9E3E26] pl-3 py-1">
                  “How does it feel to be a problem? I answer seldom a word.”
                </p>
              </div>

              {/* Mock Audio Bar */}
              <div className="mt-8 pt-4 border-t border-[#DFD5C6] flex items-center justify-between bg-[#F9F6F0] p-3 rounded-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#9E3E26] text-[#FFFDF9] flex items-center justify-center text-xs font-bold">
                    ▶
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-[#1B1A17]">Audio Narration</div>
                    <div className="text-[10px] text-[#8E887E] font-mono">1.0x • 12:20 remaining</div>
                  </div>
                </div>
                <div className="text-xs font-mono text-[#5C5850]">
                  Sleep Timer: 15m
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. BOOKTOK: VERTICAL VIDEO REELS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 border-b border-[#DFD5C6] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#9E3E26] animate-ping" />
              <span className="text-xs font-mono uppercase tracking-widest text-[#9E3E26]">Booktok Studio</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1A17] mt-1">
              60-Second Literary Dispatches
            </h2>
          </div>
          <Link href="/booktok" className="mt-4 sm:mt-0 text-xs font-mono font-bold text-[#9E3E26] hover:underline uppercase tracking-widest">
            Open Vertical Swipe Feed →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((vid) => (
            <Link
              key={vid.id}
              href={`/booktok#${vid.slug}`}
              className="group relative aspect-[9/16] rounded-xs overflow-hidden border border-[#DFD5C6] shadow-book-spine bg-[#1B1A17] flex flex-col justify-end p-6 text-[#FFFDF9]"
            >
              {/* Background preview image */}
              <div className="absolute inset-0 opacity-50 group-hover:scale-105 transition-transform duration-700 bg-gradient-to-t from-[#1B1A17] via-[#1B1A17]/60 to-transparent">
                <Image
                  src="https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80"
                  alt={vid.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Overlay Content */}
              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-2 bg-[#9E3E26] text-[#FFFDF9] text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 font-bold">
                  <span>Episode {vid.episode_number}</span>
                </div>
                <h3 className="font-serif text-lg font-bold leading-snug group-hover:text-[#C68936] transition-colors">
                  {vid.title}
                </h3>
                <p className="text-xs text-[#DFD5C6] line-clamp-2">
                  {vid.description}
                </p>
                <div className="pt-2 flex items-center justify-between text-xs font-mono text-[#8E887E]">
                  <span>{vid.author_name}</span>
                  <span>{vid.view_count.toLocaleString()} plays</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. AI ENGINE & GEO ANSWER BLOCK */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-[#DFD5C6] bg-[#F3ECE1] p-8 sm:p-12 rounded-xs space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono uppercase tracking-widest text-[#9E3E26]">Reader Reference & FAQ</span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#1B1A17]">
            Understanding SuperBooks: Origins, Rights, and Reading Mechanics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-[#5C5850] leading-relaxed">
            <div>
              <h4 className="font-bold text-[#1B1A17] mb-2 uppercase text-xs tracking-wider">What is SuperBooks?</h4>
              <p>
                SuperBooks is an independent digital reading platform dedicated to preserving and celebrating historical and contemporary African and world literature. Every title is presented with thoughtful typesetting, dual reading modes (continuous scroll or physical page turns), and chapter audio narration.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-[#1B1A17] mb-2 uppercase text-xs tracking-wider">How are book rights handled?</h4>
              <p>
                Public domain works (such as W.E.B. Du Bois, Bantu oral histories, and Frederick Douglass) are 100% free to read without registration. Contemporary and licensed titles provide full Chapter 1 reading previews, with server-verified access for subsequent chapters.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
