import { supabase } from '@/app/lib/supabase';
import { postsApi } from '@/app/lib/supabase-posts';
import PostClient from './PostClient';

interface PostWithAuthor {
  id: string;
  title: string;
  subtitle?: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  reading_time: number;
  word_count: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at: string;
  created_at: string;
  updated_at: string;
  users: {
    id: string;
    full_name: string;
    username: string;
    avatar_url?: string;
  };
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    // Fetch the post with author information
    const { data, error } = await supabase
      .from('posts')
      .select(`
        *,
        users!posts_author_id_fkey (
          id,
          full_name,
          username,
          avatar_url
        )
      `)
      .eq('id', id)
      .eq('status', 'published')
      .single();

    if (error || !data) {
      return (
        <div className="min-h-screen flex flex-col">
          <main className="flex-1 pt-20 px-6 md:px-12">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl font-bold text-[#191b22] mb-4">Post Not Found</h1>
              <p className="text-lg text-[#7e828f] mb-8">The post you&apos;re looking for doesn&apos;t exist or has been removed.</p>
              <a 
                href="/feed"
                className="inline-block px-6 py-3 bg-[#35b8be] text-white rounded-full font-medium hover:bg-[#269ba0] transition-colors"
              >
                Back to Feed
              </a>
            </div>
          </main>
        </div>
      );
    }

    // Increment view count
    await postsApi.incrementViewCount(id);

    return <PostClient post={data as PostWithAuthor} />;
  } catch (err) {
    console.error('Error fetching post:', err);
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pt-20 px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-[#191b22] mb-4">Error Loading Post</h1>
            <p className="text-lg text-[#7e828f] mb-8">Failed to load the post. Please try again later.</p>
            <a 
              href="/feed"
              className="inline-block px-6 py-3 bg-[#35b8be] text-white rounded-full font-medium hover:bg-[#269ba0] transition-colors"
            >
              Back to Feed
            </a>
          </div>
        </main>
      </div>
    );
  }
} 