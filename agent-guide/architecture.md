# Home Architecture

## Overview

Home is a modern AI-powered rental and property discovery platform focused on Ghana.

The application is built using a scalable full-stack architecture powered by:

- Next.js
- Supabase
- TypeScript
- TailwindCSS

The system follows:
- feature-based architecture
- server-first rendering
- modular engineering principles
- AI-agent compatible development standards

---

# Core Tech Stack

## Frontend + Backend
- Next.js 15
- React 19
- TypeScript

## UI
- TailwindCSS
- shadcn/ui
- Framer Motion

## State Management
- Zustand
- TanStack Query

## Database & Infrastructure
- Supabase PostgreSQL
- Supabase Auth
- Supabase Storage

## AI Layer
- OpenAI API
- AI SDK compatible architecture
- Retrieval-ready architecture

## Deployment
- Vercel
- Supabase

---

# High-Level System Design

Client
    ↓
Next.js Application Layer
    ↓
Server Actions / API Routes
    ↓
Service Layer
    ↓
Supabase Infrastructure

The application must remain server-first.

Avoid unnecessary client-side rendering.

---

# Engineering Philosophy

The architecture prioritizes:

- maintainability
- scalability
- modularity
- performance
- AI-agent compatibility

The codebase must remain:
- predictable
- typed
- isolated by feature
- easy to refactor

---

# Architectural Rules

## 1. Feature-Based Architecture

All features must be isolated.

Each feature owns:
- components
- hooks
- actions
- services
- types

Example:

/features
    /auth
    /properties
    /search
    /favorites
    /chat
    /bookings
    /ai

Avoid:
- giant shared folders
- mixed feature responsibilities

---

## 2. Server-First Architecture

Default:
- Server Components

Client Components should ONLY be used when necessary.

Allowed reasons:
- forms
- animations
- browser APIs
- highly interactive UI

Avoid:
- unnecessary "use client"
- client-side fetching by default

---

## 3. Thin Routes & Actions

Route handlers and Server Actions must remain thin.

Responsibilities:
- validate input
- call services
- return responses

Business logic MUST NOT live inside:
- route.ts
- page.tsx
- server actions

---

## 4. Service Layer Architecture

All application logic belongs inside services.

Example:

/services/propertyService.ts
/services/authService.ts
/services/aiService.ts

Responsibilities:
- business rules
- database coordination
- external API handling
- transformations

Avoid:
- database logic inside components
- duplicated API calls
- inline fetch requests

---

## 5. Database Access Rules

Supabase interactions must remain centralized.

Use:
- repositories
- service abstractions
- dedicated query utilities

Never:
- scatter direct Supabase queries throughout the app

---

# Project Structure

/apps/web

/src
    /app
    /components
    /features
    /hooks
    /lib
    /services
    /store
    /types
    /utils

/public

/docs

---

# App Router Standards

## Required
- Next.js App Router

## Forbidden
- Pages Router

All new routes must use:
- app directory
- route groups
- layouts
- server components

---

# Frontend Standards

## Component Rules

Components must be:
- reusable
- typed
- isolated
- small in responsibility

Avoid:
- massive page components
- mixed concerns
- direct database access

---

## Styling Rules

Use:
- TailwindCSS
- shadcn/ui

Avoid:
- inline styles
- random CSS files
- mixed styling systems

---

## Form Standards

Use:
- React Hook Form
- Zod validation

All forms must validate:
- client-side
- server-side

---

# State Management Standards

## Zustand

Use Zustand for:
- auth UI state
- modal state
- filters
- lightweight global state

---

## TanStack Query

Use TanStack Query for:
- API caching
- synchronization
- invalidation
- optimistic updates

Avoid duplicating server state.

---

# Authentication Architecture

Authentication handled via:
- Supabase Auth

Protected routes must validate sessions:
- server-side
- middleware
- route protection

Never trust client-only auth validation.

---

# API Architecture

## Preferred Order

1. Server Components
2. Server Actions
3. Route Handlers
4. Client fetching only when necessary

---

## API Standards

Use:
- RESTful conventions
- typed responses
- centralized error handling

Correct:
- /api/properties
- /api/bookings

Incorrect:
- /api/getProperties
- /api/createBooking

---

# AI Architecture

AI functionality must remain isolated.

Example:

/features/ai
/services/ai

Responsibilities:
- prompt management
- recommendations
- semantic search
- embeddings
- conversational memory

AI services must NEVER:
- directly manipulate UI state
- bypass validation
- access secrets client-side

---

# File Upload Architecture

Uploads handled through:
- Supabase Storage

Use:
- signed upload URLs
- protected buckets

Never expose:
- service role keys
- storage secrets

---

# Error Handling

Use:
- centralized error formatting
- typed API errors
- structured responses

Example:

{
  "success": false,
  "message": "Invalid credentials",
  "error": "AUTH_INVALID"
}

---

# Security Standards

## Required
- environment variables
- input validation
- server-side auth checks
- rate limiting
- secure headers

## Forbidden
- hardcoded secrets
- exposing API keys
- trusting client input blindly

---

# Performance Standards

Required:
- code splitting
- lazy loading
- image optimization
- streaming where beneficial

Use:
- next/image
- suspense
- dynamic imports

Avoid:
- massive client bundles
- unnecessary re-renders
- duplicate fetches

---

# Logging Standards

Log:
- API errors
- auth events
- AI requests
- critical actions

Never log:
- passwords
- tokens
- secrets
- sensitive personal data

---

# AI Agent Development Rules

AI-generated code MUST:
- follow existing architecture
- reuse existing modules
- avoid duplicate logic
- maintain strict typing
- preserve folder conventions

AI MUST NOT:
- invent architecture
- bypass services
- create hidden dependencies
- create massive files
- mix unrelated concerns

If unclear:
- request clarification
- do not hallucinate implementation details

---

# Scalability Goals

The system must support future expansion for:
- payments
- AI recommendations
- real-time messaging
- analytics
- admin dashboards
- property verification
- geolocation/maps
- mobile applications
- multi-language support

Architecture decisions must preserve scalability.