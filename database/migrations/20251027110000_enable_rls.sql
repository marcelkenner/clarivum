-- 20251027110000_enable_rls.sql
-- Enable RLS and establish baseline access policies for core Clarivum tables.

-- Personas: public read, service role full access
alter table public.personas enable row level security;

create policy personas_read_public
on public.personas
for select
to anon, authenticated
using (true);

create policy personas_admin_service_role
on public.personas
for all
to service_role
using (true)
with check (true);

-- Profiles: restrict access to service role until per-user policies are defined
alter table public.profiles enable row level security;

create policy profiles_admin_service_role
on public.profiles
for all
to service_role
using (true)
with check (true);

-- Leads: restrict to service role (created via backend or automation)
alter table public.leads enable row level security;

create policy leads_admin_service_role
on public.leads
for all
to service_role
using (true)
with check (true);

-- Content items: public read, service role manage
alter table public.content_items enable row level security;

create policy content_items_read_public
on public.content_items
for select
to anon, authenticated
using (status = 'published' and deleted_at is null);

create policy content_items_admin_service_role
on public.content_items
for all
to service_role
using (true)
with check (true);

-- Entitlements: restrict to service role until scoped policies exist
alter table public.entitlements enable row level security;

create policy entitlements_admin_service_role
on public.entitlements
for all
to service_role
using (true)
with check (true);

-- Entitlement status history: restrict to service role
alter table public.entitlement_status_history enable row level security;

create policy entitlement_status_history_admin_service_role
on public.entitlement_status_history
for all
to service_role
using (true)
with check (true);
