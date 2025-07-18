# Mission System Design Canvas Fix

## Issue Fixed

The `CrisisSystemDesignCanvas` was showing "Failed to load mission: Mission not found" when clicking the "System Builder" CTA from an email because:

1. **Missing Backend API**: The component was trying to use RTK Query to call a backend API endpoint (`/email/${emailId}/mission-stage`) that doesn't exist
2. **Missing Database Schema**: The required database tables (`mission_emails`, `missions`, `mission_stages`) were not set up
3. **Missing Test Data**: No data existed for the specific email ID mentioned in the issue

## What Was Fixed

### 1. Updated CrisisSystemDesignCanvas Component

**File**: `src/pages/InitialExperience/CrisisSystemDesignCanvas.tsx`

- ✅ Removed RTK Query dependency (which was calling non-existent backend API)
- ✅ Added direct Supabase integration to fetch mission stage data
- ✅ Added proper error handling and fallback mechanisms
- ✅ Fixed TypeScript errors with proper type handling

### 2. Created Database Schema

**File**: `sql/02_create_mission_tables.sql`

- ✅ Created `missions` table for mission definitions
- ✅ Created `mission_stages` table for mission stage details
- ✅ Created `mission_emails` table linking emails to mission stages
- ✅ Added proper foreign key relationships and indexes
- ✅ Included test data with the exact email ID from the issue

### 3. Added Database Setup Script

**File**: `scripts/setup-mission-database.js`

- ✅ Automated script to run the database migration
- ✅ Verification of setup with test queries
- ✅ Fallback instructions for manual setup

## How to Set Up

### Option 1: Automated Setup

1. Make sure your `.env` file has Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

2. Run the setup script:
   ```bash
   node scripts/setup-mission-database.js
   ```

### Option 2: Manual Setup

1. Go to your Supabase dashboard
2. Navigate to **SQL Editor**
3. Copy and paste the entire contents of `sql/02_create_mission_tables.sql`
4. Click **Run** to execute the migration

## Test the Fix

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to the email client in the browser

3. Find the email with subject: **"URGENT: Health Crisis - System Down"**
   - Email ID: `4c9569fb-89a4-4439-80c4-8e3944990d7c`
   - Stage ID: `bcd0760f-c920-44e8-b658-1674341ea1d8`

4. Click the **"System Builder"** button

5. The System Design Canvas should now load with:
   - ✅ Mission title: "Community Health Tracker Overload"
   - ✅ Stage information: "Stage 1: Separate Concerns"
   - ✅ Problem description: "Alex's laptop is crashing from running both web server and database"
   - ✅ Available components in the drawer
   - ✅ Requirements panel on the right

## What You Should See

When the System Builder opens, you should see:

```
🔧 Available Components
Stage 1: Separate Concerns
Alex's laptop is crashing from running both web server and database

Drag components to the canvas to fix Community Health Tracker Overload!

[Component cards for Web Server, Database, File Storage, etc.]
```

## Technical Details

### Data Flow
1. User clicks "System Builder" in email with ID `4c9569fb-89a4-4439-80c4-8e3944990d7c`
2. `EmailClientWrapper` calls `onOpenSystemDesign(emailId)`
3. `index.tsx` creates new tab with `SystemDesignCanvasWrapper` component
4. `CrisisSystemDesignCanvas` receives `emailId` prop
5. Component fetches mission stage data from Supabase using the `emailId`
6. Mission stage data populates the canvas with stage-specific content

### Database Structure
```sql
missions (id, slug, title, description, crisis_description)
  ↓
mission_stages (id, mission_id, stage_number, title, problem_description, required_components)
  ↓
mission_emails (id, mission_id, stage_id, sender_name, subject, body, ...)
```

### Fallback Behavior
If database queries fail, the component will:
1. Try to load mission by slug (`health-tracker-crisis`)
2. Use hardcoded fallback mission data
3. Display appropriate error messages

## Troubleshooting

### Database Connection Issues
- Verify your Supabase credentials in `.env`
- Check your Supabase project is active
- Ensure you have the right permissions

### SQL Execution Errors
- Run the SQL manually in Supabase SQL Editor
- Check for existing tables with conflicting names
- Verify UUID extension is enabled in your Supabase project

### Component Not Loading
- Check browser console for errors
- Verify the email ID exists in the database
- Ensure React Flow dependencies are installed

## Files Modified

- `src/pages/InitialExperience/CrisisSystemDesignCanvas.tsx` - Main component fix
- `sql/02_create_mission_tables.sql` - Database schema and test data
- `scripts/setup-mission-database.js` - Setup automation script
- `MISSION_SYSTEM_FIX.md` - This documentation 