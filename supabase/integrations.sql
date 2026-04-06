-- INTEGRATIONS TABLE
CREATE TABLE IF NOT EXISTS public.integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  provider text NOT NULL, -- 'github', 'stripe', 'linear', etc.
  config jsonb DEFAULT '{}'::jsonb, -- stores encrypted/sensitive tokens or settings
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, provider)
);

ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own integrations" ON public.integrations 
FOR ALL USING (auth.uid() = user_id);
