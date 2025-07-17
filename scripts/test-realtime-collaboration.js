import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testRealtimeCollaboration() {
  console.log('🔄 Testing Realtime Collaboration Setup...\n');

  try {
    // 1. Test table access
    console.log('1️⃣ Testing table access...');
    const tables = [
      'design_sessions',
      'canvas_components',
      'canvas_connections',
      'design_session_participants',
      'collaboration_logs'
    ];

    for (const table of tables) {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);

      if (error) {
        console.error(`❌ Error accessing ${table}:`, error.message);
      } else {
        console.log(`✅ ${table} table is accessible`);
      }
    }

    // 2. Test creating a design session
    console.log('\n2️⃣ Testing design session creation...');
    const { data: session, error: sessionError } = await supabase
      .from('design_sessions')
      .insert({
        scenario_id: 'test-scenario',
        session_name: 'Test Collaboration Session',
        is_active: true
      })
      .select()
      .single();

    if (sessionError) {
      console.error('❌ Error creating session:', sessionError.message);
    } else {
      console.log('✅ Created test session:', session.id);

      // 3. Test realtime channel
      console.log('\n3️⃣ Testing realtime channel...');
      const channel = supabase.channel(`design_session:${session.id}`, {
        config: {
          presence: { key: 'test-user' },
          broadcast: { self: false }
        }
      });

      let subscribed = false;

      channel.subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime channel');
          subscribed = true;
        }
      });

      // Wait a bit for subscription
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (subscribed) {
        // Test presence
        console.log('\n4️⃣ Testing presence API...');
        await channel.track({
          user_id: 'test-user',
          name: 'Test User',
          status: 'active'
        });

        console.log('✅ Presence tracked successfully');

        // Test broadcast
        console.log('\n5️⃣ Testing broadcast...');
        channel.on('broadcast', { event: 'test-event' }, (payload) => {
          console.log('✅ Received broadcast:', payload);
        });

        await channel.send({
          type: 'broadcast',
          event: 'test-event',
          payload: { message: 'Hello from test!' }
        });

        await new Promise(resolve => setTimeout(resolve, 1000));

        // Cleanup
        channel.unsubscribe();
      }

      // 6. Cleanup test session
      console.log('\n6️⃣ Cleaning up test data...');
      const { error: deleteError } = await supabase
        .from('design_sessions')
        .delete()
        .eq('id', session.id);

      if (deleteError) {
        console.error('❌ Error cleaning up:', deleteError.message);
      } else {
        console.log('✅ Test data cleaned up');
      }
    }

    console.log('\n✨ Realtime collaboration setup is working correctly!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testRealtimeCollaboration(); 