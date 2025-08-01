#!/usr/bin/env node

// Test Supabase Auth Database Setup
// Run with: node scripts/test-auth-database.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Testing Supabase Auth Database Setup...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables:');
  if (!supabaseUrl) console.error('   - VITE_SUPABASE_URL is not set');
  if (!supabaseAnonKey) console.error('   - VITE_SUPABASE_ANON_KEY is not set');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testAuthSetup() {
  console.log('🔍 Checking database setup for authentication...\n');

  try {
    // 1. Test profiles table
    console.log('📋 Testing profiles table...');
    const { data: profileTest, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);

    if (profileError) {
      if (profileError.message.includes('relation "profiles" does not exist')) {
        console.error('❌ Profiles table does not exist!');
        console.error('   Please create the profiles table in your Supabase dashboard.');
        console.error('\n📝 Required SQL:');
        console.log(`
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
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

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
        `);
        return false;
      } else {
        console.error('❌ Error accessing profiles table:', profileError.message);
        return false;
      }
    }
    console.log('✅ Profiles table exists');

    // 2. Check if we can create a test user
    console.log('\n🧪 Testing user signup capability...');
    const testEmail = `test_${Date.now()}@example.com`;
    const testPassword = 'TestPassword123!';
    
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: { username: `testuser_${Date.now()}` }
      }
    });

    if (signUpError) {
      console.error('❌ Signup test failed:', signUpError.message);
      
      if (signUpError.message.includes('Database error saving new user')) {
        console.error('\n🔍 This usually indicates:');
        console.error('   1. Missing database trigger for profile creation');
        console.error('   2. RLS policies blocking the operation');
        console.error('   3. Database constraint violations');
        console.error('\n📝 Required trigger:');
        console.log(`
-- Handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, new.raw_user_meta_data->>'username');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger the function every time a user is created
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
        `);
      }
      return false;
    }

    console.log('✅ User signup successful!');
    
    // Clean up test user
    if (signUpData.user) {
      console.log('🧹 Cleaning up test user...');
      
      // First, delete from profiles
      await supabase
        .from('profiles')
        .delete()
        .eq('id', signUpData.user.id);
      
      // Note: Deleting from auth.users requires admin privileges
      console.log('⚠️  Test user created but cannot be fully deleted via anon key');
      console.log('   You may want to delete it manually from Supabase dashboard');
    }

    // 3. Check RLS policies
    console.log('\n🔒 Checking RLS policies...');
    const { data: rls, error: rlsError } = await supabase.rpc('check_rls_enabled', {
      table_name: 'profiles'
    }).single();

    if (rlsError) {
      console.log('⚠️  Could not check RLS status (this is normal with anon key)');
    } else {
      console.log(rls ? '✅ RLS is enabled on profiles table' : '❌ RLS is NOT enabled on profiles table');
    }

    console.log('\n✅ Database appears to be set up correctly for authentication!');
    return true;

  } catch (error) {
    console.error('❌ Unexpected error:', error.message);
    return false;
  }
}

async function suggestFixes() {
  console.log('\n📝 To fix the "Database error saving new user" issue:\n');
  console.log('1. Go to your Supabase dashboard');
  console.log('2. Navigate to SQL Editor');
  console.log('3. Run the following SQL commands:\n');
  
  console.log(`-- 1. Create profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  username TEXT UNIQUE,
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

-- 2. Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 3. Create RLS policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- 4. Create function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (new.id, COALESCE(new.raw_user_meta_data->>'username', 'user_' || substr(new.id::text, 1, 8)));
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Create trigger for automatic profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 6. Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;`);
  
  console.log('\n4. After running these commands, test signup again');
  console.log('5. If issues persist, check the Supabase logs for more details\n');
}

// Run the test
testAuthSetup().then(success => {
  if (!success) {
    suggestFixes();
  }
  process.exit(success ? 0 : 1);
});