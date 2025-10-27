-- 20251027090000_core_schema.sql
-- Establish core Supabase schema for personas, profiles, leads, content references, and entitlements.

-- Extensions
create extension if not exists "pgcrypto";
create extension if not exists "citext" with schema extensions;

-- Install pg_uuidv7 when available; otherwise define a compatible generator.
do $$
begin
  if exists (
    select 1
    from pg_available_extensions
    where name = 'pg_uuidv7'
  ) then
    execute 'create extension if not exists "pg_uuidv7"';
  end if;

  if not exists (
    select 1
    from pg_proc p
    where p.proname = 'uuid_generate_v7'
  ) then
    execute $function$
      create or replace function public.uuid_generate_v7()
      returns uuid
      language plpgsql
      set search_path = pg_catalog, public
      as $inner$
      declare
        unix_ts_ms bigint;
        unix_ts_bytes bytea;
        random_bytes bytea;
        uuid_bytes bytea;
      begin
        unix_ts_ms := floor(extract(epoch from clock_timestamp()) * 1000);
        unix_ts_bytes := decode(lpad(to_hex(unix_ts_ms), 12, '0'), 'hex');
        random_bytes := gen_random_bytes(10);
        uuid_bytes := unix_ts_bytes || random_bytes;
        uuid_bytes := set_byte(uuid_bytes, 6, (get_byte(uuid_bytes, 6) & 15) | 112);
        uuid_bytes := set_byte(uuid_bytes, 8, (get_byte(uuid_bytes, 8) & 63) | 128);
        return encode(uuid_bytes, 'hex')::uuid;
      end;
      $inner$;
    $function$;
  end if;
end
$$;

-- Enumerated types
do $$
begin
  if not exists (select 1 from pg_type where typname = 'profile_status') then
    create type profile_status as enum ('pending_claim', 'active', 'inactive', 'blocked');
  end if;

  if not exists (select 1 from pg_type where typname = 'entitlement_status') then
    create type entitlement_status as enum ('pending_claim', 'active', 'processing', 'revoked', 'expired');
  end if;

  if not exists (select 1 from pg_type where typname = 'content_kind') then
    create type content_kind as enum ('article', 'guide', 'ebook', 'tool', 'page');
  end if;

  if not exists (select 1 from pg_type where typname = 'content_publish_status') then
    create type content_publish_status as enum ('draft', 'scheduled', 'published', 'archived');
  end if;
end
$$;

-- Audit helper function
create or replace function public.set_audit_fields()
returns trigger
language plpgsql
set search_path = pg_catalog, public
as $$
begin
  if tg_op = 'UPDATE' then
    new.created_at := old.created_at;
    new.created_by := old.created_by;
    new.revision := coalesce(old.revision, 0) + 1;
    if new.updated_by is null then
      new.updated_by := coalesce(old.updated_by, 'system');
    end if;
  end if;

  new.updated_at := timezone('utc', now());
  return new;
end;
$$;

-- Personas table
create table if not exists public.personas (
  id uuid primary key default uuid_generate_v7(),
  key text not null,
  name text not null,
  description text,
  sort_order smallint,
  created_at timestamptz not null default timezone('utc', now()),
  created_by text not null default 'system',
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by text not null default 'system',
  revision integer not null default 1,
  deleted_at timestamptz,
  deleted_by text,
  constraint personas_key_unique unique (key)
);

create trigger personas_set_audit
before update on public.personas
for each row
execute function public.set_audit_fields();

create index if not exists personas_key_idx on public.personas (key);
create index if not exists personas_sort_order_idx on public.personas (sort_order);

-- Profiles table
create table if not exists public.profiles (
  id uuid primary key default uuid_generate_v7(),
  auth_provider text not null default 'auth0',
  auth_user_id text,
  email citext not null,
  email_hash text generated always as (encode(digest(lower(email), 'sha256'), 'hex')) stored,
  persona_id uuid references public.personas (id),
  status profile_status not null default 'pending_claim',
  pending_claim_token text,
  pending_claim_token_expires_at timestamptz,
  last_claim_email_sent_at timestamptz,
  marketing_opt_in boolean not null default false,
  locale text,
  timezone text,
  created_at timestamptz not null default timezone('utc', now()),
  created_by text not null default 'system',
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by text not null default 'system',
  revision integer not null default 1,
  deleted_at timestamptz,
  deleted_by text,
  constraint profiles_email_unique unique (email)
);

create trigger profiles_set_audit
before update on public.profiles
for each row
execute function public.set_audit_fields();

create unique index if not exists profiles_auth_account_unique
on public.profiles (auth_provider, auth_user_id)
where auth_user_id is not null;

create unique index if not exists profiles_pending_claim_token_unique
on public.profiles (pending_claim_token)
where pending_claim_token is not null;

create index if not exists profiles_status_idx on public.profiles (status);
create index if not exists profiles_persona_idx on public.profiles (persona_id);
create index if not exists profiles_email_hash_idx on public.profiles (email_hash);

-- Leads table
create table if not exists public.leads (
  id uuid primary key default uuid_generate_v7(),
  profile_id uuid references public.profiles (id),
  persona_id uuid references public.personas (id),
  email citext not null,
  email_hash text generated always as (encode(digest(lower(email), 'sha256'), 'hex')) stored,
  source text not null,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  marketing_opt_in boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  first_seen_at timestamptz not null default timezone('utc', now()),
  created_at timestamptz not null default timezone('utc', now()),
  created_by text not null default 'system',
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by text not null default 'system',
  revision integer not null default 1,
  deleted_at timestamptz,
  deleted_by text
);

create trigger leads_set_audit
before update on public.leads
for each row
execute function public.set_audit_fields();

create index if not exists leads_email_idx on public.leads (email);
create index if not exists leads_email_hash_idx on public.leads (email_hash);
create index if not exists leads_persona_idx on public.leads (persona_id);
create index if not exists leads_profile_idx on public.leads (profile_id);
create index if not exists leads_source_idx on public.leads (source);
create index if not exists leads_created_at_idx on public.leads (created_at);
create unique index if not exists leads_email_source_unique
on public.leads (email, source)
where deleted_at is null;

-- Content table
create table if not exists public.content_items (
  id uuid primary key default uuid_generate_v7(),
  external_id text not null,
  slug text not null,
  title text not null,
  summary text,
  excerpt text,
  persona_id uuid references public.personas (id),
  content_type content_kind not null,
  status content_publish_status not null default 'draft',
  locale text not null default 'en-US',
  published_at timestamptz,
  feature_flag_key text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  created_by text not null default 'system',
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by text not null default 'system',
  revision integer not null default 1,
  deleted_at timestamptz,
  deleted_by text,
  constraint content_items_external_id_unique unique (external_id)
);

create trigger content_items_set_audit
before update on public.content_items
for each row
execute function public.set_audit_fields();

create unique index if not exists content_items_slug_unique
on public.content_items (slug)
where deleted_at is null;

create index if not exists content_items_persona_idx on public.content_items (persona_id);
create index if not exists content_items_type_idx on public.content_items (content_type);
create index if not exists content_items_status_idx on public.content_items (status);
create index if not exists content_items_published_at_idx on public.content_items (published_at);

-- Entitlements table
create table if not exists public.entitlements (
  id uuid primary key default uuid_generate_v7(),
  profile_id uuid not null references public.profiles (id),
  feature_key text not null,
  plan_key text not null,
  status entitlement_status not null default 'pending_claim',
  source text,
  external_reference text,
  granted_at timestamptz not null default timezone('utc', now()),
  starts_at timestamptz not null default timezone('utc', now()),
  ends_at timestamptz,
  revoked_at timestamptz,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default timezone('utc', now()),
  created_by text not null default 'system',
  updated_at timestamptz not null default timezone('utc', now()),
  updated_by text not null default 'system',
  revision integer not null default 1,
  deleted_at timestamptz,
  deleted_by text
);

create trigger entitlements_set_audit
before update on public.entitlements
for each row
execute function public.set_audit_fields();

create unique index if not exists entitlements_active_unique
on public.entitlements (profile_id, feature_key, plan_key)
where deleted_at is null
  and status in ('pending_claim', 'active', 'processing');

create index if not exists entitlements_profile_idx on public.entitlements (profile_id);
create index if not exists entitlements_status_idx on public.entitlements (status);
create index if not exists entitlements_feature_idx on public.entitlements (feature_key);
create index if not exists entitlements_starts_idx on public.entitlements (starts_at);
create index if not exists entitlements_ends_idx on public.entitlements (ends_at);
create unique index if not exists entitlements_external_reference_unique
on public.entitlements (external_reference)
where external_reference is not null;

-- Entitlement status history
create table if not exists public.entitlement_status_history (
  id uuid primary key default uuid_generate_v7(),
  entitlement_id uuid not null references public.entitlements (id) on delete cascade,
  from_status entitlement_status,
  to_status entitlement_status not null,
  change_reason text,
  created_at timestamptz not null default timezone('utc', now()),
  created_by text not null default 'system'
);

create index if not exists entitlement_status_history_entitlement_idx
  on public.entitlement_status_history (entitlement_id);
create index if not exists entitlement_status_history_created_idx
  on public.entitlement_status_history (created_at);
