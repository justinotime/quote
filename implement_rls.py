import psycopg2
import json
import os
import urllib.parse

def implement_rls_policies(conn):
    """Implement Row Level Security policies on Quote platform tables"""
    
    # RLS implementation SQL commands
    rls_commands = [
        # Enable RLS on tables
        "ALTER TABLE users ENABLE ROW LEVEL SECURITY;",
        "ALTER TABLE posts ENABLE ROW LEVEL SECURITY;",
        
        # Users table policies
        """CREATE POLICY "Users can view own profile" ON users
            FOR SELECT USING (auth.uid() = id);""",
            
        """CREATE POLICY "Users can update own profile" ON users
            FOR UPDATE USING (auth.uid() = id);""",
            
        """CREATE POLICY "Users can insert own profile" ON users
            FOR INSERT WITH CHECK (auth.uid() = id);""",
            
        """CREATE POLICY "Public can view user info for published posts" ON users
            FOR SELECT USING (
                EXISTS (
                    SELECT 1 FROM posts 
                    WHERE posts.author_id = users.id 
                    AND posts.status = 'published'
                )
            );""",
        
        # Posts table policies
        """CREATE POLICY "Authors can view own posts" ON posts
            FOR SELECT USING (auth.uid() = author_id);""",
            
        """CREATE POLICY "Authors can create own posts" ON posts
            FOR INSERT WITH CHECK (auth.uid() = author_id);""",
            
        """CREATE POLICY "Authors can update own posts" ON posts
            FOR UPDATE USING (auth.uid() = author_id);""",
            
        """CREATE POLICY "Authors can delete own posts" ON posts
            FOR DELETE USING (auth.uid() = author_id);""",
            
        """CREATE POLICY "Public can view published posts" ON posts
            FOR SELECT USING (status = 'published');""",
        
        # Secure view count function
        """CREATE OR REPLACE FUNCTION increment_view_count(post_id UUID)
            RETURNS void
            LANGUAGE plpgsql
            SECURITY DEFINER
            AS $$
            BEGIN
                UPDATE posts 
                SET view_count = view_count + 1
                WHERE id = post_id 
                AND status = 'published';
                
                IF NOT FOUND THEN
                    RAISE EXCEPTION 'Post not found or not published';
                END IF;
            END;
            $$;""",
        
        # Grant execute permission
        "GRANT EXECUTE ON FUNCTION increment_view_count(UUID) TO authenticated;",
        
        # Auto-create user profile trigger
        """CREATE OR REPLACE FUNCTION handle_new_user()
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
            $$;""",
        
        # Create trigger
        "DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;",
        """CREATE TRIGGER on_auth_user_created
            AFTER INSERT ON auth.users
            FOR EACH ROW EXECUTE FUNCTION handle_new_user();"""
    ]
    
    cur = conn.cursor()
    
    print("🔐 Implementing Row Level Security policies...")
    print("=" * 60)
    
    for i, command in enumerate(rls_commands, 1):
        try:
            print(f"Executing command {i}/{len(rls_commands)}...")
            cur.execute(command)
            print(f"✅ Success: {command[:50]}...")
        except Exception as e:
            print(f"❌ Error executing command {i}: {e}")
            print(f"Command: {command}")
            # Continue with next command instead of failing completely
            continue
    
    conn.commit()
    cur.close()
    print("\n🎉 RLS implementation completed!")

def verify_rls_implementation(conn):
    """Verify that RLS policies were implemented correctly"""
    
    cur = conn.cursor()
    
    print("\n🔍 Verifying RLS implementation...")
    print("=" * 60)
    
    # Check if RLS is enabled on tables
    cur.execute("""
        SELECT tablename, rowsecurity
        FROM pg_tables 
        WHERE tablename IN ('users', 'posts')
        ORDER BY tablename;
    """)
    
    rls_status = cur.fetchall()
    print("\n📋 RLS Status on Tables:")
    for table, enabled in rls_status:
        status = "✅ ENABLED" if enabled else "❌ DISABLED"
        print(f"  {table}: {status}")
    
    # Check existing policies
    cur.execute("""
        SELECT tablename, policyname, cmd
        FROM pg_policies 
        WHERE tablename IN ('users', 'posts')
        ORDER BY tablename, policyname;
    """)
    
    policies = cur.fetchall()
    print(f"\n📋 RLS Policies Created ({len(policies)} total):")
    for table, policy, cmd in policies:
        print(f"  {table}.{policy} ({cmd})")
    
    # Check functions
    cur.execute("""
        SELECT routine_name, routine_type
        FROM information_schema.routines
        WHERE routine_name IN ('increment_view_count', 'handle_new_user')
        AND routine_schema = 'public';
    """)
    
    functions = cur.fetchall()
    print(f"\n🔧 Functions Created ({len(functions)} total):")
    for func_name, func_type in functions:
        print(f"  {func_name} ({func_type})")
    
    cur.close()
    
    return len(policies) >= 8 and len(functions) >= 2  # Expected minimum

def main():
    # URL-encode the password to handle special characters
    password = urllib.parse.quote_plus("3zB8RLqFbTFYtoqE")
    database_url = f"postgresql://postgres:{password}@db.vkrpxixijyowlirbssxp.supabase.co:5432/postgres"
    
    try:
        print("🔗 Connecting to Supabase database...")
        conn = psycopg2.connect(database_url)
        print("✅ Connected successfully!")
        
        # Implement RLS policies
        implement_rls_policies(conn)
        
        # Verify implementation
        success = verify_rls_implementation(conn)
        
        if success:
            print("\n🎉 RLS implementation completed successfully!")
            print("✅ Your Quote platform now has enterprise-level database security!")
            print("\n📋 Next steps:")
            print("  1. Test your application functionality")
            print("  2. Monitor for any RLS-related errors")
            print("  3. Implement rate limiting on API endpoints")
            print("  4. Add CORS and CSP headers")
        else:
            print("\n⚠️  RLS implementation may be incomplete. Please check the verification results above.")
        
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("Please check your database connection and try again.")

if __name__ == "__main__":
    main() 