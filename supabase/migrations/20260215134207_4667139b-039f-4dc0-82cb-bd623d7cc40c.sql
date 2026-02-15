
-- Drop the restrictive policy
DROP POLICY IF EXISTS "Users can read own roles" ON public.user_roles;

-- Create a permissive policy for authenticated users
CREATE POLICY "Authenticated users can read own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);
