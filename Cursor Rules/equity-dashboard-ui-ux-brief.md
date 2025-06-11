# UI/UX Design Instructions - Apple-Style Investment Dashboard

## 🎨 Design Philosophy

### Core Principles
- **Clarity over Complexity**: Every element should have a clear purpose
- **Content First**: Let the data breathe with generous white space
- **Subtle Depth**: Use shadows and layers to create hierarchy without clutter
- **Purposeful Motion**: Animations should feel natural and aid understanding
- **Touch-First**: Design for fingers first, cursors second

---

## 🎯 Visual Language

### Typography System

```css
/* Primary Font Stack - Apple System Fonts */
--font-system: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Arial, sans-serif;

/* Font Sizes - Mobile First */
--text-xs: 0.75rem;    /* 12px - Captions */
--text-sm: 0.875rem;   /* 14px - Secondary text */
--text-base: 1rem;     /* 16px - Body text */
--text-lg: 1.125rem;   /* 18px - Emphasized body */
--text-xl: 1.5rem;     /* 24px - Section headers */
--text-2xl: 2rem;      /* 32px - Page titles */
--text-3xl: 2.5rem;    /* 40px - Hero numbers */

/* Font Weights */
--font-light: 300;
--font-regular: 400;
--font-medium: 500;
--font-semibold: 600;
--font-bold: 700;

/* Line Heights */
--leading-tight: 1.25;
--leading-normal: 1.5;
--leading-relaxed: 1.75;

/* Letter Spacing */
--tracking-tight: -0.02em;
--tracking-normal: 0;
--tracking-wide: 0.02em;
```

### Color Palette

```css
/* Background Colors - Light Theme */
--bg-primary: #FFFFFF;
--bg-secondary: #F5F5F7;
--bg-tertiary: #FAFAFA;
--bg-canvas: #F2F2F7; /* iOS-style background */

/* Surface Colors */
--surface-primary: #FFFFFF;
--surface-secondary: rgba(255, 255, 255, 0.8);
--surface-glass: rgba(255, 255, 255, 0.72);

/* Text Colors */
--text-primary: #1D1D1F;
--text-secondary: #6E6E73;
--text-tertiary: #8E8E93;
--text-quaternary: #C7C7CC;

/* Accent Colors - Pastel Palette */
--accent-blue: #007AFF;      /* Primary actions */
--accent-green: #34C759;     /* Positive/Growth */
--accent-red: #FF3B30;       /* Negative/Decline */
--accent-orange: #FF9500;    /* Warnings */
--accent-purple: #AF52DE;    /* Special highlights */
--accent-teal: #5AC8FA;      /* Secondary actions */
--accent-pink: #FF2D55;      /* Emphasis */

/* Pastel Variations for Charts/Backgrounds */
--pastel-blue: #E3F2FF;
--pastel-green: #E8F8ED;
--pastel-red: #FFEBE9;
--pastel-orange: #FFF0E0;
--pastel-purple: #F3E8FF;
--pastel-teal: #E0F5FF;
--pastel-pink: #FFE5EA;

/* Semantic Colors */
--color-success: var(--accent-green);
--color-danger: var(--accent-red);
--color-warning: var(--accent-orange);
--color-info: var(--accent-blue);

/* Cycle Phase Colors */
--phase-expansion: #34C759;
--phase-peak: #FF9500;
--phase-contraction: #FF3B30;
--phase-trough: #5856D6;
--phase-stable: #8E8E93;

/* Shadows */
--shadow-xs: 0 1px 3px rgba(0, 0, 0, 0.06);
--shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.04);
--shadow-md: 0 4px 14px rgba(0, 0, 0, 0.08);
--shadow-lg: 0 8px 28px rgba(0, 0, 0, 0.12);
--shadow-xl: 0 16px 48px rgba(0, 0, 0, 0.16);

/* Card Shadows (More Subtle) */
--card-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 
                0 1px 2px rgba(0, 0, 0, 0.06);
--card-shadow-hover: 0 8px 24px rgba(0, 0, 0, 0.08), 
                     0 2px 8px rgba(0, 0, 0, 0.04);
```

### Spacing System

```css
/* 4px Base Unit System */
--space-0: 0;
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
--space-20: 5rem;     /* 80px */

/* Component Spacing */
--card-padding: var(--space-5);
--section-gap: var(--space-8);
--container-padding: var(--space-4);
```

### Border Radius

```css
--radius-sm: 6px;
--radius-md: 10px;
--radius-lg: 16px;
--radius-xl: 20px;
--radius-full: 9999px;

/* Component Specific */
--card-radius: var(--radius-lg);
--button-radius: var(--radius-md);
--input-radius: var(--radius-md);
--badge-radius: var(--radius-sm);
```

---

## 📱 Component Patterns

### Cards

```css
.card {
  background: var(--surface-primary);
  border-radius: var(--card-radius);
  padding: var(--space-5);
  box-shadow: var(--card-shadow);
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
  
  /* Subtle hover effect */
  &:hover {
    transform: translateY(-2px);
    box-shadow: var(--card-shadow-hover);
  }
}

/* Glass Card Variant */
.card-glass {
  background: var(--surface-glass);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### Metric Cards

```
Structure:
┌─────────────────────────┐
│ Label      ┌──────────┐ │
│            │ Sparkline │ │
│ Value      └──────────┘ │
│ Change                  │
└─────────────────────────┘

Specifications:
- Label: text-sm, text-secondary, font-medium
- Value: text-2xl, text-primary, font-semibold
- Change: text-sm, color based on positive/negative
- Sparkline: 60x32px, subtle stroke, no fill
```

### Buttons

```css
/* Primary Button */
.button-primary {
  background: var(--accent-blue);
  color: white;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--button-radius);
  font-weight: var(--font-medium);
  font-size: var(--text-base);
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  
  /* Apple-style button press effect */
  &:active {
    transform: scale(0.98);
  }
}

/* Secondary Button */
.button-secondary {
  background: var(--bg-secondary);
  color: var(--text-primary);
  /* Same structure as primary */
}

/* Ghost Button */
.button-ghost {
  background: transparent;
  color: var(--accent-blue);
  border: 1px solid var(--accent-blue);
}
```

### Phase Badges

```css
.phase-badge {
  display: inline-flex;
  align-items: center;
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: var(--text-sm);
  font-weight: var(--font-medium);
  
  /* Phase-specific colors */
  &.expansion {
    background: var(--pastel-green);
    color: var(--phase-expansion);
  }
  
  &.contraction {
    background: var(--pastel-red);
    color: var(--phase-contraction);
  }
}
```

### Charts

```css
/* Chart Container */
.chart-container {
  background: var(--surface-primary);
  border-radius: var(--card-radius);
  padding: var(--space-5);
  
  /* Chart Title */
  .chart-title {
    font-size: var(--text-lg);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
    margin-bottom: var(--space-4);
  }
  
  /* Chart Canvas */
  .chart-canvas {
    height: 240px; /* Fixed height for consistency */
    
    @media (min-width: 768px) {
      height: 320px;
    }
  }
}

/* Chart Styling Guidelines */
- Line thickness: 2px
- Grid lines: 1px, rgba(0, 0, 0, 0.06)
- Axis text: text-sm, text-tertiary
- Smooth curves with tension: 0.4
- Subtle area fills with 10% opacity
- Hover states with enlarged dots
```

### Navigation

```css
.nav-tabs {
  display: flex;
  gap: var(--space-1);
  padding: var(--space-1);
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  
  .nav-tab {
    flex: 1;
    padding: var(--space-2) var(--space-4);
    border-radius: calc(var(--radius-md) - 2px);
    font-size: var(--text-sm);
    font-weight: var(--font-medium);
    color: var(--text-secondary);
    transition: all 0.2s ease;
    
    &.active {
      background: var(--surface-primary);
      color: var(--text-primary);
      box-shadow: var(--shadow-sm);
    }
  }
}
```

---

## 🎭 Interaction Patterns

### Hover States
- **Cards**: Subtle lift with shadow enhancement
- **Buttons**: Brightness adjustment or scale
- **Charts**: Highlight data points with tooltips
- **Links**: Color transition with underline

### Loading States
```css
/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-secondary) 0%,
    var(--bg-tertiary) 50%,
    var(--bg-secondary) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
  border-radius: var(--radius-sm);
}

@keyframes skeleton-loading {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
```

### Transitions
```css
/* Global Transition Settings */
--transition-fast: 150ms ease;
--transition-base: 200ms ease;
--transition-slow: 300ms ease;

/* Spring-like Animations */
--transition-spring: 300ms cubic-bezier(0.68, -0.55, 0.265, 1.55);
```

---

## 📐 Layout Patterns

### Mobile-First Grid

```css
/* Container */
.container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 var(--container-padding);
}

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  gap: var(--space-4);
  
  /* Mobile: Single column */
  grid-template-columns: 1fr;
  
  /* Tablet: 2 columns */
  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-6);
  }
  
  /* Desktop: Flexible columns */
  @media (min-width: 1024px) {
    grid-template-columns: repeat(12, 1fr);
    
    /* Span patterns for different components */
    .span-full { grid-column: 1 / -1; }
    .span-half { grid-column: span 6; }
    .span-third { grid-column: span 4; }
    .span-two-thirds { grid-column: span 8; }
  }
}
```

### Section Spacing

```css
.section {
  margin-bottom: var(--space-8);
  
  @media (min-width: 768px) {
    margin-bottom: var(--space-12);
  }
}

.section-header {
  margin-bottom: var(--space-4);
  
  h2 {
    font-size: var(--text-xl);
    font-weight: var(--font-semibold);
    color: var(--text-primary);
  }
}
```

---

## 🎨 Visual Effects

### Glass Morphism

```css
.glass-effect {
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.18);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}
```

### Gradient Overlays

```css
/* Subtle gradient for headers */
.gradient-header {
  background: linear-gradient(
    135deg,
    var(--pastel-blue) 0%,
    var(--pastel-purple) 100%
  );
}

/* Chart gradient fills */
.chart-gradient-green {
  background: linear-gradient(
    to bottom,
    rgba(52, 199, 89, 0.2) 0%,
    rgba(52, 199, 89, 0) 100%
  );
}
```

### Focus States

```css
/* Accessible focus rings */
:focus-visible {
  outline: 2px solid var(--accent-blue);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
```

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Breakpoints */
--screen-sm: 640px;   /* Small tablets */
--screen-md: 768px;   /* Tablets */
--screen-lg: 1024px;  /* Desktop */
--screen-xl: 1280px;  /* Large desktop */

/* Usage */
@media (min-width: 768px) { }
@media (min-width: 1024px) { }
```

---

## ✨ Micro-Interactions

### Number Animations
```css
/* Animate number changes */
.metric-value {
  transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Counting animation for important metrics */
@keyframes count-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Chart Interactions
- **Hover**: Show tooltip with exact values
- **Touch**: Tap to see details, swipe to pan
- **Zoom**: Pinch to zoom on mobile, scroll on desktop
- **Selection**: Drag to select time range

### Page Transitions
```css
/* Smooth page enters */
.page-enter {
  animation: page-enter 0.3s ease forwards;
}

@keyframes page-enter {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🎯 Best Practices

### Do's
- ✅ Use consistent spacing multiples (4px base)
- ✅ Maintain 44px minimum touch targets
- ✅ Keep contrast ratios above 4.5:1
- ✅ Use system fonts for better performance
- ✅ Implement smooth, purposeful animations
- ✅ Design for thumb reach on mobile
- ✅ Use semantic color names
- ✅ Test on real devices

### Don'ts
- ❌ Don't use more than 3 font weights
- ❌ Avoid harsh shadows or borders
- ❌ Don't animate everything
- ❌ Avoid tiny click targets
- ❌ Don't use pure black (#000)
- ❌ Avoid information overload

---

## 🔧 Implementation Notes

### CSS Architecture
```scss
// Use CSS Modules or styled-components
// Organize styles by component
styles/
  ├── globals.css      // Reset and base styles
  ├── variables.css    // Design tokens
  ├── components/      // Component styles
  ├── layouts/         // Layout styles
  └── utilities/       // Helper classes
```

### Performance Guidelines
- Use CSS transforms for animations (not position)
- Implement virtual scrolling for large lists
- Lazy load images and heavy components
- Use CSS Grid and Flexbox over floats
- Minimize reflows with fixed dimensions

### Accessibility
- Maintain keyboard navigation
- Use proper ARIA labels
- Ensure color isn't the only indicator
- Test with screen readers
- Support reduced motion preferences

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 🎨 Example Component

```jsx
// Metric Card Example
<div className="metric-card">
  <div className="metric-header">
    <span className="metric-label">Revenue Growth</span>
    <div className="metric-sparkline">
      {/* Mini chart here */}
    </div>
  </div>
  
  <div className="metric-value">
    ₹24.5 Cr
  </div>
  
  <div className="metric-change positive">
    <svg className="icon-trend-up" />
    <span>+12.4%</span>
    <span className="metric-period">vs last quarter</span>
  </div>
</div>
```

---

## 🚀 Real Data Testing Protocol

### Testing Schedule
After each major UI task completion (Tasks 5.0, 6.0, 7.0, etc.), we will:

1. **Load Real Company Data**: Use Emami and Axis Bank datasets
2. **Visual Review**: Check layouts, spacing, and readability
3. **Interaction Testing**: Test hover states, transitions, and responsiveness
4. **Performance Check**: Ensure smooth rendering with real data volumes
5. **Mobile Testing**: Verify touch interactions and mobile layouts

### Testing Checklist
- [ ] Data displays correctly without layout breaks
- [ ] Charts render smoothly with real data points
- [ ] Colors and phase indicators work as expected
- [ ] Mobile responsiveness maintained
- [ ] Performance remains within targets (<2s load time)
- [ ] Accessibility features function properly

---

Remember: **Elegance is the elimination of excess.** Every pixel should earn its place on the screen. 