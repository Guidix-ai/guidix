# Styling Centralization Strategy

## Executive Summary

This document outlines the strategy to migrate from inline CSS styles to a centralized, maintainable, and reusable styling system for the Guidix Resume Builder application.

**Current State:**
- 1,765 inline style occurrences across 53 files
- Mix of inline styles, CSS modules, and Tailwind CSS
- Duplicated style definitions across components
- Inconsistent design token usage

**Target State:**
- Centralized design system with reusable tokens
- Consistent styling methodology across the codebase
- Reduced code duplication
- Improved maintainability and developer experience

---

## Table of Contents

1. [Current Architecture Analysis](#current-architecture-analysis)
2. [Proposed Centralized Architecture](#proposed-centralized-architecture)
3. [Implementation Strategy](#implementation-strategy)
4. [Migration Roadmap](#migration-roadmap)
5. [Best Practices & Guidelines](#best-practices--guidelines)
6. [Tools & Resources](#tools--resources)

---

## Current Architecture Analysis

### Existing Styling Methods

The codebase currently uses **three different styling approaches**:

#### 1. **Inline Styles (1,765 occurrences)**
```javascript
// Example from job-search/page.js
<span style={{ position: "relative", display: "inline-flex" }}>
  {children}
</span>

// Example from enhanced-resume/page.js
const inputStyles = {
  width: "100%",
  height: 56,
  backgroundColor: colorTokens.bgLight,
  borderRadius: 16,
  // ...
};
```

**Issues:**
- No reusability
- Large bundle size
- Hard to maintain consistency
- Difficult to theme

#### 2. **CSS Modules (37 files)**
```
app/styles/
├── components/
│   ├── JobTracker.module.css
│   ├── JobCard.module.css
│   └── ...
├── pages/
│   ├── dashboard.module.css
│   ├── enhanced-resume.module.css
│   └── ...
└── ui/
    ├── button.module.css
    └── card.module.css
```

**Benefits:**
- Scoped styles
- Traditional CSS syntax
- Prevents naming conflicts

#### 3. **Tailwind CSS v4 + CSS Variables**
```css
/* globals.css */
:root {
  --brand-primary: #2370FF;
  --brand-primary-dark: #2B49C2;
  --neutral-lightest: #F6F7FA;
  /* ... */
}
```

**Benefits:**
- Utility-first approach
- Built-in design constraints
- Excellent DX with autocomplete
- Small production bundle

### Current Design Tokens

Already defined in `globals.css`:

| Category | Examples | Count |
|----------|----------|-------|
| **Colors** | `--brand-primary`, `--neutral-lightest` | 20+ |
| **Shadows** | `--ShadowBlurMedium`, `--ShadowPositioningNone` | 7 |
| **Overlays** | `--ColorsOverlayColorsDark10` | 3 |

### High-Impact Files (Top 10)

| File | Inline Styles | Category |
|------|--------------|----------|
| `app/(pages)/enhanced-resume/page.js` | 152 | Page |
| `app/(pages)/job-search/page.js` | 134 | Page |
| `app/(pages)/job-search/JobCardRefined.tsx` | 78 | Component |
| `app/(pages)/job-details/[id]/page.js` | 73 | Page |
| `components/pdf-templates/job/JobTemplate2WithoutPhoto.js` | 71 | PDF Template |
| `components/pdf-templates/job/JobTemplate3WithPhoto.js` | 66 | PDF Template |
| `components/pdf-templates/job/JobTemplate2WithPhoto.js` | 64 | PDF Template |
| `app/(pages)/resume-builder/page.js` | 62 | Page |
| `components/pdf-templates/internship/InternshipTemplate2WithoutPhoto.js` | 55 | PDF Template |
| `components/layout/dashboard-layout.js` | 48 | Layout |

---

## Proposed Centralized Architecture

### Three-Tier Styling System

```
┌─────────────────────────────────────────────────────┐
│                  Tier 1: Foundation                  │
│          Design Tokens + CSS Variables              │
│    (Colors, Spacing, Typography, Shadows, etc.)     │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                  Tier 2: Primitives                  │
│          Tailwind Utilities + Base Classes          │
│      (Utility classes, Component base styles)       │
└─────────────────────────────────────────────────────┘
                         ↓
┌─────────────────────────────────────────────────────┐
│                 Tier 3: Components                   │
│        Component Variants + Compositions            │
│     (Button variants, Card styles, Layouts)         │
└─────────────────────────────────────────────────────┘
```

### File Structure

```
guidix/
├── app/
│   └── styles/
│       ├── globals.css                    # Tailwind imports + custom utilities
│       ├── design-tokens.css              # CSS variables (foundation)
│       └── component-variants.css         # Reusable component classes
│
├── lib/
│   ├── design-system/
│   │   ├── tokens.js                      # JS design tokens (for inline when needed)
│   │   ├── shadows.js                     # Shadow utilities
│   │   ├── colors.js                      # Color palette
│   │   ├── typography.js                  # Font configurations
│   │   └── spacing.js                     # Spacing scale
│   │
│   └── utils/
│       ├── cn.js                          # Tailwind class merger (already exists)
│       └── style-utils.js                 # Helper functions for dynamic styles
│
└── components/
    └── ui/
        ├── button.tsx                     # Using Tailwind + CVA
        ├── card.tsx                       # Using Tailwind + CVA
        └── ...
```

---

## Implementation Strategy

### Phase 1: Foundation Setup (Week 1)

#### 1.1 Create Design Token System

**File:** `lib/design-system/tokens.js`

```javascript
/**
 * Design Tokens - Single Source of Truth
 * These tokens are used when CSS variables cannot be applied (e.g., JS calculations, PDF templates)
 */

export const colors = {
  // Brand Colors
  brand: {
    primary: '#2370FF',
    primaryDark: '#2B49C2',
    primaryDarker: '#0355BE',
    primaryDarkest: '#002A79',
  },

  // Semantic Colors
  semantic: {
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
  },

  // Neutral Colors
  neutral: {
    white: '#FFFFFF',
    lightest: '#F6F7FA',
    light: '#F3F7FF',
    mediumLight: '#E1E4EB',
    medium: '#C4C9D6',
    mediumDark: '#8A96C9',
    dark: '#7D85BF',
    darker: '#23355C',
    darkest: '#192150',
  },

  // Text Colors
  text: {
    title: '#002A79',
    paragraph: '#6477B4',
    muted: '#8A96C9',
  },

  // Background Colors
  background: {
    light: '#F8F9FF',
    white: '#FFFFFF',
    card: '#FFFFFF',
  },
};

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '24px',
  '2xl': '32px',
  '3xl': '48px',
  '4xl': '64px',
};

export const borderRadius = {
  sm: '8px',
  md: '12px',
  lg: '16px',
  xl: '20px',
  full: '9999px',
};

export const typography = {
  fontFamily: {
    sans: "'Inter', sans-serif",
  },
  fontSize: {
    xs: '12px',
    sm: '14px',
    base: '16px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '30px',
    '4xl': '36px',
  },
  fontWeight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.7',
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
  },
};

export const shadows = {
  // Shadow utilities
  sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
  base: '0 2px 4px rgba(0, 0, 0, 0.1)',
  md: '0 4px 6px rgba(0, 0, 0, 0.1)',
  lg: '0 8px 16px rgba(0, 0, 0, 0.1)',
  xl: '0 12px 24px rgba(0, 0, 0, 0.15)',

  // Custom shadows from design system
  input: `
    0px 0px 2px 0px rgba(0,19,88,0.15),
    0px 4px 4px 0px rgba(0,19,88,0.04),
    0px 4px 16px 0px rgba(0,19,88,0.04),
    inset 0px -4px 4px 0px rgba(0,19,88,0.10)
  `,

  card: `
    0 0 6px 0 rgba(0, 0, 0, 0.12),
    0 2px 3px 0 rgba(0, 0, 0, 0.04),
    0 2px 6px 0 rgba(0, 0, 0, 0.04),
    inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08)
  `,

  button: '0 0.5px 1.5px rgba(0, 19, 88, 0.30), 0 2px 5px rgba(0, 19, 88, 0.10)',
};

export const transitions = {
  fast: '150ms ease',
  base: '200ms ease',
  slow: '300ms ease',
};

// Composite tokens (combining multiple tokens)
export const components = {
  input: {
    height: '56px',
    minHeight: '56px',
    padding: '6px 16px',
    backgroundColor: colors.background.light,
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.tight,
    letterSpacing: '-0.32px',
    border: 'none',
    outline: '1px solid #C7D6ED',
    boxShadow: shadows.input,
  },

  button: {
    height: '48px',
    padding: '12px 24px',
    borderRadius: borderRadius.lg,
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    transition: transitions.base,
  },

  card: {
    borderRadius: borderRadius.lg,
    padding: spacing['2xl'],
    backgroundColor: colors.background.white,
    boxShadow: shadows.card,
  },
};

// Export all tokens
export const tokens = {
  colors,
  spacing,
  borderRadius,
  typography,
  shadows,
  transitions,
  components,
};

export default tokens;
```

#### 1.2 Extend CSS Variables

**File:** `app/styles/design-tokens.css`

```css
/**
 * Design Tokens - CSS Variables
 * Use these variables in CSS/Tailwind whenever possible
 */

:root {
  /* ==================== Colors ==================== */

  /* Brand Colors */
  --brand-primary: #2370FF;
  --brand-primary-dark: #2B49C2;
  --brand-primary-darker: #0355BE;
  --brand-primary-darkest: #002A79;

  /* Semantic Colors */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Neutral Colors */
  --neutral-white: #FFFFFF;
  --neutral-lightest: #F6F7FA;
  --neutral-light: #F3F7FF;
  --neutral-medium-light: #E1E4EB;
  --neutral-medium: #C4C9D6;
  --neutral-medium-dark: #8A96C9;
  --neutral-dark: #7D85BF;
  --neutral-darker: #23355C;
  --neutral-darkest: #192150;

  /* Text Colors */
  --text-title: #002A79;
  --text-paragraph: #6477B4;
  --text-muted: #8A96C9;

  /* Background Colors */
  --bg-light: #F8F9FF;
  --bg-white: #FFFFFF;
  --bg-card: #FFFFFF;

  /* ==================== Spacing ==================== */

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-2xl: 32px;
  --spacing-3xl: 48px;
  --spacing-4xl: 64px;

  /* ==================== Border Radius ==================== */

  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 16px;
  --radius-xl: 20px;
  --radius-full: 9999px;

  /* ==================== Typography ==================== */

  --font-family-sans: 'Inter', sans-serif;

  --font-size-xs: 12px;
  --font-size-sm: 14px;
  --font-size-base: 16px;
  --font-size-lg: 18px;
  --font-size-xl: 20px;
  --font-size-2xl: 24px;
  --font-size-3xl: 30px;
  --font-size-4xl: 36px;

  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.25;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.7;

  --letter-spacing-tight: -0.02em;
  --letter-spacing-normal: 0;
  --letter-spacing-wide: 0.02em;

  /* ==================== Shadows ==================== */

  --shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.05);
  --shadow-base: 0 2px 4px rgba(0, 0, 0, 0.1);
  --shadow-md: 0 4px 6px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.1);
  --shadow-xl: 0 12px 24px rgba(0, 0, 0, 0.15);

  /* Component-specific shadows */
  --shadow-input:
    0px 0px 2px 0px rgba(0,19,88,0.15),
    0px 4px 4px 0px rgba(0,19,88,0.04),
    0px 4px 16px 0px rgba(0,19,88,0.04),
    inset 0px -4px 4px 0px rgba(0,19,88,0.10);

  --shadow-card:
    0 0 6px 0 rgba(0, 0, 0, 0.12),
    0 2px 3px 0 rgba(0, 0, 0, 0.04),
    0 2px 6px 0 rgba(0, 0, 0, 0.04),
    inset 0 -2px 3px 0 rgba(0, 0, 0, 0.08);

  --shadow-button:
    0 0.5px 1.5px rgba(0, 19, 88, 0.30),
    0 2px 5px rgba(0, 19, 88, 0.10);

  /* ==================== Transitions ==================== */

  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  /* ==================== Z-Index Scale ==================== */

  --z-dropdown: 1000;
  --z-sticky: 1020;
  --z-fixed: 1030;
  --z-modal-backdrop: 1040;
  --z-modal: 1050;
  --z-popover: 1060;
  --z-tooltip: 1070;
}
```

#### 1.3 Create Component Variant System

**File:** `app/styles/component-variants.css`

```css
/**
 * Component Variants
 * Reusable component-level classes
 */

/* ==================== Input Variants ==================== */

.input-base {
  width: 100%;
  height: var(--spacing-4xl);
  min-height: var(--spacing-4xl);
  padding: 6px var(--spacing-lg);
  background-color: var(--bg-light);
  border-radius: var(--radius-lg);
  border: none;
  box-shadow: var(--shadow-input);
  outline: 1px solid #C7D6ED;
  font-size: var(--font-size-sm);
  color: var(--text-title);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  letter-spacing: -0.32px;
  transition: var(--transition-base);
}

.input-base:focus {
  outline: 2px solid var(--brand-primary);
  outline-offset: 0;
}

.input-base:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ==================== Textarea Variants ==================== */

.textarea-base {
  width: 100%;
  min-height: 120px;
  padding: var(--spacing-lg);
  background-color: var(--bg-light);
  border-radius: var(--radius-lg);
  border: none;
  box-shadow: var(--shadow-input);
  outline: 1px solid #C7D6ED;
  font-size: var(--font-size-sm);
  color: var(--text-title);
  font-family: var(--font-family-sans);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  letter-spacing: -0.32px;
  resize: vertical;
  transition: var(--transition-base);
}

.textarea-base:focus {
  outline: 2px solid var(--brand-primary);
  outline-offset: 0;
}

/* ==================== Button Variants ==================== */

.btn-base {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 48px;
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  font-family: var(--font-family-sans);
  line-height: var(--line-height-tight);
  transition: var(--transition-base);
  cursor: pointer;
  border: none;
  white-space: nowrap;
}

.btn-primary {
  background: linear-gradient(135deg, var(--brand-primary), var(--brand-primary-dark));
  color: white;
  text-shadow: var(--shadow-button);
  box-shadow: var(--shadow-card);
}

.btn-primary:hover {
  background: linear-gradient(135deg, var(--brand-primary-dark), var(--brand-primary-darker));
  transform: translateY(-1px);
  box-shadow: var(--shadow-lg);
}

.btn-primary:active {
  transform: translateY(0);
  box-shadow: var(--shadow-md);
}

.btn-secondary {
  background: var(--bg-light);
  color: var(--text-title);
  border: 1px solid var(--neutral-medium-light);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:hover {
  background: var(--neutral-lightest);
  border-color: var(--brand-primary);
}

.btn-ghost {
  background: transparent;
  color: var(--text-title);
}

.btn-ghost:hover {
  background: var(--bg-light);
}

/* ==================== Card Variants ==================== */

.card-base {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-2xl);
  box-shadow: var(--shadow-card);
  transition: var(--transition-base);
}

.card-hover:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.card-bordered {
  border: 1px solid var(--neutral-medium-light);
  box-shadow: var(--shadow-sm);
}

/* ==================== Label Variants ==================== */

.label-base {
  color: var(--text-title);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  font-family: var(--font-family-sans);
  line-height: 20px;
  margin-bottom: var(--spacing-md);
  display: block;
}

/* ==================== Badge Variants ==================== */

.badge-base {
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.badge-primary {
  background: var(--brand-primary);
  color: white;
}

.badge-success {
  background: var(--color-success);
  color: white;
}

.badge-warning {
  background: var(--color-warning);
  color: white;
}

.badge-neutral {
  background: var(--neutral-light);
  color: var(--text-title);
}

/* ==================== Tooltip Variants ==================== */

.tooltip-base {
  position: absolute;
  z-index: var(--z-tooltip);
  pointer-events: none;
  background: white;
  border-radius: 10px;
  border: 1px solid #E5E9F2;
  box-shadow: 0 8px 24px rgba(0,20,40,0.08);
  padding: var(--spacing-md);
  min-width: 200px;
  max-width: 300px;
}

/* ==================== Layout Utilities ==================== */

.container-base {
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 0 var(--spacing-xl);
}

.section-base {
  padding: var(--spacing-4xl) 0;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

/* ==================== Text Utilities ==================== */

.text-title {
  color: var(--text-title);
  font-weight: var(--font-weight-semibold);
}

.text-paragraph {
  color: var(--text-paragraph);
}

.text-muted {
  color: var(--text-muted);
}

/* ==================== Utility Classes ==================== */

.transition-all {
  transition: all var(--transition-base);
}

.shadow-hover:hover {
  box-shadow: var(--shadow-lg);
}

.clickable {
  cursor: pointer;
  user-select: none;
}
```

#### 1.4 Update globals.css

**File:** `app/globals.css` (update)

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');
@import "tailwindcss";

/* Import design tokens */
@import "./styles/design-tokens.css";

/* Import component variants */
@import "./styles/component-variants.css";

@theme {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --font-sans: var(--font-inter);
  --max-width-8xl: 88rem;
  --animate-pulse: fadeIn 0.6s ease-out;
}

/* ... rest of existing styles ... */
```

---

### Phase 2: Component Migration (Weeks 2-4)

#### 2.1 Priority Order

1. **High-impact pages** (152+ inline styles each):
   - `app/(pages)/enhanced-resume/page.js`
   - `app/(pages)/job-search/page.js`

2. **Shared components** (used across multiple pages):
   - `components/layout/dashboard-layout.js`
   - Input/Textarea/Button components

3. **Feature components** (moderate complexity):
   - Job cards, dialogs, modals

4. **PDF templates** (special handling required):
   - Keep @react-pdf/renderer StyleSheet
   - Extract reusable constants

#### 2.2 Migration Pattern

**Before:**
```javascript
const inputStyles = {
  width: "100%",
  height: 56,
  paddingLeft: 16,
  paddingRight: 16,
  backgroundColor: colorTokens.bgLight,
  borderRadius: 16,
  border: 'none',
  boxShadow: "0px 0px 2px 0px rgba(0,19,88,0.15)...",
  fontSize: 14,
  color: "rgb(15, 38, 120)",
};

<input style={inputStyles} />
```

**After (Option A - CSS Classes):**
```javascript
import '@/app/styles/component-variants.css';

<input className="input-base" />
```

**After (Option B - Tailwind):**
```javascript
<input className="w-full h-14 px-4 bg-[var(--bg-light)] rounded-2xl border-none shadow-[var(--shadow-input)] text-sm text-[var(--text-title)] font-medium" />
```

**After (Option C - Hybrid with cn utility):**
```javascript
import { cn } from '@/lib/utils';

<input
  className={cn(
    "input-base",
    error && "outline-red-500",
    disabled && "opacity-60"
  )}
/>
```

#### 2.3 When to Keep Inline Styles

Keep inline styles for:

1. **Dynamic values based on state/props**
   ```javascript
   style={{ width: `${progress}%` }}
   ```

2. **Positioning logic (tooltips, popovers)**
   ```javascript
   style={{
     top: position.y,
     left: position.x,
     transform: `translate(${offset.x}px, ${offset.y}px)`
   }}
   ```

3. **PDF templates using @react-pdf/renderer**
   ```javascript
   import { StyleSheet } from '@react-pdf/renderer';
   const styles = StyleSheet.create({ ... });
   ```

4. **Animation/transition calculations**
   ```javascript
   style={{
     opacity: isVisible ? 1 : 0,
     transform: `translateY(${offset}px)`
   }}
   ```

---

### Phase 3: Testing & Optimization (Week 5)

#### 3.1 Visual Regression Testing

Create a checklist:
- [ ] All pages render correctly
- [ ] Interactive states work (hover, focus, active)
- [ ] Responsive breakpoints maintained
- [ ] Dark mode (if applicable)
- [ ] Print styles for resumes

#### 3.2 Performance Metrics

Measure before and after:
- Bundle size reduction
- CSS file size
- Runtime style recalculations
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)

#### 3.3 Accessibility Audit

Ensure:
- Focus states visible
- Color contrast ratios maintained
- Screen reader compatibility
- Keyboard navigation works

---

## Migration Roadmap

### Week 1: Foundation
- [ ] Create `lib/design-system/tokens.js`
- [ ] Create `app/styles/design-tokens.css`
- [ ] Create `app/styles/component-variants.css`
- [ ] Update `app/globals.css`
- [ ] Test design tokens work correctly

### Week 2: High-Impact Pages
- [ ] Migrate `enhanced-resume/page.js` (152 instances)
- [ ] Migrate `job-search/page.js` (134 instances)
- [ ] Create reusable classes for common patterns
- [ ] Visual regression testing

### Week 3: Shared Components
- [ ] Migrate `dashboard-layout.js` (48 instances)
- [ ] Update form components (Input, Textarea, Select)
- [ ] Update button components
- [ ] Update card components
- [ ] Test across all pages

### Week 4: Feature Components
- [ ] Migrate JobCard components (78 instances)
- [ ] Migrate dialog components
- [ ] Migrate job-details page (73 instances)
- [ ] Migrate resume-builder page (62 instances)

### Week 5: PDF Templates & Polish
- [ ] Refactor PDF template styles (consolidate duplicates)
- [ ] Create shared PDF template constants
- [ ] Final visual regression tests
- [ ] Performance benchmarking
- [ ] Documentation updates

---

## Best Practices & Guidelines

### 1. Naming Conventions

#### CSS Variables
```css
/* Pattern: --[category]-[property]-[variant] */
--brand-primary-dark
--spacing-xl
--shadow-card
--text-title
```

#### CSS Classes
```css
/* Pattern: [component]-[variant] or [utility]-[variant] */
.btn-primary
.card-hover
.input-base
.text-muted
```

#### JavaScript Tokens
```javascript
// Pattern: category.property.variant
tokens.colors.brand.primary
tokens.spacing.xl
tokens.shadows.card
```

### 2. Responsive Design

Use Tailwind breakpoints:
```javascript
<div className="w-full md:w-1/2 lg:w-1/3">
  {/* Mobile: full width, Tablet: half, Desktop: third */}
</div>
```

### 3. State Variants

Use data attributes or conditional classes:
```javascript
// Option 1: Data attributes
<button data-state={isActive ? 'active' : 'default'} className="btn-base">

// Option 2: Conditional classes
<button className={cn("btn-base", isActive && "btn-active")}>
```

### 4. Component Composition

Build complex components from primitives:
```javascript
// Good: Composable
<div className="card-base">
  <h3 className="text-title">Title</h3>
  <p className="text-paragraph">Description</p>
  <button className="btn-primary">Action</button>
</div>

// Avoid: Monolithic inline styles
<div style={{ ...cardStyles, ...customStyles }}>
```

### 5. CSS Organization

Keep specificity low:
```css
/* Good: Single class */
.btn-primary { }

/* Avoid: High specificity */
.card .content .button.primary { }
```

### 6. Performance Tips

1. **Avoid inline styles for static values**
   ```javascript
   // Bad
   <div style={{ padding: '16px' }}>

   // Good
   <div className="p-4">
   ```

2. **Use CSS variables for theming**
   ```css
   /* Efficient - single variable change updates all */
   .card { background: var(--bg-card); }
   ```

3. **Leverage Tailwind's purge**
   ```javascript
   // Tailwind will remove unused classes automatically
   ```

---

## Tools & Resources

### Development Tools

1. **VS Code Extensions**
   - Tailwind CSS IntelliSense
   - PostCSS Language Support
   - CSS Peek
   - Color Highlight

2. **Browser DevTools**
   - Chrome DevTools (Inspect computed styles)
   - React DevTools (Component props)

3. **Linting**
   ```bash
   npm install stylelint stylelint-config-standard
   ```

### Helpful Commands

```bash
# Find all inline styles
grep -r "style={{" ./app ./components

# Count inline style occurrences
grep -r "style={{" ./app ./components | wc -l

# Search for specific style patterns
grep -r "backgroundColor:" ./app ./components
```

### Migration Script Template

```javascript
// scripts/migrate-styles.js
// Helper script to identify migration candidates

const fs = require('fs');
const path = require('path');

function findInlineStyles(dir) {
  const results = [];
  const files = fs.readdirSync(dir);

  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      results.push(...findInlineStyles(filePath));
    } else if (file.match(/\.(js|jsx|tsx)$/)) {
      const content = fs.readFileSync(filePath, 'utf8');
      const matches = content.match(/style=\{/g);

      if (matches) {
        results.push({
          file: filePath,
          count: matches.length
        });
      }
    }
  });

  return results;
}

const results = findInlineStyles('./app');
console.table(results.sort((a, b) => b.count - a.count));
```

### Documentation References

- [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
- [CSS Variables Guide](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties)
- [React PDF Renderer Styling](https://react-pdf.org/styling)
- [Class Variance Authority (CVA)](https://cva.style/docs)

---

## Success Metrics

Track these KPIs to measure success:

| Metric | Before | Target | Actual |
|--------|--------|--------|--------|
| Inline style occurrences | 1,765 | <100 | TBD |
| CSS bundle size | TBD | -30% | TBD |
| Design token coverage | ~20 | 50+ | TBD |
| Component variants | 0 | 15+ | TBD |
| Developer onboarding time | TBD | -50% | TBD |
| Code review time (styling) | TBD | -40% | TBD |

---

## FAQ

### Q: Should we use Tailwind or CSS Modules?
**A:** Use a hybrid approach:
- **Tailwind** for layout, spacing, and common utilities
- **CSS classes** for complex component variants
- **CSS Modules** for page-specific styles (if needed)
- **Inline styles** only for dynamic values

### Q: What about PDF template styles?
**A:** PDF templates require `@react-pdf/renderer`'s StyleSheet API. Keep those as-is but:
- Extract common values to constants
- Share color/spacing tokens
- Consolidate duplicate styles

### Q: How do we handle dark mode?
**A:** Use CSS variables and media queries:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-card: #1a1a1a;
    --text-title: #ffffff;
  }
}
```

### Q: What about existing CSS Modules?
**A:** Keep them! They're already well-organized. Just:
- Ensure they use CSS variables
- Remove duplicated styles
- Consider migrating common patterns to component variants

---

## Conclusion

This centralized styling strategy will:

1. ✅ Reduce code duplication
2. ✅ Improve maintainability
3. ✅ Enhance developer experience
4. ✅ Enable consistent design system
5. ✅ Improve performance
6. ✅ Make theming easier

**Estimated Timeline:** 5 weeks
**Estimated Effort:** 60-80 developer hours
**Impact:** High - affects entire codebase

---

## Appendix

### A. Complete File Checklist

Files to migrate (top 20 by inline style count):

- [ ] app/(pages)/enhanced-resume/page.js (152)
- [ ] app/(pages)/job-search/page.js (134)
- [ ] app/(pages)/job-search/JobCardRefined.tsx (78)
- [ ] app/(pages)/job-details/[id]/page.js (73)
- [ ] components/pdf-templates/job/JobTemplate2WithoutPhoto.js (71)
- [ ] components/pdf-templates/job/JobTemplate3WithPhoto.js (66)
- [ ] components/pdf-templates/job/JobTemplate2WithPhoto.js (64)
- [ ] app/(pages)/resume-builder/page.js (62)
- [ ] components/pdf-templates/internship/InternshipTemplate2WithoutPhoto.js (55)
- [ ] components/pdf-templates/job/ATSTemplateWithPhoto.js (51)
- [ ] components/pdf-templates/internship/InternshipTemplate2WithPhoto.js (49)
- [ ] components/layout/dashboard-layout.js (48)
- [ ] components/pdf-templates/internship/InternshipTemplateWithPhoto.js (45)
- [ ] components/pdf-templates/internship/InternshipTemplateWithoutPhoto.js (42)
- [ ] components/pdf-templates/job/ATSTemplateWithoutPhoto_TEST.js (42)
- [ ] components/pdf-templates/internship/InternshipTemplate3WithPhoto.js (42)
- [ ] components/pdf-templates/job/JobTemplate1WithPhoto.js (40)
- [ ] app/(pages)/resume-choice/page.js (39)
- [ ] app/(pages)/signup/page.js (38)
- [ ] components/pdf-templates/job/JobTemplate1WithoutPhoto.js (37)

### B. Code Review Checklist

When reviewing style migrations:

- [ ] No inline styles for static values
- [ ] Uses design tokens (CSS vars or JS tokens)
- [ ] Consistent naming conventions
- [ ] Responsive design maintained
- [ ] Accessibility preserved
- [ ] Performance not degraded
- [ ] Visual appearance unchanged
- [ ] Interactive states work correctly

---

**Last Updated:** 2025-11-18
**Version:** 1.0
**Author:** Claude Code Assistant
**Status:** Draft
