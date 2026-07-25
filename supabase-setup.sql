-- Mohamed Sherif Portfolio Hub — Secure Supabase Setup
-- Safe to run more than once.
-- Owner: mohmedsherif599@gmail.com

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('owner','viewer')),
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'software',
  visibility text not null default 'public' check (visibility in ('public','private','unlisted')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  summary text not null default '',
  content text not null default '',
  tags text[] not null default '{}',
  cover_url text not null default '',
  document_url text not null default '',
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null default 'network',
  visibility text not null default 'public' check (visibility in ('public','private','unlisted')),
  status text not null default 'draft' check (status in ('draft','published','archived')),
  featured boolean not null default false,
  summary text not null default '',
  content text not null default '',
  tags text[] not null default '{}',
  cover_url text not null default '',
  document_url text not null default '',
  sort_order integer not null default 100,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  headline text not null default 'Network Infrastructure & Security Engineer',
  email text not null default '',
  linkedin_url text not null default '',
  cv_url text not null default 'cv.html',
  location text not null default 'Egypt',
  updated_at timestamptz not null default now()
);

create table if not exists public.cv_documents (
  id integer primary key default 1 check (id = 1),
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.notes enable row level security;
alter table public.site_settings enable row level security;
alter table public.cv_documents enable row level security;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'owner'
  );
$$;

grant execute on function public.is_owner() to anon, authenticated;

drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile" on public.profiles
for select to authenticated using (id = auth.uid());

drop policy if exists "Public published projects" on public.projects;
create policy "Public published projects" on public.projects
for select to anon, authenticated
using ((visibility = 'public' and status = 'published') or public.is_owner());

drop policy if exists "Owner manages projects" on public.projects;
create policy "Owner manages projects" on public.projects
for all to authenticated
using (public.is_owner()) with check (public.is_owner());

drop policy if exists "Public published notes" on public.notes;
create policy "Public published notes" on public.notes
for select to anon, authenticated
using ((visibility = 'public' and status = 'published') or public.is_owner());

drop policy if exists "Owner manages notes" on public.notes;
create policy "Owner manages notes" on public.notes
for all to authenticated
using (public.is_owner()) with check (public.is_owner());

drop policy if exists "Public reads settings" on public.site_settings;
create policy "Public reads settings" on public.site_settings
for select to anon, authenticated using (true);

drop policy if exists "Owner manages settings" on public.site_settings;
create policy "Owner manages settings" on public.site_settings
for all to authenticated
using (public.is_owner()) with check (public.is_owner());

drop policy if exists "Public reads latest CV" on public.cv_documents;
create policy "Public reads latest CV" on public.cv_documents
for select to anon, authenticated using (true);

drop policy if exists "Owner manages latest CV" on public.cv_documents;
create policy "Owner manages latest CV" on public.cv_documents
for all to authenticated
using (public.is_owner()) with check (public.is_owner());

insert into public.site_settings (id, headline, email, linkedin_url, cv_url, location)
values (
  1,
  'Network Infrastructure & Security Engineer',
  'mohmedsherif599@gmail.com',
  'https://www.linkedin.com/',
  'cv.html',
  '6th of October City, Giza, Egypt'
)
on conflict (id) do update set
  email = excluded.email,
  cv_url = excluded.cv_url,
  location = excluded.location;

-- Assign the existing Supabase Auth user as owner.
insert into public.profiles (id, role)
select id, 'owner' from auth.users
where lower(email) = lower('mohmedsherif599@gmail.com')
on conflict (id) do update set role = excluded.role;

do $$
begin
  if not exists (
    select 1 from auth.users
    where lower(email) = lower('mohmedsherif599@gmail.com')
  ) then
    raise exception 'Owner user not found. Create mohmedsherif599@gmail.com in Authentication > Users, then run this script again.';
  end if;
end $$;

insert into storage.buckets (id, name, public)
values ('portfolio-public','portfolio-public',true)
on conflict (id) do nothing;

insert into storage.buckets (id, name, public)
values ('portfolio-private','portfolio-private',false)
on conflict (id) do nothing;

drop policy if exists "Public reads portfolio files" on storage.objects;
create policy "Public reads portfolio files" on storage.objects
for select to public using (bucket_id = 'portfolio-public');

drop policy if exists "Owner manages public files" on storage.objects;
create policy "Owner manages public files" on storage.objects
for all to authenticated
using (bucket_id = 'portfolio-public' and public.is_owner())
with check (bucket_id = 'portfolio-public' and public.is_owner());

drop policy if exists "Owner manages private files" on storage.objects;
create policy "Owner manages private files" on storage.objects
for all to authenticated
using (bucket_id = 'portfolio-private' and public.is_owner())
with check (bucket_id = 'portfolio-private' and public.is_owner());
