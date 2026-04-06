import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useShipLogStore } from '@/store/shipLogStore';
import { useFocusStore } from '@/store/focusStore';
import { useAuth } from '@/hooks/useAuth';

export function useSupabaseRealtime() {
  const { user } = useAuth();
  const { fetchEntries } = useShipLogStore();
  const { activeSession, setActiveSession } = useFocusStore();

  useEffect(() => {
    if (!user) return;

    // Listen to log_entries changes
    const logEntriesSub = supabase
      .channel('log_entries_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'log_entries',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          // A change happened, refetch the entries
          fetchEntries(user.id);
        }
      )
      .subscribe();

    // Listen to sessions changes
    const sessionsSub = supabase
      .channel('sessions_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'sessions',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          // If active session was deleted or ended remotely
          if (activeSession) {
             if (payload.eventType === 'DELETE' && payload.old.id === activeSession.id) {
               setActiveSession(null);
             } else if (payload.eventType === 'UPDATE' && payload.new.id === activeSession.id && payload.new.ended_at) {
               setActiveSession(null);
             }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(logEntriesSub);
      supabase.removeChannel(sessionsSub);
    };
  }, [user, fetchEntries, activeSession, setActiveSession]);
}
