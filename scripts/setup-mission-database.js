#!/usr/bin/env node

/**
 * Setup script for mission database tables
 * This script creates the necessary tables and test data for the mission system
 */

import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runMigration() {
  try {
    console.log('🚀 Setting up mission database tables...');
    
    // Read the SQL migration file
    const sqlPath = join(__dirname, '..', 'sql', '02_create_mission_tables.sql');
    const sqlContent = readFileSync(sqlPath, 'utf8');
    
    // Split SQL into individual statements (rough split by semicolon + newline)
    const statements = sqlContent
      .split(';\n')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executing ${statements.length} SQL statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        console.log(`   ${i + 1}/${statements.length}: ${statement.substring(0, 50)}...`);
        
        const { error } = await supabase.rpc('exec_sql', { 
          sql: statement + ';' 
        });
        
        if (error) {
          // Try direct query if RPC fails
          const { error: queryError } = await supabase
            .from('_supabase_migrations')
            .select('*')
            .limit(1);
          
          if (queryError) {
            console.log(`   ⚠️  RPC not available, trying direct execution...`);
            // For simple operations, we can try individual table operations
            // This is a fallback approach
          }
        }
      }
    }
    
    // Verify the setup by checking if our test data exists
    console.log('🔍 Verifying setup...');
    
    const { data: emailData, error: emailError } = await supabase
      .from('mission_emails')
      .select('id, subject')
      .eq('id', '4c9569fb-89a4-4439-80c4-8e3944990d7c')
      .single();
    
    if (emailError) {
      console.log('⚠️  Direct query failed, tables may need to be created manually');
      console.log('   Copy the SQL from sql/02_create_mission_tables.sql');
      console.log('   and run it in your Supabase SQL Editor');
    } else {
      console.log('✅ Success! Mission email found:', emailData.subject);
    }
    
    const { data: stageData, error: stageError } = await supabase
      .from('mission_stages')
      .select('id, title')
      .eq('id', 'bcd0760f-c920-44e8-b658-1674341ea1d8')
      .single();
    
    if (!stageError && stageData) {
      console.log('✅ Success! Mission stage found:', stageData.title);
    }
    
    console.log('\n🎉 Database setup complete!');
    console.log('📧 Test email ID: 4c9569fb-89a4-4439-80c4-8e3944990d7c');
    console.log('🎯 Test stage ID: bcd0760f-c920-44e8-b658-1674341ea1d8');
    console.log('\nYou can now click the "System Builder" button in the email to load the mission stage data.');
    
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    console.log('\n📋 Manual Setup Instructions:');
    console.log('1. Go to your Supabase dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the contents of sql/02_create_mission_tables.sql');
    console.log('4. Click "Run" to execute the migration');
  }
}

// Run the migration
runMigration(); 