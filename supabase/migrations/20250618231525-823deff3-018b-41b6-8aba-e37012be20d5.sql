
-- Enable Row Level Security on all tables
ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.behaviors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vacation_days ENABLE ROW LEVEL SECURITY;

-- Children table policies (allow all authenticated users to access)
CREATE POLICY "Authenticated users can view children" 
  ON public.children 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create children" 
  ON public.children 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update children" 
  ON public.children 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete children" 
  ON public.children 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Activities table policies (allow all authenticated users to access)
CREATE POLICY "Authenticated users can view activities" 
  ON public.activities 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create activities" 
  ON public.activities 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update activities" 
  ON public.activities 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete activities" 
  ON public.activities 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Behaviors table policies (allow all authenticated users to access)
CREATE POLICY "Authenticated users can view behaviors" 
  ON public.behaviors 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create behaviors" 
  ON public.behaviors 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update behaviors" 
  ON public.behaviors 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete behaviors" 
  ON public.behaviors 
  FOR DELETE 
  USING (auth.role() = 'authenticated');

-- Vacation days table policies (allow all authenticated users to access)
CREATE POLICY "Authenticated users can view vacation days" 
  ON public.vacation_days 
  FOR SELECT 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can create vacation days" 
  ON public.vacation_days 
  FOR INSERT 
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update vacation days" 
  ON public.vacation_days 
  FOR UPDATE 
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can delete vacation days" 
  ON public.vacation_days 
  FOR DELETE 
  USING (auth.role() = 'authenticated');
