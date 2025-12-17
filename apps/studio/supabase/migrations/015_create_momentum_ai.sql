-- Momentum AI Tables
-- Migration: 015_create_momentum_ai.sql
-- Created: December 17, 2024
--
-- Stores AI conversation history and business memory for Momentum AI

-- AI Memory: Persistent preferences and learned info about the business
CREATE TABLE IF NOT EXISTS ai_memory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,

  -- Learned preferences
  brand_voice TEXT,                    -- e.g., "casual and adventurous"
  goals JSONB DEFAULT '[]'::jsonb,     -- e.g., ["100 bookings this month", "60% completion"]
  preferences JSONB DEFAULT '{}'::jsonb, -- e.g., {"post_day": "Thursday", "tone": "friendly"}

  -- Context notes (AI can store important info it learns)
  notes JSONB DEFAULT '[]'::jsonb,     -- e.g., [{"date": "...", "note": "User prefers short copy"}]

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),

  CONSTRAINT unique_org_memory UNIQUE (organization_id)
);

-- AI Conversations: Chat history with the AI
CREATE TABLE IF NOT EXISTS ai_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Conversation title (auto-generated from first message)
  title TEXT,

  -- Messages stored as JSONB array
  -- Format: [{ role: "user"|"assistant", content: string, timestamp: string, actions?: [] }]
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,

  -- Metadata
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMPTZ DEFAULT now(),

  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- AI Actions Log: Track actions taken by AI (for undo, audit)
CREATE TABLE IF NOT EXISTS ai_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE SET NULL,

  -- What action was taken
  action_type TEXT NOT NULL,           -- 'apply_copy', 'update_cta', 'revert_frame', etc.
  target_type TEXT NOT NULL,           -- 'frame', 'slyde', 'organization'
  target_id UUID NOT NULL,

  -- Before/after for undo capability
  before_value JSONB,
  after_value JSONB,

  -- Status
  status TEXT DEFAULT 'completed',     -- 'completed', 'reverted', 'failed'
  reverted_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_ai_memory_org ON ai_memory(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_org ON ai_conversations(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_user ON ai_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_ai_conversations_last_message ON ai_conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_ai_actions_org ON ai_actions(organization_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_conversation ON ai_actions(conversation_id);
CREATE INDEX IF NOT EXISTS idx_ai_actions_target ON ai_actions(target_type, target_id);

-- RLS Policies
ALTER TABLE ai_memory ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_actions ENABLE ROW LEVEL SECURITY;

-- AI Memory: Only org owner can read/write
CREATE POLICY ai_memory_select ON ai_memory
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY ai_memory_insert ON ai_memory
  FOR INSERT WITH CHECK (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY ai_memory_update ON ai_memory
  FOR UPDATE USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

-- AI Conversations: User can only see their own conversations
CREATE POLICY ai_conversations_select ON ai_conversations
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY ai_conversations_insert ON ai_conversations
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY ai_conversations_update ON ai_conversations
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY ai_conversations_delete ON ai_conversations
  FOR DELETE USING (user_id = auth.uid());

-- AI Actions: Only org owner can see
CREATE POLICY ai_actions_select ON ai_actions
  FOR SELECT USING (
    organization_id IN (
      SELECT id FROM organizations WHERE owner_id = auth.uid()
    )
  );

-- Function to update ai_memory.updated_at
CREATE OR REPLACE FUNCTION update_ai_memory_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ai_memory_updated_at
  BEFORE UPDATE ON ai_memory
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_memory_timestamp();

-- Function to update ai_conversations.updated_at and message_count
CREATE OR REPLACE FUNCTION update_ai_conversation_metadata()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.message_count = jsonb_array_length(NEW.messages);
  NEW.last_message_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ai_conversations_metadata
  BEFORE UPDATE ON ai_conversations
  FOR EACH ROW
  EXECUTE FUNCTION update_ai_conversation_metadata();
