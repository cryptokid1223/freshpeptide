-- User Peptide Stack Table
-- This allows users to save custom peptides they like from the library

CREATE TABLE IF NOT EXISTS user_peptide_stack (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  peptides JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_peptide_stack ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own stack" ON user_peptide_stack
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own stack" ON user_peptide_stack
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own stack" ON user_peptide_stack
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own stack" ON user_peptide_stack
  FOR DELETE USING (auth.uid() = user_id);

-- Create index for better performance
CREATE INDEX idx_user_peptide_stack_user_id ON user_peptide_stack(user_id);

-- ============================================
-- How to use:
-- Run this SQL in Supabase SQL Editor to enable the "Add to Stack" feature
-- ============================================

