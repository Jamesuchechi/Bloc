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
    <div className="w-full space-y-10">
      <div className="grid grid-cols-1 gap-4">
        <div className="bg-surface/50 border border-border/10 p-5 rounded-2xl flex items-center gap-5 transition-all hover:bg-surface/70 group">
          <div className="p-3 rounded-xl bg-amber/10 border border-amber/20 group-hover:scale-110 transition-transform">
            <Clock className="w-5 h-5 text-amber" />
          </div>
          <div>
            <div className="text-[10px] font-black text-mist/40 uppercase tracking-widest">Tracked Today</div>
            <div className="text-xl font-black text-chalk">
              {hours > 0 && `${hours}h `}{mins}m
            </div>
          </div>
        </div>

        <div className="bg-surface/50 border border-border/10 p-5 rounded-2xl flex items-center gap-5 transition-all hover:bg-surface/70 group">
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 group-hover:scale-110 transition-transform">
            <Flame className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <div className="text-[10px] font-black text-mist/40 uppercase tracking-widest">Current Streak</div>
            <div className="text-xl font-black text-chalk">12 Days</div>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-[10px] font-black text-chalk uppercase tracking-[0.2em] flex items-center gap-2">
            <History className="w-3 h-3 text-amber" />
            Vessel Progress
          </h3>
          <span className="text-[8px] font-black text-mist/40 uppercase tracking-widest">{sessions.length} sessions</span>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 w-full animate-pulse bg-surface/10 rounded-2xl border border-border/5" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-border/10 rounded-2xl">
            <p className="text-[10px] font-black uppercase tracking-widest text-mist/20">Awaiting Data Sync</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sessions.map((session) => (
              <div 
                key={session.id} 
                className="group bg-surface/20 border border-border/5 hover:border-amber/20 p-5 rounded-2xl transition-all cursor-pointer hover:bg-surface/40"
              >
                <div className="flex items-center justify-between">
                  <div className="space-y-1.5 min-w-0">
                    <p className="text-sm font-bold text-chalk truncate pr-4">
                      {session.title}
                    </p>
                    <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black text-mist/40 uppercase tracking-tighter">
                        {new Date(session.started_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <div className="h-1 w-1 rounded-full bg-border/20" />
                      <span className="text-[10px] font-black text-amber uppercase tabular-nums">
                        {session.duration_mins}M Session
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-mist/20 group-hover:text-amber group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
