---
name: Atelier Modernist
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191c1e'
  on-tertiary-container: '#818486'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#e0e3e5'
  tertiary-fixed-dim: '#c4c7c9'
  on-tertiary-fixed: '#191c1e'
  on-tertiary-fixed-variant: '#444749'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  title-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 20px
  stack-gap-sm: 8px
  stack-gap-md: 16px
  stack-gap-lg: 24px
  section-padding: 40px
---

## Brand & Style

This design system is built on the philosophy of "Digital Craftsmanship." It blends high-end editorial aesthetics with the precision of artificial intelligence. The target audience is design-conscious homeowners and professionals who value efficiency but demand a premium, curated experience.

The visual style is **Minimalist-Modern**. It prioritizes heavy whitespace to allow furniture imagery to breathe, utilizing high-quality typography and a restrained color palette to convey authority. The interface avoids unnecessary ornamentation, ensuring that the AI-driven features feel like a seamless extension of the user's creative process rather than a complex technical tool.

## Colors

The color palette is anchored by **Deep Navy (Slate 950)**, providing a sophisticated, stable foundation that evokes professional trust. The primary background is a **Crisp White**, contrasted by **Light Slate** surfaces to define content areas without heavy borders.

**Emerald Green** serves as the primary action color, signifying growth, precision, and "success" in the AI generation process. For high-tier "Premium" features or AI-exclusive suggestions, a **Muted Gold** is used sparingly as an accent to denote value and exclusivity. 
- **Primary:** Deep Navy for text and structural elements.
- **Action:** Emerald Green for buttons and active states.
- **Background:** White/Very Light Gray for a clean, spacious feel.
- **Status:** Subtle tints of red for errors and amber for warnings, maintaining the desaturated, premium tone.

## Typography

The system utilizes a dual-font strategy to balance character with utility. **Manrope** is used for headlines to provide a modern, geometric, and slightly warm personality. **Inter** is utilized for body copy and UI labels due to its exceptional legibility at small sizes and its neutral, systematic feel.

Hierarchy is established through significant weight shifts. Large displays use a tight letter-spacing for a "high-fashion" editorial look, while body text maintains standard spacing for maximum readability during long browsing sessions.

## Layout & Spacing

This design system follows a **Fluid Grid** model optimized for mobile-first interactions. It utilizes a 4-column structure for mobile devices with a 20px outer margin and 16px gutters.

The spacing rhythm is based on an **8px scale**. Elements are grouped using proximity to indicate relationship, with generous vertical padding (40px+) between major sections to prevent visual clutter and emphasize the premium, "unrushed" nature of the app. Layouts should prioritize center-aligned or left-aligned content with strict adherence to the grid to maintain a professional, architectural feel.

## Elevation & Depth

Depth is conveyed through **Ambient Shadows** and **Tonal Layering**. Instead of heavy shadows, the system uses "Soft Depth":
- **Level 0 (Base):** The main background (White).
- **Level 1 (Cards):** Very soft, diffused shadows (Y: 4px, Blur: 12px, Opacity: 4% Black) to lift furniture cards and menus off the base.
- **Level 2 (Modals/Overlays):** Medium diffusion (Y: 8px, Blur: 24px, Opacity: 8% Black) to focus user attention.

Surface colors shift slightly from #FFFFFF to #F8FAFC to create "Sunken" areas for input fields or secondary content, reducing the need for intrusive borders.

## Shapes

The shape language is defined by **Soft Geometricism**. A standard corner radius of 12px (`rounded-lg`) is applied to cards and primary containers to make the tech-heavy AI features feel approachable and organic, mirroring the curves of modern furniture design.

Buttons and input fields utilize an 8px radius to maintain a sense of precision and structure. Icons should follow a 2px stroke weight with rounded terminals to align with the overall radius strategy.

## Components

- **Buttons:** Primary buttons use the Emerald Green background with White text. Secondary buttons use the Deep Navy outline or a light gray ghost style. All buttons include a subtle haptic feedback and a slight scale-down on tap.
- **Cards:** Product and AI-result cards use a White background with the Level 1 shadow. Images should be edge-to-edge at the top with a 12px internal padding for text below.
- **Chips:** Used for furniture categories (e.g., "Mid-Century," "Minimalist"). They feature a light gray fill and 100px (pill) radius, switching to Deep Navy with White text when selected.
- **Input Fields:** Minimalist design with a 1px border in Light Slate. On focus, the border transitions to Deep Navy with a soft outer glow in Emerald Green.
- **AI Visualizers:** A specialized component—an AR viewport with a subtle, pulsating Emerald Green "scanning" line to indicate AI processing.
- **Lists:** Clean, divider-less lists using vertical whitespace to separate items. Interaction is indicated by a subtle background color change on press.