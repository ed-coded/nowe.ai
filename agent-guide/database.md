# HomeHub Database Design

## Database Provider

Database:
- Supabase PostgreSQL

Auth:
- Supabase Auth

Storage:
- Supabase Storage

---

# Database Design Principles

## Rules

- UUID primary keys only
- Timestamps on all tables
- Soft deletes where necessary
- Normalize critical relational data
- Avoid unnecessary JSON blobs

---

# Core Tables

## profiles

Stores user profile information.

| Column | Type |
|---|---|
| id | uuid |
| email | text |
| full_name | text |
| avatar_url | text |
| phone | text |
| role | text |
| created_at | timestamptz |
| updated_at | timestamptz |

Relationship:
- linked to Supabase auth.users

---

## properties

Stores rental property listings.

| Column | Type |
|---|---|
| id | uuid |
| owner_id | uuid |
| title | text |
| description | text |
| property_type | text |
| price | numeric |
| bedrooms | integer |
| bathrooms | integer |
| address | text |
| city | text |
| region | text |
| latitude | numeric |
| longitude | numeric |
| is_featured | boolean |
| status | text |
| created_at | timestamptz |
| updated_at | timestamptz |

---

## property_images

Stores property images.

| Column | Type |
|---|---|
| id | uuid |
| property_id | uuid |
| image_url | text |
| sort_order | integer |
| created_at | timestamptz |

---

## favorites

Stores saved properties.

| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| property_id | uuid |
| created_at | timestamptz |

---

## bookings

Stores property viewing requests.

| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| property_id | uuid |
| booking_date | timestamptz |
| status | text |
| created_at | timestamptz |

---

## chats

Stores conversations.

| Column | Type |
|---|---|
| id | uuid |
| user_id | uuid |
| created_at | timestamptz |

---

## chat_messages

Stores chat messages.

| Column | Type |
|---|---|
| id | uuid |
| chat_id | uuid |
| sender_type | text |
| message | text |
| created_at | timestamptz |

---

# Relationships

profiles
    ↓
properties.owner_id

properties
    ↓
property_images.property_id

profiles
    ↓
favorites.user_id

properties
    ↓
favorites.property_id

profiles
    ↓
bookings.user_id

properties
    ↓
bookings.property_id

---

# Enums

## user_role
- user
- landlord
- admin

## property_status
- draft
- published
- archived

## booking_status
- pending
- approved
- rejected
- completed

---

# Required Indexes

## properties
- city
- price
- property_type
- status

## favorites
- user_id
- property_id

## bookings
- user_id
- property_id

---

# Row Level Security (RLS)

RLS must be enabled.

## Example Rules

Users can:
- view public properties
- edit their own profile
- manage their own listings
- manage their own favorites

Admins can:
- manage all content

---

# Storage Buckets

## property-images
Stores listing images.

## avatars
Stores user profile images.

---

# Naming Conventions

## Tables
snake_case plural

Correct:
- property_images
- chat_messages

Incorrect:
- PropertyImages
- propertyImage

---

# Migration Rules

All schema changes must:
- use migrations
- be reversible
- never modify production manually

---

# Future Database Expansion

Future-ready tables:
- payments
- reviews
- notifications
- AI embeddings
- recommendations
- analytics
- moderation reports

Database design must remain extensible.