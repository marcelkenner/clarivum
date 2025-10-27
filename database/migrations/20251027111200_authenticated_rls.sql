-- 20251027111200_authenticated_rls.sql
-- Introduce authenticated user policies for personas-related domain tables.

-- Profiles: allow owners to read and update their own record.
create policy profiles_select_self
on public.profiles
for select
to authenticated
using (
  (
    auth.uid() is not null
    and auth_user_id is not null
    and auth_user_id = auth.uid()::text
  )
  or (
    auth.email() is not null
    and email = auth.email()
  )
);

create policy profiles_update_self
on public.profiles
for update
to authenticated
using (
  (
    auth.uid() is not null
    and auth_user_id is not null
    and auth_user_id = auth.uid()::text
  )
  or (
    auth.email() is not null
    and email = auth.email()
  )
)
with check (
  (
    auth.uid() is not null
    and auth_user_id is not null
    and auth_user_id = auth.uid()::text
  )
  or (
    auth.email() is not null
    and email = auth.email()
  )
);

-- Leads: allow authenticated users to view their own submissions.
create policy leads_select_self
on public.leads
for select
to authenticated
using (
  (
    auth.email() is not null
    and email = auth.email()
  )
  or exists (
    select 1
    from public.profiles p
    where p.id = leads.profile_id
      and (
        (
          auth.uid() is not null
          and p.auth_user_id is not null
          and p.auth_user_id = auth.uid()::text
        )
        or (
          auth.email() is not null
          and p.email = auth.email()
        )
      )
  )
);

-- Entitlements: allow owners to view their entitlements.
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
          auth.uid() is not null
          and p.auth_user_id is not null
          and p.auth_user_id = auth.uid()::text
        )
        or (
          auth.email() is not null
          and p.email = auth.email()
        )
      )
  )
);

-- Entitlement status history: surface only entries tied to the caller's entitlements.
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
          auth.uid() is not null
          and p.auth_user_id is not null
          and p.auth_user_id = auth.uid()::text
        )
        or (
          auth.email() is not null
          and p.email = auth.email()
        )
      )
  )
);
