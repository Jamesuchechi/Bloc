import React, { useState, useEffect } from "react";
import { Timer, Play, Plus } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
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
    <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-white">Focus.</h1>
        <p className="text-zinc-400">What are you building today?</p>
      </div>

      <Card className="bg-zinc-900/50 border-zinc-800 p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-zinc-400">Current Focus</label>
            <Input
              placeholder="Designing the dashboard icons..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg py-6"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Project (Optional)</label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all"
              >
                <option value="">No Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">Mode</label>
              <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
                <button
                  type="button"
                  onClick={() => setTimerMode("stopwatch")}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    timerMode === "stopwatch" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Stopwatch
                </button>
                <button
                  type="button"
                  onClick={() => setTimerMode("countdown")}
                  className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                    timerMode === "countdown" ? "bg-zinc-800 text-white shadow-sm" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  Pomodoro
                </button>
              </div>
            </div>
          </div>

          {timerMode === "countdown" && (
            <div className="flex items-center justify-between p-4 bg-orange-500/5 border border-orange-500/10 rounded-xl animate-in zoom-in-95 duration-300">
              <span className="text-sm text-orange-200/70 font-medium">Session Duration</span>
              <div className="flex items-center gap-4">
                {[15, 25, 45, 60].map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setCountdownDuration(mins)}
                    className={`w-10 h-10 rounded-full border text-xs font-bold transition-all ${
                      countdownDuration === mins
                        ? "bg-orange-500 border-orange-400 text-white shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                        : "bg-zinc-950 border-zinc-800 text-zinc-400 hover:border-zinc-700"
                    }`}
                  >
                    {mins}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            type="submit"
            className="w-full py-7 text-lg font-bold bg-orange-500 hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.2)]"
            disabled={!title.trim()}
          >
            <Play className="w-5 h-5 mr-2 fill-current" />
            Launch Session
          </Button>
        </form>
      </Card>
    </div>
  );
};
