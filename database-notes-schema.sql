-- Daily Journal Entries Table
CREATE TABLE IF NOT EXISTS daily_journal (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  journal_date DATE NOT NULL,
  mood_rating INTEGER CHECK (mood_rating >= 1 AND mood_rating <= 10),
  energy_rating INTEGER CHECK (energy_rating >= 1 AND energy_rating <= 10),
  sleep_quality INTEGER CHECK (sleep_quality >= 1 AND sleep_quality <= 10),
  journal_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, journal_date)
);

-- Peptide-Specific Notes Table
CREATE TABLE IF NOT EXISTS peptide_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  peptide_name TEXT NOT NULL,
  note_type TEXT CHECK (note_type IN ('effect', 'side_effect', 'observation', 'progress', 'general')),
  note_text TEXT NOT NULL,
  note_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Weekly AI Summaries Table
CREATE TABLE IF NOT EXISTS weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  week_start_date DATE NOT NULL,
  week_end_date DATE NOT NULL,
  summary_text TEXT NOT NULL,
  insights JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, week_start_date)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_daily_journal_user_date ON daily_journal(user_id, journal_date DESC);
CREATE INDEX IF NOT EXISTS idx_peptide_notes_user_peptide ON peptide_notes(user_id, peptide_name, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_summaries_user_date ON weekly_summaries(user_id, week_start_date DESC);

-- Enable RLS
ALTER TABLE daily_journal ENABLE ROW LEVEL SECURITY;
ALTER TABLE peptide_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_summaries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for daily_journal
CREATE POLICY "Users can view their own journal entries"
  ON daily_journal FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries"
  ON daily_journal FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries"
  ON daily_journal FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries"
  ON daily_journal FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for peptide_notes
CREATE POLICY "Users can view their own peptide notes"
  ON peptide_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own peptide notes"
  ON peptide_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own peptide notes"
  ON peptide_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own peptide notes"
  ON peptide_notes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for weekly_summaries
CREATE POLICY "Users can view their own weekly summaries"
  ON weekly_summaries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own weekly summaries"
  ON weekly_summaries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Auto-update triggers
CREATE TRIGGER update_daily_journal_updated_at
  BEFORE UPDATE ON daily_journal
  FOR EACH ROW
  EXECUTE FUNCTION update_peptide_logs_updated_at();

CREATE TRIGGER update_peptide_notes_updated_at
  BEFORE UPDATE ON peptide_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_peptide_logs_updated_at();

-- Grant permissions
GRANT ALL ON daily_journal TO authenticated;
GRANT ALL ON daily_journal TO service_role;
GRANT ALL ON peptide_notes TO authenticated;
GRANT ALL ON peptide_notes TO service_role;
GRANT ALL ON weekly_summaries TO authenticated;
GRANT ALL ON weekly_summaries TO service_role;

