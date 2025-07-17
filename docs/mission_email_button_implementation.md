# Mission Email Button Implementation

## Overview

Mission emails now include a prominent button that opens the System Design Canvas in a new tab within the browser window, rather than linking to an external URL.

## How It Works

### 1. Mission Email Detection

The system automatically detects mission emails based on:
- Tags: `crisis`, `system-design`, `healthcare`
- Content keywords: "system design", "crisis"
- Subject keywords: "urgent"

### 2. Button Display

When a mission email is detected, a special section appears at the bottom:

```
🔧 System Design Required
This mission requires you to design a system solution. Click below to open the System Design Canvas.
[🚀 Open System Design Canvas]
```

### 3. Tab Creation

When the button is clicked:
1. A new tab is created in the browser window
2. The tab contains the `CrisisSystemDesignCanvas` component
3. The canvas includes the `ComponentDrawer` and `Requirements` components
4. User stays within the same browser window context

## Technical Implementation

### Email Detail View
```typescript
// Check if this is a mission email and show the button
{(selectedEmail.tags.includes('crisis') || 
  selectedEmail.tags.includes('system-design') || 
  selectedEmail.content?.toLowerCase().includes('system design')) && (
  <div className={styles.missionActionSection}>
    <button onClick={onOpenSystemDesign}>
      Open System Design Canvas
    </button>
  </div>
)}
```

### Tab Handler
```typescript
const handleOpenSystemDesignTab = useCallback(() => {
  const newTab = {
    id: 'system-design',
    title: 'System Builder - Emergency: Health Crisis',
    url: 'https://systembuilder.tech/emergency/healthcrisis',
    component: SystemDesignCanvasWrapper,
    closable: true,
  };
  
  setTabs(prev => [...prev, newTab]);
  setActiveTab('system-design');
}, []);
```

### Prop Passing
The `BrowserWindow` component automatically passes additional props from the tab object to the component:
```typescript
<ActiveComponent 
  {...(activeTabData && Object.fromEntries(
    Object.entries(activeTabData).filter(([key]) => 
      !['id', 'title', 'url', 'component', 'hasNotification'].includes(key)
    )
  ))}
/>
```

## User Experience

1. User receives a mission email (e.g., from Dr. Sarah Chen about a health crisis)
2. User reads the email and sees the mission button at the bottom
3. User clicks "🚀 Open System Design Canvas"
4. A new tab opens within the browser with the System Design Canvas
5. User can switch between email and canvas tabs easily

## Styling

The button features:
- Blue gradient background (#007acc to #0056b3)
- White text with rocket emoji
- Hover effects with shadow and slight upward movement
- Contained within a light blue section for prominence

## Benefits

- **Seamless Navigation**: No external windows or popups
- **Context Preservation**: User stays in the same browser window
- **Clear Call-to-Action**: Prominent button makes next steps obvious
- **Mission Integration**: Directly connects emails to system design challenges 