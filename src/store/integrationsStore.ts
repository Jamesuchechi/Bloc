import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Integration, integrationsApi } from "@/modules/integrations/api";

interface IntegrationsState {
  integrations: Integration[];
  isLoading: boolean;
  error: string | null;

  fetchIntegrations: (userId: string) => Promise<void>;
  updateIntegration: (userId: string, provider: string, config: any, isActive?: boolean) => Promise<void>;
  getIntegration: (provider: string) => Integration | undefined;
}

export const useIntegrationsStore = create<IntegrationsState>()(
  persist(
    (set, get) => ({
      integrations: [],
      isLoading: false,
      error: null,

      fetchIntegrations: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const integrations = await integrationsApi.getIntegrations(userId);
          set({ integrations, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      updateIntegration: async (userId: string, provider: string, config: any, isActive: boolean = true) => {
        set({ isLoading: true, error: null });
        try {
          const updated = await integrationsApi.upsertIntegration(userId, provider, config, isActive);
          set((state) => ({
            integrations: state.integrations.find(i => i.provider === provider)
              ? state.integrations.map(i => i.provider === provider ? updated : i)
              : [...state.integrations, updated],
            isLoading: false
          }));
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
          throw err;
        }
      },

      getIntegration: (provider: string) => {
        return get().integrations.find(i => i.provider === provider);
      }
    }),
    {
      name: "bloc-integrations-storage",
    }
  )
);
