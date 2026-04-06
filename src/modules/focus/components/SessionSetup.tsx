import React, { useState, useEffect } from "react";
import { Timer, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { motion } from "framer-motion";
import { focusApi, Project } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { useFocusStore } from "@/store/focusStore";

interface SessionSetupProps {
  onStart: (title: string, projectId: string | null) => void;
}

export const SessionSetup: React.FC<SessionSetupProps> = ({ onStart }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { timerMode, setTimerMode, countdownDuration, setCountdownDuration } = useFocusStore();

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      focusApi.getProjects(user.id)
        .then(setProjects)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onStart(title, projectId || null);
  };

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="bg-surface/30 border-border/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-32 h-32 bg-amber/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-amber/10 transition-colors" />
        
        <form onSubmit={handleSubmit} className="space-y-10 relative z-10">
          <div className="space-y-3">
            <label className="text-[10px] font-black text-mist/40 uppercase tracking-[0.2em] ml-1">Current Focus</label>
            <Input
              placeholder="What are you building today?"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-xl py-8 bg-surface/50 border-border/10 rounded-2xl focus:border-amber/50 focus:ring-amber/20 transition-all font-bold placeholder:text-mist/20"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <label className="text-[10px] font-black text-mist/40 uppercase tracking-[0.2em] ml-1">Project Context</label>
              <div className="relative group/select">
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full bg-surface/50 border border-border/10 rounded-2xl px-5 py-4 text-sm font-bold text-chalk outline-none focus:border-amber/50 focus:ring-2 focus:ring-amber/10 transition-all appearance-none cursor-pointer"
                >
                  <option value="" className="bg-ink">General / Internal</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id} className="bg-ink">
                      {p.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-mist/40 group-hover/select:text-amber transition-colors">
                  <Plus className="h-4 w-4" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-mist/40 uppercase tracking-[0.2em] ml-1">Timer Mode</label>
              <div className="flex bg-surface/50 p-1.5 rounded-2xl border border-border/10 h-[54px]">
                <button
                  type="button"
                  onClick={() => setTimerMode("stopwatch")}
                  className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    timerMode === "stopwatch" 
                      ? "bg-amber text-ink shadow-lg shadow-amber/20" 
                      : "text-mist/40 hover:text-mist hover:bg-surface"
                  }`}
                >
                  Stopwatch
                </button>
                <button
                  type="button"
                  onClick={() => setTimerMode("countdown")}
                  className={`flex-1 flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all ${
                    timerMode === "countdown" 
                      ? "bg-amber text-ink shadow-lg shadow-amber/20" 
                      : "text-mist/40 hover:text-mist hover:bg-surface"
                  }`}
                >
                  Pomodoro
                </button>
              </div>
            </div>
          </div>

          {timerMode === "countdown" && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-amber/5 border border-amber/10 rounded-2xl gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-amber/10 rounded-lg">
                   <Timer className="h-4 w-4 text-amber" />
                </div>
                <span className="text-xs text-amber font-black uppercase tracking-widest">Session Block</span>
              </div>
              <div className="flex items-center gap-3">
                {[15, 25, 45, 60, 90].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setCountdownDuration(mins)}
                    className={`h-11 px-4 rounded-xl border text-[10px] font-black transition-all ${
                      countdownDuration === mins
                        ? "bg-amber border-amber/40 text-ink shadow-xl shadow-amber/10"
                        : "bg-surface/50 border-border/10 text-mist/40 hover:text-mist hover:border-border/40"
                    }`}
                  >
                    {mins}M
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          <Button
            type="submit"
            className="w-full h-16 text-xs font-black uppercase tracking-[0.3em] bg-amber text-ink hover:bg-white transition-all shadow-2xl shadow-amber/20 active:scale-[0.98]"
            disabled={!title.trim()}
          >
            <Play className="w-4 h-4 mr-3 fill-current" />
            Initiate Protocol
          </Button>
        </form>
      </Card>
      
      <div className="flex items-center justify-center gap-8 px-4 opacity-30 group-hover:opacity-100 transition-opacity">
         <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/10" />
         <span className="text-[8px] font-black uppercase tracking-[0.4em] text-mist/40">Neural Sync Active</span>
         <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/10" />
      </div>
    </div>
  );
};
