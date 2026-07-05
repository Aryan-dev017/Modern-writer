# Enchanted Journal

An immersive storytelling platform inspired by magical libraries, enchanted notebooks, and wizarding-world aesthetics.

Enchanted Journal transforms worldbuilding into an experience that feels less like using software and more like opening an old magical book hidden deep inside an ancient library.

Create universes, characters, relationships, scenes, and lore inside a living storybook.

---

## Features

### Universe Creation
- Create multiple worlds and story universes.
- Organize projects into independent storybooks.
- Store settings, genres, themes, and lore.

### Character Management
- Create detailed character profiles.
- Track personalities, goals, fears, secrets, and relationships.
- Attach portraits and custom metadata.

### Relationship Graph
- Visualize character connections.
- Support friendships, rivalries, romances, mentorships, and more.
- Dynamic graph visualization using interactive nodes and edges.

### Scene Management
- Organize scenes chronologically.
- Maintain story timelines.
- Track emotional tone, locations, and notes.

### Lore Archive
Store:
- Locations
- Kingdoms
- Organizations
- Magic systems
- Historical events
- Technologies
- Religions

### Private Story Worlds
Every user's stories remain isolated and private through database-level security policies.

### Analytics
PostHog integration provides:
- feature usage analytics
- engagement tracking
- onboarding analytics
- performance insights

---

## Architecture

```text
User
 │
 ├── Authentication (Supabase Auth)
 │
 ├── Universes
 │     ├── Characters
 │     ├── Relationships
 │     ├── Scenes
 │     └── Lore Entries
 │
 └── Media Storage
       ├── Character Portraits
       ├── Covers
       └── Assets
```

---

## Database Structure

### Users
Managed by Supabase Authentication.

### Projects / Universes

```sql
id UUID
user_id UUID
title TEXT
description TEXT
genre TEXT
cover_image TEXT
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Characters

```sql
id UUID
project_id UUID
user_id UUID
name TEXT
bio TEXT
personality TEXT
goals TEXT
fears TEXT
secrets TEXT
avatar_url TEXT
created_at TIMESTAMP
```

### Relationships

```sql
id UUID
project_id UUID
user_id UUID
character_a UUID
character_b UUID
relationship_type TEXT
relationship_strength INTEGER
notes TEXT
```

### Scenes

```sql
id UUID
project_id UUID
user_id UUID
title TEXT
summary TEXT
location TEXT
emotional_tone TEXT
order_index INTEGER
```

### Lore Entries

```sql
id UUID
project_id UUID
user_id UUID
title TEXT
category TEXT
content TEXT
image_url TEXT
```

---

## Data Security

The application uses:

- Row Level Security (RLS)
- Supabase Authentication
- User ownership validation
- Database policies

Every record belongs to a specific user.

Users cannot access, modify, or view data belonging to other users.

---

## Storage System

Storage is handled using:

### Supabase Storage

Used for:

- Character avatars
- Universe covers
- Story assets
- Uploaded images

Storage buckets are protected using user-based access policies.

---

## Tech Stack

### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- shadcn/ui

### Backend
- Supabase
- PostgreSQL
- Row Level Security

### Analytics
- PostHog

### Deployment
- Vercel

---

## Local Development

Clone repository:

```bash
git clone https://github.com/yourusername/enchanted-journal.git
cd enchanted-journal
```

Install dependencies:

```bash
npm install
```

Create environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=
```

Run locally:

```bash
npm run dev
```

Application starts on:

```text
http://localhost:3000
```

---

## Deployment

Production deployment is handled using Vercel.

```text
Git Push
    ↓
GitHub
    ↓
Vercel Build
    ↓
Production Deployment
```

---

## Roadmap

### Version 1
- [x] Authentication
- [x] Universe creation
- [x] Character management
- [x] Relationship graph
- [x] Scene management
- [x] Lore archive

### Version 2
- [ ] Autosave
- [ ] Real-time collaboration
- [ ] Timeline mode
- [ ] Story export
- [ ] AI-assisted worldbuilding

### Version 3
- [ ] Offline support
- [ ] Mobile application
- [ ] Shared universes
- [ ] Plugin system

---

## Design Philosophy

Enchanted Journal was designed around a simple idea:

> Stories deserve a home that feels magical.

The goal was never to create another productivity application.

The goal was to create a place where worlds feel alive.

---

## License

This project is licensed under the MIT License.

---

## Final Thought

Every universe begins with a blank page.

The rest is ink.
