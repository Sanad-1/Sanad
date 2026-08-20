-- Sanad — Supabase schema
-- Run this whole file in Supabase Dashboard -> SQL Editor -> New query -> Run.
-- Safe to run more than once (every step is written to not fail on a rerun).

create extension if not exists pgcrypto; -- gen_random_uuid() + crypt() for password hashing

-- ============================================================
-- 1. Tables that were already implied by the app but never
--    formally documented. Skipped automatically if they exist.
-- ============================================================

create table if not exists app_users (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  name text,
  phone text
);

create table if not exists housing_listings (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  city text, rent int, room_type text, gender_pref text,
  nationality_pref text, bills_included boolean,
  description text, poster_role text, whatsapp text, video_url text,
  poster_user_id uuid references app_users(id) on delete set null
);

create table if not exists forum_posts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  category text, question text, posted_by text, votes int default 0,
  poster_user_id uuid references app_users(id) on delete set null
);

create table if not exists forum_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references forum_posts(id) on delete cascade,
  reply_text text
);

create table if not exists share_links (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references app_users(id) on delete cascade,
  page text, code text unique
);

create table if not exists share_clicks (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  share_link_id uuid references share_links(id) on delete cascade
);

create table if not exists buddies (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  user_id uuid references app_users(id) on delete cascade,
  help_areas text[], bio text, whatsapp text
);

-- ============================================================
-- 2. Username + password login
-- ============================================================

alter table app_users
  add column if not exists username text,
  add column if not exists password_hash text;

-- Backfill: any accounts created by the old "name + phone, no password"
-- quick sign-in won't have a username yet. Give them a placeholder so
-- the unique constraint below doesn't fail — they'll need to sign up
-- fresh to set a real password.
update app_users
set username = 'user_' || substr(id::text, 1, 8)
where username is null;

alter table app_users alter column username set not null;

do $$
begin
  alter table app_users add constraint app_users_username_key unique (username);
exception
  when duplicate_object then null; -- constraint already exists, fine
end $$;

-- ============================================================
-- 3. Lock the table down. password_hash must never be reachable
--    through the public API — only through the two functions below,
--    which run as the table owner and bypass RLS entirely.
-- ============================================================

alter table app_users enable row level security;

-- Wipe any older policies (e.g. from the previous phone-based sign-in)
-- so nothing accidentally leaves the table open to direct reads.
do $$
declare pol record;
begin
  for pol in select policyname from pg_policies where schemaname = 'public' and tablename = 'app_users' loop
    execute format('drop policy %I on public.app_users', pol.policyname);
  end loop;
end $$;

revoke all on app_users from anon, authenticated;

-- The only thing safe to expose directly: buddy cards show the
-- poster's display name via a join (app_users(name)) — nothing else.
-- Row-level policy makes every row visible; the column grant above
-- narrows *which columns* of that row anyone can actually see, so
-- username/password_hash/phone stay unreachable through the API
-- no matter what a client asks for.
grant select (id, name) on app_users to anon, authenticated;

create policy "public name lookup" on app_users for select using (true);

-- ============================================================
-- 4. Sign-up / login functions (SECURITY DEFINER = run with the
--    table owner's rights, so they work even though anon/authenticated
--    have no direct table access above).
-- ============================================================

create or replace function signup_user(
  p_username text,
  p_password text,
  p_name text default null,
  p_phone text default null
)
returns table(id uuid, username text, name text, created_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  if p_username is null or length(trim(p_username)) < 3 then
    raise exception 'Username must be at least 3 characters';
  end if;
  if p_password is null or length(p_password) < 6 then
    raise exception 'Password must be at least 6 characters';
  end if;

  return query
  insert into app_users (username, password_hash, name, phone)
  values (
    lower(trim(p_username)),
    crypt(p_password, gen_salt('bf')),
    coalesce(nullif(trim(p_name), ''), p_username),
    p_phone
  )
  returning app_users.id, app_users.username, app_users.name, app_users.created_at;
exception
  when unique_violation then
    raise exception 'That username is already taken';
end;
$$;

create or replace function login_user(
  p_username text,
  p_password text
)
returns table(id uuid, username text, name text, created_at timestamptz)
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  return query
  select app_users.id, app_users.username, app_users.name, app_users.created_at
  from app_users
  where app_users.username = lower(trim(p_username))
    and app_users.password_hash = crypt(p_password, app_users.password_hash);

  if not found then
    -- Deliberately vague — doesn't reveal whether the username exists.
    raise exception 'Invalid username or password';
  end if;
end;
$$;

grant execute on function signup_user(text, text, text, text) to anon, authenticated;
grant execute on function login_user(text, text) to anon, authenticated;

-- ============================================================
-- 5. Everything else (housing_listings, forum_posts, forum_replies,
--    share_links, share_clicks, buddies) stays publicly readable —
--    this is a public board, only app_users holds anything secret.
--    Skips a table's policy if you've already set one up by hand.
-- ============================================================

alter table housing_listings enable row level security;
alter table forum_posts enable row level security;
alter table forum_replies enable row level security;
alter table share_links enable row level security;
alter table share_clicks enable row level security;
alter table buddies enable row level security;

do $$
declare
  t text;
  tables text[] := array['housing_listings','forum_posts','forum_replies','share_links','share_clicks','buddies'];
begin
  foreach t in array tables loop
    if not exists (
      select 1 from pg_policies where schemaname = 'public' and tablename = t and policyname = 'public read'
    ) then
      execute format('create policy "public read" on public.%I for select using (true)', t);
    end if;
    if not exists (
      select 1 from pg_policies where schemaname = 'public' and tablename = t and policyname = 'public insert'
    ) then
      execute format('create policy "public insert" on public.%I for insert with check (true)', t);
    end if;
  end loop;
end $$;
