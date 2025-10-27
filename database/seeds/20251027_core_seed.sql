-- 20251027_core_seed.sql
-- Seed foundational personas, profiles, content references, leads, and entitlements for local development and CI fixtures.

-- Personas: Skin, Fuel, Habits
insert into public.personas (key, name, description, sort_order, created_by, updated_by)
values
  ('skin', 'Skin Persona', 'Customers prioritising dermatology outcomes and skincare routines.', 1, 'seed', 'seed'),
  ('fuel', 'Fuel Persona', 'Customers focused on nutrition, recipes, and dietary optimisations.', 2, 'seed', 'seed'),
  ('habits', 'Habits Persona', 'Customers building long-term lifestyle and behaviour change systems.', 3, 'seed', 'seed')
on conflict (key) do update
set
  name = excluded.name,
  description = excluded.description,
  sort_order = excluded.sort_order,
  updated_at = timezone('utc', now()),
  updated_by = excluded.updated_by;

-- Demo profile to support entitlement and homepage data tests
insert into public.profiles (auth_provider, auth_user_id, email, persona_id, status, marketing_opt_in, locale, timezone, created_by, updated_by)
values (
  'auth0',
  'auth0|demo-profile',
  'demo@clarivum.test',
  (select id from public.personas where key = 'skin'),
  'active',
  true,
  'en-GB',
  'Europe/Warsaw',
  'seed',
  'seed'
)
on conflict (email) do update
set
  auth_provider = excluded.auth_provider,
  auth_user_id = excluded.auth_user_id,
  persona_id = excluded.persona_id,
  status = excluded.status,
  marketing_opt_in = excluded.marketing_opt_in,
  locale = excluded.locale,
  timezone = excluded.timezone,
  updated_at = timezone('utc', now()),
  updated_by = excluded.updated_by;

-- Homepage content placeholders for App Router view models
insert into public.content_items (
  external_id,
  slug,
  title,
  summary,
  persona_id,
  content_type,
  status,
  locale,
  published_at,
  feature_flag_key,
  metadata,
  created_by,
  updated_by
)
values
  (
    'strapi:homepage-hero',
    'homepage-hero',
    'Clarivum Homepage Hero',
    'Seed hero content that unblocks homepage view model development.',
    (select id from public.personas where key = 'skin'),
    'article',
    'published',
    'pl-PL',
    timezone('utc', now()),
    'homepage.hero',
    jsonb_build_object('priority', 1, 'cta_target', '/skin/diagnostics'),
    'seed',
    'seed'
  ),
  (
    'strapi:fuel-stories',
    'fuel-stories',
    'Fuel Persona Story Stack',
    'Placeholder content stack for the Fuel vertical homepage sections.',
    (select id from public.personas where key = 'fuel'),
    'guide',
    'published',
    'pl-PL',
    timezone('utc', now()),
    'homepage.fuel',
    jsonb_build_object('priority', 2, 'cta_target', '/fuel/przepisy'),
    'seed',
    'seed'
  )
on conflict (external_id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  summary = excluded.summary,
  persona_id = excluded.persona_id,
  content_type = excluded.content_type,
  status = excluded.status,
  locale = excluded.locale,
  published_at = excluded.published_at,
  feature_flag_key = excluded.feature_flag_key,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now()),
  updated_by = excluded.updated_by;

-- Demo lead aligned with the Skin persona
insert into public.leads (
  id,
  profile_id,
  persona_id,
  email,
  source,
  utm_source,
  utm_medium,
  utm_campaign,
  marketing_opt_in,
  metadata,
  created_by,
  updated_by
)
values (
  '018f1f90-0000-7000-8000-000000000001',
  (select id from public.profiles where email = 'demo@clarivum.test'),
  (select id from public.personas where key = 'skin'),
  'demo@clarivum.test',
  'homepage-form',
  'clarivum-homepage',
  'landing-page',
  'skin-launch',
  true,
  jsonb_build_object('form_version', 'v0'),
  'seed',
  'seed'
)
on conflict (id) do update
set
  profile_id = excluded.profile_id,
  persona_id = excluded.persona_id,
  source = excluded.source,
  utm_source = excluded.utm_source,
  utm_medium = excluded.utm_medium,
  utm_campaign = excluded.utm_campaign,
  marketing_opt_in = excluded.marketing_opt_in,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now()),
  updated_by = excluded.updated_by;

-- Demo entitlement linked to the profile
insert into public.entitlements (
  id,
  profile_id,
  feature_key,
  plan_key,
  status,
  source,
  external_reference,
  granted_at,
  starts_at,
  metadata,
  created_by,
  updated_by
)
values (
  '018f1f90-0000-7000-9000-000000000001',
  (select id from public.profiles where email = 'demo@clarivum.test'),
  'ebooks.library',
  'founders-preview',
  'active',
  'seed-fixture',
  'order_demo_001',
  timezone('utc', now()),
  timezone('utc', now()),
  jsonb_build_object('sku', 'ebook-skin-reset'),
  'seed',
  'seed'
)
on conflict (id) do update
set
  profile_id = excluded.profile_id,
  feature_key = excluded.feature_key,
  plan_key = excluded.plan_key,
  status = excluded.status,
  source = excluded.source,
  external_reference = excluded.external_reference,
  granted_at = excluded.granted_at,
  starts_at = excluded.starts_at,
  metadata = excluded.metadata,
  updated_at = timezone('utc', now()),
  updated_by = excluded.updated_by;

-- Entitlement status history seed entry
insert into public.entitlement_status_history (
  id,
  entitlement_id,
  from_status,
  to_status,
  change_reason,
  created_by
)
values (
  '018f1f90-0000-7000-a000-000000000001',
  (select id from public.entitlements where id = '018f1f90-0000-7000-9000-000000000001'),
  null,
  'active',
  'Seeded entitlement activated for demo profile.',
  'seed'
)
on conflict (id) do update
set
  entitlement_id = excluded.entitlement_id,
  from_status = excluded.from_status,
  to_status = excluded.to_status,
  change_reason = excluded.change_reason,
  created_by = excluded.created_by;
