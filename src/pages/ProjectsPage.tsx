import React, { useEffect, useState } from "react";
import { 
  Layers, 
  Plus, 
  Search, 
  Circle, 
  Clock, 
  CheckCircle2, 
  Archive, 
  Calendar, 
  User, 
  Building2,
  Trash2,
  ChevronRight,
  Monitor
} from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProjectStore } from "@/store/projectStore";
import { ProjectModal } from "@/modules/projects/components/ProjectModal";
import { Project } from "@/modules/projects/api";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { Link } from "react-router-dom";

export default function ProjectsPage() {
  const { user } = useAuth();
  const { projects, fetchProjects, loading, deleteProject } = useProjectStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'paused' | 'completed' | 'archived'>('all');

  useEffect(() => {
    if (user) {
      fetchProjects(user.id);
    }
  }, [user, fetchProjects]);

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || 
      (p.client?.name && p.client.name.toLowerCase().includes(search.toLowerCase())) ||
      (p.client?.company && p.client.company.toLowerCase().includes(search.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || p.status === activeTab;
    
    return matchesSearch && matchesTab;
  });

  const handleDelete = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This will unlink associated sessions and logs.`)) {
      await deleteProject(id);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Circle className="h-3 w-3 text-emerald-400 fill-emerald-400/20" />;
      case 'paused': return <Clock className="h-3 w-3 text-amber-400" />;
      case 'completed': return <CheckCircle2 className="h-3 w-3 text-blue-400" />;
      case 'archived': return <Archive className="h-3 w-3 text-mist/40" />;
      default: return <Circle className="h-3 w-3 text-mist/40" />;
    }
  };

  const tabs = [
    { id: 'all', label: 'All Projects', icon: Layers },
    { id: 'active', label: 'Active', icon: Circle },
    { id: 'paused', label: 'Paused', icon: Clock },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'archived', label: 'Archived', icon: Archive },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-amber font-black tracking-widest text-[10px] uppercase bg-amber/5 w-fit px-3 py-1 rounded-full border border-amber/10">
            <Layers className="h-3 w-3" />
            Workspace
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-chalk tracking-tighter flex items-center gap-4">
            Projects.
          </h1>
          <p className="text-mist max-w-lg text-sm font-medium opacity-60">Manage your active builds, focus zones, and client deliverables.</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/40" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or client..."
              className="pl-11 h-12 bg-surface2/50 border-border/10 text-chalk focus:border-amber/30 shadow-inner"
            />
          </div>
          <Button 
            onClick={() => { setEditingProject(null); setModalOpen(true); }}
            className="w-full sm:w-auto bg-amber hover:bg-amber/90 text-ink h-12 px-6 font-black uppercase tracking-widest text-xs gap-3 shadow-xl shadow-amber/10 transition-transform active:scale-95"
          >
            <Plus className="h-5 w-5" />
            Deploy Project
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-surface2/30 border border-border/5 rounded-2xl w-fit backdrop-blur-md">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
              activeTab === tab.id 
                ? "bg-amber text-ink shadow-[0_0_20px_rgba(232,160,32,0.2)]" 
                : "text-mist/40 hover:text-mist hover:bg-surface2/50"
            )}
          >
            <tab.icon className={cn("h-3 w-3", activeTab === tab.id ? "" : "opacity-40")} />
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="h-64 bg-surface2/20 animate-pulse rounded-[2.5rem] border border-border/10" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map(project => (
              <ProjectCard 
                key={project.id} 
                project={project} 
                onEdit={() => { setEditingProject(project); setModalOpen(true); }}
                onDelete={() => handleDelete(project.id, project.name)}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div className="text-center py-32 bg-surface2/10 rounded-[3rem] border border-border/5 border-dashed flex flex-col items-center justify-center animate-in fade-in duration-1000">
          <div className="h-24 w-24 rounded-full bg-surface2/50 flex items-center justify-center mb-8 border border-border/10 shadow-inner group">
            <Layers className="h-10 w-10 text-mist/20 group-hover:text-amber/40 transition-colors duration-500" />
          </div>
          <h3 className="text-2xl font-black text-chalk tracking-tight mb-2">Workspace Empty.</h3>
          <p className="text-mist/40 max-w-xs text-center mb-10 text-sm font-medium">You haven't defined any projects yet. Start by deploying your first build space.</p>
          <Button 
            onClick={() => { setEditingProject(null); setModalOpen(true); }} 
            className="h-14 px-10 rounded-2xl bg-surface2 hover:bg-surface2/80 text-chalk border border-border/10 font-black uppercase tracking-widest text-xs gap-3 shadow-2xl transition-all hover:-translate-y-1 active:translate-y-0"
          >
            <Plus className="h-5 w-5 text-amber" /> Create project
          </Button>
        </div>
      )}

      <ProjectModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        project={editingProject} 
      />
    </div>
  );
}

function ProjectCard({ project, onEdit, onDelete }: { project: Project, onEdit: () => void, onDelete: () => void }) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Circle className="h-3 w-3 text-emerald-400 fill-emerald-400/20" />;
      case 'paused': return <Clock className="h-3 w-3 text-amber-400" />;
      case 'completed': return <CheckCircle2 className="h-3 w-3 text-blue-400" />;
      case 'archived': return <Archive className="h-3 w-3 text-mist/40" />;
      default: return <Circle className="h-3 w-3 text-mist/40" />;
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.4 }}
      className="group relative bg-surface/50 border border-border/30 rounded-[2.5rem] p-8 hover:bg-surface/80 hover:border-amber/30 transition-all duration-500 flex flex-col h-full shadow-2xl hover:shadow-amber/5 overflow-hidden"
    >
      {/* Visual Identity Strip */}
      <div 
        className="absolute top-0 right-0 h-24 w-24 -mr-12 -mt-12 rounded-full blur-3xl opacity-0 group-hover:opacity-40 transition-opacity duration-1000"
        style={{ backgroundColor: project.color || '#e8a020' }}
      />
      
      <div className="flex items-start justify-between mb-8 relative z-10">
        <div className="flex items-center gap-5">
          <div 
            className="h-14 w-14 rounded-3xl flex items-center justify-center font-black text-xl text-white shadow-xl transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110"
            style={{ backgroundColor: project.color || '#e8a020', boxShadow: `0 10px 25px -5px ${project.color}40` }}
          >
            {project.name.substring(0,1).toUpperCase()}
          </div>
          <div>
            <h3 className="text-chalk font-black text-xl truncate w-40 group-hover:text-white transition-colors tracking-tight leading-tight" title={project.name}>{project.name}</h3>
            <div className="flex items-center gap-1.5 mt-1">
              {getStatusIcon(project.status)}
              <span className="text-[10px] font-black uppercase tracking-widest text-mist/40">{project.status}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={onEdit}
             className="h-10 w-10 flex items-center justify-center rounded-2xl bg-surface2/50 border border-border/20 text-mist/40 hover:text-chalk hover:border-amber/30 transition-all shadow-inner"
           >
             <Settings className="h-4 w-4" />
           </button>
        </div>
      </div>

      <div className="space-y-6 relative z-10 flex-1">
        {project.client ? (
          <div className="bg-ink/30 border border-border/5 rounded-2xl p-4 transition-colors group-hover:bg-ink/50 group-hover:border-amber/10">
             <div className="flex items-center gap-3">
               <div className="h-10 w-10 rounded-xl bg-surface flex items-center justify-center text-amber border border-border/20">
                 <Building2 className="h-5 w-5" />
               </div>
               <div className="flex flex-col min-w-0">
                 <span className="text-[10px] font-black uppercase tracking-widest text-mist/30">Client Partner</span>
                 <span className="text-xs font-bold text-mist group-hover:text-chalk truncate">{project.client.name}</span>
               </div>
             </div>
          </div>
        ) : (
          <div className="h-14 flex items-center gap-3 px-4 border border-border/5 border-dashed rounded-2xl opacity-40">
             <User className="h-4 w-4 text-mist" />
             <span className="text-xs font-bold text-mist italic">Direct Project</span>
          </div>
        )}

        <div className="flex items-center justify-between text-mist/40 px-2">
          <div className="flex items-center gap-2">
            <Calendar className="h-3 w-3" />
            <span className="text-[10px] font-bold">Initiated {format(new Date(project.created_at), 'MM/YY')}</span>
          </div>
          <button 
            onClick={onDelete}
            className="text-[10px] font-black uppercase tracking-widest hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 flex items-center gap-2"
          >
            <Trash2 className="h-3 w-3" /> Delete
          </button>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-border/10 relative z-10">
         <Link to={`/focus?projectId=${project.id}`}>
            <Button className="w-full h-12 bg-surface2 hover:bg-surface2 hover:text-amber text-mist font-black uppercase tracking-widest text-[10px] border border-border/10 hover:border-amber/40 transition-all rounded-2xl gap-3 group/btn">
              Focus on this build <ChevronRight className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
            </Button>
         </Link>
      </div>
    </motion.div>
  );
}

function Settings({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
