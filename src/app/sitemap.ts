import { MetadataRoute } from 'next';
import { getBooks, getVideos } from '@/lib/books';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superbooks.vercel.app';
  const books = await getBooks();
  const videos = await getVideos();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/library`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/booktok`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/community`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
  ];

  const bookRoutes: MetadataRoute.Sitemap = books.flatMap((book) => {
    const mainBookRoute = {
      url: `${baseUrl}/books/${book.slug}`,
      lastModified: new Date(book.updated_at),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    };

    const chapterRoutes = (book.chapters || []).map((ch) => ({
      url: `${baseUrl}/read/${book.slug}/${ch.number}`,
      lastModified: new Date(ch.created_at),
      changeFrequency: 'monthly' as const,
      priority: ch.number === 1 ? 0.8 : 0.6,
    }));

    return [mainBookRoute, ...chapterRoutes];
  });

  const videoRoutes: MetadataRoute.Sitemap = videos.map((vid) => ({
    url: `${baseUrl}/booktok#${vid.slug}`,
    lastModified: new Date(vid.created_at),
    changeFrequency: 'weekly',
    priority: 0.75,
  }));

  return [...staticRoutes, ...bookRoutes, ...videoRoutes];
}
