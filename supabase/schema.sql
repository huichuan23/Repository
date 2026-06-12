create extension if not exists "pgcrypto";

create table if not exists user_profile (
  id uuid primary key default gen_random_uuid(),
  display_name text default '我',
  height_cm integer,
  body_notes text,
  skin_tone text,
  preferred_styles text[] default '{}',
  avoided_colors text[] default '{}',
  avoided_fits text[] default '{}',
  size_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists clothing_items (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  image_url text,
  colors text[] default '{}',
  material text,
  fit text,
  seasons text[] default '{}',
  styles text[] default '{}',
  occasions text[] default '{}',
  comfort_score integer check (comfort_score between 1 and 5),
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists outfits (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  reason text,
  occasion text,
  weather text,
  mood text,
  formality text,
  tags text[] default '{}',
  source text not null default 'manual',
  created_at timestamptz not null default now()
);

create table if not exists outfit_items (
  outfit_id uuid references outfits(id) on delete cascade,
  clothing_item_id uuid references clothing_items(id) on delete cascade,
  primary key (outfit_id, clothing_item_id)
);

create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid references outfits(id) on delete cascade,
  rating integer check (rating between 1 and 5),
  labels text[] default '{}',
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists wear_logs (
  id uuid primary key default gen_random_uuid(),
  outfit_id uuid references outfits(id) on delete set null,
  worn_on date not null default current_date,
  occasion text,
  weather text,
  comfort_score integer check (comfort_score between 1 and 5),
  photo_url text,
  notes text,
  created_at timestamptz not null default now()
);
