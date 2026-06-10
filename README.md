# OpenLover Studio Prototype

This is the deployable Next.js version of the Chinese/Japanese prototype.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Environment

Copy `.env.example` to `.env.local` and fill in Supabase keys when the Supabase project is ready.

```bash
cp .env.example .env.local
```

## Database

The first Supabase schema is in `supabase/schema.sql`.
Optional demo seed data for the home video feed is in `supabase/seed.sql`.
Generation templates (styles) table and seed are in `supabase/templates.sql`.

Run order: `schema.sql` -> `templates.sql` -> `seed.sql` (optional).

It covers:

- user profiles
- characters
- public/private works
- likes
- chat sessions
- chat messages
- creation jobs
- diamond transactions

Run `schema.sql` first, then `seed.sql` if you want sample public video works on the home feed.

## Deploy

Push this folder to GitHub, import the repository in Vercel, and set the environment variables from `.env.example`.
