---
name: E.C.H.O. Visual Identity
colors:
  surface: '#131318'
  surface-dim: '#131318'
  surface-bright: '#39383e'
  surface-container-lowest: '#0e0e13'
  surface-container-low: '#1b1b20'
  surface-container: '#1f1f25'
  surface-container-high: '#2a292f'
  surface-container-highest: '#35343a'
  on-surface: '#e4e1e9'
  on-surface-variant: '#cbc3d7'
  inverse-surface: '#e4e1e9'
  inverse-on-surface: '#303036'
  outline: '#958ea0'
  outline-variant: '#494454'
  surface-tint: '#d0bcff'
  primary: '#d0bcff'
  on-primary: '#3c0091'
  primary-container: '#a078ff'
  on-primary-container: '#340080'
  inverse-primary: '#6d3bd7'
  secondary: '#4cd7f6'
  on-secondary: '#003640'
  secondary-container: '#03b5d3'
  on-secondary-container: '#00424e'
  tertiary: '#c0c1ff'
  on-tertiary: '#1000a9'
  tertiary-container: '#8083ff'
  on-tertiary-container: '#0d0096'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#d0bcff'
  on-primary-fixed: '#23005c'
  on-primary-fixed-variant: '#5516be'
  secondary-fixed: '#acedff'
  secondary-fixed-dim: '#4cd7f6'
  on-secondary-fixed: '#001f26'
  on-secondary-fixed-variant: '#004e5c'
  tertiary-fixed: '#e1e0ff'
  tertiary-fixed-dim: '#c0c1ff'
  on-tertiary-fixed: '#07006c'
  on-tertiary-fixed-variant: '#2f2ebe'
  background: '#131318'
  on-background: '#e4e1e9'
  surface-variant: '#35343a'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  headline-sm:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Geist
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 24px
  xl: 32px
  xxl: 48px
  gutter: 20px
  margin-mobile: 16px
  margin-desktop: 40px
---

## Brand & Style

The design system is centered on a **Premium Glassmorphic** aesthetic, tailored for high-end creative workflows in AI audio storytelling. The visual narrative balances the technical precision of a developer tool with the immersive qualities of an entertainment platform. 

The core style utilizes translucent layers, high-density blurs, and microscopic borders to create a sense of physical depth and sophisticated materiality. Inspired by professional suites like Linear and Raycast, the interface prioritizes focus through generous negative space and a "dark-first" philosophy that reduces cognitive load during long creative sessions.

**Design Pillars:**
- **Luminosity:** Light is used sparingly as an interactive signal or to define the edges of surfaces.
- **Precision:** Alignment follows a strict mathematical grid, ensuring the modular nature of the platform feels stable.
- **Fluidity:** Glass surfaces and soft gradients suggest a modern, forward-thinking technical stack.

## Colors

The palette is built upon a foundation of **Deep Indigo-Charcoal** to maintain a "true dark" feel without the harshness of pure black. 

- **Primary (Vibrant Purple):** Reserved for high-priority actions, active states, and brand-critical moments.
- **Secondary (Electric Cyan):** Used for technical indicators, audio waveforms, and secondary accents.
- **Accent (Indigo):** Bridges the gap between the background and interactive elements, often used for subtle hover states or focus rings.
- **Glass Surfaces:** Surface layers must use the defined `surface` token with a `backdrop-filter: blur(12px)` to achieve the premium glass effect.
- **Borders:** Borders are semi-transparent white, acting as a "light catch" on the edge of dark surfaces.

## Typography

This design system employs a dual-font strategy: **Geist** for structural elements and headings to provide a technical, monospaced-adjacent feel, and **Inter** for long-form content to ensure maximum readability.

**Usage Guidelines:**
- **Geist:** Use for all "UI Chrome" (buttons, labels, headings, navigation). It communicates the "modular" and "AI" nature of the platform.
- **Inter:** Use for body text, story descriptions, and user-generated content.
- **Hierarchy:** Maintain high contrast between labels and body text. Use `label-md` for metadata with a slight opacity (0.7) to create secondary visual levels.

## Layout & Spacing

The layout philosophy follows a **Modular Grid System** with a 4px baseline rhythm. This ensures that even complex audio-editing components align perfectly.

- **Grid:** Use a 12-column fluid grid for desktop views.
- **Margins:** Generous side margins (40px+) on desktop to centralize the creative workspace and prevent edge-to-edge eye fatigue.
- **Safe Areas:** Components within a module should use `sm` (12px) or `md` (16px) internal padding.
- **Adaptive Strategy:** On mobile, switch to a 4-column grid with a 16px margin. Vertical stacking is preferred for modular blocks.

## Elevation & Depth

Depth is achieved through **Tonal Layering** and **Backdrop Blurs** rather than traditional black shadows.

- **Base Layer:** The deepest layer is the solid background (`#0a0a0f`).
- **Surface Layer:** Floating modules use the `surface` token with a `12px` backdrop-blur. 
- **Edges:** Each elevated surface must have a `1px` solid border (`rgba(255, 255, 255, 0.08)`).
- **Shadows:** Use extremely diffused, large-radius shadows for the highest elevation (e.g., modals). Shadow color should be a tinted indigo (`rgba(0, 0, 0, 0.5)`) rather than neutral gray to maintain the palette's temperature.

## Shapes

The design system uses a **Rounded** shape language to soften the technical nature of the AI platform.

- **Standard Elements:** Use `rounded` (0.5rem / 8px) for input fields and small buttons.
- **Containers/Modules:** Use `rounded-lg` (1rem / 16px) for cards and main workspace modules.
- **Active Indicators:** Use `rounded-xl` or pill-shapes for status chips and notification badges.
- **Consistency:** Never mix sharp corners with rounded elements. Even the smallest UI detail (like a checkbox) should follow the `0.25rem` minimum radius.

## Components

**Buttons:**
- **Primary:** Gradient background (Purple to Indigo) with white text. Subtle outer glow on hover.
- **Secondary:** Glass background with Cyan border and text. 
- **Ghost:** No background, subtle border appears only on hover.

**Input Fields:**
- Background should be a slightly darker shade than the surface (`rgba(0, 0, 0, 0.2)`).
- Active state features a 1px border of Cyan with a 4px soft outer glow.

**Cards & Modules:**
- Always use backdrop-filter for content readability.
- Headlines within cards should use `headline-sm` in Geist.

**Audio Waveforms:**
- Represented using the Secondary (Cyan) color. 
- Use semi-transparent vertical bars with a `2px` border-radius at the top and bottom of each bar.

**Chips/Tags:**
- Small, pill-shaped elements with `label-sm` text. Background opacity should be `0.1` of the category color (e.g., Purple for 'Narrative', Cyan for 'Effects').

**Modals:**
- Centered overlay with a high-intensity backdrop blur (20px) on the layers beneath. Use `rounded-xl` for the modal container itself.