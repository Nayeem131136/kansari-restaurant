-- Kansari Restaurant — Supabase (Postgres) schema
-- Run this once in the Supabase SQL Editor (Dashboard → SQL Editor → New query).

create table if not exists admin_user (
  id text primary key,
  email text unique not null,
  password_hash text not null,
  name text not null,
  role text not null default 'admin',
  last_login timestamptz
);

-- Single-row table holding the whole RestaurantSettings object as JSON.
-- Kept as JSON (not fully relational) because it's a small, deeply-nested
-- config object that's always read/written as a whole.
create table if not exists settings (
  id text primary key default 'main',
  data jsonb not null
);

create table if not exists categories (
  id text primary key,
  name text not null,
  bengali_name text not null,
  sub_label text,
  sort_order integer not null default 1,
  is_visible boolean not null default true
);

create table if not exists menu_items (
  id text primary key,
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
  created_at timestamptz,
  updated_at timestamptz
);

create table if not exists gallery (
  id text primary key,
  url text not null,
  title text not null,
  bengali text not null,
  aspect text not null default 'square',
  sort_order integer not null default 1,
  featured boolean not null default false,
  created_at timestamptz
);

create table if not exists reviews (
  id text primary key,
  name text not null,
  text text not null,
  date text not null,
  rating integer not null,
  published boolean not null default true,
  created_at timestamptz,
  updated_at timestamptz
);

create table if not exists reservations (
  id text primary key,
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

create table if not exists activity_logs (
  id text primary key,
  action text not null,
  description text not null,
  user_email text not null,
  timestamp timestamptz not null default now(),
  entity_type text
);

create index if not exists idx_menu_items_category on menu_items(category_id);
create index if not exists idx_reservations_date on reservations(date);
create index if not exists idx_reservations_status on reservations(status);
create index if not exists idx_activity_logs_timestamp on activity_logs(timestamp desc);

-- Row Level Security: enabled with NO policies, so only requests using the
-- service_role key (our backend) can read/write. The anon key alone
-- cannot touch these tables. This is intentional — all data access goes
-- through our API routes, never directly from the browser.
alter table admin_user enable row level security;
alter table settings enable row level security;
alter table categories enable row level security;
alter table menu_items enable row level security;
alter table gallery enable row level security;
alter table reviews enable row level security;
alter table reservations enable row level security;
alter table activity_logs enable row level security;
