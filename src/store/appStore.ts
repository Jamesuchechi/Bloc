import { create } from "zustand";

interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    avatar_url?: string;
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
  activeModule: "focus" | "dashboard" | "modules" | "settings" | "log";
  notifications: Notification[];

  setUser: (user: User | null) => void;
  setAuthLoading: (v: boolean) => void;
  setMobileMenuOpen: (v: boolean) => void;
  toggleSidebar: () => void;
  toggleMobileMenu: () => void;
  setActiveModule: (mod: AppState["activeModule"]) => void;
  addNotification: (n: Omit<Notification, "id" | "timestamp">) => void;
  clearNotifications: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  isAuthLoading: true,
  sidebarCollapsed: false,
  mobileMenuOpen: false,
  activeModule: "focus",
  notifications: [],

  setUser: (user) => set({ user, isAuthLoading: false }),
  setAuthLoading: (v) => set({ isAuthLoading: v }),
  setMobileMenuOpen: (v) => set({ mobileMenuOpen: v }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleMobileMenu: () => set((s) => ({ mobileMenuOpen: !s.mobileMenuOpen })),
  setActiveModule: (mod) => set({ activeModule: mod }),
  addNotification: (n) =>
    set((s) => ({
      notifications: [
        { ...n, id: Math.random().toString(36).substring(7), timestamp: Date.now() },
        ...s.notifications,
      ].slice(0, 20),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
