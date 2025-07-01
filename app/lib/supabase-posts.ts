import { supabase } from './supabase';

// TypeScript types for our database
export interface Post {
  id: string;
  author_id: string;
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published';
  is_featured: boolean;
  is_editors_pick: boolean;
  reading_time: number;
  word_count: number;
  view_count: number;
  like_count: number;
  comment_count: number;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  subtitle?: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  status: 'draft' | 'published';
}

export interface UpdatePostData {
  title?: string;
  subtitle?: string;
  content?: string;
  excerpt?: string;
  featured_image?: string;
  status?: 'draft' | 'published';
}

// Calculate reading time and word count
const calculateReadingStats = (content: string) => {
  // Remove HTML tags for word count
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent.split(' ').length;
  
  // Average reading speed: 200-250 words per minute
  const readingTime = Math.ceil(wordCount / 225);
  
  return { wordCount, readingTime };
};

// Generate excerpt from content
const generateExcerpt = (content: string, maxLength: number = 160) => {
  const textContent = content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  if (textContent.length <= maxLength) return textContent;
  return textContent.substring(0, maxLength).trim() + '...';
};

// Posts API
export const postsApi = {
  // Get all posts for a user
  async getUserPosts(userId: string, status?: 'draft' | 'published') {
    let query = supabase
      .from('posts')
      .select('*')
      .eq('author_id', userId)
      .order('updated_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching user posts:', error);
      throw error;
    }
    
    return data as Post[];
  },

  // Get a single post by ID
  async getPost(postId: string) {
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('id', postId)
      .single();

    if (error) {
      console.error('Error fetching post:', error);
      throw error;
    }

    return data as Post;
  },

  // Create a new post (draft or published)
  async createPost(userId: string, postData: CreatePostData): Promise<Post> {
    const { wordCount, readingTime } = calculateReadingStats(postData.content);
    const excerpt = postData.excerpt || generateExcerpt(postData.content);

    const newPost = {
      author_id: userId,
      title: postData.title,
      subtitle: postData.subtitle,
      content: postData.content,
      excerpt,
      featured_image: postData.featured_image,
      status: postData.status,
      reading_time: readingTime,
      word_count: wordCount,
      view_count: 0,
      like_count: 0,
      comment_count: 0,
      is_featured: false,
      is_editors_pick: false,
      ...(postData.status === 'published' && { published_at: new Date().toISOString() })
    };

    const { data, error } = await supabase
      .from('posts')
      .insert(newPost)
      .select()
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }

    return data as Post;
  },

  // Update an existing post
  async updatePost(postId: string, userId: string, updates: UpdatePostData): Promise<Post> {
    // Verify the post belongs to the user
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id, author_id')
      .eq('id', postId)
      .single();

    if (!existingPost || existingPost.author_id !== userId) {
      throw new Error('Post not found or access denied');
    }

    const updateData: Partial<Post> & { published_at?: string } = { ...updates };

    // Recalculate stats if content changed
    if (updates.content) {
      const { wordCount, readingTime } = calculateReadingStats(updates.content);
      updateData.word_count = wordCount;
      updateData.reading_time = readingTime;
      updateData.excerpt = updates.excerpt || generateExcerpt(updates.content);
    }

    // Set published_at if status changes to published
    if (updates.status === 'published') {
      updateData.published_at = new Date().toISOString();
    }

    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', postId)
      .select()
      .single();

    if (error) {
      console.error('Error updating post:', error);
      throw error;
    }

    return data as Post;
  },

  // Save draft (create or update)
  async saveDraft(userId: string, draftData: { title: string; content: string; postId?: string }): Promise<Post> {
    if (draftData.postId) {
      // Update existing draft
      return this.updatePost(draftData.postId, userId, {
        title: draftData.title,
        content: draftData.content,
        status: 'draft'
      });
    } else {
      // Create new draft
      return this.createPost(userId, {
        title: draftData.title,
        content: draftData.content,
        status: 'draft'
      });
    }
  },

  // Publish a draft
  async publishDraft(postId: string, userId: string): Promise<Post> {
    return this.updatePost(postId, userId, {
      status: 'published'
    });
  },

  // Delete a post
  async deletePost(postId: string, userId: string): Promise<void> {
    // Verify the post belongs to the user
    const { data: existingPost } = await supabase
      .from('posts')
      .select('id, author_id')
      .eq('id', postId)
      .single();

    if (!existingPost || existingPost.author_id !== userId) {
      throw new Error('Post not found or access denied');
    }

    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', postId);

    if (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Get published posts for feed
  async getPublishedPosts(limit: number = 20, offset: number = 0) {
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
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching published posts:', error);
      throw error;
    }

    return data;
  },

  // Increment view count
  async incrementViewCount(postId: string) {
    const { error } = await supabase.rpc('increment_view_count', { post_id: postId });
    
    if (error) {
      console.error('Error incrementing view count:', error);
      // Don't throw error for view count updates
    }
  }
};

// Auto-save functionality
export class AutoSave {
  private timeoutId: NodeJS.Timeout | null = null;
  private lastSavedContent: string = '';
  private isSaving: boolean = false;

  constructor(
    private userId: string,
    private postId: string | null,
    private onSave: (post: Post) => void,
    private onError: (error: Error) => void
  ) {}

  async save(title: string, content: string, delay: number = 2000) {
    // Clear existing timeout
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    // Don't save if content hasn't changed
    if (content === this.lastSavedContent) {
      return;
    }

    // Set new timeout
    this.timeoutId = setTimeout(async () => {
      if (this.isSaving) return;
      
      this.isSaving = true;
      try {
        const post = await postsApi.saveDraft(this.userId, {
          title,
          content,
          postId: this.postId || undefined
        });
        
        this.lastSavedContent = content;
        this.postId = post.id;
        this.onSave(post);
      } catch (error) {
        this.onError(error as Error);
      } finally {
        this.isSaving = false;
      }
    }, delay);
  }

  cancel() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
      this.timeoutId = null;
    }
  }
} 