import { supabase } from "@/lib/supabase";

export interface Session {
  id: string;
  user_id: string;
  project_id: string | null;
  title: string;
  started_at: string;
  ended_at: string | null;
  duration_mins: number | null;
  notes: string | null;
  created_at: string;
}

export interface LogEntry {
  id: string;
  user_id: string;
  project_id: string | null;
  session_id: string | null;
  date: string;
  description: string;
  duration_mins: number | null;
  tags: string[] | null;
  created_at: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  color: string | null;
  status: string;
  created_at: string;
}

export const focusApi = {
  /**
   * Create a new session in Supabase
   */
  async createSession(payload: {
    userId: string;
    title: string;
    projectId?: string | null;
    startedAt: string;
  }): Promise<Session> {
    const { data, error } = await supabase
      .from("sessions")
      .insert({
        user_id: payload.userId,
        title: payload.title,
        project_id: payload.projectId || null,
        started_at: payload.startedAt,
      })
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * End a session and update it in Supabase
   */
  async endSession(
    id: string,
    payload: {
      endedAt: string;
      durationMins: number;
      notes?: string | null;
    }
  ): Promise<Session> {
    const { data, error } = await supabase
      .from("sessions")
      .update({
        ended_at: payload.endedAt,
        duration_mins: payload.durationMins,
        notes: payload.notes || null,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    return data;
  },

  /**
   * Fetch today's sessions for a user
   */
  async getTodaySessions(userId: string): Promise<Session[]> {
    const today = new Date().toISOString().split("T")[0];
    const { data, error } = await supabase
      .from("sessions")
      .select("*")
      .eq("user_id", userId)
      .gte("started_at", `${today}T00:00:00Z`)
      .lte("started_at", `${today}T23:59:59Z`)
      .order("started_at", { ascending: false });

    if (error) throw new Error(error.message);
    return data || [];
  },

  /**
   * Manually create a log entry (fallback for trigger or standalone)
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
   * Fetch all active projects for a user
   */
  async getProjects(userId: string): Promise<Project[]> {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("user_id", userId)
      .eq("status", "active")
      .order("name");

    if (error) throw new Error(error.message);
    return data || [];
  },
};
