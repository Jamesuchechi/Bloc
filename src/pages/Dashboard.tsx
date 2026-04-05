import React, { useEffect } from "react";
import { useAppStore } from "../store/appStore";
import { useShipLogStore } from "../store/shipLogStore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { 
  Timer, 
  LayoutDashboard, 
  Users, 
  ClipboardList, 
  ArrowRight, 
  Zap, 
  TrendingUp, 
  Clock,
  Plus,
  Ship,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow, parseISO } from "date-fns";

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { user, setActiveModule } = useAppStore();
  const { entries, fetchEntries, isLoading } = useShipLogStore();
  const navigate = useNavigate();
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Builder";

  useEffect(() => {
    if (user) {
      fetchEntries(user.id);
    }
  }, [user, fetchEntries]);

  const recentShips = entries.slice(0, 3);
  
  const totalFocusMins = entries.reduce((acc, curr) => acc + (curr.duration_mins || 0), 0);
  const totalFocusHours = (totalFocusMins / 60).toFixed(1);

  const stats = [
    { label: "Focus Hours", value: `${totalFocusHours}h`, icon: Clock, trend: "This Week", color: "text-amber" },
    { label: "Items Shipped", value: entries.length.toString(), icon: Ship, trend: "Total", color: "text-blue-400" },
    { label: "Active Projects", value: "3", icon: LayoutDashboard, trend: "Stable", color: "text-emerald-400" },
    { label: "Open Proposals", value: "0", icon: ClipboardList, trend: "Coming Soon", color: "text-purple-400" },
  ];

  const handleGoToFocus = () => {
    setActiveModule("focus");
    navigate("/focus");
  };

  const handleGoToLog = () => {
    setActiveModule("log");
    navigate("/log");
  };

  return (
    <div className="space-y-10 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <Badge variant="amber" className="mb-2 uppercase tracking-widest text-[10px] px-3 py-1 bg-amber/10 border-amber/20 text-amber font-bold">Command Center</Badge>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-chalk leading-tight">
            Welcome back, <span className="text-amber capitalize">{userName}</span>
          </h1>
          <p className="text-mist text-base md:text-lg max-w-2xl mx-auto md:mx-0 font-medium">
            Your productivity engine is primed. You've clocked <span className="text-chalk font-bold">{totalFocusHours} hours</span> this week. Keep shipping.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="outline" onClick={handleGoToLog} className="gap-2 h-12 px-6 border-border/50 hover:bg-surface2 transition-all font-bold uppercase tracking-widest text-xs">
            Ship Logs
          </Button>
          <Button className="gap-2 h-12 px-6 bg-amber hover:bg-amber/90 text-ink font-black uppercase tracking-widest text-xs shadow-[0_0_30px_rgba(232,160,32,0.2)]">
            <Plus className="h-4 w-4 stroke-[3px]" />
            New Project
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {stats.map((stat, idx) => (
          <motion.div key={idx} variants={item}>
            <Card className="bg-surface/30 border-border/20 hover:border-amber/30 transition-all duration-300 group hover:translate-y-[-4px] backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2.5 rounded-xl bg-ink/60 border border-border/10 ${stat.color} shadow-inner`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold opacity-60 group-hover:opacity-100 transition-opacity border-border/30">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-bold text-mist uppercase tracking-[0.2em]">{stat.label}</p>
                  <p className="text-3xl font-black text-chalk tracking-tighter">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Focus Entry */}
        <Card className="lg:col-span-2 overflow-hidden border-border/20 bg-surface/30 backdrop-blur-md relative group min-h-[320px] flex flex-col justify-center">
          <div className="absolute top-0 right-0 p-8 text-amber/5 group-hover:text-amber/10 transition-colors pointer-events-none">
             <Timer className="h-80 w-80 -mr-20 -mt-20 transition-transform duration-700 group-hover:rotate-12 group-hover:scale-110" />
          </div>
          
          <CardHeader className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-2 w-2 rounded-full bg-amber animate-pulse shadow-[0_0_10px_rgba(232,160,32,0.8)]" />
              <span className="text-xs font-black uppercase tracking-[0.3em] text-amber">Active Engine</span>
            </div>
            <CardTitle className="text-3xl md:text-5xl font-black tracking-tighter mb-4">Launch into <br/> <span className="text-amber">Deep Work.</span></CardTitle>
            <CardDescription className="text-base md:text-xl max-w-md text-mist font-medium leading-relaxed">
              Quiet the noise. Focus on what matters. Your next big ship starts with a single timer.
            </CardDescription>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="flex flex-col sm:flex-row gap-4 mt-4">
              <Button onClick={handleGoToFocus} size="lg" className="h-14 px-10 font-black text-lg gap-3 bg-amber hover:bg-amber/90 text-ink shadow-2xl shadow-amber/20 uppercase tracking-widest">
                <Timer className="h-6 w-6 stroke-[2.5px]" />
                Start Session
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 border-border/50 hover:bg-surface2 text-chalk font-bold">
                Project Roadmap
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Small Progress / Next Steps */}
        <Card className="border-border/20 bg-ink/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-3 font-bold">
              <TrendingUp className="h-5 w-5 text-amber" />
              Next Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Ship Log Redesign", status: "Completed", color: "text-emerald-400" },
              { label: "Client Portal Module", status: "Phase 4", color: "text-amber" },
              { label: "Proposal Engine", status: "Phase 5", color: "text-mist/40" },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-surface/40 border border-border/10 group hover:border-amber/20 transition-all cursor-default">
                <div className="space-y-1">
                  <p className="text-sm font-bold text-chalk leading-none">{task.label}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${task.color}`}>{task.status}</p>
                </div>
                <div className="h-8 w-8 rounded-full bg-ink/50 flex items-center justify-center border border-border/10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRight className="h-4 w-4 text-amber" />
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-[0.2em] text-mist/60 hover:text-amber">View Vision Board</Button>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-6 pt-6">
        <div className="flex items-center justify-between border-b border-border/10 pb-4">
          <div className="flex items-center gap-3">
            <Ship className="h-6 w-6 text-amber" />
            <h2 className="text-xl md:text-2xl font-black tracking-tight text-chalk uppercase tracking-[0.1em]">Recent Ships</h2>
          </div>
          <Button variant="link" onClick={handleGoToLog} className="text-amber font-bold flex items-center gap-2 group">
            All Records
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
        
        {recentShips.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentShips.map((entry) => (
              <Card key={entry.id} className="bg-surface/20 border-border/20 hover:bg-surface/30 hover:border-amber/20 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                     <Badge variant="outline" className="font-bold border-border/30 bg-ink/40">{entry.duration_mins || 0}m</Badge>
                     <span className="text-[10px] text-mist/60 font-bold uppercase tracking-widest">
                       {formatDistanceToNow(parseISO(entry.date), { addSuffix: true })}
                     </span>
                  </div>
                  <h3 className="font-bold text-chalk mb-2 group-hover:text-amber transition-colors line-clamp-1">{entry.description.substring(0, 60)}...</h3>
                  <p className="text-sm text-mist/70 line-clamp-2 italic mb-4 leading-relaxed">
                    {entry.description}
                  </p>
                  <div className="pt-4 border-t border-border/10 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-amber shadow-[0_0_8px_rgba(232,160,32,0.6)]" />
                    <span className="text-[10px] font-bold text-chalk uppercase tracking-widest">
                      {entry.projects?.name || "General Work"}
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-12 text-center bg-surface/10 border-2 border-dashed border-border/20 rounded-3xl">
            <p className="text-mist font-medium">No shipments recorded yet. Start focusing to see your logs here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
