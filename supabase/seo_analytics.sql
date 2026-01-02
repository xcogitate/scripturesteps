create table if not exists public.seo_analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  time_range text not null check (time_range in ('7d', '30d', '90d')),
  captured_at timestamptz not null default now(),
  total_visitors int4 not null default 0,
  page_views int4 not null default 0,
  avg_bounce_rate int4 not null default 0,
  conversion_rate int4 not null default 0,
  organic_traffic int4 not null default 0,
  search_impressions int4 not null default 0,
  avg_search_position numeric(6,2) not null default 0,
  click_through_rate numeric(6,2) not null default 0,
  top_keywords jsonb not null default '[]'::jsonb,
  traffic_sources jsonb not null default '[]'::jsonb,
  top_pages jsonb not null default '[]'::jsonb,
  devices jsonb not null default '[]'::jsonb,
  geography jsonb not null default '[]'::jsonb,
  conversions jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists seo_analytics_snapshots_time_range_idx on public.seo_analytics_snapshots(time_range);

alter table public.seo_analytics_snapshots enable row level security;

create policy "Admin read seo analytics snapshots"
  on public.seo_analytics_snapshots
  for select
  using (auth.role() = 'service_role');
