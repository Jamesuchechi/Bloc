import React, { useState, useEffect } from "react";
import { format, startOfWeek, endOfWeek, subDays } from "date-fns";
import { TrendingUp, Copy, Share2, Mail, ExternalLink, Award, Plus, CheckCircle2 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Button } from "@/components/ui/Button";
import { shiplogApi } from "../api";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const WeeklySummaryPanel: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Calculate current week range
  const now = new Date();
  const weekStart = startOfWeek(now, { weekStartsOn: 1 }); // Monday
  const weekEnd = endOfWeek(now, { weekStartsOn: 1 });

  useEffect(() => {
    if (user) {
      setIsLoading(true);
      shiplogApi.getWeeklyStats(
        user.id, 
        weekStart.toISOString().split("T")[0], 
        weekEnd.toISOString().split("T")[0]
      )
      .then(setStats)
      .catch(console.error)
      .finally(() => setIsLoading(false));
    }
  }, [user]);

  const totalMins = stats.reduce((acc, curr) => acc + (curr.duration_mins || 0), 0);
  const totalHours = (totalMins / 60).toFixed(1);
  const projectStats = stats.reduce((acc: any, curr) => {
    const name = curr.projects?.name || "Uncategorized";
    acc[name] = (acc[name] || 0) + (curr.duration_mins || 0);
    return acc;
  }, {});

  const chartData = Object.entries(projectStats).map(([name, mins]: any) => ({
    name: name.length > 15 ? name.substring(0, 15) + '...' : name,
    hours: Number((mins / 60).toFixed(1)),
    fullProjectName: name
  })).sort((a, b) => b.hours - a.hours);

  const CHAT_COLORS = ['#e8a020', '#f5b544', '#d68f1c', '#c27e16', '#fcd386'];

  const generateSummaryText = () => {
    let summary = `🚢 Weekly Ship Log Summary (${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")})\n\n`;
    summary += `Total Time: ${totalHours} hours\n\n`;
    summary += `Projects:\n`;
    Object.entries(projectStats).forEach(([name, mins]: any) => {
      summary += `- ${name}: ${(mins / 60).toFixed(1)}h\n`;
    });
    return summary;
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateSummaryText());
    toast.success("Summary copied to clipboard");
  };

  const shareSummaryLink = () => {
    if (!user) return;

    const summaryData = {
      ownerName: user.user_metadata?.full_name || user.email?.split('@')[0] || "Independent Builder",
      startDate: weekStart.toISOString(),
      endDate: weekEnd.toISOString(),
      totalHours,
      projectBreakdown: Object.entries(projectStats).reduce((acc: any, [name, mins]: any) => {
        acc[name] = (mins / 60).toFixed(1);
        return acc;
      }, {}),
      highlights: stats.slice(0, 5).map(s => s.description.substring(0, 100) + (s.description.length > 100 ? "..." : ""))
    };

    const encodedData = btoa(JSON.stringify(summaryData));
    const shareUrl = `${window.location.origin}/summary?data=${encodedData}`;
    
    navigator.clipboard.writeText(shareUrl);
    toast.success("Public share link copied to clipboard!");
  };

  return (
    <div className="bg-surface/30 border border-border/20 rounded-3xl p-8 backdrop-blur-xl sticky top-24">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-chalk flex items-center gap-3">
            <TrendingUp className="h-6 w-6 text-amber" />
            Weekly Summary
          </h3>
          <p className="text-sm text-mist/60 mt-1 uppercase tracking-widest font-semibold">
            {format(weekStart, "MMM d")} — {format(weekEnd, "MMM d")}
          </p>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-amber/10 flex items-center justify-center border border-amber/20 shadow-[0_0_20px_rgba(232,160,32,0.1)]">
          <Award className="h-6 w-6 text-amber" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-10">
        <div className="p-4 rounded-2xl bg-ink/40 border border-border/10">
          <div className="text-[10px] font-bold text-mist/40 uppercase tracking-[0.2em] mb-1">Total Hours</div>
          <div className="text-3xl font-black text-chalk tracking-tighter">{totalHours}h</div>
        </div>
        <div className="p-4 rounded-2xl bg-ink/40 border border-border/10">
          <div className="text-[10px] font-bold text-mist/40 uppercase tracking-[0.2em] mb-1">Items Shipped</div>
          <div className="text-3xl font-black text-chalk tracking-tighter">{stats.length}</div>
        </div>
      </div>

      {/* Project Breakdown */}
      <div className="space-y-4 mb-10 w-full">
        <h4 className="text-[10px] font-bold text-mist/60 uppercase tracking-[0.2em]">Project Distribution</h4>
        {chartData.length > 0 ? (
          <div className="h-[200px] w-full mt-4 -ml-4 pr-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#a1a1aa', fontSize: 11, fontWeight: 500 }}
                  width={110}
                />
                <Tooltip 
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#18181b', border: '1px solid #27272a', borderRadius: '12px', fontSize: '12px', color: '#e4e4e7' }}
                  itemStyle={{ color: '#e8a020', fontWeight: 'bold' }}
                />
                <Bar dataKey="hours" radius={[0, 4, 4, 0]} barSize={20}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={CHAT_COLORS[index % CHAT_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-xs text-mist italic">No project data for this week.</p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        <Button 
          variant="outline" 
          onClick={copyToClipboard}
          className="w-full justify-between gap-4 border-border/30 hover:bg-surface2 hover:text-amber transition-all group"
        >
          <div className="flex items-center gap-3">
             <Copy className="h-4 w-4" />
             Copy Summary Text
          </div>
          <CheckCircle2 className="h-4 w-4 opacity-0 group-active:opacity-100 transition-opacity" />
        </Button>
        <Button 
          variant="outline" 
          onClick={shareSummaryLink}
          className="w-full justify-between gap-4 border-border/30 hover:bg-surface2 hover:text-amber transition-all"
        >
          <div className="flex items-center gap-3">
             <Share2 className="h-4 w-4" />
             Public Share Link
          </div>
          <ExternalLink className="h-4 w-4 text-mist/40" />
        </Button>
        <Button 
          variant="ghost" 
          onClick={() => {
            const subject = encodeURIComponent(`Weekly Update: ${format(weekStart, "MMM d")} - ${format(weekEnd, "MMM d")}`);
            const body = encodeURIComponent(generateSummaryText());
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
          }}
          className="w-full justify-start gap-3 text-mist/70 hover:text-amber"
        >
          <Mail className="h-4 w-4" />
          Send to Client via Email
        </Button>
      </div>
      
      <div className="mt-8 pt-8 border-t border-border/10">
        <p className="text-[10px] text-mist/40 text-center leading-relaxed">
          Regularly shipping is the hallmark of a pro. <br />
          Keep building, keep tracking.
        </p>
      </div>
    </div>
  );
};
