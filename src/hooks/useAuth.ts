import { useEffect } from "react";
import { supabase } from "../lib/supabase";
import { useAppStore } from "../store/appStore";

export function useAuth() {
  const { user, isAuthLoading, setUser, setAuthLoading } = useAppStore();

  const signUp = async (email: string, password: string, fullName: string) => {
    // @ts-ignore
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });
    if (error) throw error;
    return data;
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