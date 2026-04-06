import { create } from "zustand";
import { supabase } from "@/lib/supabase";
import { DBNotification, notificationsApi } from "@/modules/notifications/api";
import { toast } from "react-hot-toast";

interface NotificationState {
  notifications: DBNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;

  fetchNotifications: (userId: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: (userId: string) => Promise<void>;
  subscribeToNotifications: (userId: string) => () => void;
  addLocalNotification: (n: DBNotification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,

  fetchNotifications: async (userId: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await notificationsApi.getNotifications(userId);
      set({ 
        notifications: data, 
        unreadCount: data.filter(n => !n.is_read).length,
        isLoading: false 
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationsApi.markAsRead(id);
      set(state => {
        const updated = state.notifications.map(n => n.id === id ? { ...n, is_read: true } : n);
        return {
          notifications: updated,
          unreadCount: updated.filter(n => !n.is_read).length
        };
      });
    } catch (err: any) {
      console.error("Failed to mark as read", err);
    }
  },

  markAllAsRead: async (userId: string) => {
    try {
      await notificationsApi.markAllAsRead(userId);
      set(state => ({
        notifications: state.notifications.map(n => ({ ...n, is_read: true })),
        unreadCount: 0
      }));
    } catch (err: any) {
      console.error("Failed to mark all as read", err);
    }
  },

  addLocalNotification: (n: DBNotification) => {
    set(state => {
      const exists = state.notifications.find(existing => existing.id === n.id);
      if (exists) return state;

      const updated = [n, ...state.notifications].slice(0, 50);
      return {
        notifications: updated,
        unreadCount: updated.filter(u => !u.is_read).length
      };
    });
    
    // Also trigger a toast if it's new
    toast(n.message, {
      icon: '🔔',
      duration: 4000,
    });
  },

  subscribeToNotifications: (userId: string) => {
    const channel = supabase
      .channel(`user-notifications-${userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          get().addLocalNotification(payload.new as DBNotification);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  },
}));
