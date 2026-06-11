-- Protect the built-in admin account and any administrator profile from deletion.
-- Run this after schema.sql/admin.sql in every environment.

create or replace function public.prevent_protected_admin_profile_delete()
returns trigger
language plpgsql
security definer set search_path = public
as $$
declare
  old_profile jsonb := to_jsonb(old);
  old_username text := lower(coalesce(old_profile->>'username', ''));
  old_email text := lower(coalesce(old.email, ''));
  old_is_admin boolean := coalesce((old_profile->>'is_admin')::boolean, false);
begin
  if old_is_admin or old_username = 'admin' or old_email = 'admin@openlover.app' then
    raise exception 'Protected admin account cannot be deleted';
  end if;

  return old;
end;
$$;

drop trigger if exists prevent_protected_admin_profile_delete on public.profiles;
create trigger prevent_protected_admin_profile_delete
  before delete on public.profiles
  for each row execute function public.prevent_protected_admin_profile_delete();
