import { supabase } from "@/lib/supabase";

export interface Proposal {
  id: string;
  user_id: string;
  client_id: string | null;
  title: string;
  scope: string | null;
  timeline_start: string | null; // Used for "Issue Date"
  timeline_end: string | null;   // Used for "Valid Until"
  payment_terms: string | null;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'declined';
  share_token: string;
  signed_at: string | null;
  signed_name: string | null;
  total_value: number;
  created_at: string;
}

export interface ProposalService {
  id: string;
  proposal_id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  position: number;
}

export interface ServiceSnippet {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  unit_price: number;
  created_at: string;
}

export const proposalApi = {
  // --- Proposals ---
  async getProposals(userId: string): Promise<Proposal[]> {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async getProposalById(id: string): Promise<Proposal> {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async getProposalByToken(token: string): Promise<Proposal> {
    const { data, error } = await supabase
      .from("proposals")
      .select("*")
      .eq("share_token", token)
      .single();
    if (error) throw new Error("Proposal not found or invalid token.");
    return data;
  },

  async createProposal(payload: Partial<Proposal>): Promise<Proposal> {
    const { data, error } = await supabase
      .from("proposals")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async updateProposal(id: string, payload: Partial<Proposal>): Promise<Proposal> {
    const { data, error } = await supabase
      .from("proposals")
      .update(payload)
      .eq("id", id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },

  async deleteProposal(id: string): Promise<void> {
    const { error } = await supabase.from("proposals").delete().eq("id", id);
    if (error) throw new Error(error.message);
  },

  async signProposal(id: string, signedName: string): Promise<void> {
    const { error } = await supabase
      .from("proposals")
      .update({ 
        status: 'signed', 
        signed_name: signedName, 
        signed_at: new Date().toISOString() 
      })
      .eq("id", id);
    if (error) throw new Error(error.message);
  },

  // --- Proposal Services (Line Items) ---
  async getServicesForProposal(proposalId: string): Promise<ProposalService[]> {
    const { data, error } = await supabase
      .from("proposal_services")
      .select("*")
      .eq("proposal_id", proposalId)
      .order("position", { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async saveServicesForProposal(proposalId: string, services: Partial<ProposalService>[]): Promise<void> {
    // Basic sync: delete old, insert new. Transactions would be better via RPC,
    // but standard REST works fine for manageable arrays.
    const { error: delError } = await supabase
      .from("proposal_services")
      .delete()
      .eq("proposal_id", proposalId);
    if (delError) throw new Error(delError.message);

    if (services.length > 0) {
      const inserts = services.map((s, idx) => ({
        proposal_id: proposalId,
        name: s.name,
        description: s.description,
        quantity: s.quantity,
        unit_price: s.unit_price,
        position: idx
      }));

      const { error: insError } = await supabase
        .from("proposal_services")
        .insert(inserts);
      if (insError) throw new Error(insError.message);
    }
  },

  // --- Service Snippets ---
  async getSnippets(userId: string): Promise<ServiceSnippet[]> {
    const { data, error } = await supabase
      .from("service_snippets")
      .select("*")
      .eq("user_id", userId)
      .order("name", { ascending: true });
    if (error) throw new Error(error.message);
    return data || [];
  },

  async createSnippet(payload: Partial<ServiceSnippet>): Promise<ServiceSnippet> {
    const { data, error } = await supabase
      .from("service_snippets")
      .insert(payload)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  },
  
  async deleteSnippet(id: string): Promise<void> {
    const { error } = await supabase.from("service_snippets").delete().eq("id", id);
    if (error) throw new Error(error.message);
  }
};
