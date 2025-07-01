'use client';

import Navbar from '@/app/Components/ui/Navbar';
import FooterSection from '@/app/Components/FooterSection';
import { Clock, Eye, Heart, MessageCircle, User, Calendar, Share2, Bookmark } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
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

interface PostClientProps {
  post: PostWithAuthor;
}

export default function PostClient({ post }: PostClientProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You could add a toast notification here
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar navItems={[]} />
      <main className="flex-1 pt-20 px-6 md:px-12">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#191b22] mb-4 leading-tight">
              {post.title}
            </h1>
            {post.subtitle && (
              <p className="text-xl text-[#7e828f] mb-6 leading-relaxed">
                {post.subtitle}
              </p>
            )}
            
            {/* Author Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                  {post.users.avatar_url ? (
                    <Image 
                      src={post.users.avatar_url} 
                      alt={post.users.full_name}
                      width={48}
                      height={48}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <User size={24} className="text-gray-500" />
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
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-4 py-2 text-[#7e828f] hover:text-[#191b22] transition-colors"
                >
                  <Share2 size={16} />
                  Share
                </button>
                <button className="flex items-center gap-2 px-4 py-2 text-[#7e828f] hover:text-[#191b22] transition-colors">
                  <Bookmark size={16} />
                  Save
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-6 text-sm text-[#7e828f] border-t border-gray-200 pt-4">
              <div className="flex items-center gap-1">
                <Clock size={14} />
                <span>{post.reading_time} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye size={14} />
                <span>{post.view_count} views</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart size={14} />
                <span>{post.like_count} likes</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageCircle size={14} />
                <span>{post.comment_count} comments</span>
              </div>
              <div className="text-xs">
                {post.word_count.toLocaleString()} words
              </div>
            </div>
          </header>

          {/* Featured Image */}
          {post.featured_image && (
            <div className="mb-8">
              <Image 
                src={post.featured_image} 
                alt={post.title}
                width={800}
                height={400}
                className="w-full h-64 md:h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <div 
              dangerouslySetInnerHTML={{ __html: sanitizeHTML(post.content) }}
              className="text-[#191b22] leading-relaxed"
            />
          </div>

          {/* Footer */}
          <footer className="mt-12 pt-8 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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
                  <p className="font-medium text-[#191b22]">Written by {post.users.full_name}</p>
                  <p className="text-sm text-[#7e828f]">Published on {formatDate(post.published_at)}</p>
                </div>
              </div>
              
              <Link 
                href="/feed"
                className="px-6 py-2 border border-[#35b8be] text-[#35b8be] rounded-full font-medium hover:bg-[#35b8be] hover:text-white transition-colors"
              >
                Back to Feed
              </Link>
            </div>
          </footer>
        </article>
      </main>
      <FooterSection />
    </div>
  );
} 