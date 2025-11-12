-- ============================================
-- CRITICAL FIX: Create missing profile for existing user
-- ============================================
-- Run this in Supabase SQL Editor to fix your account

-- This will create a profile for your existing auth user
INSERT INTO profiles (id, email, created_at)
SELECT 
  id, 
  email, 
  created_at
FROM auth.users
WHERE email = 'stokhtabayev@gmail.com'
ON CONFLICT (id) DO NOTHING;

-- Verify the profile was created
SELECT * FROM profiles WHERE email = 'stokhtabayev@gmail.com';

