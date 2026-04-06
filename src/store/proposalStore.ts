import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Proposal, ProposalService, ServiceSnippet, proposalApi } from "@/modules/proposals/api";

interface ProposalState {
  proposals: Proposal[];
  snippets: ServiceSnippet[];
  isLoading: boolean;
  error: string | null;

  fetchProposals: (userId: string) => Promise<void>;
  fetchSnippets: (userId: string) => Promise<void>;
  createProposal: (payload: Partial<Proposal>) => Promise<Proposal>;
  updateProposal: (id: string, payload: Partial<Proposal>) => Promise<Proposal>;
  deleteProposal: (id: string) => Promise<void>;
  createSnippet: (payload: Partial<ServiceSnippet>) => Promise<void>;
  deleteSnippet: (id: string) => Promise<void>;
}

export const useProposalStore = create<ProposalState>()(
  persist(
    (set, get) => ({
      proposals: [],
      snippets: [],
      isLoading: false,
      error: null,

      fetchProposals: async (userId: string) => {
        set({ isLoading: true, error: null });
        try {
          const proposals = await proposalApi.getProposals(userId);
          set({ proposals, isLoading: false });
        } catch (err: any) {
          set({ error: err.message, isLoading: false });
        }
      },

      fetchSnippets: async (userId: string) => {
        try {
          const snippets = await proposalApi.getSnippets(userId);
          set({ snippets });
        } catch (err: any) {
          console.error("Failed to fetch snippets", err);
        }
      },

      createProposal: async (payload: Partial<Proposal>) => {
        try {
          const newProposal = await proposalApi.createProposal(payload);
          set((state) => ({ 
            proposals: [newProposal, ...state.proposals] 
          }));
          return newProposal;
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        }
      },

      updateProposal: async (id: string, payload: Partial<Proposal>) => {
        try {
          const updated = await proposalApi.updateProposal(id, payload);
          set((state) => ({
            proposals: state.proposals.map(p => p.id === id ? { ...p, ...updated } : p)
          }));
          return updated;
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        }
      },

      deleteProposal: async (id: string) => {
        try {
          await proposalApi.deleteProposal(id);
          set((state) => ({
            proposals: state.proposals.filter(p => p.id !== id)
          }));
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        }
      },

      createSnippet: async (payload: Partial<ServiceSnippet>) => {
        try {
          const newSnippet = await proposalApi.createSnippet(payload);
          set((state) => ({ snippets: [...state.snippets, newSnippet].sort((a,b) => a.name.localeCompare(b.name)) }));
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        }
      },

      deleteSnippet: async (id: string) => {
        try {
          await proposalApi.deleteSnippet(id);
          set((state) => ({
            snippets: state.snippets.filter(s => s.id !== id)
          }));
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        }
      }
    }),
    {
      name: "bloc-proposal-storage",
    }
  )
);
