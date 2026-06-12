create extension if not exists "pgcrypto";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  username text unique,
  display_name text,
  avatar_url text,
  locale text not null default 'zh',
  current_plan text not null default 'standard',
  diamond_balance integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.characters (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references public.profiles(id) on delete set null,
  name text not null,
  age integer,
  tag text,
  creator_name text,
  image_url text,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.profiles
  add column if not exists username text;

create unique index if not exists profiles_username_key
  on public.profiles (username)
  where username is not null;

alter table public.profiles
  add column if not exists active_character_id uuid references public.characters(id) on delete set null;

create table if not exists public.works (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  character_id uuid references public.characters(id) on delete set null,
  title text not null,
  mode text not null check (mode in ('image', 'video')),
  media_url text not null,
  thumbnail_url text,
  cost integer not null default 0,
  visibility text not null default 'public' check (visibility in ('public', 'private')),
  likes_count integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.work_likes (
  work_id uuid not null references public.works(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (work_id, user_id)
);

create table if not exists public.chat_sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  character_id uuid references public.characters(id) on delete set null,
  title text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.chat_messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid not null references public.chat_sessions(id) on delete cascade,
  sender text not null check (sender in ('user', 'character', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.creation_jobs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  character_id uuid references public.characters(id) on delete set null,
  template_name text not null,
  mode text not null check (mode in ('image', 'video')),
  prompt text not null,
  status text not null default 'queued' check (status in ('queued', 'running', 'completed', 'failed')),
  result_work_id uuid references public.works(id) on delete set null,
  cost integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.diamond_transactions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount integer not null,
  reason text not null,
  related_job_id uuid references public.creation_jobs(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.characters enable row level security;
alter table public.works enable row level security;
alter table public.work_likes enable row level security;
alter table public.chat_sessions enable row level security;
alter table public.chat_messages enable row level security;
alter table public.creation_jobs enable row level security;
alter table public.diamond_transactions enable row level security;

create policy "Profiles are readable by owner"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Profiles are editable by owner"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Profiles are insertable by owner"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "Public characters are readable"
  on public.characters for select
  using (is_public = true or auth.uid() = owner_id);

create policy "Users manage own characters"
  on public.characters for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Public works are readable"
  on public.works for select
  using (visibility = 'public' or auth.uid() = user_id);

create policy "Users manage own works"
  on public.works for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own likes"
  on public.work_likes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own chats"
  on public.chat_sessions for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read messages in own chats"
  on public.chat_messages for select
  using (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and chat_sessions.user_id = auth.uid()
    )
  );

create policy "Users create messages in own chats"
  on public.chat_messages for insert
  with check (
    exists (
      select 1 from public.chat_sessions
      where chat_sessions.id = chat_messages.session_id
      and chat_sessions.user_id = auth.uid()
    )
  );

create policy "Users manage own creation jobs"
  on public.creation_jobs for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users read own diamond transactions"
  on public.diamond_transactions for select
  using (auth.uid() = user_id);
