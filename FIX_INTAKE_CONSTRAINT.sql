-- ============================================
-- CRITICAL FIX: Add UNIQUE constraint to intake table
-- ============================================
-- This fixes the error: "there is no unique or exclusion constraint matching the ON CONFLICT specification"
-- Run this in your Supabase SQL Editor

-- Add UNIQUE constraint to user_id in intake table
ALTER TABLE intake 
ADD CONSTRAINT intake_user_id_unique UNIQUE (user_id);

-- Verify the constraint was added
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'intake'::regclass 
AND conname = 'intake_user_id_unique';

-- Expected result: Should show the constraint was created

