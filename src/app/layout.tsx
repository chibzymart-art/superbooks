import type { Metadata } from 'next';
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google';
import Link from 'next/link';
import './globals.css';

const newsreader = Newsreader({
  variable: '--font-serif',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: '--font-sans',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    template: '%s | SuperBooks',
    default: 'SuperBooks — The Editorial Reading Platform for African & World Literature',
  },
  description: 'Immerse in timeless literature from the African continent and diaspora. Featuring dual reading modes, physical page flip, chapter audio narration, and short-form Booktok reflections.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://superbooks.vercel.app'),
  keywords: [
    'African literature',
    'online book reader',
    'page flip reader',
    'audiobook player',
    'Pan-African thought',
    'Bantu folklore',
    'W.E.B. Du Bois',
    'free classic books',
    'Booktok literature',
  ],
  authors: [{ name: 'SuperBooks Editorial Studio' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://superbooks.vercel.app',
    siteName: 'SuperBooks',
    title: 'SuperBooks — Handcrafted Reading Platform for African & World Literature',
    description: 'Read full public domain classics and preview premium titles with tactile page-flip physics and human-speed audio narration.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&h=630&q=85',
        width: 1200,
        height: 630,
        alt: 'SuperBooks Editorial Reading Experience',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SuperBooks — African & World Literature Reading Platform',
    description: 'Read full public domain classics with tactile page-flip physics and human-speed audio narration.',
    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&h=630&q=85'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLdOrg = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'SuperBooks',
    url: 'https://superbooks.vercel.app',
    logo: 'https://superbooks.vercel.app/icon.png',
    description: 'A production book reading platform celebrating Pan-African and world literature.',
  };

  const jsonLdWebSite = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'SuperBooks',
    url: 'https://superbooks.vercel.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://superbooks.vercel.app/library?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <html lang="en" className={`${newsreader.variable} ${plusJakartaSans.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#1B1A17] selection:bg-[#9E3E26] selection:text-[#FFFDF9]">
        {/* Editorial Top Utility Bar */}
        <div className="border-b border-[#DFD5C6] bg-[#F3ECE1] py-1.5 px-4 text-xs tracking-wider uppercase flex justify-between items-center text-[#5C5850]">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#9E3E26]" />
            <span>Vol. 2026 • Literary Gazette & Reading Room</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="hidden sm:inline">Direct browser presigned reading</span>
            <Link href="/library" className="hover:text-[#9E3E26] transition-colors underline decoration-[#9E3E26]/40">
              Browse 5 Curated Classics
            </Link>
          </div>
        </div>

        {/* Studio Editorial Header */}
        <header className="border-b border-[#DFD5C6] bg-[#F9F6F0]/95 backdrop-blur-xs sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-baseline gap-2 group">
              <span className="font-serif text-3xl font-bold tracking-tight text-[#1B1A17] group-hover:text-[#9E3E26] transition-colors">
                SuperBooks<span className="text-[#9E3E26]">.</span>
              </span>
              <span className="text-[11px] font-mono tracking-widest text-[#8E887E] uppercase hidden md:inline">
                Reading Studio
              </span>
            </Link>

            {/* Navigation Links */}
            <nav className="flex items-center gap-6 sm:gap-8 text-sm font-medium tracking-wide">
              <Link href="/library" className="text-[#1B1A17] hover:text-[#9E3E26] transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#9E3E26] hover:after:w-full after:transition-all">
                Library
              </Link>
              <Link href="/booktok" className="text-[#1B1A17] hover:text-[#9E3E26] transition-colors py-1 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#9E3E26] animate-pulse" />
                <span>Booktok</span>
              </Link>
              <Link href="/community" className="text-[#5C5850] hover:text-[#1B1A17] transition-colors hidden sm:inline">
                Discussions
              </Link>
              <Link href="/admin" className="text-[#5C5850] hover:text-[#1B1A17] transition-colors text-xs font-mono border border-[#DFD5C6] px-2.5 py-1 rounded-sm bg-[#F3ECE1] hover:border-[#1B1A17]">
                Admin
              </Link>
              <Link
                href="/library?free=true"
                className="bg-[#9E3E26] text-[#FFFDF9] px-4 py-2 text-xs uppercase tracking-widest font-semibold hover:bg-[#822F1B] transition-colors shadow-xs"
              >
                Read Free
              </Link>
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Handcrafted Editorial Footer */}
        <footer className="border-t border-[#DFD5C6] bg-[#F3ECE1] mt-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="md:col-span-2 space-y-4">
                <span className="font-serif text-2xl font-bold tracking-tight text-[#1B1A17]">
                  SuperBooks<span className="text-[#9E3E26]">.</span>
                </span>
                <p className="text-sm text-[#5C5850] max-w-md leading-relaxed">
                  A sanctuary for deliberate reading. We restore, curate, and present literature from Africa and across the world with tangible typography, acoustic page turns, and per-chapter narration.
                </p>
                <div className="pt-2 text-xs font-mono text-[#8E887E]">
                  Typeset in Newsreader & Plus Jakarta Sans • Built with Next.js, Supabase & Cloudflare R2
                </div>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-[#1B1A17] mb-4">Reading Rooms</h4>
                <ul className="space-y-2 text-sm text-[#5C5850]">
                  <li><Link href="/library" className="hover:text-[#9E3E26]">Complete Library</Link></li>
                  <li><Link href="/library?genre=African+Folklore+%26+Mythology" className="hover:text-[#9E3E26]">African Folklore</Link></li>
                  <li><Link href="/library?genre=Pan-African+%26+Social+Thought" className="hover:text-[#9E3E26]">Pan-African Thought</Link></li>
                  <li><Link href="/booktok" className="hover:text-[#9E3E26]">Vertical Video Feed</Link></li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs uppercase tracking-widest font-bold text-[#1B1A17] mb-4">Platform & Engine</h4>
                <ul className="space-y-2 text-sm text-[#5C5850]">
                  <li><Link href="/llms.txt" className="hover:text-[#9E3E26]">AI Index (llms.txt)</Link></li>
                  <li><Link href="/robots.txt" className="hover:text-[#9E3E26]">Crawler Rules</Link></li>
                  <li><Link href="/sitemap.xml" className="hover:text-[#9E3E26]">XML Sitemap</Link></li>
                  <li><Link href="/admin" className="hover:text-[#9E3E26]">Studio Admin Desk</Link></li>
                </ul>
              </div>
            </div>

            <div className="border-t border-[#DFD5C6] mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-[#8E887E]">
              <p>© 2026 SuperBooks Reading Platform. Public domain works curated with care.</p>
              <p className="mt-2 sm:mt-0 font-serif italic">“Between me and the other world there is ever an unasked question.”</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
