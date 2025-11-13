-- Peptide Tracking Logs Table
CREATE TABLE IF NOT EXISTS peptide_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  peptide_name TEXT NOT NULL,
  peptide_class TEXT,
  amount TEXT,
  route TEXT CHECK (route IN ('subcutaneous', 'intramuscular', 'oral', 'nasal', 'topical', 'other')),
  logged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes TEXT,
  effects TEXT,
  side_effects TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_peptide_logs_user_id ON peptide_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_peptide_logs_logged_at ON peptide_logs(logged_at DESC);

-- Enable RLS (Row Level Security)
ALTER TABLE peptide_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own logs"
  ON peptide_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON peptide_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON peptide_logs FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON peptide_logs FOR DELETE
  USING (auth.uid() = user_id);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_peptide_logs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to call the function
CREATE TRIGGER update_peptide_logs_updated_at_trigger
  BEFORE UPDATE ON peptide_logs
  FOR EACH ROW
  EXECUTE FUNCTION update_peptide_logs_updated_at();

-- Grant permissions
GRANT ALL ON peptide_logs TO authenticated;
GRANT ALL ON peptide_logs TO service_role;

