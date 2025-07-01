'use client';

import { useAuth } from '@/app/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import Navbar from '@/app/Components/ui/Navbar';
import FooterSection from '@/app/Components/FooterSection';
import TipTapEditor from '@/app/Components/ui/TipTapEditor';
import { Save, Eye, Send, AlertCircle, CheckCircle } from 'lucide-react';
import { postsApi, AutoSave, Post } from '@/app/lib/supabase-posts';

export default function DraftPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [currentPost, setCurrentPost] = useState<Post | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const autoSaveRef = useRef<AutoSave | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  // Initialize auto-save when user is available
  useEffect(() => {
    if (user && !autoSaveRef.current) {
      autoSaveRef.current = new AutoSave(
        user.id,
        currentPost?.id || null,
        (post) => {
          setCurrentPost(post);
          setLastSaved(new Date());
          setSaveStatus('saved');
          setTimeout(() => setSaveStatus('idle'), 3000);
        },
        (error) => {
          console.error('Auto-save error:', error);
          setSaveStatus('error');
          setErrorMessage(error.message);
          setTimeout(() => setSaveStatus('idle'), 5000);
        }
      );
    }

    return () => {
      if (autoSaveRef.current) {
        autoSaveRef.current.cancel();
      }
    };
  }, [user, currentPost?.id]);

  // Auto-save when title or content changes
  useEffect(() => {
    if (autoSaveRef.current && user && (title.trim() || content.trim())) {
      setSaveStatus('saving');
      autoSaveRef.current.save(title, content, 2000);
    }
  }, [title, content, user]);

  const handleManualSave = async () => {
    if (!user || (!title.trim() && !content.trim())) return;

    setIsSaving(true);
    setSaveStatus('saving');
    
    try {
      const post = await postsApi.saveDraft(user.id, {
        title: title.trim() || 'Untitled',
        content,
        postId: currentPost?.id
      });
      
      setCurrentPost(post);
      setLastSaved(new Date());
      setSaveStatus('saved');
      setErrorMessage('');
      
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (error) {
      console.error('Error saving draft:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!user || !title.trim()) {
      setErrorMessage('Please add a title before publishing');
      return;
    }

    if (!currentPost) {
      setErrorMessage('Please save your draft before publishing');
      return;
    }
    
    try {
      setSaveStatus('saving');
      const publishedPost = await postsApi.publishDraft(currentPost.id, user.id);
      
      setCurrentPost(publishedPost);
      setSaveStatus('saved');
      setErrorMessage('');
      
      // Redirect to the published post or feed
      router.push('/feed');
    } catch (error) {
      console.error('Error publishing post:', error);
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to publish post');
    }
  };

  const getSaveStatusIcon = () => {
    switch (saveStatus) {
      case 'saving':
        return <div className="w-4 h-4 border-2 border-[#35b8be] border-t-transparent rounded-full animate-spin" />;
      case 'saved':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'error':
        return <AlertCircle size={16} className="text-red-500" />;
      default:
        return null;
    }
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return 'Saving...';
      case 'saved':
        return 'Saved';
      case 'error':
        return 'Save failed';
      default:
        return lastSaved ? `Last saved: ${lastSaved.toLocaleTimeString()}` : 'Not saved';
    }
  };

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
            <h1 className="text-3xl font-bold text-[#191b22] mb-4">Start Writing</h1>
            <p className="text-[#7e828f]">Write hard. Write true.</p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            </div>
          )}

          {/* Title Input */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Enter your title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl font-bold text-[#191b22] bg-transparent border-none outline-none placeholder:text-[#7e828f] placeholder:font-normal"
            />
          </div>

          {/* Editor */}
          <div className="mb-8">
            <TipTapEditor
              content={content}
              onSave={(editorContent) => setContent(editorContent)}
              placeholder="Start writing your story..."
              className="min-h-[600px]"
            />
          </div>

          {/* Action Bar */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-[#7e828f]">
                {getSaveStatusIcon()}
                <span>{getSaveStatusText()}</span>
              </div>
              
              {currentPost && (
                <span className="text-sm text-[#7e828f]">
                  Post ID: {currentPost.id.slice(0, 8)}...
                </span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <button
                onClick={handleManualSave}
                disabled={isSaving || saveStatus === 'saving'}
                className="flex items-center gap-2 px-4 py-2 text-[#7e828f] hover:text-[#191b22] transition-colors disabled:opacity-50"
              >
                <Save size={16} />
                {isSaving ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                onClick={() => console.log('Preview functionality coming soon')}
                className="flex items-center gap-2 px-4 py-2 text-[#7e828f] hover:text-[#191b22] transition-colors"
              >
                <Eye size={16} />
                Preview
              </button>
              
              <button
                onClick={handlePublish}
                disabled={!title.trim() || !currentPost || saveStatus === 'saving'}
                className="flex items-center gap-2 px-6 py-2 bg-[#35b8be] text-white rounded-full font-medium hover:bg-[#269ba0] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={16} />
                Publish
              </button>
            </div>
          </div>
        </div>
      </main>
      <FooterSection />
    </div>
  );
} 