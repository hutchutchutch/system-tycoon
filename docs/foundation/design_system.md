# System Design Tycoon - Comprehensive UI Design System

**Version:** 2.0  
**Date:** July 14, 2025  
**Author:** Design Team  

---

## 1. Introduction

This comprehensive UI Design System provides exhaustive specifications for every interface element in System Design Tycoon, from atomic design tokens to complex React Flow implementations. It serves as the definitive reference for developers, designers, and QA teams throughout the game's lifecycle.

**Document Structure:**
- **Sections 1-3:** Foundation (tokens, atoms, molecules)
- **Sections 4-7:** Game-Specific Components (organisms, templates)
- **Sections 8-10:** React Flow Specifications
- **Sections 11-13:** Multiplayer & Advanced Features
- **Sections 14-16:** Implementation & Quality Standards

---

## 2. Extended Design Tokens

### 2.1 Advanced Color System

#### Game Phase Color Schemes
```css
/* Meeting Phase Palette */
--meeting-bg-gradient-start: #667EEA;
--meeting-bg-gradient-end: #764BA2;
--meeting-overlay: rgba(255, 255, 255, 0.1);
--meeting-card-bg: rgba(255, 255, 255, 0.95);
--meeting-card-border: rgba(255, 255, 255, 0.3);

/* Design Phase Palette */
--design-canvas-bg: #F8FAFC;
--design-grid-line: #E5E7EB;
--design-grid-dot: #D1D5DB;
--design-selection-stroke: #3B82F6;
--design-connection-preview: rgba(59, 130, 246, 0.5);

/* Simulation Phase Palette */
--sim-packet-color: #10B981;
--sim-packet-glow: rgba(16, 185, 129, 0.6);
--sim-flow-normal: #3B82F6;
--sim-flow-congested: #F59E0B;
--sim-flow-failing: #EF4444;

/* Review Phase Palette */
--review-success-bg: #F0FDF4;
--review-warning-bg: #FEF3C7;
--review-failure-bg: #FEF2F2;
--review-metric-positive: #10B981;
--review-metric-negative: #EF4444;
```

#### Component State Color Matrix
```css
/* Load-based Color Progression */
--load-0-25: #10B981;      /* 0-25% capacity: Healthy green */
--load-25-50: #34D399;     /* 25-50% capacity: Light green */
--load-50-75: #FCD34D;     /* 50-75% capacity: Yellow */
--load-75-90: #F59E0B;     /* 75-90% capacity: Orange */
--load-90-95: #F97316;     /* 90-95% capacity: Dark orange */
--load-95-100: #EF4444;    /* 95-100% capacity: Red */
--load-overload: #B91C1C;  /* >100% capacity: Dark red */

/* Connection Quality Colors */
--connection-excellent: #10B981;
--connection-good: #3B82F6;
--connection-fair: #FCD34D;
--connection-poor: #F59E0B;
--connection-critical: #EF4444;
--connection-broken: #6B7280;
```

### 2.2 Extended Typography System

#### Context-Specific Type Scales
```css
/* Meeting Phase Typography */
--meeting-dialogue-text: 1.125rem/1.75rem;
--meeting-speaker-name: 0.875rem/1.25rem;
--meeting-question-text: 1rem/1.5rem;
--meeting-timer-text: 1.5rem/1.75rem;

/* Canvas Typography */
--canvas-component-label: 0.875rem/1.25rem;
--canvas-metric-value: 1.25rem/1.5rem;
--canvas-metric-unit: 0.75rem/1rem;
--canvas-cost-display: 1rem/1.25rem;

/* Achievement Typography */
--achievement-title: 1.25rem/1.5rem;
--achievement-description: 0.875rem/1.25rem;
--achievement-progress: 0.75rem/1rem;
```

### 2.3 Layout Constants

#### React Flow Canvas Specifications
```css
/* Canvas Dimensions */
--canvas-min-width: 800px;
--canvas-min-height: 600px;
--canvas-max-zoom: 2;
--canvas-min-zoom: 0.25;
--canvas-zoom-step: 0.1;

/* Node Dimensions */
--node-standard-width: 180px;
--node-standard-height: 80px;
--node-expanded-width: 240px;
--node-expanded-height: 120px;
--node-compact-width: 140px;
--node-compact-height: 60px;

/* Handle Specifications */
--handle-size: 12px;
--handle-border-width: 2px;
--handle-hover-scale: 1.2;
--handle-active-scale: 0.9;

/* Edge Specifications */
--edge-stroke-width-normal: 2px;
--edge-stroke-width-heavy: 4px;
--edge-stroke-width-critical: 6px;
--edge-arrow-size: 20px;
```

---

## 3. Game-Specific Atomic Components

### 3.1 Meeting Phase Components

#### Character Portrait Component
```css
.character-portrait {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  transition: transform var(--duration-normal) var(--ease-out);
}

.character-portrait__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.character-portrait__glow {
  position: absolute;
  inset: -3px;
  background: linear-gradient(45deg, var(--color-primary-500), var(--color-premium-500));
  border-radius: 50%;
  z-index: -1;
  opacity: 0;
  transition: opacity var(--duration-normal) var(--ease-out);
}

.character-portrait--available .character-portrait__glow {
  opacity: 1;
  animation: pulse-glow 2s ease-in-out infinite;
}

.character-portrait__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  width: 28px;
  height: 28px;
  background: var(--color-secondary-500);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

@keyframes pulse-glow {
  0%, 100% { transform: scale(1); opacity: 0.8; }
  50% { transform: scale(1.05); opacity: 1; }
}
```

#### Question Selection Card
```css
.question-card {
  background: var(--color-white);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  position: relative;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
}

.question-card__category-indicator {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
}

.question-card--product .question-card__category-indicator {
  background: var(--color-primary-500);
}

.question-card--business .question-card__category-indicator {
  background: var(--color-secondary-500);
}

.question-card--marketing .question-card__category-indicator {
  background: var(--color-warning-500);
}

.question-card--technical .question-card__category-indicator {
  background: var(--color-premium-500);
}

.question-card__impact-icons {
  position: absolute;
  top: var(--space-3);
  right: var(--space-3);
  display: flex;
  gap: var(--space-1);
}

.question-card__impact-icon {
  width: 20px;
  height: 20px;
  border-radius: var(--radius-sm);
  background: var(--color-neutral-100);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.question-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: var(--color-primary-300);
}

.question-card--selected {
  background: var(--color-primary-50);
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.question-card--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.question-card--disabled:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-neutral-200);
}
```

### 3.2 Mentor Selection Components

#### Mentor Card Component
```css
.mentor-card {
  background: var(--color-white);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  padding: var(--space-6);
  position: relative;
  cursor: pointer;
  transition: all var(--duration-normal) var(--ease-out);
  overflow: hidden;
}

.mentor-card__header {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  margin-bottom: var(--space-4);
}

.mentor-card__avatar {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-lg);
  object-fit: cover;
}

.mentor-card__specialization {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin-top: var(--space-3);
}

.mentor-card__specialization-tag {
  padding: var(--space-1) var(--space-2);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.mentor-card__advice-preview {
  margin-top: var(--space-4);
  padding: var(--space-3);
  background: var(--color-neutral-50);
  border-radius: var(--radius-md);
  font-style: italic;
  font-size: var(--text-small);
  color: var(--color-neutral-600);
}

.mentor-card--recommended {
  border-color: var(--color-secondary-400);
}

.mentor-card--recommended::before {
  content: "Recommended";
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  padding: var(--space-1) var(--space-3);
  background: var(--color-secondary-500);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

.mentor-card--locked {
  opacity: 0.6;
  cursor: not-allowed;
}

.mentor-card--locked::after {
  content: "";
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.mentor-card:hover:not(.mentor-card--locked) {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: var(--color-primary-400);
}

.mentor-card--selected {
  border-color: var(--color-primary-500);
  background: var(--color-primary-50);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
}
```

---

## 4. React Flow Node Components

### 4.1 Base Node Styling

#### Standard Component Node
```css
.react-flow__node-component {
  background: var(--color-white);
  border: 2px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  transition: all var(--duration-normal) var(--ease-out);
  min-width: var(--node-standard-width);
  min-height: var(--node-standard-height);
}

.react-flow__node-component__header {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-neutral-100);
}

.react-flow__node-component__icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-md);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

.react-flow__node-component__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.react-flow__node-component__body {
  padding: var(--space-3) var(--space-4);
}

.react-flow__node-component__metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.react-flow__node-component__metric {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.react-flow__node-component__metric-label {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.react-flow__node-component__metric-value {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
}

/* Load-based Border Styling */
.react-flow__node-component--load-low {
  border-color: var(--load-0-25);
  border-left-width: 4px;
}

.react-flow__node-component--load-medium {
  border-color: var(--load-50-75);
  border-left-width: 4px;
}

.react-flow__node-component--load-high {
  border-color: var(--load-75-90);
  border-left-width: 4px;
  animation: pulse-warning 2s ease-in-out infinite;
}

.react-flow__node-component--load-critical {
  border-color: var(--load-95-100);
  border-left-width: 4px;
  animation: shake-error 0.5s ease-in-out infinite;
}

/* Selection State */
.react-flow__node-component.selected {
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

/* Drag State */
.react-flow__node-component.dragging {
  cursor: grabbing;
  transform: rotate(2deg);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15);
}
```

#### Component Category Variants
```css
/* Compute Nodes */
.react-flow__node-component--compute .react-flow__node-component__icon {
  background: var(--color-primary-100);
  color: var(--color-primary-700);
}

/* Storage Nodes */
.react-flow__node-component--storage .react-flow__node-component__icon {
  background: var(--color-secondary-100);
  color: var(--color-secondary-700);
}

/* Networking Nodes */
.react-flow__node-component--networking .react-flow__node-component__icon {
  background: var(--color-info-100);
  color: var(--color-info-700);
}

/* Security Nodes */
.react-flow__node-component--security .react-flow__node-component__icon {
  background: var(--color-premium-100);
  color: var(--color-premium-700);
}

/* Operations Nodes */
.react-flow__node-component--operations .react-flow__node-component__icon {
  background: var(--color-warning-100);
  color: var(--color-warning-700);
}
```

### 4.2 React Flow Handle Styling

```css
.react-flow__handle {
  width: var(--handle-size);
  height: var(--handle-size);
  background: var(--color-neutral-400);
  border: var(--handle-border-width) solid var(--color-white);
  border-radius: 50%;
  transition: all var(--duration-fast) var(--ease-out);
}

/* Handle Types */
.react-flow__handle-source {
  background: var(--color-primary-500);
}

.react-flow__handle-target {
  background: var(--color-secondary-500);
}

/* Handle States */
.react-flow__handle:hover {
  transform: scale(var(--handle-hover-scale));
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.2);
}

.react-flow__handle.connecting {
  background: var(--color-warning-500);
  animation: pulse-connect 1s ease-in-out infinite;
}

.react-flow__handle.valid {
  background: var(--color-secondary-500);
  box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3);
}

.react-flow__handle.invalid {
  background: var(--color-error-500);
  box-shadow: 0 0 0 4px rgba(239, 68, 68, 0.3);
}

/* Multiple Handle Positioning */
.react-flow__handle--primary {
  /* Default centered position */
}

.react-flow__handle--secondary {
  top: 30%;
}

.react-flow__handle--tertiary {
  top: 70%;
}

@keyframes pulse-connect {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}
```

### 4.3 React Flow Edge Styling

```css
/* Base Edge Styles */
.react-flow__edge-path {
  stroke: var(--color-primary-400);
  stroke-width: var(--edge-stroke-width-normal);
  fill: none;
  transition: stroke var(--duration-fast) var(--ease-out);
}

/* Traffic-based Edge Styling */
.react-flow__edge--low-traffic {
  stroke-width: var(--edge-stroke-width-normal);
  stroke: var(--connection-excellent);
}

.react-flow__edge--medium-traffic {
  stroke-width: var(--edge-stroke-width-heavy);
  stroke: var(--connection-good);
}

.react-flow__edge--high-traffic {
  stroke-width: var(--edge-stroke-width-critical);
  stroke: var(--connection-fair);
  stroke-dasharray: 5 5;
  animation: flow-animation 1s linear infinite;
}

.react-flow__edge--congested {
  stroke-width: var(--edge-stroke-width-critical);
  stroke: var(--connection-poor);
  animation: pulse-critical 0.5s ease-in-out infinite alternate;
}

/* Animated Flow Visualization */
.react-flow__edge--animated {
  stroke-dasharray: 5 5;
}

.react-flow__edge--animated path {
  animation: dash-flow 1s linear infinite;
}

@keyframes dash-flow {
  to {
    stroke-dashoffset: -10;
  }
}

@keyframes flow-animation {
  0% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -20; }
}

/* Edge Labels */
.react-flow__edge-label {
  background: var(--color-white);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* Connection Line (Preview) */
.react-flow__connection {
  stroke: var(--design-connection-preview);
  stroke-width: 2;
  stroke-dasharray: 5 5;
  animation: dash-preview 1s linear infinite;
}

.react-flow__connection.valid {
  stroke: var(--color-secondary-400);
}

.react-flow__connection.invalid {
  stroke: var(--color-error-400);
}

@keyframes dash-preview {
  to {
    stroke-dashoffset: -10;
  }
}
```

---

## 5. Component Drawer Specifications

### 5.1 Drawer Container
```css
.component-drawer {
  width: var(--canvas-sidebar-width);
  height: 100%;
  background: var(--color-neutral-50);
  border-right: 1px solid var(--color-neutral-200);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.component-drawer__header {
  padding: var(--space-4);
  background: var(--color-white);
  border-bottom: 1px solid var(--color-neutral-200);
}

.component-drawer__search {
  position: relative;
}

.component-drawer__search-input {
  width: 100%;
  padding: var(--space-2) var(--space-4) var(--space-2) var(--space-10);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-full);
  font-size: var(--text-small);
  transition: all var(--duration-fast) var(--ease-out);
}

.component-drawer__search-icon {
  position: absolute;
  left: var(--space-3);
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-neutral-400);
}

.component-drawer__categories {
  flex: 1;
  overflow-y: auto;
  padding-bottom: var(--space-4);
}
```

### 5.2 Category Sections
```css
.component-category {
  border-bottom: 1px solid var(--color-neutral-200);
}

.component-category__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4);
  background: var(--color-white);
  cursor: pointer;
  transition: background var(--duration-fast) var(--ease-out);
}

.component-category__header:hover {
  background: var(--color-neutral-50);
}

.component-category__icon {
  width: 24px;
  height: 24px;
  margin-right: var(--space-3);
}

.component-category__title {
  flex: 1;
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.component-category__count {
  padding: var(--space-1) var(--space-2);
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
}

.component-category__chevron {
  transition: transform var(--duration-fast) var(--ease-out);
}

.component-category--expanded .component-category__chevron {
  transform: rotate(180deg);
}

.component-category__items {
  padding: var(--space-2);
  display: grid;
  gap: var(--space-2);
  max-height: 0;
  overflow: hidden;
  transition: max-height var(--duration-normal) var(--ease-out);
}

.component-category--expanded .component-category__items {
  max-height: 600px; /* Adjust based on content */
}
```

### 5.3 Draggable Component Items
```css
.component-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  cursor: grab;
  transition: all var(--duration-fast) var(--ease-out);
  position: relative;
}

.component-item__icon {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  background: var(--color-primary-100);
  color: var(--color-primary-700);
  flex-shrink: 0;
}

.component-item__content {
  flex: 1;
  min-width: 0;
}

.component-item__name {
  font-size: var(--text-base);
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-1);
}

.component-item__cost {
  font-size: var(--text-xs);
  color: var(--color-neutral-600);
}

.component-item__badge {
  position: absolute;
  top: -4px;
  right: -4px;
  padding: 2px 6px;
  background: var(--color-primary-500);
  color: white;
  border-radius: var(--radius-full);
  font-size: 10px;
  font-weight: var(--font-bold);
  text-transform: uppercase;
}

.component-item:hover {
  background: var(--color-primary-50);
  border-color: var(--color-primary-300);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.component-item:active {
  cursor: grabbing;
  transform: scale(0.98);
}

.component-item--dragging {
  opacity: 0.5;
  cursor: grabbing;
}

.component-item--locked {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--color-neutral-100);
}

.component-item--locked:hover {
  transform: none;
  box-shadow: none;
  border-color: var(--color-neutral-200);
}

.component-item__lock-icon {
  position: absolute;
  right: var(--space-3);
  color: var(--color-neutral-400);
}
```

---

## 6. Real-time Metrics Dashboard

### 6.1 Metrics Container
```css
.metrics-dashboard {
  position: fixed;
  top: var(--space-4);
  right: var(--space-4);
  width: 320px;
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
}

.metrics-dashboard__header {
  padding: var(--space-4);
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.metrics-dashboard__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.metrics-dashboard__status {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.metrics-dashboard__status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-secondary-500);
  animation: pulse-status 2s ease-in-out infinite;
}

.metrics-dashboard__status-indicator--warning {
  background: var(--color-warning-500);
}

.metrics-dashboard__status-indicator--critical {
  background: var(--color-error-500);
  animation: pulse-critical 0.5s ease-in-out infinite alternate;
}

@keyframes pulse-status {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
```

### 6.2 Metric Cards
```css
.metric-card {
  padding: var(--space-4);
  border-bottom: 1px solid var(--color-neutral-100);
  transition: background var(--duration-fast) var(--ease-out);
}

.metric-card:hover {
  background: var(--color-neutral-50);
}

.metric-card__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-2);
}

.metric-card__label {
  font-size: var(--text-small);
  color: var(--color-neutral-600);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.metric-card__trend {
  display: flex;
  align-items: center;
  gap: var(--space-1);
  font-size: var(--text-xs);
}

.metric-card__trend--up {
  color: var(--color-secondary-600);
}

.metric-card__trend--down {
  color: var(--color-error-600);
}

.metric-card__value {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-1);
}

.metric-card__unit {
  font-size: var(--text-small);
  color: var(--color-neutral-500);
  margin-left: var(--space-1);
}

.metric-card__progress {
  height: 4px;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.metric-card__progress-bar {
  height: 100%;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
}

.metric-card__progress-bar--warning {
  background: var(--color-warning-500);
}

.metric-card__progress-bar--critical {
  background: var(--color-error-500);
}
```

---

## 7. Data Flow Visualization

### 7.1 Packet Animation System
```css
.data-packet {
  position: absolute;
  width: 12px;
  height: 12px;
  background: var(--sim-packet-color);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--sim-packet-glow);
  pointer-events: none;
  z-index: 5;
}

.data-packet--http {
  background: var(--color-primary-500);
  box-shadow: 0 0 8px rgba(59, 130, 246, 0.6);
}

.data-packet--database {
  background: var(--color-secondary-500);
  box-shadow: 0 0 8px rgba(34, 197, 94, 0.6);
}

.data-packet--cache {
  background: var(--color-warning-500);
  box-shadow: 0 0 8px rgba(249, 115, 22, 0.6);
}

.data-packet--error {
  background: var(--color-error-500);
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
  animation: pulse-error 0.3s ease-in-out infinite;
}

@keyframes pulse-error {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* Packet Trail Effect */
.data-packet::before {
  content: '';
  position: absolute;
  inset: -2px;
  background: inherit;
  border-radius: 50%;
  opacity: 0.3;
  animation: packet-trail 0.5s ease-out;
}

@keyframes packet-trail {
  0% { transform: scale(1); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}
```

### 7.2 Connection Animation States
```css
/* Flow Line States */
.flow-line {
  stroke-width: 2;
  fill: none;
  transition: all var(--duration-fast) var(--ease-out);
}

.flow-line--idle {
  stroke: var(--color-neutral-300);
  stroke-dasharray: 5 10;
  opacity: 0.5;
}

.flow-line--active {
  stroke: var(--sim-flow-normal);
  stroke-dasharray: 0;
  opacity: 1;
}

.flow-line--heavy {
  stroke: var(--sim-flow-congested);
  stroke-width: 4;
}

.flow-line--critical {
  stroke: var(--sim-flow-failing);
  stroke-width: 6;
  animation: pulse-critical-line 0.5s ease-in-out infinite alternate;
}

@keyframes pulse-critical-line {
  0% { opacity: 1; }
  100% { opacity: 0.4; }
}

/* Bandwidth Indicator */
.bandwidth-indicator {
  position: absolute;
  padding: var(--space-1) var(--space-2);
  background: var(--color-neutral-900);
  color: white;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  pointer-events: none;
  z-index: 10;
}

.bandwidth-indicator--warning {
  background: var(--color-warning-600);
}

.bandwidth-indicator--critical {
  background: var(--color-error-600);
}
```

---

## 8. Achievement & Notification System

### 8.1 Achievement Toast
```css
.achievement-toast {
  position: fixed;
  bottom: var(--space-4);
  right: var(--space-4);
  min-width: 320px;
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  animation: slide-in-right 0.3s var(--ease-bounce);
  z-index: 100;
}

@keyframes slide-in-right {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.achievement-toast__border {
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(to bottom, var(--color-premium-500), var(--color-primary-500));
}

.achievement-toast__content {
  padding: var(--space-4);
  display: flex;
  gap: var(--space-4);
}

.achievement-toast__icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, var(--color-premium-100), var(--color-primary-100));
  color: var(--color-premium-700);
  flex-shrink: 0;
}

.achievement-toast__text {
  flex: 1;
}

.achievement-toast__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-1);
}

.achievement-toast__description {
  font-size: var(--text-small);
  color: var(--color-neutral-600);
}

.achievement-toast__close {
  position: absolute;
  top: var(--space-2);
  right: var(--space-2);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-neutral-400);
  cursor: pointer;
  transition: all var(--duration-fast) var(--ease-out);
}

.achievement-toast__close:hover {
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
}
```

### 8.2 Progress Notification
```css
.progress-notification {
  position: fixed;
  top: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-3) var(--space-6);
  background: var(--color-neutral-900);
  color: white;
  border-radius: var(--radius-full);
  font-size: var(--text-small);
  font-weight: var(--font-medium);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: fade-in-down 0.3s var(--ease-out);
  z-index: 90;
}

@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.progress-notification__icon {
  display: inline-block;
  margin-right: var(--space-2);
  animation: spin 1s linear infinite;
}

.progress-notification--success {
  background: var(--color-secondary-600);
}

.progress-notification--error {
  background: var(--color-error-600);
}
```

---

## 9. Multiplayer Interface Components

### 9.1 Challenge Mode Leaderboard
```css
.challenge-leaderboard {
  position: fixed;
  left: var(--space-4);
  top: 50%;
  transform: translateY(-50%);
  width: 280px;
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 10;
}

.challenge-leaderboard__header {
  padding: var(--space-4);
  background: linear-gradient(135deg, var(--color-primary-600), var(--color-primary-700));
  color: white;
}

.challenge-leaderboard__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  margin-bottom: var(--space-1);
}

.challenge-leaderboard__timer {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  font-variant-numeric: tabular-nums;
}

.challenge-leaderboard__players {
  padding: var(--space-2);
  max-height: 400px;
  overflow-y: auto;
}

.challenge-player {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  transition: background var(--duration-fast) var(--ease-out);
}

.challenge-player:hover {
  background: var(--color-neutral-50);
}

.challenge-player__rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-full);
  background: var(--color-neutral-100);
  font-size: var(--text-xs);
  font-weight: var(--font-bold);
}

.challenge-player__rank--1 {
  background: linear-gradient(135deg, #FFD700, #FFA500);
  color: white;
}

.challenge-player__rank--2 {
  background: linear-gradient(135deg, #C0C0C0, #808080);
  color: white;
}

.challenge-player__rank--3 {
  background: linear-gradient(135deg, #CD7F32, #8B4513);
  color: white;
}

.challenge-player__info {
  flex: 1;
}

.challenge-player__name {
  font-size: var(--text-small);
  font-weight: var(--font-medium);
  color: var(--color-neutral-900);
}

.challenge-player__progress {
  margin-top: var(--space-1);
  height: 4px;
  background: var(--color-neutral-100);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.challenge-player__progress-bar {
  height: 100%;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  transition: width var(--duration-normal) var(--ease-out);
}

.challenge-player__score {
  font-size: var(--text-base);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
}

.challenge-player--current {
  background: var(--color-primary-50);
  border: 1px solid var(--color-primary-300);
}
```

### 9.2 Collaborate Mode Interface
```css
.collaborate-toolbar {
  position: fixed;
  bottom: var(--space-4);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-2);
  padding: var(--space-2);
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-full);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 20;
}

.collaborate-player-cursor {
  position: absolute;
  pointer-events: none;
  z-index: 1000;
  transition: all 50ms linear;
}

.collaborate-player-cursor__pointer {
  width: 20px;
  height: 20px;
  background: var(--color-primary-500);
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.collaborate-player-cursor__label {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  padding: var(--space-1) var(--space-2);
  background: var(--color-neutral-900);
  color: white;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  white-space: nowrap;
}

.collaborate-player-cursor--player-1 .collaborate-player-cursor__pointer {
  background: var(--color-primary-500);
}

.collaborate-player-cursor--player-2 .collaborate-player-cursor__pointer {
  background: var(--color-secondary-500);
}

.collaborate-player-cursor--player-3 .collaborate-player-cursor__pointer {
  background: var(--color-warning-500);
}

.collaborate-player-cursor--player-4 .collaborate-player-cursor__pointer {
  background: var(--color-premium-500);
}

.collaborate-chat {
  position: fixed;
  right: var(--space-4);
  bottom: var(--space-4);
  width: 320px;
  height: 400px;
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-xl);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 15;
}

.collaborate-chat__header {
  padding: var(--space-3) var(--space-4);
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-neutral-200);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.collaborate-chat__messages {
  flex: 1;
  padding: var(--space-4);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.collaborate-chat__message {
  max-width: 80%;
}

.collaborate-chat__message--own {
  align-self: flex-end;
}

.collaborate-chat__message-bubble {
  padding: var(--space-2) var(--space-3);
  background: var(--color-neutral-100);
  border-radius: var(--radius-lg);
  font-size: var(--text-small);
}

.collaborate-chat__message--own .collaborate-chat__message-bubble {
  background: var(--color-primary-500);
  color: white;
}

.collaborate-chat__input {
  padding: var(--space-3) var(--space-4);
  border-top: 1px solid var(--color-neutral-200);
  display: flex;
  gap: var(--space-2);
}
```

---

## 10. React Flow Advanced Components

### 10.1 MiniMap Customization
```css
.react-flow__minimap {
  background: var(--color-neutral-100);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.react-flow__minimap-mask {
  fill: var(--color-neutral-200);
  opacity: 0.3;
}

.react-flow__minimap-node {
  fill: var(--color-primary-400);
  stroke: var(--color-primary-600);
  stroke-width: 1;
}

.react-flow__minimap-node--compute {
  fill: var(--color-primary-400);
}

.react-flow__minimap-node--storage {
  fill: var(--color-secondary-400);
}

.react-flow__minimap-node--networking {
  fill: var(--color-info-400);
}

.react-flow__minimap-node--security {
  fill: var(--color-premium-400);
}

.react-flow__minimap-node--operations {
  fill: var(--color-warning-400);
}
```

### 10.2 Controls Panel
```css
.react-flow__controls {
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.react-flow__controls-button {
  width: 36px;
  height: 36px;
  background: var(--color-white);
  border: none;
  border-bottom: 1px solid var(--color-neutral-200);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--duration-fast) var(--ease-out);
}

.react-flow__controls-button:last-child {
  border-bottom: none;
}

.react-flow__controls-button:hover {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
}

.react-flow__controls-button:active {
  transform: scale(0.95);
}

.react-flow__controls-button svg {
  width: 18px;
  height: 18px;
}
```

### 10.3 Background Pattern
```css
.react-flow__background {
  background-color: var(--design-canvas-bg);
}

.react-flow__background pattern .react-flow__background-path {
  stroke: var(--design-grid-line);
  stroke-width: 0.5;
}

/* Dots Pattern */
.react-flow__background-pattern--dots circle {
  fill: var(--design-grid-dot);
}

/* Lines Pattern */
.react-flow__background-pattern--lines path {
  stroke: var(--design-grid-line);
}

/* Cross Pattern */
.react-flow__background-pattern--cross path {
  stroke: var(--design-grid-line);
  stroke-width: 0.3;
}
```

### 10.4 Custom Panel Components
```css
.react-flow__panel {
  padding: var(--space-4);
  background: var(--color-white);
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-lg);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: var(--space-4);
}

.react-flow__panel--top-left {
  position: absolute;
  top: 0;
  left: 0;
}

.react-flow__panel--top-right {
  position: absolute;
  top: 0;
  right: 0;
}

.react-flow__panel--bottom-left {
  position: absolute;
  bottom: 0;
  left: 0;
}

.react-flow__panel--bottom-right {
  position: absolute;
  bottom: 0;
  right: 0;
}

/* Requirements Panel */
.requirements-panel {
  width: var(--canvas-requirements-width);
}

.requirements-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-4);
}

.requirements-panel__title {
  font-size: var(--text-base);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
}

.requirements-panel__status {
  display: flex;
  gap: var(--space-2);
}

.requirements-panel__item {
  display: flex;
  align-items: start;
  gap: var(--space-2);
  padding: var(--space-2) 0;
}

.requirements-panel__icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin-top: 2px;
}

.requirements-panel__icon--met {
  color: var(--color-secondary-500);
}

.requirements-panel__icon--unmet {
  color: var(--color-neutral-400);
}

.requirements-panel__icon--warning {
  color: var(--color-warning-500);
}

.requirements-panel__text {
  font-size: var(--text-small);
  color: var(--color-neutral-700);
  line-height: 1.4;
}

.requirements-panel__text--met {
  text-decoration: line-through;
  color: var(--color-neutral-500);
}
```

---

## 11. Loading States & Skeleton Screens

### 11.1 Component Loading States
```css
.skeleton {
  animation: skeleton-loading 1.5s ease-in-out infinite;
  background: linear-gradient(
    90deg,
    var(--color-neutral-200) 25%,
    var(--color-neutral-100) 50%,
    var(--color-neutral-200) 75%
  );
  background-size: 200% 100%;
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.skeleton-text {
  height: var(--text-base);
  border-radius: var(--radius-sm);
  margin-bottom: var(--space-2);
}

.skeleton-text--short {
  width: 40%;
}

.skeleton-text--medium {
  width: 70%;
}

.skeleton-text--long {
  width: 90%;
}

.skeleton-component-card {
  width: var(--node-standard-width);
  height: var(--node-standard-height);
  border-radius: var(--radius-lg);
}

.skeleton-metric-card {
  height: 80px;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-3);
}
```

### 11.2 Loading Indicators
```css
.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-neutral-200);
  border-top-color: var(--color-primary-500);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-spinner--small {
  width: 20px;
  height: 20px;
  border-width: 2px;
}

.loading-spinner--large {
  width: 60px;
  height: 60px;
  border-width: 4px;
}

.loading-dots {
  display: flex;
  gap: var(--space-1);
}

.loading-dots__dot {
  width: 8px;
  height: 8px;
  background: var(--color-primary-500);
  border-radius: 50%;
  animation: dot-pulse 1.4s ease-in-out infinite;
}

.loading-dots__dot:nth-child(1) { animation-delay: -0.32s; }
.loading-dots__dot:nth-child(2) { animation-delay: -0.16s; }
.loading-dots__dot:nth-child(3) { animation-delay: 0; }

@keyframes dot-pulse {
  0%, 80%, 100% {
    transform: scale(0.8);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-progress {
  height: 4px;
  background: var(--color-neutral-200);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.loading-progress__bar {
  height: 100%;
  background: var(--color-primary-500);
  border-radius: var(--radius-full);
  animation: progress-indeterminate 1.5s ease-in-out infinite;
}

@keyframes progress-indeterminate {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(200%);
  }
}
```

---

## 12. Modal & Dialog System

### 12.1 Base Modal Structure
```css
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fade-in var(--duration-normal) var(--ease-out);
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.modal {
  background: var(--color-white);
  border-radius: var(--radius-xl);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  max-width: 90vw;
  max-height: 90vh;
  overflow: hidden;
  animation: scale-in var(--duration-normal) var(--ease-bounce);
}

@keyframes scale-in {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.modal--small { width: 400px; }
.modal--medium { width: 600px; }
.modal--large { width: 800px; }
.modal--full { width: 90vw; height: 90vh; }

.modal__header {
  padding: var(--space-6);
  border-bottom: 1px solid var(--color-neutral-200);
}

.modal__title {
  font-size: var(--text-h2);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin: 0;
}

.modal__content {
  padding: var(--space-6);
  overflow-y: auto;
  max-height: calc(90vh - 160px);
}

.modal__footer {
  padding: var(--space-4) var(--space-6);
  border-top: 1px solid var(--color-neutral-200);
  display: flex;
  gap: var(--space-3);
  justify-content: flex-end;
}
```

### 12.2 Level Complete Modal
```css
.level-complete-modal {
  text-align: center;
}

.level-complete-modal__trophy {
  width: 120px;
  height: 120px;
  margin: 0 auto var(--space-6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-premium-400), var(--color-primary-400));
  color: white;
  font-size: 48px;
  animation: trophy-bounce 0.6s var(--ease-bounce);
}

@keyframes trophy-bounce {
  0% { transform: scale(0); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}

.level-complete-modal__stars {
  display: flex;
  gap: var(--space-2);
  justify-content: center;
  margin-bottom: var(--space-4);
}

.level-complete-modal__star {
  width: 48px;
  height: 48px;
  color: var(--color-neutral-300);
  transition: all var(--duration-normal) var(--ease-out);
}

.level-complete-modal__star--earned {
  color: var(--color-warning-500);
  animation: star-pop 0.4s var(--ease-bounce);
}

@keyframes star-pop {
  0% { transform: scale(0) rotate(0deg); }
  50% { transform: scale(1.2) rotate(180deg); }
  100% { transform: scale(1) rotate(360deg); }
}

.level-complete-modal__metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-4);
  margin: var(--space-6) 0;
}

.level-complete-modal__metric {
  padding: var(--space-4);
  background: var(--color-neutral-50);
  border-radius: var(--radius-lg);
}

.level-complete-modal__metric-value {
  font-size: var(--text-h3);
  font-weight: var(--font-bold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-1);
}

.level-complete-modal__metric-label {
  font-size: var(--text-small);
  color: var(--color-neutral-600);
}
```

---

## 13. Form Components

### 13.1 Form Controls
```css
.form-group {
  margin-bottom: var(--space-4);
}

.form-label {
  display: block;
  font-size: var(--text-small);
  font-weight: var(--font-medium);
  color: var(--color-neutral-700);
  margin-bottom: var(--space-2);
}

.form-label--required::after {
  content: " *";
  color: var(--color-error-500);
}

.form-input {
  width: 100%;
  padding: var(--space-3) var(--space-4);
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--text-base);
  transition: all var(--duration-fast) var(--ease-out);
}

.form-input:hover {
  border-color: var(--color-neutral-400);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary-500);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input--error {
  border-color: var(--color-error-500);
}

.form-input--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-input--success {
  border-color: var(--color-secondary-500);
}

.form-input--success:focus {
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.1);
}

.form-help-text {
  font-size: var(--text-xs);
  color: var(--color-neutral-600);
  margin-top: var(--space-1);
}

.form-error-text {
  font-size: var(--text-xs);
  color: var(--color-error-600);
  margin-top: var(--space-1);
}

.form-select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%236B7280' d='M6 8L2 4h8z'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right var(--space-3) center;
  padding-right: var(--space-10);
}

.form-checkbox-group,
.form-radio-group {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.form-checkbox,
.form-radio {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
}

.form-checkbox input[type="checkbox"],
.form-radio input[type="radio"] {
  width: 16px;
  height: 16px;
  flex-shrink: 0;
  accent-color: var(--color-primary-500);
  cursor: pointer;
}

.form-checkbox-label,
.form-radio-label {
  font-size: var(--text-base);
  color: var(--color-neutral-700);
  cursor: pointer;
}
```

### 13.2 Switch Component
```css
.switch {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.switch__input {
  opacity: 0;
  width: 0;
  height: 0;
}

.switch__slider {
  position: absolute;
  inset: 0;
  background: var(--color-neutral-300);
  border-radius: var(--radius-full);
  transition: all var(--duration-normal) var(--ease-out);
  cursor: pointer;
}

.switch__slider::before {
  content: "";
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: white;
  border-radius: 50%;
  transition: all var(--duration-normal) var(--ease-out);
}

.switch__input:checked + .switch__slider {
  background: var(--color-primary-500);
}

.switch__input:checked + .switch__slider::before {
  transform: translateX(20px);
}

.switch__input:focus + .switch__slider {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
}

.switch__input:disabled + .switch__slider {
  background: var(--color-neutral-200);
  cursor: not-allowed;
}

.switch__input:disabled + .switch__slider::before {
  background: var(--color-neutral-100);
}
```

---

## 14. Error States & Empty States

### 14.1 Error States
```css
.error-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.error-state__icon {
  width: 80px;
  height: 80px;
  margin: 0 auto var(--space-6);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: var(--color-error-100);
  color: var(--color-error-600);
}

.error-state__title {
  font-size: var(--text-h3);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-2);
}

.error-state__description {
  font-size: var(--text-base);
  color: var(--color-neutral-600);
  margin-bottom: var(--space-6);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.error-state__actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
}
```

### 14.2 Empty States
```css
.empty-state {
  text-align: center;
  padding: var(--space-12) var(--space-6);
}

.empty-state__illustration {
  width: 200px;
  height: 200px;
  margin: 0 auto var(--space-6);
  opacity: 0.8;
}

.empty-state__title {
  font-size: var(--text-h3);
  font-weight: var(--font-semibold);
  color: var(--color-neutral-900);
  margin-bottom: var(--space-2);
}

.empty-state__description {
  font-size: var(--text-base);
  color: var(--color-neutral-600);
  margin-bottom: var(--space-6);
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.empty-state__action {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
}
```

---

## 15. Responsive Design Specifications

### 15.1 Breakpoint Behaviors
```css
/* Tablet (768px - 1023px) */
@media (min-width: 768px) and (max-width: 1023px) {
  .component-drawer {
    width: 280px;
  }
  
  .metrics-dashboard {
    width: 280px;
    font-size: var(--text-small);
  }
  
  .react-flow__node-component {
    min-width: var(--node-compact-width);
    min-height: var(--node-compact-height);
  }
  
  .modal--large {
    width: 90vw;
  }
}

/* Small Desktop (1024px - 1279px) */
@media (min-width: 1024px) and (max-width: 1279px) {
  .component-drawer {
    width: 300px;
  }
  
  .requirements-panel {
    width: 260px;
  }
}

/* Mobile (< 768px) - Limited Support */
@media (max-width: 767px) {
  /* Show mobile-specific message */
  .mobile-message {
    display: flex;
    position: fixed;
    inset: 0;
    background: var(--color-primary-600);
    color: white;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: var(--space-6);
  }
  
  .game-container {
    display: none;
  }
}
```

### 15.2 Touch-Specific Styles
```css
@media (hover: none) and (pointer: coarse) {
  /* Increase touch targets */
  .button {
    min-height: 44px;
  }
  
  .form-input,
  .form-select {
    min-height: 44px;
  }
  
  .react-flow__handle {
    width: 16px;
    height: 16px;
  }
  
  /* Remove hover effects */
  .component-item:hover {
    transform: none;
    box-shadow: none;
  }
  
  /* Add active states for touch feedback */
  .component-item:active {
    background: var(--color-primary-50);
  }
}
```

---

## 16. Print Styles

```css
@media print {
  /* Hide UI controls */
  .component-drawer,
  .metrics-dashboard,
  .react-flow__controls,
  .modal-overlay,
  .achievement-toast,
  .collaborate-chat {
    display: none !important;
  }
  
  /* Optimize canvas for printing */
  .react-flow-canvas {
    background: white !important;
  }
  
  .react-flow__background {
    display: none !important;
  }
  
  .react-flow__edge {
    stroke: black !important;
  }
  
  .react-flow__node-component {
    border-color: black !important;
    box-shadow: none !important;
  }
  
  /* Ensure text is readable */
  * {
    color: black !important;
    background: white !important;
  }
}
```

---

## 17. Dark Mode (Future Enhancement)

```css
[data-theme="dark"] {
  /* Color overrides */
  --color-neutral-50: #0F172A;
  --color-neutral-100: #1E293B;
  --color-neutral-200: #334155;
  --color-neutral-300: #475569;
  --color-neutral-400: #64748B;
  --color-neutral-500: #94A3B8;
  --color-neutral-600: #CBD5E1;
  --color-neutral-700: #E2E8F0;
  --color-neutral-800: #F1F5F9;
  --color-neutral-900: #F8FAFC;
  --color-white: #0F172A;
  
  /* Component adjustments */
  --component-healthy: #10B981;
  --component-stressed: #F59E0B;
  --component-overloaded: #EF4444;
  
  /* Reduced contrast for dark mode */
  --design-canvas-bg: #0F172A;
  --design-grid-line: #1E293B;
  --design-grid-dot: #334155;
}

/* Dark mode specific adjustments */
[data-theme="dark"] .react-flow__node-component {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

[data-theme="dark"] .modal {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}
```

---

## 18. Implementation Notes

### 18.1 CSS Architecture
- Use CSS Modules or styled-components for component isolation
- Implement CSS custom properties at :root level
- Use PostCSS for vendor prefixing and optimization
- Ensure all animations respect prefers-reduced-motion

### 18.2 Performance Optimization
- Use CSS containment for complex components
- Implement will-change for animated elements
- Use transform and opacity for animations (GPU acceleration)
- Lazy load component styles based on game progression

### 18.3 Testing Requirements
- Visual regression testing for all component states
- Cross-browser testing (Chrome, Firefox, Safari, Edge)
- Accessibility testing with screen readers
- Performance testing for animation frame rates

---

*This Comprehensive UI Design System provides complete specifications for implementing System Design Tycoon's interface. All measurements, colors, and behaviors have been carefully crafted to create an educational, engaging, and accessible gaming experience.*

**Version:** 2.0  
**Last Updated:** July 14, 2025  
**Next Review:** Weekly during active development  
**Maintainer:** Design Team