-- BLOC DATABASE SCHEMA
-- Based on ARCHITECTURE.md definitions

-- 1. USERS (Extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  avatar_url text,
  timezone text DEFAULT 'UTC',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. CLIENTS
CREATE TABLE IF NOT EXISTS public.clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  company text,
  email text,
  color text,
  portal_token uuid DEFAULT gen_random_uuid() UNIQUE,
  portal_password_hash text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

-- 3. PROJECTS
CREATE TABLE IF NOT EXISTS public.projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  name text NOT NULL,
  status text DEFAULT 'active', -- active | paused | completed | archived
  color text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- 4. SESSIONS (Focus Module)
CREATE TABLE IF NOT EXISTS public.sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  title text NOT NULL,
  started_at timestamptz NOT NULL,
  ended_at timestamptz,
  duration_mins integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;

-- 5. LOG ENTRIES (Ship Log Module)
CREATE TABLE IF NOT EXISTS public.log_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  project_id uuid REFERENCES public.projects(id) ON DELETE SET NULL,
  session_id uuid REFERENCES public.sessions(id) ON DELETE SET NULL,
  date date NOT NULL,
  description text NOT NULL,
  duration_mins integer,
  tags text[],
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.log_entries ENABLE ROW LEVEL SECURITY;

-- 6. PORTAL UPDATES
CREATE TABLE IF NOT EXISTS public.portal_updates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  log_entry_id uuid REFERENCES public.log_entries(id) ON DELETE SET NULL,
  content text NOT NULL,
  visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.portal_updates ENABLE ROW LEVEL SECURITY;

-- 7. DELIVERABLES
CREATE TABLE IF NOT EXISTS public.deliverables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  status text DEFAULT 'pending', -- pending | in_review | approved
  file_url text,
  approved_at timestamptz,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.deliverables ENABLE ROW LEVEL SECURITY;

-- 8. PROPOSALS
CREATE TABLE IF NOT EXISTS public.proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  client_id uuid REFERENCES public.clients(id) ON DELETE SET NULL,
  title text NOT NULL,
  scope text,
  timeline_start date,
  timeline_end date,
  payment_terms text DEFAULT 'full',
  status text DEFAULT 'draft', -- draft | sent | viewed | signed | declined
  share_token uuid DEFAULT gen_random_uuid() UNIQUE,
  signed_at timestamptz,
  signed_name text,
  total_value numeric(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.proposals ENABLE ROW LEVEL SECURITY;

-- 9. PROPOSAL SERVICES
CREATE TABLE IF NOT EXISTS public.proposal_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  proposal_id uuid REFERENCES public.proposals(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  description text,
  quantity integer DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  position integer NOT NULL
);

ALTER TABLE public.proposal_services ENABLE ROW LEVEL SECURITY;

--------------------------------------------------------------------------------
-- RLS POLICIES (Simplified "User-Owns-Data" Pattern)
--------------------------------------------------------------------------------

-- Helper function to check if user owns the record
-- Policies for 'users'
CREATE POLICY "Users can view their own profile" ON public.users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING (auth.uid() = id);

-- Logic for other tables (user_id check)
CREATE POLICY "Users can manage their own clients" ON public.clients FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own projects" ON public.projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own sessions" ON public.sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own log_entries" ON public.log_entries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage their own proposals" ON public.proposals FOR ALL USING (auth.uid() = user_id);

-- Positioned services for proposals
CREATE POLICY "Users can manage services for their proposals" ON public.proposal_services FOR ALL 
USING (EXISTS (SELECT 1 FROM public.proposals WHERE id = proposal_id AND user_id = auth.uid()));

-- Portal-Client relationships (Placeholder for more complex logic)
CREATE POLICY "Anyone with portal token can view visibility=true updates" ON public.portal_updates FOR SELECT 
USING (visible = true);

--------------------------------------------------------------------------------
-- TRIGGERS & AUTOMATION
--------------------------------------------------------------------------------

-- Automatically create a user profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
