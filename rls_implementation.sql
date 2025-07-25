-- Quote Platform - Row Level Security (RLS) Implementation
-- This script enables RLS on all tables and creates appropriate security policies

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY ON ALL TABLES
-- ============================================================================

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Enable RLS on posts table
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- USERS TABLE POLICIES
-- ============================================================================

-- Policy: Users can read their own profile
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Policy: Users can insert their own profile (during signup)
CREATE POLICY "Users can insert own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Policy: Public can read basic user info for published posts
CREATE POLICY "Public can view user info for published posts" ON users
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM posts 
            WHERE posts.author_id = users.id 
            AND posts.status = 'published'
        )
    );

-- ============================================================================
-- POSTS TABLE POLICIES
-- ============================================================================

-- Policy: Authors can view their own posts (drafts and published)
CREATE POLICY "Authors can view own posts" ON posts
    FOR SELECT USING (auth.uid() = author_id);

-- Policy: Authors can create their own posts
CREATE POLICY "Authors can create own posts" ON posts
    FOR INSERT WITH CHECK (auth.uid() = author_id);

-- Policy: Authors can update their own posts
CREATE POLICY "Authors can update own posts" ON posts
    FOR UPDATE USING (auth.uid() = author_id);

-- Policy: Authors can delete their own posts
CREATE POLICY "Authors can delete own posts" ON posts
    FOR DELETE USING (auth.uid() = author_id);

-- Policy: Public can view published posts
CREATE POLICY "Public can view published posts" ON posts
    FOR SELECT USING (status = 'published');

-- ============================================================================
-- FUNCTION TO INCREMENT VIEW COUNT SECURELY
-- ============================================================================

-- Create a secure function to increment view count
CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Only increment for published posts
    UPDATE posts 
    SET view_count = view_count + 1
    WHERE id = post_id 
    AND status = 'published';
    
    -- Return void if no rows were updated (post doesn't exist or not published)
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Post not found or not published';
    END IF;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;

-- ============================================================================
-- TRIGGER TO AUTO-CREATE USER PROFILE ON SIGNUP
-- ============================================================================

-- Create a trigger function to automatically create user profile
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO users (id, email, full_name, username, avatar_url, created_at, updated_at)
    VALUES (
        NEW.id,
        NEW.email,
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
        NEW.raw_user_meta_data->>'avatar_url',
        NOW(),
        NOW()
    );
    RETURN NEW;
END;
$$;

-- Create trigger on auth.users table
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if RLS is enabled on tables
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename IN ('users', 'posts')
ORDER BY tablename;

-- Check existing policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename IN ('users', 'posts')
ORDER BY tablename, policyname;
