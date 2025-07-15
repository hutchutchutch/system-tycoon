# Supabase Schema Documentation

## Tables

### profiles
The profiles table stores user profile information and game progress.

**Structure:**
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  userId UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(50) NOT NULL UNIQUE,
  avatarUrl TEXT,
  currentLevel INTEGER DEFAULT 1,
  reputationPoints INTEGER DEFAULT 0,
  careerTitle VARCHAR(100) DEFAULT 'Junior Consultant',
  preferredMentorId UUID,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Key Points:**
- `id` is the primary key and foreign key to `auth.users(id)`
- `userId` is also a foreign key to `auth.users(id)` for backward compatibility
- `username` must be unique across all profiles
- Profile is automatically created when user signs up
- Use `id` column for lookups, not `user_id`

### user_stats
Tracks user game statistics and performance.

**Structure:**
```sql
CREATE TABLE user_stats (
  userId UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  totalProjectsCompleted INTEGER DEFAULT 0,
  totalComponentsUsed INTEGER DEFAULT 0,
  averageScore DECIMAL(5,2) DEFAULT 0,
  bestScore DECIMAL(5,2) DEFAULT 0,
  totalTimePlayed INTEGER DEFAULT 0,
  favoriteComponentId UUID,
  lastPlayedAt TIMESTAMP WITH TIME ZONE,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### scenarios
Game scenarios and levels.

**Structure:**
```sql
CREATE TABLE scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level INTEGER NOT NULL,
  title VARCHAR(200) NOT NULL,
  clientName VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  budgetLimit INTEGER NOT NULL,
  timeLimitSeconds INTEGER NOT NULL,
  baseRequirements JSONB NOT NULL,
  availableQuestions JSONB NOT NULL,
  availableComponents TEXT[] NOT NULL,
  availableMentors TEXT[] NOT NULL,
  successCriteria JSONB NOT NULL,
  createdAt TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Row Level Security (RLS)

Enable RLS on all tables and create policies:

```sql
-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenarios ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- User stats policies
CREATE POLICY "Users can view their own stats" ON user_stats
  FOR SELECT USING (auth.uid() = userId);

CREATE POLICY "Users can update their own stats" ON user_stats
  FOR UPDATE USING (auth.uid() = userId);

CREATE POLICY "Users can insert their own stats" ON user_stats
  FOR INSERT WITH CHECK (auth.uid() = userId);

-- Scenarios policies (public read)
CREATE POLICY "Anyone can view scenarios" ON scenarios
  FOR SELECT TO authenticated;
```

## Triggers

Create triggers to automatically update timestamps:

```sql
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updatedAt = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to tables
CREATE TRIGGER update_profiles_updated_at 
  BEFORE UPDATE ON profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_stats_updated_at 
  BEFORE UPDATE ON user_stats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```
