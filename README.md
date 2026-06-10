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

It covers:

- user profiles
- characters
- public/private works
- likes
- chat sessions
- chat messages
- creation jobs
- diamond transactions

## Deploy

Push this folder to GitHub, import the repository in Vercel, and set the environment variables from `.env.example`.
