# Database Schema Design Patterns for Mission-Based Educational Games

## Mission progression systems store hierarchical content with flexible prerequisites

Building a mission-based educational game requires sophisticated database architecture that balances structure with flexibility. After analyzing patterns from successful games like Assassin's Creed and Call of Duty, combined with educational platforms like Moodle and Coursera, the most effective approach uses a hybrid relational-JSON model in PostgreSQL/Supabase.

The core pattern separates static mission definitions from dynamic user progress. **Static content rarely changes and benefits from heavy caching**, while user-specific data requires real-time updates and careful indexing. This separation dramatically improves performance at scale - games handling millions of concurrent players use this exact pattern to maintain sub-100ms query times.

For a consulting simulation game, the foundation starts with three essential tables: missions, user_progress, and mission_phases. These tables form the backbone of your progression system, enabling complex unlock conditions while maintaining query performance.

## Core schema architecture balances flexibility with performance

The mission table structure leverages PostgreSQL's JSONB capabilities for maximum flexibility:

```sql
CREATE TABLE missions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    order_index INTEGER NOT NULL,
    difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Example mission configuration
INSERT INTO missions (title, order_index, difficulty, config) VALUES 
('Client Discovery Workshop', 1, 'beginner', '{
    "phases": ["email_discovery", "video_call", "system_design", "client_feedback"],
    "estimated_duration": 45,
    "learning_objectives": [
        "Identify key stakeholder concerns",
        "Demonstrate active listening",
        "Propose initial solutions"
    ],
    "unlock_conditions": {
        "type": "simple",
        "required_level": 1
    },
    "scoring": {
        "email_quality": 30,
        "video_performance": 40,
        "design_accuracy": 30
    }
}');
```

User progress tracking requires a separate table that maintains state without duplicating content:

```sql
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    mission_id UUID REFERENCES missions(id),
    status TEXT CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
    current_phase INTEGER DEFAULT 0,
    progress_data JSONB NOT NULL DEFAULT '{}',
    score INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, mission_id)
);

-- GIN indexes for JSONB queries
CREATE INDEX idx_progress_data ON user_progress USING GIN (progress_data);
CREATE INDEX idx_user_status ON user_progress (user_id, status);
```

## Complex unlock conditions require specialized patterns

Games with sophisticated progression systems implement unlock conditions through a combination of prerequisite tables and JSONB formulas. **The most flexible approach stores prerequisites as JSONB while maintaining referential integrity through foreign keys**:

```sql
CREATE TABLE mission_prerequisites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES missions(id),
    prerequisite_config JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Example complex prerequisite
INSERT INTO mission_prerequisites (mission_id, prerequisite_config) VALUES
('advanced-mission-id', '{
    "logic": "AND",
    "conditions": [
        {
            "type": "missions_completed",
            "mission_ids": ["intro-1", "intro-2"],
            "minimum_score": 80
        },
        {
            "type": "OR",
            "conditions": [
                {"type": "player_level", "minimum": 5},
                {"type": "skills_unlocked", "skills": ["advanced_analysis"]}
            ]
        }
    ]
}');

-- Efficient unlock checking function
CREATE OR REPLACE FUNCTION check_mission_unlocked(
    p_user_id UUID,
    p_mission_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
    prereq_config JSONB;
    completed_missions UUID[];
    user_level INTEGER;
BEGIN
    -- Get prerequisite configuration
    SELECT prerequisite_config INTO prereq_config
    FROM mission_prerequisites
    WHERE mission_id = p_mission_id;
    
    IF prereq_config IS NULL THEN
        RETURN TRUE; -- No prerequisites
    END IF;
    
    -- Get user's completed missions
    SELECT ARRAY_AGG(mission_id) INTO completed_missions
    FROM user_progress
    WHERE user_id = p_user_id 
    AND status = 'completed'
    AND score >= COALESCE((prereq_config->>'minimum_score')::INTEGER, 0);
    
    -- Complex logic evaluation here
    -- This is simplified - implement full recursive logic
    RETURN completed_missions @> ARRAY(
        SELECT jsonb_array_elements_text(prereq_config->'mission_ids')::UUID
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

## JSON storage enables rich interactive content

Educational games require diverse content types - emails, videos, interactive diagrams, and simulations. **JSONB provides the perfect balance between structure and flexibility** for storing this content:

```sql
CREATE TABLE mission_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    mission_id UUID REFERENCES missions(id),
    phase_name TEXT NOT NULL,
    content_type TEXT CHECK (content_type IN ('email', 'video', 'react_flow', 'document', 'simulation')),
    content_data JSONB NOT NULL,
    sequence_order INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Email content example
INSERT INTO mission_content (mission_id, phase_name, content_type, content_data, sequence_order) VALUES
('mission-id', 'email_discovery', 'email', '{
    "subject": "Urgent: System Performance Issues",
    "from": {
        "name": "Sarah Chen",
        "email": "s.chen@techcorp.example",
        "role": "CTO"
    },
    "body": "Our customer portal has been experiencing significant slowdowns...",
    "attachments": [
        {
            "filename": "performance_metrics.pdf",
            "size_kb": 1024,
            "preview_available": true
        }
    ],
    "metadata": {
        "priority": "high",
        "sentiment": "concerned",
        "key_issues": ["performance", "customer_impact", "revenue_risk"]
    },
    "response_options": [
        {
            "id": "immediate_response",
            "label": "Respond immediately with initial assessment"
        },
        {
            "id": "gather_info",
            "label": "Request additional technical details first"
        }
    ]
}', 1);

-- React Flow diagram storage
INSERT INTO mission_content (mission_id, phase_name, content_type, content_data, sequence_order) VALUES
('mission-id', 'system_design', 'react_flow', '{
    "initial_state": {
        "nodes": [
            {
                "id": "1",
                "type": "systemComponent",
                "position": {"x": 100, "y": 100},
                "data": {
                    "label": "Load Balancer",
                    "component_type": "infrastructure",
                    "configurable": true
                }
            }
        ],
        "edges": []
    },
    "validation_rules": {
        "required_components": ["load_balancer", "cache", "database"],
        "performance_target": {
            "response_time_ms": 200,
            "throughput_rps": 1000
        }
    },
    "interactive_features": {
        "drag_enabled": true,
        "connection_validation": true,
        "real_time_metrics": true
    }
}', 3);
```

## Content versioning preserves user progress during updates

Educational content evolves, but user progress must be preserved. **The most robust pattern separates content versions from user progress**, allowing updates without disrupting active learners:

```sql
CREATE TABLE content_versions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID NOT NULL,
    version_number TEXT NOT NULL,
    content_data JSONB NOT NULL,
    change_notes TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT now(),
    created_by UUID REFERENCES auth.users(id)
);

-- Migration tracking for user progress
CREATE TABLE progress_migrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    old_version_id UUID REFERENCES content_versions(id),
    new_version_id UUID REFERENCES content_versions(id),
    migration_status TEXT DEFAULT 'pending',
    migration_data JSONB,
    migrated_at TIMESTAMPTZ
);

-- Safe content update function
CREATE OR REPLACE FUNCTION update_mission_content(
    p_content_id UUID,
    p_new_content JSONB,
    p_change_notes TEXT
) RETURNS UUID AS $$
DECLARE
    new_version_id UUID;
    current_version TEXT;
BEGIN
    -- Get current version number
    SELECT version_number INTO current_version
    FROM content_versions
    WHERE content_id = p_content_id AND is_current = TRUE;
    
    -- Create new version
    INSERT INTO content_versions (content_id, version_number, content_data, change_notes)
    VALUES (
        p_content_id,
        (current_version::NUMERIC + 0.1)::TEXT,
        p_new_content,
        p_change_notes
    ) RETURNING id INTO new_version_id;
    
    -- Update current flag
    UPDATE content_versions SET is_current = FALSE 
    WHERE content_id = p_content_id AND id != new_version_id;
    
    UPDATE content_versions SET is_current = TRUE 
    WHERE id = new_version_id;
    
    -- Queue migration for active users
    INSERT INTO progress_migrations (user_id, old_version_id, new_version_id, migration_data)
    SELECT DISTINCT 
        up.user_id,
        cv.id,
        new_version_id,
        jsonb_build_object('auto_migration', true)
    FROM user_progress up
    JOIN content_versions cv ON cv.content_id = p_content_id AND cv.version_number = current_version
    WHERE up.status = 'in_progress';
    
    RETURN new_version_id;
END;
$$ LANGUAGE plpgsql;
```

## Supabase-specific patterns enhance real-time features

Supabase's real-time capabilities transform static progression into dynamic, multiplayer experiences. **Row Level Security (RLS) provides granular access control** without sacrificing performance:

```sql
-- Enable RLS on all game tables
ALTER TABLE missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE mission_content ENABLE ROW LEVEL SECURITY;

-- User progress policies
CREATE POLICY "Users view own progress" ON user_progress
    FOR SELECT TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users update own progress" ON user_progress
    FOR UPDATE TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Mission visibility based on unlock status
CREATE POLICY "Users see unlocked missions" ON missions
    FOR SELECT TO authenticated
    USING (
        id NOT IN (
            SELECT mission_id FROM mission_prerequisites
        ) OR check_mission_unlocked(auth.uid(), id)
    );

-- Real-time leaderboard updates
CREATE OR REPLACE FUNCTION broadcast_completion() RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        PERFORM pg_notify(
            'mission_completion',
            json_build_object(
                'user_id', NEW.user_id,
                'mission_id', NEW.mission_id,
                'score', NEW.score,
                'completion_time', NEW.completed_at
            )::text
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER mission_completion_trigger
    AFTER UPDATE ON user_progress
    FOR EACH ROW
    EXECUTE FUNCTION broadcast_completion();
```

## Performance optimization requires strategic indexing and caching

Games demand millisecond response times. **Strategic indexing and materialized views provide the necessary performance**:

```sql
-- Partial indexes for common queries
CREATE INDEX idx_available_missions ON user_progress (user_id, mission_id)
    WHERE status IN ('available', 'in_progress');

CREATE INDEX idx_completed_high_score ON user_progress (mission_id, score DESC)
    WHERE status = 'completed';

-- GIN indexes for JSONB operations
CREATE INDEX idx_mission_config ON missions USING GIN (config);
CREATE INDEX idx_progress_data ON user_progress USING GIN (progress_data);

-- Specialized indexes for specific queries
CREATE INDEX idx_email_content ON mission_content USING GIN (content_data)
    WHERE content_type = 'email';

-- Materialized view for mission statistics
CREATE MATERIALIZED VIEW mission_statistics AS
SELECT 
    m.id as mission_id,
    m.title,
    m.difficulty,
    COUNT(DISTINCT up.user_id) as total_attempts,
    COUNT(DISTINCT CASE WHEN up.status = 'completed' THEN up.user_id END) as completions,
    AVG(CASE WHEN up.status = 'completed' THEN up.score END) as avg_score,
    AVG(CASE WHEN up.status = 'completed' THEN 
        EXTRACT(EPOCH FROM (up.completed_at - up.started_at))/60 
    END) as avg_completion_minutes,
    PERCENTILE_CONT(0.5) WITHIN GROUP (
        ORDER BY CASE WHEN up.status = 'completed' THEN up.score END
    ) as median_score
FROM missions m
LEFT JOIN user_progress up ON m.id = up.mission_id
GROUP BY m.id, m.title, m.difficulty;

-- Refresh strategy
CREATE OR REPLACE FUNCTION refresh_mission_statistics() RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY mission_statistics;
END;
$$ LANGUAGE plpgsql;

-- Schedule refresh every hour using pg_cron
SELECT cron.schedule('refresh-stats', '0 * * * *', 'SELECT refresh_mission_statistics();');
```

## Practical implementation for 20+ mission consulting game

For a consulting simulation game with 20+ missions, implement a phased rollout:

**Phase 1: Core Infrastructure (Weeks 1-2)**
- User authentication and profiles
- Mission definitions with JSONB configuration
- Basic progress tracking
- Simple linear unlock system

**Phase 2: Content Management (Weeks 3-4)**
- Email template system with response tracking
- React Flow diagram storage and validation
- Video content integration
- Version control system

**Phase 3: Advanced Features (Weeks 5-6)**
- Complex prerequisite evaluation
- Real-time leaderboards
- Team collaboration features
- Performance analytics dashboard

**Phase 4: Optimization (Week 7+)**
- Implement caching layer
- Add monitoring and alerting
- Performance tuning based on usage patterns
- A/B testing infrastructure

## Query patterns for common operations

Efficient queries are crucial for game performance. Here are optimized patterns for frequent operations:

```sql
-- Get available missions for user
WITH user_completed AS (
    SELECT mission_id, score 
    FROM user_progress 
    WHERE user_id = $1 AND status = 'completed'
)
SELECT m.*, 
       CASE WHEN uc.mission_id IS NOT NULL THEN 'completed'
            WHEN up.status IS NOT NULL THEN up.status
            WHEN check_mission_unlocked($1, m.id) THEN 'available'
            ELSE 'locked'
       END as user_status,
       uc.score as user_score
FROM missions m
LEFT JOIN user_completed uc ON m.id = uc.mission_id
LEFT JOIN user_progress up ON m.id = up.mission_id AND up.user_id = $1
ORDER BY m.order_index;

-- Update user progress efficiently
UPDATE user_progress
SET 
    progress_data = progress_data || $2::jsonb,
    current_phase = GREATEST(current_phase, ($2->>'current_phase')::int),
    score = GREATEST(score, ($2->>'score')::int),
    updated_at = now()
WHERE user_id = $1 AND mission_id = $3
RETURNING *;

-- Get mission content with user progress
SELECT 
    mc.*,
    CASE 
        WHEN up.current_phase > mc.sequence_order THEN 'completed'
        WHEN up.current_phase = mc.sequence_order THEN 'current'
        ELSE 'locked'
    END as phase_status
FROM mission_content mc
JOIN user_progress up ON up.mission_id = mc.mission_id
WHERE mc.mission_id = $1 AND up.user_id = $2
ORDER BY mc.sequence_order;
```

This architecture provides a robust foundation that scales from prototype to production, supporting complex educational scenarios while maintaining the performance expected in modern games. The combination of PostgreSQL's powerful features with Supabase's real-time capabilities creates an ideal platform for mission-based educational games.