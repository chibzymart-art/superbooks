import { Metadata } from 'next';
import { getCommunityPosts } from '@/lib/books';
import { CommunityView } from '@/components/community/CommunityView';

export const metadata: Metadata = {
  title: 'Community Discussions — Literary Dialogue & Notes',
  description: 'Join the SuperBooks community in thoughtful conversations about African literature, philosophy, and history.',
};

export default async function CommunityPage() {
  const posts = await getCommunityPosts();

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <CommunityView initialPosts={posts} />
    </div>
  );
}
