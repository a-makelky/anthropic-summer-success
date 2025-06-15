
-- Create enum types for better data integrity
CREATE TYPE activity_type AS ENUM ('chore', 'education', 'skill');
CREATE TYPE behavior_type AS ENUM ('Talking Back', 'Lying', 'Sneaking Food', 'Unauthorized Screen Time', 'Not Following Instructions', 'Fighting with Sibling', 'Disrespectful Language', 'Not Completing Assigned Tasks');

-- Create children table
CREATE TABLE public.children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert the two children
INSERT INTO public.children (name) VALUES ('Mac'), ('Miles');

-- Create activities table
CREATE TABLE public.activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  type activity_type NOT NULL,
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  duration INTEGER, -- in minutes
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create behaviors table
CREATE TABLE public.behaviors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  type TEXT NOT NULL,
  deduction INTEGER DEFAULT 5, -- minutes deducted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vacation_days table
CREATE TABLE public.vacation_days (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS) but make data accessible to all authenticated users
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_days ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all authenticated users to access all data
-- This ensures both users can see and edit all data for Mac and Miles

-- Children policies
CREATE POLICY "Allow all authenticated users to view children" 
  ON public.children FOR SELECT 
  TO authenticated 
  USING (true);

-- Activities policies
CREATE POLICY "Allow all authenticated users to view activities" 
  ON public.activities FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow all authenticated users to insert activities" 
  ON public.activities FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update activities" 
  ON public.activities FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow all authenticated users to delete activities" 
  ON public.activities FOR DELETE 
  TO authenticated 
  USING (true);

-- Behaviors policies
CREATE POLICY "Allow all authenticated users to view behaviors" 
  ON public.behaviors FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow all authenticated users to insert behaviors" 
  ON public.behaviors FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to update behaviors" 
  ON public.behaviors FOR UPDATE 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow all authenticated users to delete behaviors" 
  ON public.behaviors FOR DELETE 
  TO authenticated 
  USING (true);

-- Vacation days policies
CREATE POLICY "Allow all authenticated users to view vacation days" 
  ON public.vacation_days FOR SELECT 
  TO authenticated 
  USING (true);

CREATE POLICY "Allow all authenticated users to insert vacation days" 
  ON public.vacation_days FOR INSERT 
  TO authenticated 
  WITH CHECK (true);

CREATE POLICY "Allow all authenticated users to delete vacation days" 
  ON public.vacation_days FOR DELETE 
  TO authenticated 
  USING (true);

-- Create function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at for activities
CREATE TRIGGER update_activities_updated_at 
    BEFORE UPDATE ON public.activities 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
