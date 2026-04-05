import { create } from "zustand";
import { persist } from "zustand/middleware";
import { LogEntryExtended, shiplogApi } from "@/modules/shiplog/api";

interface ShipLogState {
  // Entries State
  entries: LogEntryExtended[];
  isLoading: boolean;
  error: string | null;
  
  // Filtering & Pagination
  filters: {
    projectId: string | null;
    startDate: string | null;
    endDate: string | null;
    search: string;
  };
  hasMore: boolean;
  offset: number;
  limit: number;

  // Actions
  setFilters: (filters: Partial<ShipLogState["filters"]>) => void;
  fetchEntries: (userId: string, isLoadMore?: boolean) => Promise<void>;
  createEntry: (payload: any) => Promise<void>;
  updateEntry: (id: string, payload: any) => Promise<void>;
  deleteEntry: (id: string) => Promise<void>;
  resetLogs: () => void;
}

export const useShipLogStore = create<ShipLogState>()(
  persist(
    (set, get) => ({
      entries: [],
      isLoading: false,
      error: null,
      filters: {
        projectId: null,
        startDate: null,
        endDate: null,
        search: "",
      },
      hasMore: true,
      offset: 0,
      limit: 20,

      setFilters: (newFilters) => {
        set((state) => ({
          filters: { ...state.filters, ...newFilters },
          offset: 0, // Reset when filters change
          entries: [],
        }));
      },

      fetchEntries: async (userId, isLoadMore = false) => {
        const { filters, offset, limit, entries } = get();
        set({ isLoading: true, error: null });

        try {
          const newEntries = await shiplogApi.getLogEntries({
            userId,
            projectId: filters.projectId,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            search: filters.search || undefined,
            limit,
            offset: isLoadMore ? offset : 0,
          });

          set({
            entries: isLoadMore ? [...entries, ...newEntries] : newEntries,
            hasMore: newEntries.length === limit,
            offset: isLoadMore ? offset + limit : limit,
          });
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ isLoading: false });
        }
      },

      createEntry: async (payload) => {
        const entry = await shiplogApi.createLogEntry(payload);
        // Refresh or prepend locally
        set((state) => ({
          entries: [entry, ...state.entries].slice(0, state.limit + state.offset)
        }));
      },

      updateEntry: async (id, payload) => {
        const updated = await shiplogApi.updateLogEntry(id, payload);
        set((state) => ({
          entries: state.entries.map((e) => (e.id === id ? { ...e, ...updated } : e))
        }));
      },

      deleteEntry: async (id) => {
        await shiplogApi.deleteLogEntry(id);
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id)
        }));
      },

      resetLogs: () => set({ entries: [], offset: 0, hasMore: true }),
    }),
    {
      name: "bloc-shiplog-storage",
      partialize: (state) => ({
        filters: state.filters,
      }),
    }
  )
);
