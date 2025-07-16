#!/usr/bin/env node

// Test Supabase connection script
// Run with: node scripts/test-supabase-connection.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔧 Testing Supabase Connection...\n');

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables:');
  if (!supabaseUrl) console.error('   - VITE_SUPABASE_URL is not set');
  if (!supabaseAnonKey) console.error('   - VITE_SUPABASE_ANON_KEY is not set');
  console.error('\nPlease create a .env file with these variables.');
  process.exit(1);
}

console.log('✅ Environment variables found');
console.log(`📍 URL: ${supabaseUrl}`);
console.log(`🔑 Key: ${supabaseAnonKey.substring(0, 20)}...\n`);

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    // Test basic connection
    console.log('🔄 Testing connection...');
    const { data, error } = await supabase
      .from('emails')
      .select('count')
      .limit(1);

    if (error) {
      if (error.message.includes('relation "emails" does not exist')) {
        console.log('⚠️  Connection successful, but emails table not found');
        console.log('📝 Please run the SQL migration in your Supabase dashboard');
        return;
      }
      throw error;
    }

    console.log('✅ Connection successful!');
    
    // Check if table has data
    const { data: emails, error: countError } = await supabase
      .from('emails')
      .select('*');

    if (countError) {
      throw countError;
    }

    console.log(`📧 Found ${emails.length} emails in database`);
    
    if (emails.length === 0) {
      console.log('📝 Database is empty - the app will auto-populate initial data');
    } else {
      console.log('📋 Sample emails:');
      emails.slice(0, 3).forEach(email => {
        console.log(`   - ${email.subject} (from ${email.sender_name})`);
      });
    }

  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('\n💡 Troubleshooting:');
    console.error('   1. Check your Supabase project URL and anon key');
    console.error('   2. Make sure the emails table exists (run the migration)');
    console.error('   3. Check your project permissions');
  }
}

testConnection(); 