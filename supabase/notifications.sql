-- NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  type text NOT NULL, -- 'info' | 'success' | 'warning' | 'error' | 'proposal_signed' | 'deliverable_approved'
  title text NOT NULL,
  message text NOT NULL,
  link text, -- optional route to navigate to
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own notifications" ON public.notifications 
FOR ALL USING (auth.uid() = user_id);
