# API Rules

# Overview

The Home API architecture must remain:
- predictable
- typed
- secure
- modular
- scalable

All APIs must follow consistent standards.

---

# API Architecture

Use:
- Next.js Route Handlers
- Server Actions
- service layer abstraction

Business logic must NEVER exist directly inside:
- route.ts
- page.tsx

---

# API Design Principles

APIs must be:
- RESTful
- resource-oriented
- version-ready
- predictable

---

# Route Naming Rules

## Correct

/api/properties
/api/bookings
/api/users

## Incorrect

/api/getProperties
/api/createUser

Use nouns, not verbs.

---

# HTTP Method Rules

## GET
Retrieve data

## POST
Create resources

## PATCH
Update resources

## DELETE
Delete resources

Avoid:
- abusing POST for everything

---

# Response Standards

All responses must follow consistent structure.

## Success Response

{
  "success": true,
  "data": {}
}

---

## Error Response

{
  "success": false,
  "message": "Human readable message",
  "error": "ERROR_CODE"
}

---

# Validation Rules

All input must validate:
- client-side
- server-side

Use:
- Zod
- strict TypeScript typing

Never trust client input.

---

# Authentication Rules

Protected routes must:
- validate sessions server-side
- verify user roles
- reject unauthorized access

Never rely on client-only checks.

---

# Authorization Rules

Role checks required for:
- admin routes
- landlord actions
- sensitive mutations

Roles:
- agent
- user

---

# Database Rules

Database access must:
- go through services
- remain centralized

Avoid:
- duplicated queries
- direct DB access inside components

---

# Pagination Rules

Large collections MUST use pagination.

Use:
- cursor pagination
OR
- limit/offset pagination

Never return massive datasets.

---

# Filtering Rules

Filtering must:
- validate query parameters
- support indexing
- remain performant

---

# Error Handling Rules

Use:
- centralized error formatting
- predictable status codes
- meaningful messages

Avoid:
- leaking internal errors
- exposing stack traces

---

# File Upload Rules

Uploads must:
- validate file types
- validate size limits
- use signed upload URLs

Never expose:
- storage secrets
- service role keys

---

# Logging Rules

Log:
- API failures
- auth events
- critical mutations

Never log:
- passwords
- tokens
- sensitive user data

---

# Security Rules

Required:
- rate limiting
- input sanitization
- auth validation
- server-side permissions

Forbidden:
- trusting frontend validation alone
- exposing secrets client-side

---

# Performance Rules

Use:
- indexed queries
- caching where appropriate
- optimized payloads

Avoid:
- N+1 queries
- duplicate requests
- overfetching

---

# API Versioning

Future-ready structure:

/api/v1

The system should support future API versioning without major rewrites.

---

# AI API Rules

AI endpoints must:
- remain isolated
- validate prompts
- rate limit requests

Avoid:
- unrestricted AI usage
- excessive token generation

AI routes should remain cost-aware.

---

# Forbidden Practices

Do NOT:
- create giant route handlers
- duplicate API logic
- bypass services
- bypass validation
- return inconsistent responses
- expose internal implementation details