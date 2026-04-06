import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format, subDays, parseISO, isSameDay } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid
} from 'recharts';
import { 
  Timer, 
  Users, 
  ClipboardList, 
  ArrowRight, 
  TrendingUp, 
  Clock,
  Ship,
  Sparkles,
  Github,
  GitCommit,
  RefreshCw,
  Layout
} from "lucide-react";

import { useAppStore } from "../store/appStore";
import { useShipLogStore } from "../store/shipLogStore";
import { usePortalStore } from "../store/portalStore";
import { useProposalStore } from "../store/proposalStore";
import { useIntegrationsStore } from "../store/integrationsStore";
import { githubApi, GitHubCommit } from "../modules/github/api";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { toast } from "react-hot-toast";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function Dashboard() {
  const { user, setActiveModule } = useAppStore();
  const { entries, fetchEntries } = useShipLogStore();
  const { clients, fetchClients } = usePortalStore();
  const { proposals, fetchProposals } = useProposalStore();
  const { integrations, fetchIntegrations } = useIntegrationsStore();
  
  const navigate = useNavigate();
  const [commits, setCommits] = useState<GitHubCommit[]>([]);
  const [isRefreshingGitHub, setIsRefreshingGitHub] = useState(false);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Builder";

  useEffect(() => {
    if (user) {
      fetchEntries(user.id);
      fetchClients(user.id);
      fetchProposals(user.id);
      fetchIntegrations(user.id);
    }
  }, [user, fetchEntries, fetchClients, fetchProposals, fetchIntegrations]);

  const githubIntegration = useMemo(() => 
    integrations.find(i => i.provider === 'github' && i.is_active),
  [integrations]);

  const refreshGitHub = async () => {
    if (!githubIntegration?.config?.token || !githubIntegration?.config?.repo) return;
    setIsRefreshingGitHub(true);
    try {
      const data = await githubApi.fetchRecentCommits(
        githubIntegration.config.repo, 
        githubIntegration.config.token
      );
      setCommits(data);
    } catch (err) {
      // Silence background errors but log for dev
      console.error(err);
    } finally {
      setIsRefreshingGitHub(false);
    }
  };

  useEffect(() => {
    refreshGitHub();
  }, [githubIntegration]);

  // Aggregate stats
  const totalFocusMins = entries.reduce((acc, curr) => acc + (curr.duration_mins || 0), 0);
  const totalFocusHours = (totalFocusMins / 60).toFixed(1);
  const activeProposals = proposals.filter(p => !['declined'].includes(p.status));
  const openValue = activeProposals.reduce((sum, p) => sum + p.total_value, 0);

  // Compute Stacked Velocity Chart (Hours per Project)
  const chartData = useMemo(() => {
    const days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));
    const projectNames = Array.from(new Set(entries.map(e => e.projects?.name || 'General'))).slice(0, 5);
    
    return days.map(day => {
      const data: any = { 
        date: format(day, 'EEE'),
        fullDate: format(day, 'MMM d')
      };
      
      projectNames.forEach(name => {
        const hours = entries
          .filter(e => isSameDay(parseISO(e.date), day) && (e.projects?.name || 'General') === name)
          .reduce((sum, e) => sum + (e.duration_mins || 0), 0) / 60;
        data[name] = Number(hours.toFixed(1));
      });
      
      return data;
    });
  }, [entries]);

  const recentShips = entries.slice(0, 3);
  const chartProjects = Array.from(new Set(entries.map(e => e.projects?.name || 'General'))).slice(0, 5);
  const chartColors = ['#e8a020', '#60a5fa', '#34d399', '#a78bfa', '#f472b6'];

  const stats = [
    { label: "Focus Hours", value: `${totalFocusHours}h`, icon: Clock, trend: "Current", color: "text-amber" },
    { label: "Pipeline Value", value: `$${openValue.toLocaleString()}`, icon: TrendingUp, trend: "Active", color: "text-emerald-400" },
    { label: "Client Base", value: clients.length.toString(), icon: Users, trend: "Total", color: "text-blue-400" },
    { label: "Recent Ships", value: entries.length.toString(), icon: Ship, trend: "Record", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-10 pb-20 relative">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute top-40 right-1/4 w-64 h-64 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
        <div className="space-y-2">
          <Badge variant="amber" className="mb-2 uppercase tracking-[0.2em] text-[10px] px-3 py-1 bg-amber/10 border-amber/20 text-amber font-black">
            <Sparkles className="h-3 w-3 mr-1" /> Dynamic command Center
          </Badge>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-chalk leading-none">
            Sup, <span className="text-amber">{userName}</span>
          </h1>
          <p className="text-mist text-lg font-medium opacity-80">
            Real-time reflection of your developer velocity and business pipeline.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => { setActiveModule("focus"); navigate("/focus"); }} className="h-14 px-8 bg-amber hover:bg-amber/90 text-ink font-black uppercase tracking-widest text-xs shadow-2xl shadow-amber/20 group">
             Start Engine <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-surface/30 border-border/10 backdrop-blur-xl group hover:border-amber/30 transition-all duration-500 cursor-default shadow-2xl">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className={`p-3 rounded-2xl bg-black/40 border border-border/10 ${stat.color} shadow-inner`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest border-border/20 opacity-40 group-hover:opacity-100 transition-opacity">{stat.trend}</Badge>
              </div>
              <div>
                <p className="text-[10px] font-black text-mist/40 uppercase tracking-[0.3em] mb-1">{stat.label}</p>
                <h3 className="text-3xl font-black text-chalk tracking-tighter">{stat.value}</h3>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Main Chart Card */}
        <Card className="lg:col-span-2 bg-surface/20 border-border/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
          <CardHeader className="flex flex-row items-center justify-between border-b border-border/5 pb-8 mb-4">
            <div>
              <CardTitle className="text-2xl font-black tracking-tight flex items-center gap-3 uppercase tracking-widest text-[14px]">
                <TrendingUp className="h-5 w-5 text-amber" /> Focus Distribution
              </CardTitle>
              <CardDescription className="text-mist/60 mt-1 font-medium">Daily productivity hours stacked by project context.</CardDescription>
            </div>
            <div className="flex gap-2">
               {chartProjects.map((p, i) => (
                 <div key={p} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-white/5 border border-white/5">
                   <div className="h-2 w-2 rounded-full" style={{ backgroundColor: chartColors[i % chartColors.length] }} />
                   <span className="text-[10px] font-bold text-mist/80 truncate max-w-[80px]">{p}</span>
                 </div>
               ))}
            </div>
          </CardHeader>
          <CardContent className="h-[340px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 0, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#ffffff0a" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#ffffff33', fontSize: 11, fontWeight: 900 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#ffffff33', fontSize: 11, fontWeight: 900 }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '16px', boxShadow: '0 20px 50px rgba(0,0,0,0.5)', padding: '16px' }}
                  itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                  labelStyle={{ color: '#71717a', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}
                />
                {chartProjects.map((p, i) => (
                  <Bar 
                    key={p} 
                    dataKey={p} 
                    stackId="a" 
                    fill={chartColors[i % chartColors.length]} 
                    radius={i === chartProjects.length - 1 ? [6, 6, 0, 0] : [0, 0, 0, 0]}
                    maxBarSize={50}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* GitHub / Side Column */}
        <div className="space-y-6">
          {/* GitHub Card */}
          <Card className={`relative overflow-hidden bg-black/40 border-border/10 shadow-2xl backdrop-blur-3xl transition-all duration-500 ${!githubIntegration ? 'opacity-60 grayscale' : 'hover:border-amber/20'}`}>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-chalk flex items-center justify-center p-1.5">
                    <Github className="h-full w-full text-ink" />
                  </div>
                  <div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest">Git History</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-amber truncate max-w-[140px]">{githubIntegration?.config?.repo || 'Repo Unlinked'}</CardDescription>
                  </div>
                </div>
                <Button 
                   variant="ghost" 
                   size="icon" 
                   className="h-8 w-8 text-mist" 
                   onClick={refreshGitHub}
                   disabled={isRefreshingGitHub || !githubIntegration}
                >
                  <RefreshCw className={`h-4 w-4 ${isRefreshingGitHub ? 'animate-spin' : ''}`} />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {githubIntegration ? (
                commits.length > 0 ? (
                  commits.map((c, i) => (
                    <div key={i} className="flex gap-3 group">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_rgba(232,160,32,0.8)] mt-1.5" />
                        {i < commits.length - 1 && <div className="w-px flex-1 bg-border/20 my-1" />}
                      </div>
                      <div className="flex-1 min-w-0 pb-3">
                         <p className="text-xs font-bold text-chalk line-clamp-1 group-hover:text-amber transition-colors">{c.commit.message}</p>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-mist/40 font-bold uppercase">{c.author?.login || 'bot'}</span>
                            <span className="text-[9px] text-mist/20 font-bold">•</span>
                            <span className="text-[10px] text-mist/40 font-medium">{format(parseISO(c.commit.author.date), "MMM d, HH:mm")}</span>
                         </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <GitCommit className="h-8 w-8 text-mist/10 mx-auto mb-2" />
                    <p className="text-xs text-mist/40">No recent commits found.</p>
                  </div>
                )
              ) : (
                <div className="text-center py-8">
                   <p className="text-xs text-mist font-medium mb-4">Connect GitHub to see your activity reflected here.</p>
                   <Button 
                      onClick={() => navigate('/integrations')}
                      className="bg-surface2 hover:bg-surface2/80 text-chalk text-[10px] font-black uppercase tracking-widest h-9 px-4"
                    >
                      Configure
                    </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Action */}
          <Card className="bg-gradient-to-br from-indigo-500/10 to-transparent border-border/10 overflow-hidden group cursor-pointer" onClick={() => navigate('/proposals')}>
             <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <ArrowRight className="h-4 w-4 text-mist opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                </div>
                <h4 className="text-chalk font-bold">New Proposal</h4>
                <p className="text-[10px] text-mist/60 mt-1 uppercase font-bold tracking-widest">0 Wins this month</p>
             </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Activity Toggle */}
      <div className="border-t border-border/10 pt-10 flex items-center justify-between opacity-50 hover:opacity-100 transition-opacity">
        <div className="flex items-center gap-3">
          <Layout className="h-5 w-5 text-mist" />
          <span className="text-xs font-black uppercase tracking-[0.2em] text-mist">Interface: Phase 6 Fully Operational</span>
        </div>
        <div className="text-[10px] font-bold text-mist/40">SUPABASE + VITE PROD BUILD</div>
      </div>

    </div>
  );
}
