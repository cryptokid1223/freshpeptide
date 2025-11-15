-- ============================================
-- FIX PROFILE MISMATCH - Run in Supabase SQL Editor
-- ============================================
-- This fixes the case where a profile exists but doesn't match your auth user ID

-- Step 1: Check current situation
-- ============================================
SELECT 
  'Auth Users' as source,
  id,
  email,
  created_at
FROM auth.users
WHERE email = 'stokhtabayev@gmail.com'
UNION ALL
SELECT 
  'Profiles' as source,
  id,
  email,
  created_at
FROM profiles
WHERE email = 'stokhtabayev@gmail.com';

-- Step 2: Delete any orphaned profiles with your email
-- ============================================
-- This removes profiles that don't match an auth user
DELETE FROM profiles 
WHERE email = 'stokhtabayev@gmail.com' 
  AND id NOT IN (SELECT id FROM auth.users);

-- Step 3: Create profile for your auth user if it doesn't exist
-- ============================================
INSERT INTO profiles (id, email, created_at)
SELECT id, email, created_at
FROM auth.users
WHERE email = 'stokhtabayev@gmail.com'
  AND id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO UPDATE SET
  email = EXCLUDED.email;

-- Step 4: Verify the fix worked
-- ============================================
SELECT 
  au.id as auth_user_id,
  au.email as auth_email,
  p.id as profile_id,
  p.email as profile_email,
  CASE 
    WHEN au.id = p.id THEN '✅ MATCH'
    ELSE '❌ MISMATCH'
  END as status
FROM auth.users au
LEFT JOIN profiles p ON au.id = p.id
WHERE au.email = 'stokhtabayev@gmail.com';

-- Expected: Both IDs should match and status should be "✅ MATCH"

-- ============================================
-- DONE! Your profile should now be correctly linked.
-- ============================================

