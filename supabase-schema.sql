-- Mohamed Sherif Portfolio Hub
-- Run this entire file in Supabase Dashboard → SQL Editor.

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
  cv_url text not null default '',
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

-- Helper function. The user is an owner only when their profile row says so.
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

-- Profiles: users may read only their own role.
drop policy if exists "Read own profile" on public.profiles;
create policy "Read own profile" on public.profiles for select to authenticated using (id = auth.uid());

-- Public visitors receive only published public content.
drop policy if exists "Public published projects" on public.projects;
create policy "Public published projects" on public.projects for select to anon, authenticated using (
  (visibility = 'public' and status = 'published') or public.is_owner()
);

drop policy if exists "Public published notes" on public.notes;
create policy "Public published notes" on public.notes for select to anon, authenticated using (
  (visibility = 'public' and status = 'published') or public.is_owner()
);

-- Only the owner may create, update or delete content.
drop policy if exists "Owner manages projects" on public.projects;
create policy "Owner manages projects" on public.projects for all to authenticated using (public.is_owner()) with check (public.is_owner());

drop policy if exists "Owner manages notes" on public.notes;
create policy "Owner manages notes" on public.notes for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- Settings are publicly readable but owner-managed.
drop policy if exists "Public reads settings" on public.site_settings;
create policy "Public reads settings" on public.site_settings for select to anon, authenticated using (true);

drop policy if exists "Owner manages settings" on public.site_settings;
create policy "Owner manages settings" on public.site_settings for all to authenticated using (public.is_owner()) with check (public.is_owner());

-- The latest CV is publicly readable and can only be changed by the owner.
drop policy if exists "Public reads latest CV" on public.cv_documents;
create policy "Public reads latest CV" on public.cv_documents for select to anon, authenticated using (true);

drop policy if exists "Owner manages latest CV" on public.cv_documents;
create policy "Owner manages latest CV" on public.cv_documents for all to authenticated using (public.is_owner()) with check (public.is_owner());

insert into public.site_settings (id, headline, email, linkedin_url, cv_url, location)
values (1, 'Network Infrastructure & Security Engineer', '', '', '', '6th of October City, Giza, Egypt')
on conflict (id) do nothing;

-- After creating your first user in Authentication → Users, run this once.
-- The website can display username mohamed.sherif, but Supabase Auth signs in with this owner email.
-- Replace the email below with the exact owner email.
-- insert into public.profiles (id, role)
-- select id, 'owner' from auth.users where email = 'YOUR_EMAIL@example.com'
-- on conflict (id) do update set role = excluded.role;

-- Optional storage buckets for CVs, project files and private files.
insert into storage.buckets (id, name, public) values ('portfolio-public','portfolio-public',true)
on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('portfolio-private','portfolio-private',false)
on conflict (id) do nothing;

-- Public bucket: anyone can read, owner can manage.
drop policy if exists "Public reads portfolio files" on storage.objects;
create policy "Public reads portfolio files" on storage.objects for select to public using (bucket_id = 'portfolio-public');

drop policy if exists "Owner manages public files" on storage.objects;
create policy "Owner manages public files" on storage.objects for all to authenticated using (bucket_id = 'portfolio-public' and public.is_owner()) with check (bucket_id = 'portfolio-public' and public.is_owner());

-- Private bucket: owner only.
drop policy if exists "Owner manages private files" on storage.objects;
create policy "Owner manages private files" on storage.objects for all to authenticated using (bucket_id = 'portfolio-private' and public.is_owner()) with check (bucket_id = 'portfolio-private' and public.is_owner());
