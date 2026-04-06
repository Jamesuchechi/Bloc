import { supabase } from "@/lib/supabase";

export interface Project {
  id: string;
  user_id: string;
  client_id: string | null;
  name: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  color: string | null;
  created_at: string;
  client?: {
    name: string;
    company: string | null;
  };
}

export const projectsApi = {
  /**
   * Fetch all projects for a user, optionally including client info
   */
  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*, client:clients(name, company)")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Create a new project
   */
  async createProject(payload: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .insert(payload)
      .select("*, client:clients(name, company)")
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update an existing project
   */
  async updateProject(id: string, payload: Partial<Project>): Promise<Project> {
    const { data, error } = await supabase
      .from("projects")
      .update(payload)
      .eq("id", id)
      .select("*, client:clients(name, company)")
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete a project
   */
  async deleteProject(id: string): Promise<void> {
    const { error } = await supabase.from("projects").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },
};
