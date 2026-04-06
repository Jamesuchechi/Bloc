import { supabase } from "@/lib/supabase";
import { Project } from "@/modules/focus/api";
import { LogEntryExtended } from "@/modules/shiplog/api";

export interface Client {
  id: string;
  user_id: string;
  name: string;
  company: string | null;
  email: string | null;
  color: string | null;
  portal_token: string;
  portal_password_hash: string | null;
  created_at: string;
}

export interface PortalUpdate {
  id: string;
  project_id: string;
  log_entry_id: string | null;
  content: string;
  visible: boolean;
  created_at: string;
  log_entries?: LogEntryExtended;
}

export interface Deliverable {
  id: string;
  project_id: string;
  title: string;
  status: 'pending' | 'in_review' | 'approved';
  file_url: string | null;
  approved_at: string | null;
  created_at: string;
}

export const portalApi = {
  // --- Client Management ---
  async getClients(userId: string): Promise<Client[]> {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createClient(payload: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from("clients")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async updateClient(id: string, payload: Partial<Client>): Promise<Client> {
    const { data, error } = await supabase
      .from("clients")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteClient(id: string): Promise<void> {
    const { error } = await supabase.from("clients").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // --- Portal Builder Actions ---
  async getClientProjects(clientId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("client_id", clientId)
      .order("name");
    if (error) throw new Error(error.message);
    return data || [];
  },

  async assignProjectToClient(projectId: string, clientId: string | null): Promise<void> {
    const { error } = await supabase
      .from("projects")
      .update({ client_id: clientId })
      .eq("id", projectId);
    if (error) throw new Error(error.message);
  },

  // --- Updates ---
  async getPortalUpdates(projectId: string): Promise<PortalUpdate[]> {
    const { data, error } = await supabase
      .from("portal_updates")
      .select("*, log_entries(*)")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createPortalUpdate(payload: Partial<PortalUpdate>): Promise<PortalUpdate> {
    const { data, error } = await supabase
      .from("portal_updates")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deletePortalUpdate(id: string): Promise<void> {
    const { error } = await supabase.from("portal_updates").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // --- Deliverables ---
  async getDeliverables(projectId: string): Promise<Deliverable[]> {
    const { data, error } = await supabase
      .from("deliverables")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createDeliverable(payload: Partial<Deliverable>): Promise<Deliverable> {
    const { data, error } = await supabase
      .from("deliverables")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async updateDeliverableStatus(id: string, status: Deliverable['status']): Promise<void> {
    const updatePayload: any = { status };
    if (status === 'approved') {
      updatePayload.approved_at = new Date().toISOString();
    }
    const { error } = await supabase
      .from("deliverables")
      .update(updatePayload)
      .eq("id", id);
    if (error) throw new Error(error.message);
  },

  async deleteDeliverable(id: string): Promise<void> {
    const { error } = await supabase.from("deliverables").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  // --- File Upload ---
  async uploadDeliverableFile(file: File, projectId: string): Promise<string> {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${projectId}/${fileName}`;

    const { error } = await supabase.storage
      .from('deliverables')
      .upload(filePath, file);

    if (error) throw new Error(`Upload failed: ${error.message}`);

    const { data } = supabase.storage
      .from('deliverables')
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  // --- Public Portal Access ---
  async getPortalByToken(token: string): Promise<Client | null> {
    const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("portal_token", token)
      .single();
    if (error && error.code !== "PGRST116") throw new Error(error.message); // PGRST116 is not found
    return data;
  },

  async verifyPortalPassword(token: string, password: string): Promise<boolean> {
    const { data, error } = await supabase.rpc('verify_portal_password', {
      p_token: token,
      p_password: password
    });
    
    if (error) throw new Error(error.message);
    return !!data;
  },
};
