-- Auth support: profile auto-creation, atomic diamond spend, likes count sync.
-- Already applied to the project as migration `auth_profile_trigger_and_rpc`.
-- Kept here for reference / new environments. Run after schema.sql.

-- Auto-create a profile row when a new auth user signs up.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name, public_id)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', 'User-' || substr(replace(new.id::text, '-', ''), 1, 8)),
    substr(md5(new.id::text || 'openlover'), 1, 8)
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Atomic diamond spend: checks balance, deducts, records transaction.
create or replace function public.spend_diamonds(amount integer, reason text)
returns integer
language plpgsql
security definer set search_path = public
as $$
declare
  new_balance integer;
begin
  if amount <= 0 then
    raise exception 'invalid amount';
  end if;
  update public.profiles
    set diamond_balance = diamond_balance - amount, updated_at = now()
    where id = auth.uid() and diamond_balance >= amount
    returning diamond_balance into new_balance;
  if new_balance is null then
    raise exception 'insufficient balance';
  end if;
  insert into public.diamond_transactions (user_id, amount, reason)
  values (auth.uid(), -amount, reason);
  return new_balance;
end;
$$;

revoke all on function public.spend_diamonds(integer, text) from anon;

-- Keep works.likes_count in sync with work_likes.
create or replace function public.sync_likes_count()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    update public.works set likes_count = likes_count + 1 where id = new.work_id;
    return new;
  elsif tg_op = 'DELETE' then
    update public.works set likes_count = greatest(likes_count - 1, 0) where id = old.work_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists on_work_like_change on public.work_likes;
create trigger on_work_like_change
  after insert or delete on public.work_likes
  for each row execute function public.sync_likes_count();

-- Allow reading likes on public works (for showing liked state).
drop policy if exists "Likes on public works are readable" on public.work_likes;
create policy "Likes on public works are readable"
  on public.work_likes for select
  using (
    auth.uid() = user_id
    or exists (select 1 from public.works where works.id = work_likes.work_id and works.visibility = 'public')
  );
