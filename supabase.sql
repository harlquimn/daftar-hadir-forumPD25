-- Create the attendances table
CREATE TABLE attendances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  nip TEXT NOT NULL,
  position TEXT NOT NULL,
  institution TEXT NOT NULL,
  region TEXT NOT NULL,
  department TEXT NOT NULL,
  signature TEXT NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE attendances ENABLE ROW LEVEL SECURITY;

-- Create policy to allow inserts for authenticated users
CREATE POLICY "Allow inserts for authenticated users" 
  ON attendances FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow reads for authenticated users
CREATE POLICY "Allow reads for authenticated users" 
  ON attendances FOR SELECT 
  USING (true);
