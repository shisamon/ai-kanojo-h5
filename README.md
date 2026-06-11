# AIAI Studio Prototype

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
Admin account deletion protection is in `supabase/protect-admin-account.sql`.

Run order: `schema.sql` -> `admin.sql` -> `auth.sql` -> `templates.sql` -> `protect-admin-account.sql` -> `seed.sql` (optional).

It covers:

- user profiles
- characters
- public/private works
- likes
- chat sessions
- chat messages
- creation jobs
- diamond transactions

Run `seed.sql` only if you want sample public video works on the home feed.

## Video Generation

The creation tab calls `/api/generate-video`. Without RunPod variables it stays in demo mode, still creating a private work and spending diamonds. To connect a real worker, set:

- `RUNPOD_API_KEY`
- `RUNPOD_VIDEO_ENDPOINT`

Use a RunPod endpoint that returns a video URL in the response, preferably a synchronous endpoint for the first production version.

## Deploy

Push this folder to GitHub, import the repository in Vercel, and set the environment variables from `.env.example`.
