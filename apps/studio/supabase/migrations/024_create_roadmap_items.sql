-- Roadmap items for HQ admin
-- Stores feature suggestions from Studio and manual items

CREATE TABLE IF NOT EXISTS public.roadmap_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'triage' CHECK (status IN ('triage', 'planned', 'in-progress', 'done')),
  priority text NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
  category text,
  request_type text DEFAULT 'feature',
  source text NOT NULL DEFAULT 'suggestion' CHECK (source IN ('manual', 'suggestion')),
  user_email text,
  org_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for filtering by status (kanban columns)
CREATE INDEX idx_roadmap_items_status ON public.roadmap_items(status);

-- RLS: Only admins can access (we'll check via API auth)
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (API uses service role)
CREATE POLICY "Service role full access" ON public.roadmap_items
  FOR ALL USING (true) WITH CHECK (true);
