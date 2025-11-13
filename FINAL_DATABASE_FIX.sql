-- ============================================
-- FINAL DATABASE FIX - Run This ONCE in Supabase SQL Editor
-- ============================================
-- This fixes ALL user data persistence issues permanently

-- Step 1: Create database trigger to auto-create profiles for new users
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, created_at)
  VALUES (new.id, new.email, new.created_at)
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for all future signups
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 2: Fix ALL existing users who don't have profiles
-- ============================================
INSERT INTO profiles (id, email, created_at)
SELECT id, email, created_at
FROM auth.users
WHERE id NOT IN (SELECT id FROM profiles)
ON CONFLICT (id) DO NOTHING;

-- Step 3: Verify the fixes worked
-- ============================================
-- Check how many users now have profiles
SELECT 
  (SELECT COUNT(*) FROM auth.users) as total_auth_users,
  (SELECT COUNT(*) FROM profiles) as total_profiles,
  (SELECT COUNT(*) FROM auth.users WHERE id NOT IN (SELECT id FROM profiles)) as users_without_profiles;

-- Expected result: users_without_profiles should be 0

-- ============================================
-- DONE! All current and future users will work now.
-- ============================================

