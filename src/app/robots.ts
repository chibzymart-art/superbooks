import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://superbooks.vercel.app';

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/upload'],
      },
      // Explicitly allow AI Engine Bots & LLM Web Crawlers
      {
        userAgent: [
          'GPTBot',
          'OAI-SearchBot',
          'ClaudeBot',
          'PerplexityBot',
          'Google-Extended',
          'Applebot-Extended',
          'cohere-ai',
        ],
        allow: ['/', '/books/', '/library', '/booktok', '/llms.txt', '/llms-full.txt'],
        disallow: ['/admin', '/api/upload'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
