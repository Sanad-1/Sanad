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

-- create table if not exists is a no-op on a table that already existed
-- before poster_user_id was added to it here, so add it explicitly too —
-- this is what lets tapping a listing's avatar open the poster's profile.
alter table housing_listings add column if not exists poster_user_id uuid references app_users(id) on delete set null;
alter table forum_posts add column if not exists poster_user_id uuid references app_users(id) on delete set null;

-- ============================================================
-- 2. Username + password login
-- ============================================================

alter table app_users
  add column if not exists username text,
  add column if not exists password_hash text;

-- The old quick sign-in required a phone number; the new username+password
-- flow doesn't collect one, so it can no longer be mandatory.
alter table app_users alter column phone drop not null;

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
  -- A unique constraint is backed by an index, so Postgres reports a repeat
  -- attempt as 42P07 (duplicate_table), not 42710 (duplicate_object) — catch
  -- both so this is safe however it was created.
  when duplicate_table then null;
  when duplicate_object then null;
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

-- session_token proves "I am this user" to the mutating functions added later
-- (vote_on_reply, set_open_to_work) without needing a real auth/session layer —
-- a random, unguessable value only login/signup ever mint or rotate.
alter table app_users add column if not exists session_token text;
create unique index if not exists idx_app_users_session_token on app_users(session_token) where session_token is not null;

-- Postgres won't let CREATE OR REPLACE change a function's return type —
-- and these already exist (without session_token) from the first version
-- of this file — so drop them first. Safe: the bodies below recreate both
-- immediately, and DROP...IF EXISTS is a no-op on a first-time run.
drop function if exists signup_user(text, text, text, text);
drop function if exists login_user(text, text);

create or replace function signup_user(
  p_username text,
  p_password text,
  p_name text default null,
  p_phone text default null
)
returns table(id uuid, username text, name text, created_at timestamptz, session_token text)
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
  insert into app_users (username, password_hash, name, phone, session_token)
  values (
    lower(trim(p_username)),
    crypt(p_password, gen_salt('bf')),
    coalesce(nullif(trim(p_name), ''), p_username),
    p_phone,
    encode(gen_random_bytes(32), 'hex')
  )
  returning app_users.id, app_users.username, app_users.name, app_users.created_at, app_users.session_token;
exception
  when unique_violation then
    raise exception 'That username is already taken';
end;
$$;

create or replace function login_user(
  p_username text,
  p_password text
)
returns table(id uuid, username text, name text, created_at timestamptz, session_token text)
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v_id uuid;
begin
  select app_users.id into v_id
  from app_users
  where app_users.username = lower(trim(p_username))
    and app_users.password_hash = crypt(p_password, app_users.password_hash);

  if v_id is null then
    -- Deliberately vague — doesn't reveal whether the username exists.
    raise exception 'Invalid username or password';
  end if;

  -- Rotate the token on every login (simple "one active session" behavior —
  -- logging in elsewhere invalidates the old session token).
  return query
  update app_users set session_token = encode(gen_random_bytes(32), 'hex')
  where app_users.id = v_id
  returning app_users.id, app_users.username, app_users.name, app_users.created_at, app_users.session_token;
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

-- ============================================================
-- 6. Reply attribution + votes. forum_replies already had public
--    read/insert from section 5 (it's in that tables[] array), so
--    only the new columns + the votes table need policies here.
-- ============================================================

alter table forum_replies add column if not exists poster_user_id uuid references app_users(id) on delete set null;
alter table forum_replies add column if not exists created_at timestamptz default now();
alter table forum_replies add column if not exists votes int default 0;
create index if not exists idx_forum_replies_created_at on forum_replies(created_at);
create index if not exists idx_forum_replies_poster on forum_replies(poster_user_id);

create table if not exists forum_reply_votes (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default now(),
  reply_id uuid references forum_replies(id) on delete cascade,
  user_id uuid references app_users(id) on delete cascade,
  unique (reply_id, user_id)
);
alter table forum_reply_votes enable row level security;

do $$
declare pol record;
begin
  for pol in select policyname from pg_policies where schemaname = 'public' and tablename = 'forum_reply_votes' loop
    execute format('drop policy %I on public.forum_reply_votes', pol.policyname);
  end loop;
end $$;

create policy "public read" on public.forum_reply_votes for select using (true);
-- Deliberately no insert policy — the only insert path is vote_on_reply()
-- below, so a raw POST to this table from a client is always rejected.

-- ============================================================
-- 7. Reply voting — one vote per signed-in user per reply, enforced
--    server-side. p_session_token (not a raw user id) proves who's
--    calling, the same way login_user proves identity by checking a
--    password rather than trusting a client-asserted username.
-- ============================================================

create or replace function vote_on_reply(p_session_token text, p_reply_id uuid)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v_user_id uuid;
begin
  select id into v_user_id from app_users where session_token = p_session_token;
  if v_user_id is null then
    raise exception 'You need to be signed in to vote';
  end if;
  if not exists (select 1 from forum_replies where id = p_reply_id) then
    raise exception 'That reply no longer exists';
  end if;

  insert into forum_reply_votes (reply_id, user_id) values (p_reply_id, v_user_id);
  update forum_replies set votes = votes + 1 where id = p_reply_id;
exception
  when unique_violation then
    raise exception 'You already upvoted this reply';
end;
$$;

grant execute on function vote_on_reply(text, uuid) to anon, authenticated;

-- ============================================================
-- 8. Monthly helpfulness aggregate. A plain view, not a materialized
--    one — this app has no cron infra, and a GROUP BY over an indexed
--    created_at column is cheap at this scale, so recomputing on every
--    read keeps it simple and always fresh instead of trading that for
--    a staleness/refresh-schedule problem the app doesn't need yet.
--    Raw counts only — score weighting happens client-side in app.js
--    so the formula can be tuned without a migration.
-- ============================================================

create or replace view leaderboard_components as
select
  fr.poster_user_id as user_id,
  count(fr.id) filter (where fr.created_at >= date_trunc('month', now())) as reply_count_month,
  count(v.id)  filter (where v.created_at  >= date_trunc('month', now())) as vote_count_month
from forum_replies fr
left join forum_reply_votes v on v.reply_id = fr.id
where fr.poster_user_id is not null
group by fr.poster_user_id;

grant select on leaderboard_components to anon, authenticated;

-- ============================================================
-- 9. Employer opt-in. open_to_work_directory is a *view*, not a
--    grant on app_users — same "one narrow named door" pattern as
--    signup_user/login_user. Its `where open_to_work = true` clause
--    is fixed at creation time, so an opted-out user's contact info
--    is structurally unreachable through it, not just filtered by
--    convention. employer_contact_whatsapp is a separate column from
--    phone (which is optional/private, collected in a different
--    context) — opting in explicitly asks for a number at that moment.
-- ============================================================

alter table app_users add column if not exists open_to_work boolean default false;
alter table app_users add column if not exists employer_contact_whatsapp text;

create or replace function set_open_to_work(p_session_token text, p_enabled boolean, p_whatsapp text default null)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
declare v_user_id uuid;
begin
  select id into v_user_id from app_users where session_token = p_session_token;
  if v_user_id is null then
    raise exception 'You need to be signed in to change this';
  end if;
  if p_enabled and (p_whatsapp is null or length(trim(p_whatsapp)) < 8) then
    raise exception 'A WhatsApp number is required to become visible to employers';
  end if;

  update app_users
  set open_to_work = p_enabled,
      employer_contact_whatsapp = case when p_enabled then trim(p_whatsapp) else null end
  where id = v_user_id;
end;
$$;

grant execute on function set_open_to_work(text, boolean, text) to anon, authenticated;

create or replace view open_to_work_directory as
  select id, name, employer_contact_whatsapp, created_at
  from app_users
  where open_to_work = true;

grant select on open_to_work_directory to anon, authenticated;
