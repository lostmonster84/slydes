-- Roadmap columns for HQ admin kanban board
-- Allows dynamic column management (add, rename, delete, reorder)

CREATE TABLE IF NOT EXISTS public.roadmap_columns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,  -- e.g., 'triage', 'backlog', 'planned'
  label text NOT NULL,        -- Display name e.g., 'Triage', 'Backlog'
  description text,           -- Column description shown under label
  icon text DEFAULT 'circle', -- Lucide icon name
  icon_color text DEFAULT 'text-gray-400', -- Tailwind color class
  position int NOT NULL DEFAULT 0, -- Sort order (lower = first)
  is_done_column boolean DEFAULT false, -- Items here are "completed"
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for ordering
CREATE INDEX idx_roadmap_columns_position ON public.roadmap_columns(position);

-- RLS: Only admins can access (we'll check via API auth)
ALTER TABLE public.roadmap_columns ENABLE ROW LEVEL SECURITY;

-- Allow service role full access (API uses service role)
CREATE POLICY "Service role full access" ON public.roadmap_columns
  FOR ALL USING (true) WITH CHECK (true);

-- Seed the default 4 columns
INSERT INTO public.roadmap_columns (slug, label, description, icon, icon_color, position, is_done_column) VALUES
  ('triage', 'Triage', 'New suggestions to review', 'inbox', 'text-purple-400', 0, false),
  ('planned', 'Planned', 'Approved for development', 'clock', 'text-gray-400', 1, false),
  ('in-progress', 'In Progress', 'Currently being built', 'zap', 'text-amber-400', 2, false),
  ('done', 'Done', 'Shipped and live', 'check', 'text-green-400', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Remove the CHECK constraint on roadmap_items.status so it can reference any column slug
ALTER TABLE public.roadmap_items DROP CONSTRAINT IF EXISTS roadmap_items_status_check;

-- Add foreign key reference (optional - enforces valid column slug)
-- Note: This requires the slug to exist in roadmap_columns
ALTER TABLE public.roadmap_items
  ADD CONSTRAINT roadmap_items_status_fkey
  FOREIGN KEY (status) REFERENCES public.roadmap_columns(slug)
  ON UPDATE CASCADE
  ON DELETE RESTRICT;
