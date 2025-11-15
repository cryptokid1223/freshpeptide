-- Add UPDATE policy for briefs table
-- This allows users to update their own briefs

CREATE POLICY "Users can update own briefs" ON briefs
  FOR UPDATE USING (auth.uid() = user_id);

-- Also add DELETE policy in case we need it
CREATE POLICY "Users can delete own briefs" ON briefs
  FOR DELETE USING (auth.uid() = user_id);

