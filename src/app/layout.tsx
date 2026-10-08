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

import { SiteHeader } from '@/components/layout/SiteHeader';
import { SiteFooter } from '@/components/layout/SiteFooter';

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
      <body className="min-h-screen flex flex-col bg-[#F9F6F0] text-[#1B1A17] selection:bg-[#9E3E26] selection:text-[#FFFDF9] overflow-x-hidden">
        <SiteHeader />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        <SiteFooter />
      </body>
    </html>
  );
}

