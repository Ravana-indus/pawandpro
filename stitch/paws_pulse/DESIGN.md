# Design System: The Pet-Centric Super App

## 1. Overview & Creative North Star
**Creative North Star: "The Clinical Concierge"**
This design system rejects the "cluttered" aesthetic common in pet apps. Instead, it adopts a high-end editorial approach—merging the efficiency of a logistics giant (Uber) with the warmth of a premium lifestyle brand. We move beyond the "template" look through **intentional asymmetry**, massive typographic scales, and **tonal layering** rather than structural lines. The goal is to make a veterinary appointment feel as seamless as ordering a ride, and a luxury marketplace feel like a digital gallery.

---

## 2. Colors & Surface Architecture

### Palette Strategy
The palette is rooted in a high-contrast foundation of deep blacks (`on_surface: #151C27`) and architectural whites (`surface: #F9F9FF`), punctuated by a sophisticated Teal (`primary: #00647C`) that signals professional medical authority and vibrant energy.

### The "No-Line" Rule
**Explicit Instruction:** 1px solid borders for sectioning are strictly prohibited. 
Boundaries must be defined solely through:
*   **Background Shifts:** Use `surface_container_low` sections sitting on a `surface` background.
*   **Tonal Transitions:** Defining an area by its depth rather than its perimeter.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers. Each "container" is a sheet of material:
*   **Layer 0 (Base):** `surface` (#F9F9FF).
*   **Layer 1 (Cards):** `surface_container_lowest` (#FFFFFF) for maximum lift and "pop."
*   **Layer 2 (Embedded Elements):** `surface_container` (#E7EEFE) for input fields or nested selection areas.

### Glass & Gradient Rules
*   **Glassmorphism:** For floating navigation bars or "quick action" overlays, use `surface` at 80% opacity with a `20px` backdrop-blur. This integrates the component into the environment rather than "pasting" it on top.
*   **Signature Textures:** Main CTAs should use a subtle linear gradient from `primary` (#00647C) to `primary_container` (#007F9D) at a 135-degree angle. This adds "soul" and dimension to otherwise flat buttons.

---

## 3. Typography: Editorial Authority
We utilize two distinct Sans-serif personalities: **Plus Jakarta Sans** for high-impact brand moments and **Inter** for clinical precision.

*   **Display (Plus Jakarta Sans):** Used for "Hero" marketplace banners or breeder introductions. Large sizes (`display-lg`: 3.5rem) should use tight letter-spacing (-0.02em) to feel premium.
*   **Headline (Plus Jakarta Sans):** Bold, high-contrast headers that break the grid.
*   **Body & Labels (Inter):** Reserved for medical data, product descriptions, and veterinary logs. Inter provides the "Uber-like" utility—highly legible at small sizes.

**Identity Through Hierarchy:** By pairing a massive `display-md` title with a tiny, uppercase `label-md`, we create an asymmetrical tension that feels modern and intentional, moving away from "standard" balanced layouts.

---

## 4. Elevation & Depth (Tonal Layering)

### The Layering Principle
Depth is achieved by "stacking" tones. 
*   *Example:* To highlight a "Recommended Vet," place a `surface_container_lowest` (Pure White) card inside a `surface_container_low` section. The contrast creates a soft, natural lift without a single shadow being drawn.

### Ambient Shadows
When a floating effect is required (e.g., a "Book Now" sticky button):
*   **Blur:** 32px to 48px.
*   **Opacity:** 4% to 8%.
*   **Color:** Use a tinted version of `on_surface` (#151C27) rather than pure black to simulate natural light.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use the **Ghost Border**: `outline_variant` at 15% opacity. Never use 100% opaque borders.

---

## 5. Components

### Buttons (The "Precision Tool")
*   **Primary:** Gradient-filled (`primary` to `primary_container`) with `xl` (3rem) rounding. Padding: `16px 32px`.
*   **Secondary:** `surface_container_highest` background with `on_surface` text. No border.
*   **Tertiary:** Text-only in `primary` color, bold weight, with an arrow icon for directional intent.

### Cards & Lists (Marketplace & Medical)
*   **Forbid Dividers:** Do not use lines to separate "Pet Records" or "Product Listings." Use 24px of vertical whitespace or a subtle background toggle between `surface` and `surface_container_low`.
*   **The Marketplace Card:** Image occupies 100% of the top width with a `1.5rem` (md) corner radius. Information is "nested" in a `surface_container_lowest` area below.

### Selection & Input (The Breeder Portal)
*   **Input Fields:** Use `surface_container` as the background. Upon focus, transition the background to `surface_container_lowest` and apply a 2px `primary` Ghost Border.
*   **Chips:** Use `full` (9999px) rounding. Unselected: `surface_container`. Selected: `primary` with `on_primary` text.

### Specialized Components
*   **The "Health Pulse" Indicator:** A semi-transparent `tertiary` (Green) glass capsule used in the Veterinary portal to show pet status.
*   **Breeder Trust Badge:** A sophisticated, small-scale component using `tertiary_fixed` background with an icon to denote verified status.

---

## 6. Do’s and Don’ts

### Do:
*   **Do** use asymmetrical margins (e.g., 24px left, 16px right) on editorial pages to create visual interest.
*   **Do** leverage "Primary Fixed" colors for soft background highlights in the e-commerce marketplace.
*   **Do** prioritize white space over "filling the screen." If a screen feels empty, increase the typography size rather than adding more components.

### Don’t:
*   **Don’t** use standard "Drop Shadows" (0, 4, 10, 0). They feel cheap and dated.
*   **Don’t** use dividers or lines. If you feel the need to separate two things, increase the space between them.
*   **Don’t** use the `primary` color for anything other than CTAs and branding. Keep the "Uber" aesthetic by letting the black and white do the heavy lifting.