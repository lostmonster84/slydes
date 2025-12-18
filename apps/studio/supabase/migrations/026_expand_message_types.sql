-- Expand message types to support all contact points
-- Adds: investor, affiliate, partner types

-- Drop old constraint
ALTER TABLE public.messages DROP CONSTRAINT IF EXISTS messages_type_check;

-- Add new constraint with expanded types
ALTER TABLE public.messages ADD CONSTRAINT messages_type_check
  CHECK (type IN ('general', 'music_help', 'contact', 'support', 'investor', 'affiliate', 'partner'));
