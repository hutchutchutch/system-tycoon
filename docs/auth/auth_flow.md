# Authentication Flow Documentation

## Overview

This document tracks the complete authentication flow, state changes, error handling, and visual feedback in the AuthCard and AuthFlowDiagram components.

## System Architecture

```
AuthCard --[e1-2]--> Authentication Service --[e2-3]--> Database
   (1)                       (2)                        (3)
```

### Node IDs:
- **Node 1**: AuthCard (`authCardNode`)
- **Node 2**: Authentication Service (`authServiceNode`) 
- **Node 3**: Database (`databaseNode`)

### Edge IDs:
- **e1-2**: AuthCard → Authentication Service
- **e2-3**: Authentication Service → Database

## State Management

### Core States

```typescript
type AnimationPhase = 'none' | 'left' | 'right' | 'success' | 'error';

interface FlowState {
  animationPhase: AnimationPhase;
  isAnimating: boolean;
  hasDatabaseError: boolean;
  hasAuthServiceError: boolean;
  currentStep: number;
}
```

### Redux Auth States
- `isLoading`: Boolean indicating authentication in progress
- `error`: String containing error message from authentication attempt
- `isAuthenticated`: Boolean indicating successful authentication

## Flow Transitions

### 1. Initial State
```
State: none
Visual: All nodes normal (blue borders), gray edges
```

**AuthCard**: Blue border, normal state
**Auth Service**: Blue border, normal state  
**Database**: Yellow border, normal state
**Edges**: Gray (#64748b), width 2px, not animated

---

### 2. Authentication Start
```
Trigger: User clicks "Sign In" or "Create Account"
State: none → left (via handleAnimationStart)
```

**Changes:**
- `isLoading: true` in Redux
- `setIsAnimating(true)`
- `setAnimationPhase('left')`
- Reset error states: `setHasDatabaseError(false)`, `setHasAuthServiceError(false)`

**Visual:**
- AuthCard: Remains blue, loading spinner appears on button
- Edge e1-2: Starts animating, turns green (#22c55e), width 3px

---

### 3. Authentication Processing
```
State: left → right (after 800ms interval completion)
```

**Visual Flow Animation:**
```javascript
step 0: AuthCard highlighted
step 1: Auth Service highlighted + e1-2 edge animated
step 2: Database highlighted + e2-3 edge animated
```

**Changes:**
- Edge e1-2: Green animated (#22c55e)
- Auth Service: Animated state (green border/glow)
- Edge e2-3: Green animated (#22c55e) 
- Database: Animated state (green border/glow)

---

## Success Flow

### 4. Authentication Success
```
Trigger: isAuthenticated = true
State: right → success
```

**Visual:**
- All nodes: Flash green with success animation
- All edges: Remain green
- After 1.5s: Navigate to next screen via `onAuthSuccess()`

---

## Error Flows

### 5A. Validation Errors (Client-Side)
```
Trigger: Form validation fails
Errors: "Please enter a valid email address", "Password must be at least 6 characters"
```

**Visual:**
- AuthCard: Red border (#ef4444), red glow
- Nodes/Edges: Remain in current state
- No animation triggered

**Error Detection:**
```typescript
const hasValidationErrors = Object.keys(validationErrors).length > 0;
const hasAnyError = displayError || hasValidationErrors;
```

---

### 5B. Authentication Service Errors
```
Trigger: authError contains specific keywords
Keywords: "invalid login credentials", "invalid credentials", "authentication failed", "login failed"
State: → error
```

**Error Detection:**
```typescript
const isAuthServiceError = authError.toLowerCase().includes('invalid login credentials') ||
                          authError.toLowerCase().includes('invalid credentials') ||
                          authError.toLowerCase().includes('authentication failed') ||
                          authError.toLowerCase().includes('login failed');
```

**Visual Changes:**
- `setHasAuthServiceError(true)`
- `setAnimationPhase('error')`
- `setIsAnimating(false)`

**Node/Edge Updates:**
- AuthCard: Red border (from error display)
- Auth Service (Node 2): Red border, red background, red icon
- Edge e1-2: Red (#ef4444), width 3px, not animated
- Database: Remains normal
- Edge e2-3: Remains normal

**CSS Classes Applied:**
```css
.auth-service-node.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.2);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
}

.auth-service-node.error .node-icon {
  background: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
```

---

### 5C. Database Errors
```
Trigger: authError contains specific keywords  
Keywords: "database error saving new user", "database error", "profile creation error", "failed to create profile"
State: → error
```

**Error Detection:**
```typescript
const isDatabaseError = authError.toLowerCase().includes('database error saving new user') ||
                        authError.toLowerCase().includes('database error') ||
                        authError.toLowerCase().includes('profile creation error') ||
                        authError.toLowerCase().includes('failed to create profile');
```

**Visual Changes:**
- `setHasDatabaseError(true)`
- `setAnimationPhase('error')`
- `setIsAnimating(false)`

**Node/Edge Updates:**
- AuthCard: Red border (from error display)
- Auth Service: Remains in last state
- Edge e1-2: Remains in last state  
- Database (Node 3): Red border, red background, red icon
- Edge e2-3: Red (#ef4444), width 3px, not animated

**CSS Classes Applied:**
```css
.database-node.error {
  border-color: #ef4444;
  background: rgba(239, 68, 68, 0.2);
  box-shadow: 0 0 30px rgba(239, 68, 68, 0.5);
}

.database-node.error .node-icon {
  background: rgba(239, 68, 68, 0.3);
  color: #ef4444;
}
```

---

## Reset and Recovery

### 6. Error State Reset
```
Trigger: authError cleared OR user starts new authentication attempt
```

**Conditions:**
```typescript
// Reset when error is cleared
if (!authError && (hasDatabaseError || hasAuthServiceError))

// Reset when starting new authentication  
if (!isAnimating && !hasDatabaseError && !hasAuthServiceError)
```

**Actions:**
- `setHasDatabaseError(false)`
- `setHasAuthServiceError(false)` 
- `setAnimationPhase('none')`
- Reset all nodes: `error: false, animated: false, success: false`
- Reset all edges: gray color, width 2px, not animated

---

## State Transition Matrix

| Current State | Trigger | Next State | Visual Changes |
|---------------|---------|------------|----------------|
| `none` | User submits form | `left` | Start animation, green edges |
| `left` | Animation completes | `right` | Continue animation to database |
| `right` | `isAuthenticated = true` | `success` | Flash green, navigate |
| `left/right` | Auth service error | `error` | Red auth service + e1-2 edge |
| `left/right` | Database error | `error` | Red database + e2-3 edge |
| `error` | Error cleared | `none` | Reset all to normal |
| `any` | Validation error | `current` | Red AuthCard border only |

---

## Component Communication

### AuthCard → AuthFlowDiagram Callbacks

```typescript
interface AuthCardNodeData {
  onAnimationStart?: () => void;     // Triggers animation start
  onAuthServiceError?: () => void;   // Handles auth service errors  
  onDatabaseError?: () => void;      // Handles database errors
  onSuccess?: () => void;            // Handles success navigation
}
```

### Effect Dependencies

**Animation Start Effect:**
```typescript
useEffect(() => {
  if (isLoading && nodeData?.onAnimationStart) {
    nodeData.onAnimationStart();
  }
}, [isLoading, nodeData]);
```

**Error Detection Effects:**
```typescript
useEffect(() => {
  // Check for auth service errors
  if (authError && nodeData?.onAuthServiceError) {
    if (isAuthServiceError) nodeData.onAuthServiceError();
  }
}, [authError, nodeData]);

useEffect(() => {
  // Check for database errors  
  if (authError && nodeData?.onDatabaseError) {
    if (isDatabaseError) nodeData.onDatabaseError();
  }
}, [authError, nodeData]);
```

---

## Visual State Examples

### Normal Flow
```
1. User Input → Blue AuthCard, gray edges
2. Submit → Blue AuthCard (loading), green animated e1-2
3. Auth Success → Green animated e1-2 + e2-3, green nodes
4. Complete → Flash green, navigate
```

### Auth Service Error Flow  
```
1. User Input → Blue AuthCard, gray edges
2. Submit → Blue AuthCard (loading), green animated e1-2
3. "Invalid credentials" → Red AuthCard + Auth Service, red e1-2
```

### Database Error Flow
```
1. User Input → Blue AuthCard, gray edges  
2. Submit → Blue AuthCard (loading), green animated e1-2
3. Auth Success → Green animated e1-2 + e2-3
4. "Database error" → Red AuthCard + Database, red e2-3
```

### Validation Error Flow
```
1. Invalid Input → Red AuthCard border only
2. No animation triggered, nodes/edges unchanged
```

---

## Error Message Categories

### Validation Errors (Client-Side)
- "Please enter a valid email address"
- "Password must be at least 6 characters"  
- "Username must be at least 2 characters"

### Authentication Service Errors
- "Invalid login credentials"
- "Invalid credentials"
- "Authentication failed"
- "Login failed"

### Database Errors  
- "Database error saving new user"
- "Database error"
- "Profile creation error"
- "Failed to create profile"

---

## CSS Animation Classes

### Success States
```css
.custom-node.success {
  animation: flashGreen 0.5s ease-in-out;
}

@keyframes flashGreen {
  0%, 100% { box-shadow: 0 0 30px rgba(34, 197, 94, 0.5); }
  50% { box-shadow: 0 0 50px rgba(34, 197, 94, 0.8); }
}
```

### Error States
```css
.custom-node.error {
  animation: flashRed 0.5s ease-in-out;
}

@keyframes flashRed {
  0%, 100% { box-shadow: 0 0 30px rgba(239, 68, 68, 0.5); }
  50% { box-shadow: 0 0 50px rgba(239, 68, 68, 0.8); }
}
```

### Animated States
```css
.custom-node.animated {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.1);
  box-shadow: 0 0 20px rgba(34, 197, 94, 0.3);
}
```

---

## Debugging & Troubleshooting

### Common Issues

1. **Animation doesn't start**: Check `isLoading` state in Redux
2. **Wrong error highlighting**: Verify error message content matches keywords
3. **Stuck in error state**: Ensure error clearing logic runs properly
4. **Edge not animating**: Check edge IDs match (`e1-2`, `e2-3`)

### State Inspection
```javascript
// In browser console during development
console.log('Animation Phase:', animationPhase);
console.log('Has Database Error:', hasDatabaseError);
console.log('Has Auth Service Error:', hasAuthServiceError);
console.log('Auth Error:', authError);
console.log('Is Loading:', isLoading);
``` 