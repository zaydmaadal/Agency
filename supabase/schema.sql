-- Applied to Supabase project "Agency Startbord" (eu-central-1). Kept here for reference/rebuild.
create table public.members (email text primary key, name text not null);
create function public.is_member() returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.members where email = (auth.jwt() ->> 'email'))
$$;
revoke execute on function public.is_member() from public, anon;
grant execute on function public.is_member() to authenticated;
create table public.checks (id text primary key, by text not null default (auth.jwt() ->> 'email'), at timestamptz not null default now());
create table public.items (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('task','feedback','link')),
  ref text not null,
  text text not null check (length(text) between 1 and 2000),
  url text check (url ~* '^https?://'),
  by text not null default (auth.jwt() ->> 'email'),
  at timestamptz not null default now()
);
create table public.kv (key text primary key, value jsonb not null, by text not null default (auth.jwt() ->> 'email'), at timestamptz not null default now());
alter table public.members enable row level security;
alter table public.checks enable row level security;
alter table public.items enable row level security;
alter table public.kv enable row level security;
create policy "members read" on public.members for select to authenticated using ((select public.is_member()));
create policy "checks all" on public.checks for all to authenticated using ((select public.is_member())) with check ((select public.is_member()));
create policy "kv all" on public.kv for all to authenticated using ((select public.is_member())) with check ((select public.is_member()));
create policy "items read" on public.items for select to authenticated using ((select public.is_member()));
create policy "items insert" on public.items for insert to authenticated with check ((select public.is_member()) and by = (auth.jwt() ->> 'email'));
create policy "items delete own" on public.items for delete to authenticated using ((select public.is_member()) and by = (auth.jwt() ->> 'email'));
alter publication supabase_realtime add table public.checks, public.items, public.kv;
