# Manual Supabase Setup

Since the Supabase MCP isn't responding, here's how to set it up manually:

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose your organization and create a new project
4. Wait for the project to be provisioned

## Step 2: Get Project Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **Anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

## Step 3: Set Environment Variables

Create a `.env` file in your project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## Step 4: Run SQL Migration

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the following SQL:

```sql
-- Migration: Create emails table
-- Description: Creates the emails table with all necessary fields for the email client

CREATE TABLE IF NOT EXISTS emails (
  id TEXT PRIMARY KEY,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_avatar TEXT,
  subject TEXT NOT NULL,
  preview TEXT NOT NULL,
  content TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status TEXT CHECK (status IN ('read', 'unread', 'archived')) DEFAULT 'unread',
  priority TEXT CHECK (priority IN ('low', 'normal', 'high')) DEFAULT 'normal',
  has_attachments BOOLEAN DEFAULT FALSE,
  tags TEXT[] DEFAULT '{}',
  category TEXT CHECK (category IN ('primary', 'projects', 'news', 'promotions')) DEFAULT 'primary',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_emails_category ON emails(category);
CREATE INDEX IF NOT EXISTS idx_emails_status ON emails(status);
CREATE INDEX IF NOT EXISTS idx_emails_timestamp ON emails(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_emails_sender_email ON emails(sender_email);

-- Create function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_emails_updated_at ON emails;
CREATE TRIGGER update_emails_updated_at 
    BEFORE UPDATE ON emails 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

4. Click **Run** to execute the migration

## Step 5: Verify Setup

1. Go to **Table Editor** in your Supabase dashboard
2. You should see the `emails` table
3. The table should have all the columns listed in the schema

## Step 6: Test the Application

1. Restart your development server: `npm run dev`
2. Navigate to the email client
3. The app should automatically populate initial email data

## Troubleshooting

If you get connection errors:
1. Double-check your environment variables
2. Make sure the `.env` file is in the project root
3. Restart the development server
4. Check the browser console for any error messages

## Row Level Security (Optional)

For production, you may want to enable RLS:

```sql
ALTER TABLE emails ENABLE ROW LEVEL SECURITY;

-- Example policy (adjust based on your auth requirements)
CREATE POLICY "Enable read access for all users" ON emails
FOR SELECT USING (true);

CREATE POLICY "Enable insert access for all users" ON emails
FOR INSERT WITH CHECK (true);

CREATE POLICY "Enable update access for all users" ON emails
FOR UPDATE USING (true);
``` 