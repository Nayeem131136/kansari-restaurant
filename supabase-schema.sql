-- ============================================================================
-- KANSARI Restaurant — Supabase schema (client-direct architecture)
-- Run this ENTIRE file once in: Supabase Dashboard → SQL Editor → New Query → Run
--
-- This project talks to Supabase directly from the browser (no custom
-- Node/Express backend). Security is enforced entirely by the Row Level
-- Security policies below, plus Supabase Auth for the admin login.
-- ============================================================================

-- 1. CATEGORIES
create table if not exists categories (
  id text primary key,
  name text not null,
  bengali_name text not null,
  sub_label text,
  sort_order integer not null default 1,
  is_visible boolean not null default true
);

-- 2. MENU ITEMS
create table if not exists menu_items (
  id text primary key default gen_random_uuid()::text,
  category_id text not null references categories(id),
  name text not null,
  bengali_name text not null,
  price text not null,
  description text,
  bengali_description text,
  image text,
  tag text,
  badge text,
  featured boolean not null default false,
  available boolean not null default true,
  sort_order integer not null default 1,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 3. GALLERY
create table if not exists gallery (
  id text primary key default gen_random_uuid()::text,
  url text not null,
  title text not null,
  bengali text not null,
  aspect text not null default 'square',
  sort_order integer not null default 1,
  featured boolean not null default false,
  created_at timestamptz default now()
);

-- 4. REVIEWS
create table if not exists reviews (
  id text primary key default gen_random_uuid()::text,
  name text not null,
  text text not null,
  date text not null,
  rating integer not null,
  published boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 5. RESERVATIONS
create table if not exists reservations (
  id text primary key default gen_random_uuid()::text,
  customer_name text not null,
  phone text not null,
  date text not null,
  time text not null,
  guests integer not null,
  notes text,
  status text not null default 'PENDING',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 6. ACTIVITY LOGS
create table if not exists activity_logs (
  id text primary key default gen_random_uuid()::text,
  action text not null,
  description text not null,
  user_email text not null,
  timestamp timestamptz not null default now(),
  entity_type text
);

-- 7. SETTINGS (single-row JSON config)
create table if not exists settings (
  id text primary key default 'main',
  data jsonb not null
);

create index if not exists idx_menu_items_category on menu_items(category_id);
create index if not exists idx_reservations_date on reservations(date);
create index if not exists idx_reservations_status on reservations(status);
create index if not exists idx_activity_logs_timestamp on activity_logs(timestamp desc);

-- 8. updated_at auto-touch triggers
create or replace function touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_touch_menu_items on menu_items;
create trigger trg_touch_menu_items before update on menu_items
  for each row execute function touch_updated_at();

drop trigger if exists trg_touch_reviews on reviews;
create trigger trg_touch_reviews before update on reviews
  for each row execute function touch_updated_at();

drop trigger if exists trg_touch_reservations on reservations;
create trigger trg_touch_reservations before update on reservations
  for each row execute function touch_updated_at();

-- 9. ADMIN ALLOWLIST
-- IMPORTANT: keep this in sync with the admin account you create in
-- Authentication → Users. This function is the real security boundary,
-- enforced by the RLS policies below — not just a client-side check.
create or replace function is_admin()
returns boolean
language sql
stable
as $$
  select coalesce(auth.jwt() ->> 'email', '') = any(array[
    'kansari@nayeem.com'
  ]);
$$;

-- 10. ROW LEVEL SECURITY
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table gallery enable row level security;
alter table reviews enable row level security;
alter table reservations enable row level security;
alter table activity_logs enable row level security;
alter table settings enable row level security;

-- Categories: public read (visible only), admin full access
drop policy if exists "public read visible categories" on categories;
create policy "public read visible categories" on categories for select
  to anon, authenticated using (is_visible = true or is_admin());
drop policy if exists "admin write categories" on categories;
create policy "admin write categories" on categories for all
  to authenticated using (is_admin()) with check (is_admin());

-- Menu items: public read, admin full access
drop policy if exists "public read menu items" on menu_items;
create policy "public read menu items" on menu_items for select
  to anon, authenticated using (true);
drop policy if exists "admin write menu items" on menu_items;
create policy "admin write menu items" on menu_items for all
  to authenticated using (is_admin()) with check (is_admin());

-- Gallery: public read, admin full access
drop policy if exists "public read gallery" on gallery;
create policy "public read gallery" on gallery for select
  to anon, authenticated using (true);
drop policy if exists "admin write gallery" on gallery;
create policy "admin write gallery" on gallery for all
  to authenticated using (is_admin()) with check (is_admin());

-- Reviews: public reads published only, admin sees/writes everything
drop policy if exists "public read published reviews" on reviews;
create policy "public read published reviews" on reviews for select
  to anon, authenticated using (published = true or is_admin());
drop policy if exists "admin write reviews" on reviews;
create policy "admin write reviews" on reviews for all
  to authenticated using (is_admin()) with check (is_admin());

-- Reservations: anyone can submit (insert), only admin can read/update/delete
drop policy if exists "public can submit reservations" on reservations;
create policy "public can submit reservations" on reservations for insert
  to anon, authenticated with check (true);
drop policy if exists "admin read reservations" on reservations;
create policy "admin read reservations" on reservations for select
  to authenticated using (is_admin());
drop policy if exists "admin update reservations" on reservations;
create policy "admin update reservations" on reservations for update
  to authenticated using (is_admin()) with check (is_admin());
drop policy if exists "admin delete reservations" on reservations;
create policy "admin delete reservations" on reservations for delete
  to authenticated using (is_admin());

-- Activity logs: admin only, both read and write
drop policy if exists "admin all activity logs" on activity_logs;
create policy "admin all activity logs" on activity_logs for all
  to authenticated using (is_admin()) with check (is_admin());
-- Allow inserts from anon too, since a public reservation submission also
-- logs an activity entry (e.g. "NEW_RESERVATION") before the customer is
-- authenticated.
drop policy if exists "public can log reservation activity" on activity_logs;
create policy "public can log reservation activity" on activity_logs for insert
  to anon with check (entity_type = 'RESERVATION');

-- Settings: public read, admin write
drop policy if exists "public read settings" on settings;
create policy "public read settings" on settings for select
  to anon, authenticated using (true);
drop policy if exists "admin write settings" on settings;
create policy "admin write settings" on settings for update
  to authenticated using (is_admin()) with check (is_admin());

-- 11. STORAGE BUCKET for admin-uploaded dish/gallery photos
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('kansari-uploads', 'kansari-uploads', true, 8388608, array['image/png','image/jpeg','image/jpg','image/webp','image/gif'])
on conflict (id) do update set
  file_size_limit = 8388608,
  allowed_mime_types = array['image/png','image/jpeg','image/jpg','image/webp','image/gif'];

drop policy if exists "admin upload to kansari-uploads" on storage.objects;
create policy "admin upload to kansari-uploads" on storage.objects for insert
  to authenticated with check (bucket_id = 'kansari-uploads' and is_admin());
drop policy if exists "public read kansari-uploads" on storage.objects;
create policy "public read kansari-uploads" on storage.objects for select
  to anon, authenticated using (bucket_id = 'kansari-uploads');
drop policy if exists "admin delete from kansari-uploads" on storage.objects;
create policy "admin delete from kansari-uploads" on storage.objects for delete
  to authenticated using (bucket_id = 'kansari-uploads' and is_admin());

-- ============================================================================
-- Done. Next steps:
-- 1. Authentication → Providers → make sure Email is enabled.
-- 2. Authentication → Users → Add user → create your admin login
--    (kansari@nayeem.com + your password), matching is_admin() above.
-- 3. Run seed.sql next to load the real menu, categories, gallery, and
--    reviews data.
-- ============================================================================
