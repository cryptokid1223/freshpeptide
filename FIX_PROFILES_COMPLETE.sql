-- ============================================
-- COMPLETE PROFILES TABLE FIX
-- Run this ENTIRE script in Supabase SQL Editor
-- ============================================

-- Step 1: Drop all existing policies on profiles
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users" ON profiles;
DROP POLICY IF EXISTS "Service role can insert profiles" ON profiles;

-- Step 2: Recreate all policies correctly
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can insert profiles" ON profiles
  FOR INSERT WITH CHECK (true);

-- Step 3: Drop and recreate the trigger function
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger 
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, new.created_at)
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email;
  RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Step 4: Create the trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 5: Clean up any orphaned data
DELETE FROM profiles WHERE id NOT IN (SELECT id FROM auth.users);
DELETE FROM profiles WHERE email = 'stokhtabayev@gmail.com';

-- Step 6: Create profiles for any existing auth users without them
INSERT INTO profiles (id, email, created_at)
SELECT id, email, created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Step 7: Verify everything is working
SELECT 
  'Auth Users' as table_name,
  COUNT(*) as count
FROM auth.users
UNION ALL
SELECT 
  'Profiles' as table_name,
  COUNT(*) as count
FROM profiles
UNION ALL
SELECT 
  'Users without profiles' as table_name,
  COUNT(*) as count
FROM auth.users 
WHERE id NOT IN (SELECT id FROM profiles);

-- Expected: Auth Users = Profiles, Users without profiles = 0

-- ============================================
-- DONE! Try signing up now.
-- ============================================

