import { supabase } from "@/lib/supabase";

export interface Integration {
  id: string;
  user_id: string;
  provider: string; // 'github' | 'stripe' | etc.
  config: Record<string, any>;
  is_active: boolean;
  created_at: string;
}

export const integrationsApi = {
  async getIntegrations(userId: string): Promise<Integration[]> {
    const { data, error } = await supabase
      .from("integrations")
      .select("*")
      .eq("user_id", userId);
    
    if (error) throw new Error(error.message);
    return data || [];
  },

  async upsertIntegration(userId: string, provider: string, config: Record<string, any>, isActive: boolean = true): Promise<Integration> {
    const { data, error } = await supabase
      .from("integrations")
      .upsert({
        user_id: userId,
        provider,
        config,
        is_active: isActive
      }, { onConflict: 'user_id,provider' })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  async deleteIntegration(id: string): Promise<void> {
    const { error } = await supabase
      .from("integrations")
      .delete()
      .eq("id", id);
    if (error) throw new Error(error.message);
  }
};
