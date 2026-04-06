import { create } from "zustand";
import { projectsApi, Project } from "../modules/projects/api";

interface ProjectState {
  projects: Project[];
  loading: boolean;
  error: string | null;

  fetchProjects: (userId: string) => Promise<void>;
  addProject: (payload: Partial<Project>) => Promise<void>;
  updateProject: (id: string, payload: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
}

export const useProjectStore = create<ProjectState>((set) => ({
  projects: [],
  loading: false,
  error: null,

  fetchProjects: async (userId) => {
    set({ loading: true, error: null });
    try {
      const data = await projectsApi.getProjects(userId);
      set({ projects: data, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  addProject: async (payload) => {
    set({ loading: true, error: null });
    try {
      const newProject = await projectsApi.createProject(payload);
      set((state) => ({ 
        projects: [newProject, ...state.projects],
        loading: false 
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateProject: async (id, payload) => {
    set({ loading: true, error: null });
    try {
      const updatedProject = await projectsApi.updateProject(id, payload);
      set((state) => ({
        projects: state.projects.map((p) => (p.id === id ? updatedProject : p)),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deleteProject: async (id) => {
    set({ loading: true, error: null });
    try {
      await projectsApi.deleteProject(id);
      set((state) => ({
        projects: state.projects.filter((p) => p.id !== id),
        loading: false,
      }));
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
