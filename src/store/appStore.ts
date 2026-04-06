import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email?: string;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    prefs?: {
      email_proposals?: boolean;
      email_deliverables?: boolean;
      email_sessions?: boolean;
      browser_alerts?: boolean;
    };
    region?: {
      timezone?: string;
      dateFormat?: string;
    };
  };
}

interface Notification {
  id: string;
  type: "info" | "success" | "warning" | "error";
  message: string;
  timestamp: number;
}

interface AppState {
  user: User | null;
  isAuthLoading: boolean;
  sidebarCollapsed: boolean;
  mobileMenuOpen: boolean;
  activeModule: "focus" | "dashboard" | "modules" | "settings" | "log" | "clients" | "proposals" | "notifications" | "analytics" | "integrations";
  notifications: Notification[];
  theme: 'light' | 'dark' | 'system';
  accentColor: string;

  setUser: (user: User | null) => void;
  setAuthLoading: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setActiveModule: (mod: AppState["activeModule"]) => void;
  setTheme: (theme: AppState["theme"]) => void;
  setAccentColor: (color: string) => void;
  addNotification: (n: Omit<Notification, "id" | "timestamp">) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthLoading: true,
      sidebarCollapsed: false,
      mobileMenuOpen: false,
      activeModule: "focus",
      notifications: [],
      theme: 'dark',
      accentColor: '#e8a020',

      setUser: (user) => set({ user, isAuthLoading: false }),
      setAuthLoading: (v) => set({ isAuthLoading: v }),
      setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
      toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
      setActiveModule: (mod) => set({ activeModule: mod }),
      setTheme: (theme) => set({ theme }),
      setAccentColor: (accentColor) => set({ accentColor }),
      addNotification: (n) =>
        set((s) => ({
          notifications: [
            { ...n, id: Math.random().toString(36).substring(7), timestamp: Date.now() },
            ...s.notifications,
          ].slice(0, 20),
        })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: "bloc-storage",
      partialize: (state) => ({ 
        sidebarCollapsed: state.sidebarCollapsed, 
        theme: state.theme, 
        accentColor: state.accentColor 
      }),
    }
  )
);
