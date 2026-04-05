import { useAppStore } from "../store/appStore";
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
  Plus
} from "lucide-react";
import { motion } from "framer-motion";

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
  const { user } = useAppStore();
  const userName = user?.email?.split('@')[0] || "Builder";

  const stats = [
    { label: "Focus Hours", value: "24.5", icon: Clock, trend: "+12%", color: "text-amber" },
    { label: "Active Projects", value: "12", icon: LayoutDashboard, trend: "Stable", color: "text-blue-400" },
    { label: "Total Clients", value: "8", icon: Users, trend: "+2 this month", color: "text-emerald-400" },
    { label: "Open Proposals", value: "3", icon: ClipboardList, trend: "Action required", color: "text-purple-400" },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <Badge variant="amber" className="mb-2 uppercase tracking-widest text-[10px]">Dashboard Overview</Badge>
          <h1 className="text-2xl md:text-4xl font-bold tracking-tight text-chalk leading-tight">
            Welcome back, <span className="text-amber capitalize">{userName}</span>
          </h1>
          <p className="text-mist text-base md:text-lg max-w-2xl mx-auto md:mx-0">
            You've been incredibly productive this week. Here's a snapshot of your progress and upcoming tasks.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button variant="outline" className="gap-2 h-11">
            View Analytics
          </Button>
          <Button className="gap-2 h-11 shadow-[0_0_20px_rgba(232,160,32,0.3)]">
            <Plus className="h-4 w-4" />
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
            <Card className="bg-surface/50 border-border/50 hover:border-amber/50 transition-colors group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg bg-ink/50 ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <Badge variant="outline" className="text-[10px] opacity-70 group-hover:opacity-100 transition-opacity">
                    {stat.trend}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-mist uppercase tracking-wider">{stat.label}</p>
                  <p className="text-3xl font-bold text-chalk">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Focus Entry */}
        <Card className="lg:col-span-2 overflow-hidden border-border/50 bg-surface/30 backdrop-blur-sm relative group">
          <div className="absolute top-0 right-0 p-8 text-amber/10 group-hover:text-amber/20 transition-colors">
             <Timer className="h-48 w-48 -mr-12 -mt-12 transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110" />
          </div>
          
          <CardHeader>
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-amber fill-amber anim-pulse" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-amber">Active Engine</span>
            </div>
            <CardTitle className="text-2xl md:text-3xl font-bold">Start a Focus Session</CardTitle>
            <CardDescription className="text-base md:text-lg max-w-md">
              Ready to build? Select a project and dive into a deep work session.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mt-6">
              <Button size="lg" className="h-14 px-8 font-bold text-lg gap-3">
                <Timer className="h-6 w-6" />
                Go into Deep Work
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8">
                Pick a Project
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Small Progress / Next Steps */}
        <Card className="border-border/50 bg-ink/40">
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-amber" />
              Next Milestones
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Send Proposal to Acme Corp", status: "Overdue", color: "text-red-400" },
              { label: "Finish Focus Redesign", status: "In Progress", color: "text-amber" },
              { label: "Client Portal Sync", status: "Upcoming", color: "text-mist" },
            ].map((task, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-surface/50 border border-border/30">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-chalk leading-none">{task.label}</p>
                  <p className={`text-[10px] font-bold uppercase tracking-tighter ${task.color}`}>{task.status}</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-ink">
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight text-chalk uppercase">Recent Shipments</h2>
          <Button variant="link" className="text-amber">View All Logs</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((_, i) => (
            <Card key={i} className="bg-surface/20 border-border/50 hover:bg-surface/40 transition-all cursor-pointer">
              <CardContent className="p-5">
                <div className="flex justify-between items-start mb-3">
                   <Badge variant="outline">2h 15m</Badge>
                   <span className="text-[10px] text-mist font-medium uppercase">2 hours ago</span>
                </div>
                <h3 className="font-bold text-chalk mb-1">Building the Core Component Library</h3>
                <p className="text-sm text-mist line-clamp-2 italic">
                  "Implemented the stats grid and the quick focus card logic. Feeling good about the UI pace today."
                </p>
                <div className="mt-4 pt-4 border-t border-border/30 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-amber shadow-[0_0_8px_rgba(232,160,32,0.6)]" />
                  <span className="text-[10px] font-bold text-chalk uppercase tracking-widest">Bloc App Project</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
