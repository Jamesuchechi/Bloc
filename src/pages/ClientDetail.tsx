import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, ExternalLink, Upload, Folder, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { Client, Deliverable, PortalUpdate, portalApi } from "@/modules/portal/api";
import { Project } from "@/modules/focus/api";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import { DeliverableModal } from "@/modules/portal/components/DeliverableModal";
import { UpdateModal } from "@/modules/portal/components/UpdateModal";

export default function ClientDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<string | null>(null);
  
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [updates, setUpdates] = useState<PortalUpdate[]>([]);
  
  const [deliverableModalOpen, setDeliverableModalOpen] = useState(false);
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !id) return;
    
    // Fetch Client data
    portalApi.getClients(user.id).then(clients => {
      const found = clients.find(c => c.id === id);
      if (found) {
        setClient(found);
      } else {
        toast.error("Client not found");
        navigate("/clients");
      }
    });

    // Fetch Client Projects
    portalApi.getClientProjects(id).then(projs => {
      setProjects(projs);
      if (projs.length > 0) setActiveProject(projs[0].id);
    }).finally(() => setIsLoading(false));
  }, [id, user, navigate]);

  useEffect(() => {
    if (activeProject) {
      portalApi.getDeliverables(activeProject).then(setDeliverables);
      portalApi.getPortalUpdates(activeProject).then(setUpdates);
    } else {
      setDeliverables([]);
      setUpdates([]);
    }
  }, [activeProject]);

  if (isLoading) {
    return <div className="animate-pulse h-40 bg-surface rounded-3xl" />;
  }

  if (!client) return null;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Link to="/clients">
          <Button variant="ghost" size="icon" className="h-10 w-10 border border-border/20 bg-surface rounded-full">
            <ArrowLeft className="h-4 w-4 text-mist" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-black text-chalk tracking-tight">{client.name}</h1>
          <a 
            href={`/portal/${client.portal_token}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-amber text-xs font-semibold hover:underline flex items-center gap-1 mt-1"
          >
            <ExternalLink className="h-3 w-3" /> View Public Portal
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar: Projects */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold text-mist/60 uppercase tracking-widest">Client Projects</h3>
          <div className="space-y-2">
            {projects.map(p => (
              <button
                key={p.id}
                onClick={() => setActiveProject(p.id)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all ${
                  activeProject === p.id 
                    ? 'border-amber/40 bg-amber/5 text-amber font-semibold' 
                    : 'border-border/20 bg-surface2/50 text-mist hover:bg-surface2'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Folder className="h-4 w-4" />
                  <span className="truncate">{p.name}</span>
                </div>
              </button>
            ))}
            {projects.length === 0 && (
              <div className="text-mist text-sm bg-surface2/30 p-4 rounded-xl border border-border/10 text-center">
                No assigned projects. Assign them from the Focus module.
              </div>
            )}
          </div>
        </div>

        {/* Main Workspace */}
        <div className="lg:col-span-3 space-y-8">
          {activeProject ? (
            <>
              {/* Deliverables Section */}
              <div className="bg-surface/30 border border-border/20 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-chalk">Deliverables</h2>
                  <Button size="sm" className="bg-amber hover:bg-amber/90 text-ink gap-2"
                    onClick={() => setDeliverableModalOpen(true)}>
                    <Plus className="h-4 w-4" /> Add Deliverable
                  </Button>
                </div>
                
                {deliverables.length === 0 ? (
                  <p className="text-sm text-mist/60 py-4 text-center border border-dashed border-border/30 rounded-xl">No deliverables yet.</p>
                ) : (
                  <div className="space-y-3">
                    {deliverables.map(d => (
                      <div key={d.id} className="flex justify-between items-center p-4 bg-surface2/40 border border-border/20 rounded-xl">
                        <div>
                          <p className="font-semibold text-chalk text-sm">{d.title}</p>
                          <div className="flex gap-2 mt-1 items-center">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                              d.status === 'approved' ? 'bg-green-500/10 text-green-400' :
                              d.status === 'in_review' ? 'bg-amber/10 text-amber' : 
                              'bg-zinc-800 text-mist'
                            }`}>
                              {d.status.replace("_", " ")}
                            </span>
                            {d.file_url && (
                              <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-amber hover:underline flex items-center gap-1">
                                <ExternalLink className="h-3 w-3" /> View Asset
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Updates Section */}
              <div className="bg-surface/30 border border-border/20 rounded-3xl p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-chalk">Portal Updates</h2>
                  <Button size="sm" variant="outline" className="text-mist border-border/30 hover:text-amber gap-2"
                    onClick={() => setUpdateModalOpen(true)}>
                    <Plus className="h-4 w-4" /> New Update
                  </Button>
                </div>

                {updates.length === 0 ? (
                  <p className="text-sm text-mist/60 py-4 text-center border border-dashed border-border/30 rounded-xl">No updates published.</p>
                ) : (
                  <div className="space-y-4">
                    {updates.map(u => (
                      <div key={u.id} className="p-4 bg-surface2/40 border border-border/20 rounded-xl">
                        <p className="text-xs text-mist/50 font-semibold uppercase tracking-widest mb-2">
                          {format(new Date(u.created_at), "MMM d, yyyy")}
                        </p>
                        <p className="text-sm text-chalk">{u.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="h-64 flex flex-col items-center justify-center text-center border border-border/10 rounded-3xl bg-surface/20">
              <Folder className="h-8 w-8 text-mist/30 mb-3" />
              <p className="text-mist font-medium">Select a project to manage its portal content.</p>
            </div>
          )}
        </div>
      </div>

      {activeProject && (
        <>
          <DeliverableModal 
            isOpen={deliverableModalOpen} 
            onClose={() => setDeliverableModalOpen(false)} 
            projectId={activeProject} 
            onSuccess={() => portalApi.getDeliverables(activeProject).then(setDeliverables)}
          />
          <UpdateModal 
            isOpen={updateModalOpen} 
            onClose={() => setUpdateModalOpen(false)} 
            projectId={activeProject} 
            onSuccess={() => portalApi.getPortalUpdates(activeProject).then(setUpdates)}
          />
        </>
      )}
    </div>
  );
}
