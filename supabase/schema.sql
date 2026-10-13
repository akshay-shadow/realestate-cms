-- =====================================================================
-- Real Estate CMS - Supabase schema
-- Run this once in Supabase Dashboard -> SQL Editor.
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
-- Sites: one row per client website. All page content lives in `content`.
-- ---------------------------------------------------------------------
create table if not exists public.sites (
  id          uuid primary key default gen_random_uuid(),
  slug        text unique not null,
  domains     text[] not null default '{}',   -- e.g. {skyline.com,www.skyline.com}
  content     jsonb not null default '{}'::jsonb,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Which auth users can manage which site.
create table if not exists public.site_admins (
  site_id  uuid not null references public.sites(id) on delete cascade,
  user_id  uuid not null references auth.users(id) on delete cascade,
  primary key (site_id, user_id)
);

-- Enquiries submitted from the website.
create table if not exists public.leads (
  id               uuid primary key default gen_random_uuid(),
  site_id          uuid not null references public.sites(id) on delete cascade,
  name             text not null,
  phone            text not null,
  email            text,
  interest         text,
  message          text,
  source           text,            -- which form: hero / contact / popup
  utm              jsonb,
  page_url         text,
  user_agent       text,
  status           text not null default 'new'
                   check (status in ('new','contacted','site_visit','converted','lost')),
  notes            text,
  whatsapp_status  text,
  email_status     text,
  created_at       timestamptz not null default now()
);

create index if not exists sites_domains_idx on public.sites using gin (domains);
create index if not exists leads_site_created_idx on public.leads (site_id, created_at desc);

-- ---------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------
create or replace function public.is_site_admin(p_site uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.site_admins
    where site_id = p_site and user_id = auth.uid()
  );
$$;

create or replace function public.is_site_admin_by_slug(p_slug text)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.site_admins a
    join public.sites s on s.id = a.site_id
    where s.slug = p_slug and a.user_id = auth.uid()
  );
$$;

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists sites_touch on public.sites;
create trigger sites_touch before update on public.sites
for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------------
-- Row Level Security
-- Leads are inserted by the server with the service-role key, so the
-- public never gets direct insert/read access to the leads table.
-- ---------------------------------------------------------------------
alter table public.sites       enable row level security;
alter table public.site_admins enable row level security;
alter table public.leads       enable row level security;

drop policy if exists "sites are public" on public.sites;
create policy "sites are public" on public.sites
  for select using (true);

drop policy if exists "admins update their site" on public.sites;
create policy "admins update their site" on public.sites
  for update using (public.is_site_admin(id)) with check (public.is_site_admin(id));

drop policy if exists "see own admin rows" on public.site_admins;
create policy "see own admin rows" on public.site_admins
  for select using (user_id = auth.uid());

drop policy if exists "admins read leads" on public.leads;
create policy "admins read leads" on public.leads
  for select using (public.is_site_admin(site_id));

drop policy if exists "admins update leads" on public.leads;
create policy "admins update leads" on public.leads
  for update using (public.is_site_admin(site_id)) with check (public.is_site_admin(site_id));

drop policy if exists "admins delete leads" on public.leads;
create policy "admins delete leads" on public.leads
  for delete using (public.is_site_admin(site_id));

-- ---------------------------------------------------------------------
-- Storage: public "media" bucket. Files are stored as <site-slug>/<file>
-- and only that site's admins can upload / delete.
-- ---------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media admins list" on storage.objects;
create policy "media admins list" on storage.objects
  for select to authenticated
  using (bucket_id = 'media' and public.is_site_admin_by_slug((storage.foldername(name))[1]));

drop policy if exists "media admins upload" on storage.objects;
create policy "media admins upload" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'media' and public.is_site_admin_by_slug((storage.foldername(name))[1]));

drop policy if exists "media admins update" on storage.objects;
create policy "media admins update" on storage.objects
  for update to authenticated
  using (bucket_id = 'media' and public.is_site_admin_by_slug((storage.foldername(name))[1]));

drop policy if exists "media admins delete" on storage.objects;
create policy "media admins delete" on storage.objects
  for delete to authenticated
  using (bucket_id = 'media' and public.is_site_admin_by_slug((storage.foldername(name))[1]));

-- ---------------------------------------------------------------------
-- First site. Content starts empty; the app fills in demo defaults until
-- you save from the admin panel.
-- ---------------------------------------------------------------------
insert into public.sites (slug) values ('demo') on conflict (slug) do nothing;

-- ---------------------------------------------------------------------
-- After creating your admin user (Authentication -> Users -> Add user),
-- give them access to the site:
--
-- insert into public.site_admins (site_id, user_id)
-- select s.id, u.id from public.sites s, auth.users u
-- where s.slug = 'demo' and u.email = 'you@example.com';
--
-- And point the site's domain(s) at it:
--
-- update public.sites set domains = '{skyline.com,www.skyline.com}' where slug = 'demo';
-- ---------------------------------------------------------------------
