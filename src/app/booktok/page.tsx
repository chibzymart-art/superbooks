import { Metadata } from 'next';
import { getVideos } from '@/lib/books';
import { BooktokFeed } from '@/components/booktok/BooktokFeed';

export const metadata: Metadata = {
  title: 'Booktok — 60-Second Literary Dispatches & Epistles',
  description: 'Experience vertical video reflections, author deep-dives, and book summaries from the SuperBooks editorial studio.',
};

export default async function BooktokPage() {
  const videos = await getVideos();

  const jsonLdVideos = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: videos.map((vid, index) => ({
      '@type': 'VideoObject',
      position: index + 1,
      name: vid.title,
      description: vid.description,
      thumbnailUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80',
      uploadDate: vid.created_at,
    })),
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdVideos) }}
      />

      <div className="text-center space-y-2 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 border border-[#DFD5C6] bg-[#F3ECE1] px-3 py-1 text-xs font-mono tracking-widest uppercase text-[#5C5850]">
          <span className="w-2 h-2 rounded-full bg-[#9E3E26] animate-pulse" />
          <span>Vertical Feed</span>
          <span className="text-[#9E3E26]">/</span>
          <span>Cloudflare Stream</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#1B1A17]">
          SuperBooks Booktok
        </h1>
        <p className="text-xs sm:text-sm text-[#5C5850]">
          Short-form video essays exploring classic passages, trickster allegories, and the craft of tactile reading.
        </p>
      </div>

      <BooktokFeed videos={videos} />
    </div>
  );
}
