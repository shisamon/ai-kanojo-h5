-- Admin support. Already applied as migration `add_is_admin_to_profiles`.
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- Grant admin to an account (run manually per admin):
-- update public.profiles set is_admin = true where email = 'you@example.com';
