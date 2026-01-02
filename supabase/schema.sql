create extension if not exists "pgcrypto";

create table if not exists public.weekly_themes (
  id uuid primary key default gen_random_uuid(),
  program_year int not null default 1,
  week int not null,
  month text not null,
  theme_4_7 text not null,
  theme_8_12 text not null,
  created_at timestamptz not null default now(),
  unique (program_year, week)
);

create table if not exists public.weekly_verses (
  id uuid primary key default gen_random_uuid(),
  program_year int not null default 1,
  week int not null,
  age_group text not null,
  verse_variant text,
  verse_text text not null,
  reference text not null,
  created_at timestamptz not null default now(),
  unique (program_year, week, age_group, verse_variant)
);

create table if not exists public.ai_content (
  id uuid primary key default gen_random_uuid(),
  program_year int not null default 1,
  week int not null,
  age_group text not null,
  verse_variant text,
  content_type text not null,
  content jsonb not null,
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (program_year, week, age_group, verse_variant, content_type)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  parent_name text not null,
  rating int4 not null,
  sentiment text not null,
  feedback text not null,
  status text not null default 'pending',
  submitted_at timestamptz not null default now(),
  reviewed_at timestamptz,
  reviewed_by text
);

create index if not exists reviews_status_idx on public.reviews(status);
create index if not exists reviews_submitted_at_idx on public.reviews(submitted_at desc);

alter table public.reviews enable row level security;

create policy "Public can read approved reviews"
  on public.reviews
  for select
  using (status = 'approved');

create policy "Parent can create reviews"
  on public.reviews
  for insert
  with check (auth.uid() = parent_id);
