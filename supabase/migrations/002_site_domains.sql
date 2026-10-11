-- Map each site to the domains it is served on, so one deployment can
-- host many client sites. Safe to run more than once.
alter table public.sites add column if not exists domains text[] not null default '{}';
create index if not exists sites_domains_idx on public.sites using gin (domains);
