import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Client, portalApi } from "@/modules/portal/api";

interface PortalState {
  clients: Client[];
  isLoading: boolean;
  error: string | null;

  fetchClients: (userId: string) => Promise<void>;
  createClient: (payload: Partial<Client>) => Promise<void>;
  updateClient: (id: string, payload: Partial<Client>) => Promise<void>;
  deleteClient: (id: string) => Promise<void>;
}

export const usePortalStore = create<PortalState>()(
  persist(
    (set) => ({
      clients: [],
      isLoading: false,
      error: null,

      fetchClients: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const clients = await portalApi.getClients(userId);
          set({ clients, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      createClient: async (payload: Partial<Client>) => {
        try {
          const newClient = await portalApi.createClient(payload);
          set((state) => ({ clients: [...state.clients, newClient].sort((a,b) => a.name.localeCompare(b.name)) }));
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        }
      },

      updateClient: async (id: string, payload: Partial<Client>) => {
        try {
          const updated = await portalApi.updateClient(id, payload);
          set((state) => ({
            clients: state.clients.map(c => c.id === id ? { ...c, ...updated } : c)
          }));
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        }
      },

      deleteClient: async (id: string) => {
        try {
          await portalApi.deleteClient(id);
          set((state) => ({
            clients: state.clients.filter(c => c.id !== id)
          }));
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        }
      }
    }),
    {
      name: "bloc-portal-storage",
    }
  )
);
