import React, { useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { Ship, Award, TrendingUp, Calendar, Clock, CheckCircle2 } from "lucide-react";
import { format } from "date-fns";

export default function PublicSummaryPage() {
  const [searchParams] = useSearchParams();
  const dataParam = searchParams.get("data");

  const summary = useMemo(() => {
    if (!dataParam) return null;
    try {
      return JSON.parse(atob(dataParam));
    } catch (e) {
      console.error("Failed to decode summary data", e);
      return null;
    }
  }, [dataParam]);

  if (!summary) {
    return (
      <div className="min-h-screen bg-ink flex items-center justify-center p-6 text-center">
        <div className="max-w-md space-y-6">
          <div className="h-20 w-20 mx-auto rounded-3xl bg-red-500/10 flex items-center justify-center border border-red-500/20">
            <Ship className="h-10 w-10 text-red-400" />
          </div>
          <h1 className="text-2xl font-bold text-chalk">Invalid Summary Link</h1>
          <p className="text-mist">This link may be broken or expired. Please ask the builder for a new shared summary.</p>
        </div>
      </div>
    );
  }

  const { ownerName, startDate, endDate, totalHours, projectBreakdown, highlights } = summary;

  return (
    <div className="min-h-screen bg-ink text-chalk font-sans selection:bg-amber selection:text-ink">
      <div className="hero-glow opacity-30 fixed inset-0 pointer-events-none" />
      
      <div className="relative max-w-4xl mx-auto px-6 py-20">
        {/* Header */}
        <header className="space-y-8 mb-20 text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start gap-3 text-amber font-black tracking-[0.3em] uppercase text-xs">
                <Ship className="h-5 w-5" />
                Vessel Summary
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">
                Ship <span className="text-amber">Report.</span>
              </h1>
              <p className="text-xl text-mist font-medium">
                Prepared by <span className="text-chalk font-bold">{ownerName}</span> for the period of <br />
                <span className="text-amber">{format(new Date(startDate), "MMMM do")} — {format(new Date(endDate), "MMMM do, yyyy")}</span>
              </p>
            </div>
            
            <div className="h-24 w-24 mx-auto md:mx-0 rounded-3xl bg-surface/50 border border-border/50 flex items-center justify-center shadow-2xl p-4 backdrop-blur-xl">
               <img src="/logo.png" alt="BLOC" className="h-full w-full object-contain drop-shadow-[0_0_15px_rgba(232,160,32,0.4)]" />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {/* Stats Card */}
          <div className="md:col-span-1 p-8 rounded-3xl bg-surface/40 border border-border/20 backdrop-blur-xl space-y-6">
            <div className="space-y-1">
               <div className="text-[10px] font-bold text-mist uppercase tracking-widest">Total Velocity</div>
               <div className="text-5xl font-black tracking-tighter text-amber">{totalHours}h</div>
            </div>
            
            <div className="pt-6 border-t border-border/10 space-y-4">
              <h4 className="text-[10px] font-bold text-mist uppercase tracking-widest">Project Split</h4>
              {Object.entries(projectBreakdown).map(([name, hours]: any) => (
                <div key={name} className="space-y-2">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-chalk">{name}</span>
                    <span className="text-mist">{hours}h</span>
                  </div>
                  <div className="h-1.5 w-full bg-ink/60 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-amber shadow-[0_0_10px_rgba(232,160,32,0.3)]" 
                      style={{ width: `${(hours / totalHours) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights Card */}
          <div className="md:col-span-2 p-8 rounded-3xl bg-surface/40 border border-border/20 backdrop-blur-xl">
             <div className="flex items-center gap-3 mb-8">
               <TrendingUp className="h-6 w-6 text-amber" />
               <h3 className="text-2xl font-bold tracking-tight">Key Milestones</h3>
             </div>
             
             <div className="space-y-6">
               {highlights && highlights.length > 0 ? (
                 highlights.map((h: string, i: number) => (
                   <div key={i} className="flex gap-4 group">
                     <div className="mt-1 h-6 w-6 rounded-full bg-amber/10 border border-amber/20 flex items-center justify-center shrink-0 group-hover:bg-amber group-hover:text-ink transition-all">
                       <CheckCircle2 className="h-3.5 w-3.5" />
                     </div>
                     <p className="text-mist leading-relaxed group-hover:text-chalk transition-colors">{h}</p>
                   </div>
                 ))
               ) : (
                 <p className="text-mist italic">Regular maintenance and incremental improvements.</p>
               )}
             </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center space-y-6">
          <p className="text-sm text-mist/60 font-medium">
            Generated with <span className="text-chalk font-bold">BLOC</span> — The Engine for Independent Builders.
          </p>
          <div className="flex items-center justify-center gap-4">
             <div className="h-[1px] w-12 bg-border/30" />
             <Award className="h-5 w-5 text-amber/40" />
             <div className="h-[1px] w-12 bg-border/30" />
          </div>
        </footer>
      </div>
    </div>
  );
}
