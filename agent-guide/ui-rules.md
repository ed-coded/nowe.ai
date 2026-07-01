# UI Rules

## Overview

The HomeHub UI must feel:

- modern
- clean
- premium
- minimal
- fast
- mobile-first

The interface should prioritize:
- clarity
- usability
- responsiveness
- accessibility
- consistency

Avoid cluttered layouts and inconsistent styling.

---

# Design Philosophy

The UI should resemble modern SaaS and marketplace applications.

Inspirations:
- Airbnb
- Stripe
- Linear
- Notion
- Vercel

The interface must feel:
- spacious
- polished
- responsive
- lightweight

---

# Core UI Stack

- TailwindCSS
- shadcn/ui
- Framer Motion
- Lucide Icons

Avoid adding additional UI frameworks.

---

# Color Rules

## Primary Principles

Use:
- neutral backgrounds
- strong contrast
- limited accent colors

Avoid:
- rainbow interfaces
- excessive gradients
- oversaturated colors

---

## Theme Rules

Support:
- light mode
- dark mode

Dark mode must NOT:
- reduce readability
- use pure black backgrounds

---

# Typography Rules

Use:
- clean sans-serif typography
- clear hierarchy
- large readable headings

Avoid:
- tiny text
- excessive font weights
- inconsistent font sizing

---

# Layout Rules

## Required

Use:
- spacing consistency
- responsive containers
- grid systems
- visual hierarchy

Maintain:
- generous whitespace
- predictable spacing

---

## Forbidden

Avoid:
- cramped layouts
- floating random elements
- inconsistent padding
- overlapping sections

---

# Responsive Design Rules

The platform must be:
- mobile-first
- tablet responsive
- desktop optimized

Every page must function correctly on:
- mobile
- tablet
- desktop

Never design desktop-only layouts.

---

# Component Rules

Components must be:
- reusable
- isolated
- typed
- visually consistent

Each component should have:
- a single responsibility
- predictable behavior
- clean props API

---

# Button Rules

Buttons must:
- clearly indicate action hierarchy
- maintain consistent sizing
- provide hover states
- provide disabled states

Avoid:
- too many primary buttons
- unclear CTA hierarchy

---

# Form Rules

Forms must:
- validate properly
- provide clear feedback
- show loading states
- show error states

Use:
- React Hook Form
- Zod validation

Required:
- accessible labels
- clear placeholders
- consistent spacing

---

# Animation Rules

Animations should:
- enhance UX
- feel subtle
- improve feedback

Use:
- Framer Motion

Avoid:
- excessive motion
- distracting transitions
- long animations

---

# Loading States

Every async operation must provide:
- loading states
- skeleton loaders
- optimistic feedback where appropriate

Never leave blank screens during loading.

---

# Empty States

Empty states must:
- explain the situation
- guide the user
- provide next actions

Avoid dead-end screens.

---

# Error State Rules

Errors must:
- be human readable
- provide recovery options
- avoid technical jargon

Example:
Good:
"Unable to load properties."

Bad:
"Unhandled exception occurred."

---

# Card Design Rules

Cards should:
- maintain consistent padding
- use subtle borders/shadows
- remain visually lightweight

Avoid:
- excessive elevation
- noisy card designs

---

# Navigation Rules

Navigation must:
- remain intuitive
- remain minimal
- prioritize discoverability

Primary navigation should never feel crowded.

---

# Accessibility Rules

Required:
- keyboard accessibility
- semantic HTML
- accessible labels
- color contrast compliance

Avoid:
- inaccessible clickable divs
- low contrast text
- missing focus states

---

# Image Rules

Use:
- optimized images
- lazy loading
- responsive sizing

Use:
- next/image

Avoid:
- unoptimized uploads
- stretched images
- inconsistent aspect ratios

---

# Modal Rules

Modals must:
- focus user attention
- trap keyboard focus
- provide clear close actions

Avoid:
- stacked modals
- oversized modal content

---

# Dashboard Rules

Dashboards should:
- prioritize readability
- show important actions first
- avoid visual overload

Use:
- cards
- metrics
- clean spacing

---

# Marketplace UI Rules

Property listings must prioritize:
- image quality
- pricing visibility
- location clarity
- trust indicators

Search experience must feel:
- instant
- responsive
- intuitive

---

# AI UI Rules

AI features must feel:
- assistive
- helpful
- non-intrusive

Avoid:
- overwhelming chat interfaces
- excessive AI prompts
- fake intelligence behavior

---

# UI Consistency Rules

All pages must maintain:
- consistent spacing
- consistent typography
- consistent interaction patterns

Never introduce random design styles.

---

# Forbidden UI Practices

Do NOT:
- mix multiple design systems
- use inline styling excessively
- create inconsistent layouts
- create giant components
- use random animations
- use multiple competing accent colors