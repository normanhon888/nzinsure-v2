# UI Framework: Institutional Advisory Homepage

## Homepage structure overview
The homepage is built as a six-section narrative that moves from positioning to method, domain-specific advisory value, and a final conversion action.

1. Hero (Advisory Positioning)
2. Structured Method (3-column grid)
3. Business Advisory Section
4. Personal Advisory Section
5. Why Structured Advice
6. Final CTA Section

## Section breakdown explanation
### 1) Hero (Advisory Positioning)
Purpose: Establish credibility and tone immediately.

Includes:
- Institutional positioning label
- Primary heading and supporting paragraph
- Two CTAs (primary and secondary)
- Supporting advisory mandate card

### 2) Structured Method
Purpose: Communicate process clarity.

Includes:
- Section title and context copy
- Three method cards in `md:grid-cols-3`
- Numbered sequence: discovery, structuring, governance

### 3) Business Advisory
Purpose: Address enterprise and owner-led risk needs.

Includes:
- Short positioning statement
- Bullet list of advisory capabilities
- Two-column layout with `md:grid-cols-2`

### 4) Personal Advisory
Purpose: Address household and family risk governance.

Includes:
- Short positioning statement
- Bullet list of advisory capabilities
- Two-column layout with `md:grid-cols-2`

### 5) Why Structured Advice
Purpose: Explain outcomes of a disciplined advisory process.

Includes:
- Section rationale copy
- Supporting impact bullets
- Two-column trust-building layout

### 6) Final CTA
Purpose: Convert intent into consultation action.

Includes:
- Final headline and concise supporting text
- Primary and secondary CTA buttons
- High-contrast institutional panel treatment

## Color system
Core palette:
- Primary: `#0E1A2B`
- Accent: `#C8A75E`
- Background: `#F5F7FA`
- Surface: `#FFFFFF`

Usage rules:
- Use primary for major text, headers, and dark CTA panels.
- Use accent for highlights, numbered markers, and primary contrast CTA in dark sections.
- Use background as default page canvas.
- Keep borders subtle using low-opacity primary tones.

## Typography scale
Type hierarchy:
- H1: `text-5xl` to `text-6xl`, `font-semibold`, tight leading
- H2: `text-3xl`, `font-semibold`
- H3/Card title: `text-2xl`, `font-semibold`
- Body large: `text-lg`, relaxed leading
- Body standard: `text-base`, relaxed leading
- Label/meta: `text-sm`, medium/semi-bold

Tone rules:
- Avoid promotional superlatives.
- Use precise, advisory-oriented language.
- Keep sentence structure professional and calm.

## Spacing system
Vertical rhythm:
- Major sections: `py-24` or `py-28`
- Section containers: `max-w-7xl` with `px-6` and `lg:px-12`
- Internal card spacing: `p-7`, `p-8`, `p-10`, `p-12` depending on hierarchy

Whitespace rules:
- Preserve generous negative space around headings and between section groups.
- Avoid dense paragraph stacks.

## Button styles
Primary button:
- Background: primary `#0E1A2B` on light sections
- Text: white
- Radius: `rounded-xl`
- Padding: `px-6 py-3`
- Weight: `text-sm font-semibold`

Secondary button:
- Border: subtle primary border
- Surface: white or transparent (on dark section)
- Text: primary or white depending on background
- Radius: `rounded-xl`

Dark panel CTA variant:
- Primary action uses accent `#C8A75E` with primary text for clear hierarchy.

## Card styles
Base card:
- Surface: white
- Border: `border` with low-opacity primary tone
- Radius: `rounded-2xl`
- Shadow: minimal or none
- Padding: `p-7` to `p-10`

Content rules:
- One clear heading per card
- Max 3-5 bullet points where possible
- Keep copy concise and non-promotional

## Component naming rules
Use clear, section-aligned component names if extracting from `page.tsx`:
- `HeroAdvisorySection`
- `StructuredMethodSection`
- `BusinessAdvisorySection`
- `PersonalAdvisorySection`
- `WhyStructuredAdviceSection`
- `FinalAdvisoryCtaSection`

Naming conventions:
- PascalCase for React components
- Suffix with `Section` for page blocks
- Keep names domain-specific and explicit

## Figma frame naming guide
Use deterministic frame names for design-to-dev parity:

- `Homepage / 01 Hero Advisory`
- `Homepage / 02 Structured Method`
- `Homepage / 03 Business Advisory`
- `Homepage / 04 Personal Advisory`
- `Homepage / 05 Why Structured Advice`
- `Homepage / 06 Final CTA`

Component frame names:
- `Card / Method / Step 01`
- `Card / Advisory / Business`
- `Button / Primary / Light`
- `Button / Secondary / Dark`

## Layout grid system explanation
Grid model:
- Overall content container: `max-w-7xl`
- Multi-column sections:
  - `md:grid-cols-2` for dual narrative/content blocks
  - `md:grid-cols-3` for structured method cards
- Mobile behavior:
  - All grids collapse to a single-column flow
  - CTAs wrap using `flex-wrap` to prevent overflow

Alignment rules:
- Keep headline columns left-aligned.
- Use balanced gaps (`gap-6`, `gap-8`, `gap-10`, `gap-14`) based on section weight.
- Maintain consistency between Figma grids and Tailwind implementation.