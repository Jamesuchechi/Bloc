import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../store/appStore";

export function useAuth() {
  const { user, isAuthLoading, setUser, setAuthLoading } = useAppStore();

  useEffect(() => {
    let mounted = true;
    const timeout = setTimeout(() => {
      if (mounted && isAuthLoading) {
        console.warn("Auth initialization timed out. Defaulting to unauthenticated state.");
        setAuthLoading(false);
      }
    }, 5000); // 5 second timeout for auth initialization

    const initializeAuth = async () => {
      try {
        setAuthLoading(true);
        // @ts-ignore
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        if (mounted) {
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error("Error initializing auth:", err);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setAuthLoading(false);
          clearTimeout(timeout);
        }
      }
    };

    initializeAuth();

    // @ts-ignore
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        if (mounted) {
          setUser(session?.user ?? null);
          setAuthLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      clearTimeout(timeout);
      listener.subscription.unsubscribe();
    };
  }, [setUser, setAuthLoading]);

  const signUp = async (email: string, password: string, fullName: string) => {
    // @ts-ignore
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
  };

  const signIn = async (email: string, password: string) => {
    // @ts-ignore
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signOut = async () => {
    // @ts-ignore
    await supabase.auth.signOut();
  };

  const signInWithOAuth = async (provider: 'github' | 'google') => {
    // @ts-ignore
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) throw error;
  };

  return { user, isAuthLoading, signUp, signIn, signOut, signInWithOAuth };
}