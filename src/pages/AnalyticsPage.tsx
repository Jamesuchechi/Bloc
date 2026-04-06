import React, { useEffect, useMemo, useState } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid, 
  AreaChart, Area, PieChart, Pie, Sector
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Clock, 
  Target, 
  Zap, 
  Calendar,
  Users,
  Briefcase,
  ArrowUpRight,
  ArrowDownRight,
  Calculator
} from "lucide-react";
import { format, subDays, parseISO, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from "date-fns";
import { motion } from "framer-motion";

import { useAppStore } from "../store/appStore";
import { useShipLogStore } from "../store/shipLogStore";
import { usePortalStore } from "../store/portalStore";
import { useProposalStore } from "../store/proposalStore";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const COLORS = ['#e8a020', '#60a5fa', '#34d399', '#a78bfa', '#f472b6', '#fbbf24'];

export default function AnalyticsPage() {
  const { user } = useAppStore();
  const { entries, fetchEntries } = useShipLogStore();
  const { clients, fetchClients } = usePortalStore();
  const { proposals, fetchProposals } = useProposalStore();

  const [timeRange, setTimeRange] = useState<'7d' | '30d' | 'all'>('30d');

  useEffect(() => {
    if (user) {
      fetchEntries(user.id);
      fetchClients(user.id);
      fetchProposals(user.id);
    }
  }, [user, fetchEntries, fetchClients, fetchProposals]);

  // --- KPI CALCULATIONS ---
  const totalHours = useMemo(() => 
    (entries.reduce((acc, curr) => acc + (curr.duration_mins || 0), 0) / 60).toFixed(1),
  [entries]);

  const signedValue = useMemo(() => 
    proposals.filter(p => p.status === 'signed').reduce((sum, p) => sum + p.total_value, 0),
  [proposals]);

  const conversionRate = useMemo(() => {
    const total = proposals.length;
    if (total === 0) return 0;
    const signed = proposals.filter(p => p.status === 'signed').length;
    return ((signed / total) * 100).toFixed(1);
  }, [proposals]);

  // --- CHART DATA: FOCUS TREND ---
  const focusTrendData = useMemo(() => {
    const range = timeRange === '7d' ? 7 : 30;
    const interval = Array.from({ length: range }).map((_, i) => subDays(new Date(), (range - 1) - i));
    
    return interval.map(day => {
      const dayEntries = entries.filter(e => isSameDay(parseISO(e.date), day));
      const hours = dayEntries.reduce((sum, e) => sum + (e.duration_mins || 0), 0) / 60;
      return {
        date: format(day, 'MMM d'),
        hours: Number(hours.toFixed(1))
      };
    });
  }, [entries, timeRange]);

  // --- CHART DATA: PROJECT ALLOCATION ---
  const projectData = useMemo(() => {
    const map: Record<string, number> = {};
    entries.forEach(e => {
      const name = e.projects?.name || 'General';
      map[name] = (map[name] || 0) + (e.duration_mins || 0) / 60;
    });
    return Object.entries(map).map(([name, value]) => ({ name, value: Number(value.toFixed(1)) }));
  }, [entries]);

  // --- CHART DATA: PROPOSAL FUNNEL ---
  const funnelData = useMemo(() => [
    { name: 'Draft', count: proposals.filter(p => p.status === 'draft').length },
    { name: 'Sent', count: proposals.filter(p => p.status === 'sent' || p.status === 'viewed').length },
    { name: 'Signed', count: proposals.filter(p => p.status === 'signed').length },
    { name: 'Declined', count: proposals.filter(p => p.status === 'declined').length },
  ], [proposals]);

  // --- ANALYTICS INSIGHTS ---
  const avgSession = useMemo(() => {
    if (entries.length === 0) return 0;
    return Math.round(entries.reduce((acc, curr) => acc + (curr.duration_mins || 0), 0) / entries.length);
  }, [entries]);

  const mostProductiveDay = useMemo(() => {
    const daysMap: Record<string, number> = {};
    entries.forEach(e => {
      const day = format(parseISO(e.date), 'EEEE');
      daysMap[day] = (daysMap[day] || 0) + (e.duration_mins || 0);
    });
    const sorted = Object.entries(daysMap).sort((a,b) => b[1] - a[1]);
    return sorted[0]?.[0] || 'N/A';
  }, [entries]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-chalk tracking-tighter flex items-center gap-4">
            <BarChart3 className="h-10 w-10 text-amber" />
            Analytics Hub
          </h1>
          <p className="text-mist mt-1 text-lg font-medium opacity-70 italic">Quantify your productivity and business velocity.</p>
        </div>
        
        <div className="flex bg-surface/40 p-1.5 rounded-2xl border border-border/10 backdrop-blur-md">
          {(['7d', '30d', 'all'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${timeRange === r ? 'bg-amber text-ink' : 'text-mist hover:text-chalk'}`}
            >
              {r === 'all' ? 'All Time' : r}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Section */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPI className="border-amber/20" icon={Clock} label="Focus Time" value={`${totalHours}h`} trend="+12% vs last month" color="text-amber" />
        <KPI icon={Briefcase} label="Pipeline Value" value={`$${signedValue.toLocaleString()}`} trend="Revenue generated" color="text-emerald-400" />
        <KPI icon={Target} label="Conversion" value={`${conversionRate}%`} trend="Proposals signed" color="text-blue-400" />
        <KPI icon={Users} label="Active Clients" value={clients.length.toString()} trend="Managed builders" color="text-purple-400" />
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Productivity Trend Chart */}
        <Card className="lg:col-span-2 bg-surface/20 border-border/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
          <CardHeader className="pb-8">
            <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-widest">
              <TrendingUp className="h-5 w-5 text-amber" /> Productivity Trend
            </CardTitle>
            <CardDescription>Daily focus hours across the {timeRange === '7d' ? 'last week' : 'last 30 days'}.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={focusTrendData}>
                <defs>
                  <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#e8a020" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#e8a020" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff0a" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#ffffff33', fontSize: 10, fontWeight: 900}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#ffffff33', fontSize: 10, fontWeight: 900}} dx={-10} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  labelStyle={{ color: '#71717a', fontWeight: 'bold', marginBottom: '4px', textTransform: 'uppercase', fontSize: '10px' }}
                />
                <Area type="monotone" dataKey="hours" stroke="#e8a020" strokeWidth={4} fillOpacity={1} fill="url(#colorHours)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Project Distribution Chart */}
        <Card className="bg-surface/20 border-border/10 backdrop-blur-3xl shadow-2xl">
          <CardHeader>
            <CardTitle className="text-xl font-black flex items-center gap-3 uppercase tracking-widest text-[14px]">
               <Zap className="h-5 w-5 text-amber" /> Allocation
            </CardTitle>
            <CardDescription>Ship time per project.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={projectData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {projectData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="grid grid-cols-2 gap-2 mt-2">
              {projectData.slice(0, 4).map((p, i) => (
                <div key={p.name} className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-[10px] font-bold text-mist truncate">{p.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
         
         {/* Proposal Funnel */}
         <Card className="bg-surface/20 border-border/10 backdrop-blur-3xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-xl font-black uppercase tracking-widest text-[14px]">Proposal Pipeline</CardTitle>
              <CardDescription>Visualizing your business conversion funnel.</CardDescription>
            </CardHeader>
            <CardContent className="h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical" margin={{ left: 20 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#fff', fontSize: 12, fontWeight: 'bold'}} />
                  <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{backgroundColor: '#18181b', border: '1px solid #27272a'}} />
                  <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                    {funnelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.name === 'Signed' ? '#34d399' : '#ffffff20'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
         </Card>

         {/* Advanced Insights */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <InsightCard icon={Calendar} label="Prime Day" value={mostProductiveDay} sub="Most hours logged" />
            <KPI icon={Clock} label="Avg Session" value={`${avgSession}m`} trend="Deep work average" color="text-amber" />
            <div className="md:col-span-2 p-6 bg-gradient-to-br from-amber/20 via-surface to-surface border border-border/10 rounded-3xl flex items-center justify-between group cursor-pointer hover:border-amber/40 transition-all">
                <div>
                   <h4 className="font-black text-chalk text-lg tracking-tight">Generate Monthly Report</h4>
                   <p className="text-mist/60 text-xs font-medium mt-1">Export your structured productivity data to a professional PDF.</p>
                </div>
                <div className="h-12 w-12 rounded-2xl bg-amber text-ink flex items-center justify-center shadow-2xl shadow-amber/20 group-hover:scale-110 transition-transform">
                   <ArrowUpRight className="h-6 w-6 stroke-[3px]" />
                </div>
            </div>
         </div>

      </div>

    </div>
  );
}

function KPI({ icon: Icon, label, value, trend, color, className }: any) {
  return (
    <Card className={`bg-surface/30 border-border/10 backdrop-blur-xl group hover:border-border/30 transition-all duration-500 overflow-hidden relative shadow-2xl ${className}`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${color} opacity-5 rounded-full blur-3xl`} />
      <CardContent className="p-6 relative z-10">
        <div className="flex justify-between items-start mb-4">
          <div className={`p-3 rounded-2xl bg-ink/60 border border-border/10 ${color} shadow-inner`}>
            <Icon className="h-5 w-5" />
          </div>
          <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-border/20 opacity-40 group-hover:opacity-100 transition-opacity">Real-time</Badge>
        </div>
        <div className="space-y-1">
          <p className="text-[10px] font-black text-mist/40 uppercase tracking-[0.3em]">{label}</p>
          <h3 className="text-4xl font-black text-chalk tracking-tighter drop-shadow-lg">{value}</h3>
          <p className="text-[10px] font-bold text-mist/60">{trend}</p>
        </div>
      </CardContent>
    </Card>
  );
}

function InsightCard({ icon: Icon, label, value, sub }: any) {
  return (
    <Card className="bg-surface/20 border-border/10 backdrop-blur-xl group hover:border-amber/20 transition-all shadow-xl">
       <CardContent className="p-6 flex items-center gap-4">
          <div className="h-12 w-12 rounded-2xl bg-surface2 border border-border/10 flex items-center justify-center text-mist group-hover:text-amber transition-colors">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-mist/40 uppercase tracking-widest">{label}</p>
            <h4 className="text-xl font-black text-chalk leading-none mt-1">{value}</h4>
            <p className="text-[10px] text-mist/40 mt-1 font-bold italic">{sub}</p>
          </div>
       </CardContent>
    </Card>
  );
}
