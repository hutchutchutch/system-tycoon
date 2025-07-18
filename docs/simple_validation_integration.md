# Simple Requirements Validation Integration

This shows how to add API-powered validation to existing components that use the `Requirements` component.

## Integration Steps

Your existing `Requirements` component stays exactly the same. Just modify the parent component that uses it:

### 1. Add the Hook

```tsx
// In your parent component (e.g., SystemDesignCanvas.tsx)
import { useRequirementValidation } from '../hooks/useRequirementValidation';
import type { ValidationResult } from '../services/missionService';

// Add state for requirements
const [requirements, setRequirements] = useState<Requirement[]>([]);

// Add the validation hook
const { isValidating, validateRequirements } = useRequirementValidation({
  stageId: "550e8400-e29b-41d4-a716-446655440001", // Your current stage ID
  onValidationComplete: (result) => {
    // Convert API response to Requirements component format
    const convertedReqs = result.requirements
      .filter(req => req.visible) // Only show visible requirements
      .map(req => ({
        id: req.id,
        description: req.description,
        completed: req.completed
      }));
    
    setRequirements(convertedReqs);
  }
});
```

### 2. Update the onRunTest Handler

```tsx
// Replace your existing onRunTest function
const handleRunTest = async () => {
  const nodes = getNodes(); // From useReactFlow or your state
  const edges = getEdges(); // From useReactFlow or your state
  
  await validateRequirements(nodes, edges);
};
```

### 3. Update Your Requirements Component Usage

```tsx
// Your existing Requirements component usage - just change the onRunTest prop
<Requirements
  requirements={requirements}
  onRunTest={handleRunTest}
  className="your-existing-classes"
/>

{/* Optional: Add loading indicator */}
{isValidating && (
  <div className="validation-loading">
    Validating your design...
  </div>
)}
```

## Complete Example

Here's a complete example of integrating into an existing component:

```tsx
import React, { useState } from 'react';
import { useReactFlow } from 'react-flow-renderer';
import { Requirements } from '../components/molecules/Requirements/Requirements';
import { useRequirementValidation } from '../hooks/useRequirementValidation';

// Your existing component
export const SystemDesignCanvas = () => {
  const { getNodes, getEdges } = useReactFlow();
  const [requirements, setRequirements] = useState([]);

  // Add this validation hook
  const { isValidating, validateRequirements } = useRequirementValidation({
    stageId: "550e8400-e29b-41d4-a716-446655440001",
    onValidationComplete: (result) => {
      const convertedReqs = result.requirements
        .filter(req => req.visible)
        .map(req => ({
          id: req.id,
          description: req.description,
          completed: req.completed
        }));
      setRequirements(convertedReqs);
    }
  });

  // Update this handler
  const handleRunTest = async () => {
    await validateRequirements(getNodes(), getEdges());
  };

  // Your existing JSX - just update the onRunTest prop
  return (
    <div className="your-existing-layout">
      {/* Your existing canvas/design area */}
      
      <Requirements
        requirements={requirements}
        onRunTest={handleRunTest}
      />
      
      {isValidating && <div>Validating...</div>}
    </div>
  );
};
```

## That's It!

- ✅ Keep your existing `Requirements` component unchanged
- ✅ Just add the validation hook to the parent component  
- ✅ Convert the API response format to match your component's expected props
- ✅ Replace the onRunTest handler with the API call

The `Requirements` component will automatically update when validation completes, showing the real-time results from your Supabase database. 