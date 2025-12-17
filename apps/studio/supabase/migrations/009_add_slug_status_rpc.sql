-- Add RPC to distinguish between "available", "owned", and "taken" slugs
-- Used by Slydes Studio onboarding to allow users to reuse a slug they already own.

create or replace function public.slug_status(check_slug text)
returns text as $$
declare
  existing_owner uuid;
begin
  select o.owner_id
    into existing_owner
  from public.organizations o
  where o.slug = lower(check_slug)
  limit 1;

  if existing_owner is null then
    return 'available';
  end if;

  if existing_owner = auth.uid() then
    return 'owned';
  end if;

  return 'taken';
end;
$$ language plpgsql security definer;




