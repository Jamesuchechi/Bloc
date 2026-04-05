import { supabase } from "@/lib/supabase";
import { LogEntry } from "@/modules/focus/api";

export interface LogEntryExtended extends LogEntry {
  projects?: {
    name: string;
    color: string | null;
  };
}

export const shiplogApi = {
  /**
   * Fetch log entries with filtering and pagination
   */
  async getLogEntries(params: {
    userId: string;
    projectId?: string | null;
    startDate?: string;
    endDate?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }): Promise<LogEntryExtended[]> {
    let query = supabase
      .from("log_entries")
      .select("*, projects(name, color)")
      .eq("user_id", params.userId)
      .order("date", { ascending: false })
      .order("created_at", { ascending: false });

    if (params.projectId) {
      query = query.eq("project_id", params.projectId);
    }
    
    if (params.startDate) {
      query = query.gte("date", params.startDate);
    }
    
    if (params.endDate) {
      query = query.lte("date", params.endDate);
    }
    
    if (params.search) {
      query = query.ilike("description", `%${params.search}%`);
    }

    if (params.limit) {
      const offset = params.offset || 0;
      query = query.range(offset, offset + params.limit - 1);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Create a manual log entry
   */
  async createLogEntry(payload: Partial<LogEntry>): Promise<LogEntry> {
    const { data, error } = await supabase
      .from("log_entries")
      .insert(payload)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Update an existing log entry
   */
  async updateLogEntry(id: string, payload: Partial<LogEntry>): Promise<LogEntry> {
    const { data, error } = await supabase
      .from("log_entries")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Delete a log entry
   */
  async deleteLogEntry(id: string): Promise<void> {
    const { error } = await supabase
      .from("log_entries")
      .delete()
      .eq("id", id);

    if (error) throw new Error(error.message);
  },

  /**
   * Fetch aggregate stats for a weekly summary
   */
  async getWeeklyStats(userId: string, startDate: string, endDate: string) {
    const { data, error } = await supabase
      .from("log_entries")
      .select("duration_mins, project_id, projects(name, color)")
      .eq("user_id", userId)
      .gte("date", startDate)
      .lte("date", endDate);

    if (error) throw new Error(error.message);
    return data || [];
  },
};
