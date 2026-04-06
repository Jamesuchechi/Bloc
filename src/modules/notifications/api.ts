import { supabase } from "@/lib/supabase";

export interface DBNotification {
  id: string;
  user_id: string;
  type: 'info' | 'success' | 'warning' | 'error' | 'proposal_signed' | 'deliverable_approved';
  title: string;
  message: string;
  link?: string;
  is_read: boolean;
  created_at: string;
}

export const notificationsApi = {
  async getNotifications(userId: string): Promise<DBNotification[]> {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);
    
    if (error) throw new Error(error.message);
    return data || [];
  },

  async markAsRead(id: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);
    
    if (error) throw new Error(error.message);
  },

  async markAllAsRead(userId: string): Promise<void> {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", userId)
      .eq("is_read", false);
    
    if (error) throw new Error(error.message);
  },

  async createNotification(notification: Omit<DBNotification, 'id' | 'created_at' | 'is_read'>): Promise<DBNotification> {
    const { data, error } = await supabase
      .from("notifications")
      .insert(notification)
      .select()
      .single();
    
    if (error) throw new Error(error.message);
    return data;
  }
};
