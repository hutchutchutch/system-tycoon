# Email Progression System Integration Guide

This guide explains how to integrate the email progression system with your existing Redux state management architecture to ensure users only see emails they've earned through gameplay.

## Overview

The email progression system ensures that:
1. Players only see emails after completing the required mission stages
2. Emails are automatically delivered when stages are completed
3. Email progression is tracked securely on the backend
4. The system integrates seamlessly with your existing Redux architecture

## Integration Steps

### 1. Add Email Slice to Store

First, add the email slice to your existing store configuration:

```typescript
// src/store/store.ts
import emailReducer from './slices/emailSlice';
import { emailApi } from './api/emailApi';

const rootReducer = combineReducers({
  // ... existing reducers
  game: gameSlice,
  user: userSlice,
  design: designSlice,
  
  // Add email slice
  email: emailReducer,
  
  // Add email API
  [emailApi.reducerPath]: emailApi.reducer,
});

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        ignoredPaths: ['simulation.packets', 'design.draggedComponent'],
      },
    })
    .concat(gameApi.middleware)
    .concat(emailApi.middleware) // Add email API middleware
    // ... other middleware
});
```

### 2. Update RootState Type

Update your RootState type to include the email slice:

```typescript
// src/store/index.ts or wherever RootState is defined
interface RootState {
  // Existing state
  user: UserState;
  game: GameState;
  level: LevelState;
  // ... other slices
  
  // Add email state
  email: EmailState;
  
  // API state
  api: ApiState;
  [emailApi.reducerPath]: ReturnType<typeof emailApi.reducer>;
}
```

### 3. Integrate with Existing Game Flow

#### A. Stage Completion Integration

Modify your existing stage completion logic to trigger email checks:

```typescript
// Example: In your design phase completion
import { useStageCompletion } from '../hooks/useEmailProgression';

const DesignPhase: React.FC = () => {
  const { currentUser, currentMission } = useAppSelector(/* your selectors */);
  const completeStage = useStageCompletion(currentUser.id, currentMission.id);
  
  const handleDesignComplete = async (design: SystemDesign, score: number) => {
    // Your existing design completion logic
    await submitDesign(design);
    
    // Check for new emails (stage 2 completion)
    const newEmails = await completeStage(
      2, // Design stage
      score,
      performance.now() - startTime,
      { design, metricsAchieved: calculateMetrics(design) }
    );
    
    if (newEmails.length > 0) {
      // Show email notification
      showNotification(`You have ${newEmails.length} new emails!`);
    }
    
    // Continue to next phase
    dispatch(transitionPhase('simulation'));
  };
};
```

#### B. Mission Start Integration

Ensure initial emails are delivered when starting a mission:

```typescript
// Example: In your mission start logic
import { useEmailProgression } from '../hooks/useEmailProgression';

const GamePage: React.FC = () => {
  const { currentUser } = useAppSelector(/* your selector */);
  const { completeStageAndCheckEmails } = useEmailProgression(currentUser.id);
  
  const startMission = async (missionId: string) => {
    // Your existing mission start logic
    dispatch(startSession({ levelId: missionId, sessionId: generateId() }));
    
    // Check for initial mission emails
    const initialEmails = await completeStageAndCheckEmails({
      playerId: currentUser.id,
      missionId,
      stageNumber: 0, // Mission start
      score: 0,
      timeSpent: 0,
    });
    
    if (initialEmails.length > 0) {
      // Redirect to email or show notification
      showUrgentEmailNotification(initialEmails[0]);
    }
  };
};
```

### 4. Email Component Integration

Create an email component that respects progression rules:

```typescript
// src/components/organisms/EmailClient/EmailClient.tsx
import { useEmailProgression, useEmailAccessibility } from '../../../hooks/useEmailProgression';

interface EmailClientProps {
  playerId: string;
  currentMissionId: string;
}

export const EmailClient: React.FC<EmailClientProps> = ({ 
  playerId, 
  currentMissionId 
}) => {
  const {
    availableEmails,
    unreadCount,
    markAsRead,
    isLoadingEmails,
  } = useEmailProgression(playerId, currentMissionId);
  
  const handleEmailClick = (email: Email) => {
    if (email.isAccessible) {
      markAsRead(email.id);
      // Open email content
    } else {
      // Show message that email is not yet available
      showMessage("This email will be available after completing more stages.");
    }
  };
  
  if (isLoadingEmails) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="email-client">
      <EmailHeader unreadCount={unreadCount} />
      <EmailList 
        emails={availableEmails}
        onEmailClick={handleEmailClick}
      />
    </div>
  );
};

// Individual email row component
const EmailRow: React.FC<{ email: Email }> = ({ email }) => {
  const { canView } = useEmailAccessibility(email.id, email.missionId || '');
  
  return (
    <div 
      className={cn(
        "email-row",
        !canView && "email-row--locked",
        email.isUrgent && "email-row--urgent"
      )}
    >
      {canView ? (
        <>
          <EmailSender sender={email.sender} />
          <EmailSubject subject={email.subject} />
          <EmailPreview preview={email.preview} />
          <EmailTimestamp timestamp={email.sentAt} />
        </>
      ) : (
        <div className="email-row__locked">
          <Icon name="lock" />
          <span>Email locked - complete more stages to unlock</span>
        </div>
      )}
    </div>
  );
};
```

### 5. Notification System

Integrate with your notification system to show new email alerts:

```typescript
// src/components/notifications/EmailNotification.tsx
import { useEmailProgression } from '../../hooks/useEmailProgression';

export const EmailNotificationProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const { newEmailNotification, clearNotification } = useEmailProgression(
    useAppSelector(selectCurrentUserId),
    useAppSelector(selectCurrentMissionId)
  );
  
  useEffect(() => {
    if (newEmailNotification) {
      // Show toast notification
      toast({
        title: "New Email!",
        description: `From: ${newEmailNotification.sender.name}`,
        action: (
          <ToastAction 
            altText="View Email"
            onClick={() => {
              // Navigate to email
              navigateToEmail(newEmailNotification.id);
              clearNotification();
            }}
          >
            View
          </ToastAction>
        ),
      });
      
      // Auto-clear after 5 seconds
      setTimeout(clearNotification, 5000);
    }
  }, [newEmailNotification, clearNotification]);
  
  return <>{children}</>;
};
```

## Backend Integration

### 1. Database Schema

Ensure your database has the necessary tables for email progression:

```sql
-- Mission emails table (pre-defined emails for each mission)
CREATE TABLE mission_emails (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  mission_id UUID REFERENCES missions(id),
  stage_id UUID REFERENCES mission_stages(id),
  trigger_type TEXT CHECK (trigger_type IN ('mission_start', 'stage_complete', 'performance_based')),
  stage_number INTEGER, -- Which stage completion triggers this email
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  sender_avatar TEXT,
  subject TEXT NOT NULL,
  preview TEXT NOT NULL,
  body TEXT NOT NULL,
  priority TEXT DEFAULT 'normal',
  is_urgent BOOLEAN DEFAULT FALSE,
  is_important BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player email delivery tracking
CREATE TABLE player_emails_received (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES auth.users(id),
  email_id UUID REFERENCES mission_emails(id),
  mission_id UUID REFERENCES missions(id),
  delivered_at TIMESTAMPTZ DEFAULT NOW(),
  read_at TIMESTAMPTZ,
  is_accessible BOOLEAN DEFAULT TRUE,
  UNIQUE(player_id, email_id)
);

-- Player mission progress
CREATE TABLE player_mission_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_id UUID REFERENCES auth.users(id),
  mission_id UUID REFERENCES missions(id),
  current_stage INTEGER DEFAULT 0,
  max_stage_completed INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(player_id, mission_id)
);
```

### 2. Database Functions

Create functions for email progression logic:

```sql
-- Function to check if player can receive an email
CREATE OR REPLACE FUNCTION can_receive_email(
  p_player_id UUID,
  p_email_id UUID
) RETURNS BOOLEAN AS $$
DECLARE
  email_record RECORD;
  player_progress RECORD;
BEGIN
  -- Get email details
  SELECT * INTO email_record
  FROM mission_emails
  WHERE id = p_email_id;
  
  IF NOT FOUND THEN
    RETURN FALSE;
  END IF;
  
  -- Get player progress for this mission
  SELECT * INTO player_progress
  FROM player_mission_progress
  WHERE player_id = p_player_id AND mission_id = email_record.mission_id;
  
  -- Check if player has completed required stage
  CASE email_record.trigger_type
    WHEN 'mission_start' THEN
      RETURN TRUE; -- Always available when mission starts
    WHEN 'stage_complete' THEN
      RETURN (player_progress.max_stage_completed >= email_record.stage_number);
    WHEN 'performance_based' THEN
      -- Add custom logic for performance-based emails
      RETURN (player_progress.max_stage_completed >= email_record.stage_number);
    ELSE
      RETURN FALSE;
  END CASE;
END;
$$ LANGUAGE plpgsql;

-- Function to deliver available emails
CREATE OR REPLACE FUNCTION send_available_emails(
  p_player_id UUID,
  p_mission_id UUID,
  p_completed_stage INTEGER DEFAULT NULL
) RETURNS TABLE(email_id UUID, email_data JSON) AS $$
BEGIN
  -- Update player progress if stage completed
  IF p_completed_stage IS NOT NULL THEN
    INSERT INTO player_mission_progress (player_id, mission_id, current_stage, max_stage_completed)
    VALUES (p_player_id, p_mission_id, p_completed_stage, p_completed_stage)
    ON CONFLICT (player_id, mission_id)
    DO UPDATE SET 
      current_stage = p_completed_stage,
      max_stage_completed = GREATEST(player_mission_progress.max_stage_completed, p_completed_stage),
      updated_at = NOW();
  END IF;
  
  -- Find and deliver available emails
  RETURN QUERY
  WITH available_emails AS (
    SELECT me.id as email_id
    FROM mission_emails me
    WHERE me.mission_id = p_mission_id
      AND can_receive_email(p_player_id, me.id)
      AND NOT EXISTS (
        SELECT 1 FROM player_emails_received per
        WHERE per.player_id = p_player_id AND per.email_id = me.id
      )
  )
  INSERT INTO player_emails_received (player_id, email_id, mission_id)
  SELECT p_player_id, ae.email_id, p_mission_id
  FROM available_emails ae
  RETURNING 
    email_id,
    (
      SELECT to_json(me.*) 
      FROM mission_emails me 
      WHERE me.id = player_emails_received.email_id
    ) as email_data;
END;
$$ LANGUAGE plpgsql;
```

### 3. API Endpoints

Create API endpoints that use these functions:

```typescript
// Example API endpoint for stage completion
app.post('/api/emails/complete-stage', async (req, res) => {
  const { playerId, missionId, stageNumber, completionData } = req.body;
  
  try {
    // Validate stage completion
    const isValidCompletion = await validateStageCompletion(
      playerId, 
      missionId, 
      stageNumber, 
      completionData
    );
    
    if (!isValidCompletion) {
      return res.status(400).json({ error: 'Invalid stage completion' });
    }
    
    // Deliver available emails
    const { data: newEmails } = await supabase
      .rpc('send_available_emails', {
        p_player_id: playerId,
        p_mission_id: missionId,
        p_completed_stage: stageNumber
      });
    
    res.json({
      stageCompleted: true,
      newEmails: newEmails || [],
      updatedProgress: {
        [missionId]: {
          missionId,
          currentStage: stageNumber,
          maxStageCompleted: stageNumber,
          deliveredEmails: newEmails?.map(e => e.email_id) || [],
        }
      }
    });
  } catch (error) {
    console.error('Error completing stage:', error);
    res.status(500).json({ error: 'Failed to complete stage' });
  }
});
```

## Testing the Integration

### 1. Create Test Data

```sql
-- Insert test mission emails
INSERT INTO mission_emails (mission_id, trigger_type, stage_number, sender_name, subject, body) VALUES
('health-crisis-mission-id', 'mission_start', 0, 'Alex Rivera', 'URGENT - Need your help NOW', 'The health department website is completely down...'),
('health-crisis-mission-id', 'stage_complete', 1, 'Alex Rivera', 'Getting worse - more details', 'Thanks for taking this on! The situation is getting worse...'),
('health-crisis-mission-id', 'stage_complete', 2, 'Alex Rivera', 'Database crashed!', 'Oh no - our main database just crashed...');
```

### 2. Test Stage Completion

```typescript
// Test the flow in your React component
const testStageCompletion = async () => {
  const newEmails = await completeStageAndCheckEmails({
    playerId: 'test-player-id',
    missionId: 'health-crisis-mission-id',
    stageNumber: 1,
    score: 85,
    timeSpent: 120000,
  });
  
  console.log('New emails received:', newEmails);
};
```

## Security Considerations

1. **Server-side Validation**: Always validate stage completion on the server
2. **Row Level Security**: Use Supabase RLS to ensure players only see their own emails
3. **Rate Limiting**: Prevent spam by limiting email check frequency
4. **Progression Validation**: Ensure players can't skip stages or access future emails

## Summary

This email progression system ensures a natural narrative flow where emails arrive exactly when they make sense in the story. The integration with your Redux architecture provides:

- **Automatic email delivery** when stages are completed
- **Secure progression tracking** via database functions
- **Clean React hooks** for easy component integration
- **Real-time state management** via RTK Query
- **Notification system** for new email alerts

The system maintains the emotional impact of the story by preventing players from seeing future emails while providing a seamless, automatic delivery experience. 