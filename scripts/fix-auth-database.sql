-- Fix Supabase Authentication Database Setup
-- Run this in your Supabase SQL Editor

-- 1. Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  current_level INTEGER DEFAULT 1,
  reputation_score INTEGER DEFAULT 0,
  career_title TEXT DEFAULT 'Aspiring Developer',
  preferred_mentor_id TEXT,
  onboarding_completed BOOLEAN DEFAULT FALSE
);

-- 2. Add index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON public.profiles(username);

-- 3. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 4. Drop existing policies if they exist
DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- 5. Create new RLS policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 6. Create or replace function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Use COALESCE to handle missing username metadata
  INSERT INTO public.profiles (id, username)
  VALUES (
    new.id, 
    COALESCE(
      new.raw_user_meta_data->>'username', 
      'user_' || substr(new.id::text, 1, 8)
    )
  )
  ON CONFLICT (id) DO NOTHING;  -- Prevent duplicate key errors
  
  RETURN new;
EXCEPTION
  WHEN unique_violation THEN
    -- If username already exists, append a random suffix
    INSERT INTO public.profiles (id, username)
    VALUES (
      new.id,
      COALESCE(
        new.raw_user_meta_data->>'username', 
        'user'
      ) || '_' || substr(md5(random()::text), 1, 6)
    );
    RETURN new;
  WHEN OTHERS THEN
    -- Log the error but don't fail the signup
    RAISE WARNING 'Profile creation failed: %', SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 7. Drop and recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;

-- 9. Create a function to check username availability (optional)
CREATE OR REPLACE FUNCTION public.check_username_available(username_to_check TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN NOT EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE username = username_to_check
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission on the function
GRANT EXECUTE ON FUNCTION public.check_username_available TO anon, authenticated;

-- 10. Add updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- Verify the setup
SELECT 
  'Profiles table exists' as check_item,
  EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) as status;

SELECT 
  'RLS enabled on profiles' as check_item,
  relrowsecurity as status
FROM pg_class
WHERE relname = 'profiles';

SELECT 
  'User creation trigger exists' as check_item,
  EXISTS (
    SELECT FROM pg_trigger 
    WHERE tgname = 'on_auth_user_created'
  ) as status;