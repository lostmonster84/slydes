-- Messages table for HQ inbox
-- Captures all "help me" / contact messages that need a reply

CREATE TABLE IF NOT EXISTS public.messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL DEFAULT 'general' CHECK (type IN ('general', 'music_help', 'contact', 'support')),
  subject text,
  message text NOT NULL,
  user_email text,
  user_name text,
  user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  org_name text,
  status text NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'archived')),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Index for filtering by status
CREATE INDEX idx_messages_status ON public.messages(status);
CREATE INDEX idx_messages_created_at ON public.messages(created_at DESC);

-- RLS: Service role full access (API uses service role)
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON public.messages
  FOR ALL USING (true) WITH CHECK (true);
