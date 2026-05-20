# Design Brief: InfraOS – AI Operating System for Infrastructure

## Purpose & Tone
Enterprise AI command center for Indian infrastructure governance — institutional, authoritative, futuristic, government-grade. Zero startup fluff. Palantir meets SAP meets Autodesk Construction Cloud.

## Color Palette

| Name | OKLCH | Purpose |
|------|-------|---------|
| Matte Black | 0.06 0.02 280 | Primary background (brand foundation) |
| Deep Charcoal | 0.08 0.02 280 | Navigation, elevated surfaces |
| Card Surface | 0.10 0.02 280 | Glass card base, modal backgrounds |
| Elevated | 0.15 0.02 280 | Popovers, dropdowns, secondary surfaces |
| **Teal Accent** | 0.68 0.25 196 | Primary CTA, active states, data highlights |
| **Secondary Cyan** | 0.65 0.23 195 | Secondary interactive elements, borders |
| **Success (Green)** | 0.72 0.20 142 | On-track projects, positive metrics |
| **Warning (Amber)** | 0.65 0.20 72 | Moderate risk, attention required |
| **Critical (Red)** | 0.50 0.28 22 | High risk, delayed projects, alerts |
| White | 1.00 0 0 | Foreground text, max contrast headings |
| Body Text | 0.72 0.04 270 | #B0BEC5, readable body copy |
| Labels | 0.38 0.03 270 | #546E7A, uppercase small caps metadata |

## Typography
**Display & Body:** DM Sans (clean, institutional, modern sans-serif) — headings, labels, UI text  
**Data / Code:** JetBrains Mono (high-fidelity data values, metrics, technical elements)

## Shape Language
Border radius: 8px default (`--radius: 0.5rem`). Vary intentionally: 0px (none), 8px (cards/inputs), 16px (badges/pills). No excessive rounding.

## Elevation & Depth
Glassmorphism primary: `backdrop-filter: blur(12px)` + `bg-card/85` + `border-primary/15`. Glow effects sparingly on CTAs and KPI cards. No excessive shadow stacking.

## Structural Zones

| Zone | Background | Border | Intent |
|------|-----------|--------|--------|
| Header/Nav | Deep charcoal `0.08` | Subtle bottom divider `primary/15` | Authority, separation |
| Sidebar | Deep charcoal `0.08` | Teal left accent on active item | Navigation context |
| Content Cards | Glass `0.10 / 0.85` + blur | Teal border `primary/15` | Data presentation |
| KPI Widgets | Glass + inset glow | Teal glow `primary/15` | Key metrics emphasis |
| Modal/Popover | Card `0.15 / 0.85` | Subtle border `primary/15` | Secondary focus |
| Footer | Matte black `0.06` | Top border `primary/15` | Ground anchor |

## Spacing & Rhythm
16px base unit. Padding scale: 8, 12, 16, 24, 32px. Gap scale: 8, 12, 16, 24px. Dense data tables; generous breathing for headlines and hero sections.

## Component Patterns
- **Glass Cards:** `.glass-card` (blur 12px, card/85 bg, teal/15 border, hover: teal/35 + glow)
- **Buttons:** `.btn-primary` (solid teal + 16px glow), `.btn-secondary` (teal border + transparent fill)
- **Risk Badges:** `.badge-critical` (red), `.badge-warning` (amber), `.badge-success` (green) — all with inset backgrounds
- **Data Text:** `.text-data` (JetBrains Mono, teal primary, semibold)
- **Labels:** `.text-label` (uppercase, tracking-widest, muted)
- **Grid Overlay:** `.grid-overlay` (subtle teal lines, 3-5% opacity)
- **KPI Glow:** `.kpi-glow` (inset + external glow)

## Motion & Animation
**Entrance:** fade-in 0.3s, staggered per section.  
**Hover:** scale up 1%, shadow intensify, transition-smooth 0.3s.  
**Data Updates:** glow-pulse (2s infinite) on changed KPI values.  
**Active Elements:** float animation (3s) on dashboard items.  
**Interaction Feedback:** smooth 0.3s cubic-bezier for all state changes.

## Responsive Breakpoints
Mobile-first: `sm: 640px` (tablet), `md: 768px` (desktop), `lg: 1024px` (wide). Touch targets: 44px minimum. Data tables stack on mobile; sidebar collapses to drawer.

## Constraints & Guardrails
- No warm/pastel colors; matte black + teal only
- No shadows deeper than `rgba(0,0,0,0.3)`
- Glow effects on CTAs, KPIs, active states only — not on every element
- Every card must use glassmorphism base; no flat fills
- Grid texture overlay optional but recommended for depth
- All text must maintain AA+ contrast ratio
- No animations over 300ms unless explicitly choreographed
- Institutional tone: zero playful/cute elements, zero startup language

## Signature Detail
Subtle grid overlay (teal lines, 3% opacity) on all dark backgrounds. Glassmorphic cards with teal accent borders that glow on hover. KPI cards pulse with soft glow effect when data updates. Scan-line animation (3s) on hero command center. Top navigation with India-facing branding. Risk level color coding (red/amber/green) for all project states.

## Differentiator
This is NOT a SaaS template. Enterprise infrastructure intelligence platform: data-driven, institutional aesthetic, government-grade credibility. Glassmorphism + grid textures + teal accents + risk color system = premium command center feel. Every surface intentional. Zero generic elements.
