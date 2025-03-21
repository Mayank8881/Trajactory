-- Add an INSERT policy for users table to allow registration
CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (auth.uid() = id); 