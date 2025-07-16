# Design System CSS Architecture

This document explains the new consolidated CSS structure designed to make debugging and maintenance easier.

## Directory Structure

```
src/styles/design-system/
├── foundation/           # Base layer - tokens, reset, utilities
│   ├── tokens.css       # Design tokens (colors, spacing, typography)
│   └── reset.css        # Browser reset and base styles
├── layout/              # Layout system - containers, grids, positioning
│   ├── containers.css   # Page containers and layout utilities
│   ├── grids.css        # Grid system and responsive layouts
│   └── browser-windows.css # Browser window specific layouts
├── components/          # Component library organized by complexity
│   ├── atoms.css        # Basic UI: buttons, badges, inputs, icons
│   ├── molecules.css    # Mid-level: cards, tabs, metrics, email cards
│   └── organisms.css    # Complex: browser windows, email client, HUD
├── pages/               # Page-specific styling
│   ├── landing.css      # Landing page styles
│   ├── auth.css         # Authentication pages
│   ├── game.css         # Game pages
│   └── initial-experience.css # Initial experience flow
├── features/            # Feature-specific components
│   ├── react-flow.css   # React Flow diagrams
│   └── career-map.css   # Career mapping interface
├── utilities/           # Helper classes and debugging
│   ├── animations.css   # Animation keyframes and utilities
│   └── debug.css        # CSS debugging helpers
└── index.css           # Main entry point - imports everything
```

## Load Order

The CSS is loaded in a specific order to ensure proper cascade:

1. **Foundation** - Design tokens and browser reset
2. **Layout** - Container and grid systems
3. **Components** - UI components (atoms → molecules → organisms)
4. **Pages** - Page-specific styles
5. **Features** - Feature-specific components
6. **Utilities** - Helper classes and debugging tools

## Key Benefits

### ✅ Faster Issue Identification
- Organized by component complexity (atoms → molecules → organisms)
- Clear naming conventions (`.btn`, `.card`, `.browser-window`)
- Dedicated debug utilities for visual inspection

### ✅ Maintainable Structure
- Logical file organization by purpose and complexity
- No more 2885-line monolithic CSS files
- Component-specific styles grouped together

### ✅ Consistent Architecture
- All browser window layouts in `layout/browser-windows.css`
- All atomic components in `components/atoms.css`
- Page-specific styles in dedicated files

## Usage Guidelines

### Adding New Styles

1. **Determine the appropriate file**:
   - Basic UI elements → `components/atoms.css`
   - Card-like components → `components/molecules.css`
   - Complex multi-part components → `components/organisms.css`
   - Page-specific styles → `pages/[page-name].css`
   - Layout positioning → `layout/containers.css` or `layout/browser-windows.css`

2. **Use design tokens**:
   ```css
   .my-component {
     background: var(--color-primary-500);
     padding: var(--space-4);
     border-radius: var(--radius-lg);
   }
   ```

3. **Follow BEM naming**:
   ```css
   .component-name { }
   .component-name--variant { }
   .component-name__element { }
   .component-name__element--state { }
   ```

### Debugging CSS Issues

Use the debug utilities in `utilities/debug.css`:

```html
<!-- Add debug classes to identify layout issues -->
<div className="debug-layout">
<div className="debug-browser">
<div className="debug-chrome">
<div className="debug-tabs">
```

Common debug classes:
- `.debug-layout` - Shows layout boundaries
- `.debug-browser` - Highlights browser window
- `.debug-chrome` - Highlights browser chrome
- `.debug-tabs` - Highlights tab bar
- `.debug-flexbox` - Shows flex containers
- `.debug-grid` - Shows grid containers

## Key CSS Rules

### Layout Positioning
- **Never use `width: 100vw`** - Use `width: 100%` to stay within container
- **Fixed positioning**: Only for HUD and overlays
- **Container boundaries**: Components should respect parent containers

### Browser Window Architecture
```css
.browser-window {
  width: 100%;  /* NOT 100vw - prevents viewport escape */
  height: 100%;
  display: flex;
  flex-direction: column;
}
```

### Component Hierarchy
- **Atoms**: Buttons, badges, inputs, icons (no child components)
- **Molecules**: Cards, tabs, metrics (composed of atoms)
- **Organisms**: Browser windows, email clients (composed of molecules)

## Migration from Old System

Old scattered CSS files have been consolidated:

| Old Location | New Location |
|--------------|--------------|
| `InitialExperience.css` | `pages/initial-experience.css` |
| `EmailClientWrapper.css` | `layout/browser-windows.css` |
| `components.css` (2885 lines) | Split into `components/atoms.css`, `molecules.css`, `organisms.css` |
| `ui-components.css` | Merged into component files |
| `landing-animations.css` | `utilities/animations.css` |

## Common Patterns

### Browser Window Component
```css
/* Layout positioning */
.browser-window {
  width: 100%;    /* Stay within container */
  height: 100%;   /* Fill container height */
}

/* Chrome structure */
.browser-window__chrome { /* Header area */ }
.browser-window__tab-bar { /* Tab container */ }
.browser-window__controls { /* Address bar */ }
.browser-window__content { /* Main content */ }
```

### Debug Mode Toggle
```javascript
// Add to component for debugging
className={`browser-window ${debug ? 'debug-browser' : ''}`}
```

### Responsive Design
```css
/* Mobile-first approach */
.component { }

@media (max-width: 768px) {
  .component { /* Mobile adjustments */ }
}

@media (min-width: 769px) {
  .component { /* Desktop enhancements */ }
}
```

## Troubleshooting

### Component Not Styled
1. Check if CSS file is imported in `index.css`
2. Verify class name matches exactly (case-sensitive)
3. Use browser dev tools to see which CSS file is being loaded
4. Add debug class to identify positioning issues

### Layout Issues
1. Add `.debug-layout` class to parent container
2. Check for `width: 100vw` (should be `width: 100%`)
3. Verify z-index values using debug utilities
4. Check if container has proper height (`height: 100%` or `calc(100vh - 64px)`)

### Missing Styles
1. Check the load order in `index.css`
2. Ensure design tokens are imported first
3. Look for conflicting CSS specificity
4. Use `!important` sparingly - prefer specificity

## Performance Considerations

- CSS is loaded in optimal order for cascade efficiency
- Debug utilities are only active when debug classes are present
- Animations use hardware acceleration where possible
- Responsive breakpoints minimize layout shifts

This architecture ensures faster debugging, easier maintenance, and better developer experience. 