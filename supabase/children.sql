alter table public.children
  add column if not exists birthdate date;

alter table public.children enable row level security;

create policy if not exists "Parent can read own children"
  on public.children
  for select
  using (auth.uid() = parent_id);

create policy if not exists "Parent can insert own children"
  on public.children
  for insert
  with check (auth.uid() = parent_id);

create policy if not exists "Parent can update own children"
  on public.children
  for update
  using (auth.uid() = parent_id);

create policy if not exists "Parent can delete own children"
  on public.children
  for delete
  using (auth.uid() = parent_id);
