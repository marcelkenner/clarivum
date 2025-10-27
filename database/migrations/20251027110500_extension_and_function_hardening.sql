-- 20251027110500_extension_and_function_hardening.sql
-- Ensure extensions and functions comply with Supabase security guardrails.

-- Relocate citext extension to the shared extensions schema when necessary.
do $$
begin
  if exists (
    select 1
    from pg_extension ext
    join pg_namespace nsp on nsp.oid = ext.extnamespace
    where ext.extname = 'citext'
      and nsp.nspname = 'public'
  ) then
    execute 'alter extension citext set schema extensions';
  end if;
end
$$;

-- Pin function search_path for audit routines.
alter function public.set_audit_fields()
  set search_path = pg_catalog, public;

alter function public.uuid_generate_v7()
  set search_path = pg_catalog, public;
