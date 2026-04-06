CREATE TABLE IF NOT EXISTS public.service_snippets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  unit_price numeric(10,2) NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.service_snippets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own service snippets" ON public.service_snippets 
FOR ALL USING (auth.uid() = user_id);
