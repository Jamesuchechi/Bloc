-- Enable pgcrypto for crypt/gen_salt
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 1. Trigger to automatically hash passwords on INSERT or UPDATE
CREATE OR REPLACE FUNCTION public.hash_portal_password()
RETURNS TRIGGER AS $$
BEGIN
  -- Only hash if the password has changed and isn't already a hash (starts with $2a$ or $2b$)
  IF (TG_OP = 'INSERT' OR NEW.portal_password_hash IS DISTINCT FROM OLD.portal_password_hash) AND 
     (NEW.portal_password_hash IS NOT NULL AND NEW.portal_password_hash !~ '^\$2[ab]\$') THEN
    NEW.portal_password_hash := crypt(NEW.portal_password_hash, gen_salt('bf', 8));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS tr_hash_portal_password ON public.clients;
CREATE TRIGGER tr_hash_portal_password
  BEFORE INSERT OR UPDATE ON public.clients
  FOR EACH ROW
  EXECUTE FUNCTION public.hash_portal_password();

-- 2. RPC to securely verify a password without exposing the hash to the client
CREATE OR REPLACE FUNCTION public.verify_portal_password(p_token uuid, p_password text)
RETURNS boolean AS $$
DECLARE
  v_hash text;
BEGIN
  SELECT portal_password_hash INTO v_hash
  FROM public.clients
  WHERE portal_token = p_token;

  IF v_hash IS NULL THEN
    RETURN false;
  END IF;

  RETURN v_hash = crypt(p_password, v_hash);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
