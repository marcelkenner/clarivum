-- 20251027112000_rls_cached_auth_functions.sql
-- Recreate RLS policies using cached auth context to avoid repeated auth.* evaluations.

drop policy if exists profiles_select_self on public.profiles;
drop policy if exists profiles_update_self on public.profiles;
drop policy if exists leads_select_self on public.leads;
drop policy if exists entitlements_select_self on public.entitlements;
drop policy if exists entitlement_status_history_select_self on public.entitlement_status_history;

create policy profiles_select_self
on public.profiles
for select
to authenticated
using (
  (
    (select auth.uid()) is not null
    and auth_user_id is not null
    and auth_user_id = (select auth.uid())::text
  )
  or (
    (select auth.email()) is not null
    and email = (select auth.email())
  )
);

create policy profiles_update_self
on public.profiles
for update
to authenticated
using (
  (
    (select auth.uid()) is not null
    and auth_user_id is not null
    and auth_user_id = (select auth.uid())::text
  )
  or (
    (select auth.email()) is not null
    and email = (select auth.email())
  )
)
with check (
  (
    (select auth.uid()) is not null
    and auth_user_id is not null
    and auth_user_id = (select auth.uid())::text
  )
  or (
    (select auth.email()) is not null
    and email = (select auth.email())
  )
);

create policy leads_select_self
on public.leads
for select
to authenticated
using (
  (
    (select auth.email()) is not null
    and email = (select auth.email())
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = leads.profile_id
      and (
        (
          (select auth.uid()) is not null
          and p.auth_user_id is not null
          and p.auth_user_id = (select auth.uid())::text
        )
        or (
          (select auth.email()) is not null
          and p.email = (select auth.email())
        )
      )
  )
);

create policy entitlements_select_self
on public.entitlements
for select
to authenticated
using (
  exists (
    select 1
    from public.profiles p
    where p.id = entitlements.profile_id
      and (
        (
          (select auth.uid()) is not null
          and p.auth_user_id is not null
          and p.auth_user_id = (select auth.uid())::text
        )
        or (
          (select auth.email()) is not null
          and p.email = (select auth.email())
        )
      )
  )
);

create policy entitlement_status_history_select_self
on public.entitlement_status_history
for select
to authenticated
using (
  exists (
    select 1
    from public.entitlements e
    join public.profiles p on p.id = e.profile_id
    where e.id = entitlement_status_history.entitlement_id
      and (
        (
          (select auth.uid()) is not null
          and p.auth_user_id is not null
          and p.auth_user_id = (select auth.uid())::text
        )
        or (
          (select auth.email()) is not null
          and p.email = (select auth.email())
        )
      )
  )
);
