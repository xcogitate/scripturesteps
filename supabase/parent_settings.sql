create table if not exists public.parent_settings (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null unique references public.profiles(id) on delete cascade,
  reminder_morning_enabled boolean not null default true,
  reminder_morning_time time not null default '08:00',
  reminder_evening_enabled boolean not null default true,
  reminder_evening_time time not null default '19:00',
  reminder_days text[] not null default array['Mon','Tue','Wed','Thu','Fri','Sat','Sun'],
  offline_enabled boolean not null default true,
  auto_download_enabled boolean not null default true,
  content_downloaded boolean not null default false,
  last_download_at timestamptz,
  progress_reports_enabled boolean not null default true,
  plan_name text not null default 'Free Plan',
  plan_status text not null default 'active',
  plan_price_cents int4 not null default 0,
  plan_interval text not null default 'month',
  trial_end timestamptz,
  current_period_end timestamptz,
  billing_provider text,
  billing_customer_id text,
  billing_subscription_id text,
  payment_method_brand text,
  payment_method_last4 text,
  parent_pin_enabled boolean not null default false,
  parent_pin_hash text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.parent_settings add column if not exists parent_pin_enabled boolean not null default false;
alter table public.parent_settings add column if not exists parent_pin_hash text;

create index if not exists parent_settings_parent_id_idx on public.parent_settings(parent_id);

alter table public.parent_settings enable row level security;

create policy "Parent can read own settings"
  on public.parent_settings
  for select
  using (auth.uid() = parent_id);

create policy "Parent can insert own settings"
  on public.parent_settings
  for insert
  with check (auth.uid() = parent_id);

create policy "Parent can update own settings"
  on public.parent_settings
  for update
  using (auth.uid() = parent_id);

alter table public.profiles enable row level security;

create policy "Profile read own"
  on public.profiles
  for select
  using (auth.uid() = id);

create policy "Profile upsert own"
  on public.profiles
  for insert
  with check (auth.uid() = id);

create policy "Profile update own"
  on public.profiles
  for update
  using (auth.uid() = id);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists support_requests_parent_id_idx on public.support_requests(parent_id);

alter table public.support_requests enable row level security;

create policy "Parent can read own support requests"
  on public.support_requests
  for select
  using (auth.uid() = parent_id);

create policy "Parent can create support requests"
  on public.support_requests
  for insert
  with check (auth.uid() = parent_id);

create table if not exists public.export_requests (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles(id) on delete cascade,
  status text not null default 'requested',
  format text not null default 'pdf',
  requested_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists export_requests_parent_id_idx on public.export_requests(parent_id);

alter table public.export_requests enable row level security;

create policy "Parent can read own export requests"
  on public.export_requests
  for select
  using (auth.uid() = parent_id);

create policy "Parent can create export requests"
  on public.export_requests
  for insert
  with check (auth.uid() = parent_id);
