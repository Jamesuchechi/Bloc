import React, { useState, useEffect } from "react";
import { Clock, Flame, History, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { focusApi, Session } from "../api";
import { useAuth } from "@/hooks/useAuth";

export const SessionHistory: React.FC = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      focusApi.getTodaySessions(user.id)
        .then(setSessions)
        .finally(() => setIsLoading(false));
    }
  }, [user]);

  const totalMinutes = sessions.reduce((acc, s) => acc + (s.duration_mins || 0), 0);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;

  return (
    <div className="w-full space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="bg-zinc-900/40 border-zinc-800 p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-orange-500/10 border border-orange-500/20">
            <Clock className="w-6 h-6 text-orange-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-500">Tracked Today</div>
            <div className="text-2xl font-bold text-white">
              {hours > 0 && `${hours}h `}{mins}m
            </div>
          </div>
        </Card>

        <Card className="bg-zinc-900/40 border-zinc-800 p-6 flex items-center gap-4">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20">
            <Flame className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <div className="text-sm font-medium text-zinc-500">Current Streak</div>
            <div className="text-2xl font-bold text-white">12 Days</div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <History className="w-5 h-5 text-zinc-500" />
            Today's Progress
          </h3>
          <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">{sessions.length} sessions</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 w-full animate-pulse bg-zinc-900/30 rounded-xl border border-zinc-800" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-zinc-900 rounded-2xl">
            <p className="text-zinc-600 font-medium">No sessions logged today yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card 
                key={session.id} 
                className="group bg-zinc-900/30 border-zinc-800/50 hover:border-zinc-700 p-4 transition-all hover:bg-zinc-900/50"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="font-semibold text-zinc-200 group-hover:text-white transition-colors capitalize">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-zinc-500 font-medium">
                        {new Date(session.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-zinc-800" />
                      <span className="text-xs font-bold text-orange-400">
                        {session.duration_mins}m
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-700 group-hover:text-zinc-400 group-hover:translate-x-1 transition-all" />
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
