-- ====================================================================
-- FIX: Row-Level Security (RLS) Infinite Recursion on public.users
-- ====================================================================
-- Run this script in your Supabase SQL Editor to apply the fix.
-- This script is safe to run on an existing database and will not
-- affect any existing data.
-- ====================================================================

-- 1. Create a SECURITY DEFINER helper function.
-- This function bypasses RLS checks, preventing the infinite recursion
-- that occurs when a policy on public.users queries public.users itself.
create or replace function public.is_admin()
returns boolean as $$
begin
  return exists (
    select 1 from public.users where id = auth.uid() and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- 2. Drop the old recursive policy on public.users.
drop policy if exists "Admins can view all profiles" on public.users;

-- 3. Recreate the policy using the helper function.
create policy "Admins can view all profiles" on public.users
  for all using (public.is_admin());

-- 4. Update other admin policies for consistency and performance.
drop policy if exists "Admins can manage cars" on public.cars;
create policy "Admins can manage cars" on public.cars
  for all using (public.is_admin());

drop policy if exists "Admins can manage all bookings" on public.bookings;
create policy "Admins can manage all bookings" on public.bookings
  for all using (public.is_admin());

drop policy if exists "Admins can manage all payments" on public.payments;
create policy "Admins can manage all payments" on public.payments
  for all using (public.is_admin());

drop policy if exists "Admins can manage all reviews" on public.reviews;
create policy "Admins can manage all reviews" on public.reviews
  for all using (public.is_admin());

drop policy if exists "Admins can manage all documents" on public.documents;
create policy "Admins can manage all documents" on public.documents
  for all using (public.is_admin());

-- ====================================================================
-- End of Fix Script
-- ====================================================================
