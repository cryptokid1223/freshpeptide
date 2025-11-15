-- ============================================
-- FIX MISSING PROFILES - Run in Supabase SQL Editor
-- ============================================
-- This ensures all authenticated users have profiles

-- Step 1: Ensure INSERT policy exists for profiles
-- ============================================
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

-- Allow users to insert their own profile
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Also allow service role (for triggers)
CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Step 2: Create profiles for any existing auth users without them
-- ============================================
INSERT INTO profiles (id, email, created_at)
SELECT id, email, created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify the fix
-- ============================================
SELECT 
  'Auth Users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Profiles' as table_name,
  COUNT(*) as count
FROM profiles;

-- Expected: Both counts should match (or profiles >= auth users)

-- ============================================
-- DONE! All users should now have profiles.
-- ============================================

