'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/app/Components/ui/Navbar';
import FooterSection from '@/app/Components/FooterSection';
import { postsApi } from '@/app/lib/supabase-posts';
import { Clock, Eye, Heart, MessageCircle, User, Calendar } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { sanitizeHTML } from '@/app/lib/utils';

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

export default function FeedPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<PostWithAuthor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setIsLoading(true);
        const publishedPosts = await postsApi.getPublishedPosts(limit, 0);
        setPosts(publishedPosts as PostWithAuthor[]);
        setOffset(limit);
        setHasMore(publishedPosts.length === limit);
      } catch (err) {
        console.error('Error fetching posts:', err);
        setError('Failed to load posts');
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchPosts();
    }
  }, [user]);

  const loadMore = async () => {
    if (isLoadingMore || !hasMore) return;

    try {
      setIsLoadingMore(true);
      const morePosts = await postsApi.getPublishedPosts(limit, offset);
      setPosts(prev => [...prev, ...(morePosts as PostWithAuthor[])]);
      setOffset(prev => prev + limit);
      setHasMore(morePosts.length === limit);
    } catch (err) {
      console.error('Error loading more posts:', err);
      setError('Failed to load more posts');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
  };

  const PostCard = ({ post }: { post: PostWithAuthor }) => (
    <article className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      {/* Author Info */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
          {post.users.avatar_url ? (
            <Image 
              src={post.users.avatar_url} 
              alt={post.users.full_name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <User size={20} className="text-gray-500" />
          )}
        </div>
        <div>
          <p className="font-medium text-[#191b22]">{post.users.full_name}</p>
          <div className="flex items-center gap-2 text-sm text-[#7e828f]">
            <Calendar size={14} />
            <span>{formatDate(post.published_at)}</span>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      {post.featured_image && (
        <div className="mb-4">
          <Image 
            src={post.featured_image} 
            alt={post.title}
            width={200}
            height={100}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>
      )}

      {/* Content */}
      <div className="mb-4">
        <h2 className="text-xl font-bold text-[#191b22] mb-2 hover:text-[#35b8be] transition-colors">
          <Link href={`/post/${post.id}`}>
            {post.title}
          </Link>
        </h2>
        {post.subtitle && (
          <p className="text-lg text-[#7e828f] mb-2">{post.subtitle}</p>
        )}
        <p className="text-[#7e828f] line-clamp-3">
          {post.excerpt || sanitizeHTML(post.content).replace(/<[^>]*>/g, '').substring(0, 200) + '...'}
        </p>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm text-[#7e828f]">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <Clock size={14} />
            <span>{post.reading_time} min read</span>
          </div>
          <div className="flex items-center gap-1">
            <Eye size={14} />
            <span>{post.view_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <Heart size={14} />
            <span>{post.like_count}</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageCircle size={14} />
            <span>{post.comment_count}</span>
          </div>
        </div>
        
        <div className="text-xs">
          {post.word_count.toLocaleString()} words
        </div>
      </div>
    </article>
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-[#7e828f]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar navItems={[]} />
      <main className="flex-1 pt-20 px-6 md:px-12">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-[#191b22] mb-4">Your Feed</h1>
            <p className="text-[#7e828f]">Discover stories from writers you follow and beyond.</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {/* Posts Feed */}
          <div className="space-y-6">
            {isLoading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full animate-pulse" />
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 animate-pulse mb-2" />
                      <div className="h-3 bg-gray-200 rounded w-24 animate-pulse" />
                    </div>
                  </div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-full animate-pulse mb-1" />
                  <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse" />
                </div>
              ))
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-xl font-semibold text-[#191b22] mb-2">No posts yet</h3>
                <p className="text-[#7e828f] mb-6">
                  Be the first to share your story with the world.
                </p>
                <Link 
                  href="/draft"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#35b8be] text-white rounded-full font-medium hover:bg-[#269ba0] transition-colors"
                >
                  Start Writing
                </Link>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {posts.length > 0 && hasMore && (
            <div className="mt-8 text-center">
              <button 
                onClick={loadMore}
                disabled={isLoadingMore}
                className="px-6 py-3 border border-[#35b8be] text-[#35b8be] rounded-full font-medium hover:bg-[#35b8be] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoadingMore ? 'Loading...' : 'Load More Posts'}
              </button>
            </div>
          )}
        </div>
      </main>
      <FooterSection />
    </div>
  );
} 