-- Add Home Slyde analytics event types
-- Align with docs/HOME-SLYDE-BUILD-SPEC.md analytics requirements:
-- - drawer open rate
-- - time to drawer open
-- - category selection distribution
-- - video loop completion (approx)

do $$ begin
  alter type public.analytics_event_type add value if not exists 'drawerOpen';
exception
  when duplicate_object then null;
end $$;

do $$ begin
  alter type public.analytics_event_type add value if not exists 'categorySelect';
exception
  when duplicate_object then null;
end $$;

do $$ begin
  alter type public.analytics_event_type add value if not exists 'videoLoop';
exception
  when duplicate_object then null;
end $$;


