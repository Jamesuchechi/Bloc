import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { CheckCircle2, ChevronRight, FileCheck2, Activity, ShieldCheck, Download } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Client, Deliverable, PortalUpdate, portalApi } from "@/modules/portal/api";
import { notificationsApi } from "@/modules/notifications/api";
import { Project } from "@/modules/focus/api";
import { PublicPortalAuth } from "./PublicPortalAuth";
import { toast } from "react-hot-toast";

export default function PublicPortalPage() {
  const { token } = useParams<{ token: string }>();
  
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [deliverables, setDeliverables] = useState<Deliverable[]>([]);
  const [updates, setUpdates] = useState<PortalUpdate[]>([]);
  
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    
    // Initial fetch of the client by token
    portalApi.getPortalByToken(token)
      .then(c => {
        if (!c) {
          toast.error("Invalid portal link");
          setIsLoading(false);
          return;
        }
        setClient(c);
        // If password hash exists, prompt for it. Otherwise, authed.
        if (c.portal_password_hash) {
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      })
      .catch((err) => {
        console.error(err);
        setIsLoading(false);
      });
  }, [token]);

  // Fetch full data once authenticated
  useEffect(() => {
    if (isAuthenticated && client) {
      portalApi.getClientProjects(client.id).then(projs => {
        setProjects(projs);
        // For MVP, just amalgamate all updates and deliverables across all projects
        // Alternatively, builder can select the active project.
        if (projs.length > 0) {
          Promise.all(projs.map(p => portalApi.getDeliverables(p.id)))
            .then(res => setDeliverables(res.flat().sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())));
            
          Promise.all(projs.map(p => portalApi.getPortalUpdates(p.id)))
            .then(res => setUpdates(res.flat().filter(u => u.visible).sort((a,b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())));
        }
      }).finally(() => setIsLoading(false));
    } else if (client && !client.portal_password_hash) {
       setIsLoading(false);
    }
  }, [isAuthenticated, client]);

  const [isVerifying, setIsVerifying] = useState(false);

  const handleAuthenticate = async (password: string) => {
    if (!token) return;
    setIsVerifying(true);
    try {
      const isValid = await portalApi.verifyPortalPassword(token, password);
      if (isValid) {
        setIsAuthenticated(true);
        setAuthError(null);
      } else {
        setAuthError("Incorrect password");
      }
    } catch (e: any) {
      toast.error("Verification failed. Please try again.");
    } finally {
      setIsVerifying(false);
    }
  };

  const markApproved = async (d: Deliverable) => {
    try {
      await portalApi.updateDeliverableStatus(d.id, 'approved');
      
      // Notify the builder
      if (client) {
        await notificationsApi.createNotification({
          user_id: client.user_id,
          type: 'deliverable_approved',
          title: 'Deliverable Approved! ✅',
          message: `${client.name} has approved: "${d.title}"`,
          link: `/clients/${client.id}`
        });
      }

      setDeliverables(prev => prev.map(item => item.id === d.id ? { ...item, status: 'approved', approved_at: new Date().toISOString() } : item));
      toast.success("Deliverable approved!");
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (isLoading && !client) return <div className="min-h-screen bg-ink flex items-center justify-center"><div className="animate-pulse h-12 w-12 rounded-xl bg-surface2" /></div>;
  
  if (!client) return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center text-center p-6">
      <ShieldCheck className="h-16 w-16 text-mist/30 mb-4" />
      <h2 className="text-xl font-bold text-chalk mb-2">Portal Not Found</h2>
      <p className="text-mist">This portal link is invalid or has been revoked.</p>
    </div>
  );

  if (!isAuthenticated) {
    return <PublicPortalAuth clientName={client.name} clientColor={client.color} onAuthenticate={handleAuthenticate} error={authError} />;
  }

  const brandColor = client.color || "#e8a020";

  return (
    <div className="min-h-screen bg-ink text-chalk font-sora antialiased selection:bg-white/20">
      {/* Dynamic Header */}
      <header className="border-b border-white/5 bg-surface/50 backdrop-blur-xl sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center gap-4">
          <div className="h-10 w-10 flex items-center justify-center rounded-xl font-bold text-white shadow-lg" style={{ backgroundColor: brandColor }}>
            {client.name.substring(0, 2).toUpperCase()}
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-black tracking-tight">{client.name} Workspace</h1>
            <p className="text-xs text-mist/60 font-medium">Synced securely via BLOC</p>
          </div>
          {projects.length > 0 && (
             <span className="hidden sm:inline-flex text-[10px] uppercase tracking-widest px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 font-bold">
               {projects.length} Active {projects.length === 1 ? 'Project' : 'Projects'}
             </span>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Deliverables Column */}
        <section className="md:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <FileCheck2 className="h-6 w-6" style={{ color: brandColor }} />
            <h2 className="text-2xl font-bold">Deliverables & Assets</h2>
          </div>

          {deliverables.length === 0 ? (
            <div className="bg-surface/30 border border-white/5 rounded-3xl p-8 text-center text-mist/60 border-dashed">
              No deliverables are currently staged for review.
            </div>
          ) : (
            <div className="space-y-4">
              {deliverables.map(d => (
                <div key={d.id} className="bg-surface border border-white/5 rounded-3xl p-6 shadow-xl transition-all hover:bg-surface2/30">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-bold text-lg leading-tight mb-2">{d.title}</h3>
                      <div className="flex items-center gap-2">
                        {d.status === 'approved' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/10 text-white">
                            Approved <CheckCircle2 className="inline ml-1 h-3 w-3" />
                          </span>
                        )}
                        {d.status === 'in_review' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ backgroundColor: `${brandColor}20`, color: brandColor }}>
                            In Review
                          </span>
                        )}
                        {d.status === 'pending' && (
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-surface2 text-mist">
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex gap-3 w-full sm:w-auto mt-4 sm:mt-0">
                      {d.file_url && (
                        <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="flex-1 sm:flex-none">
                          <Button variant="outline" className="w-full sm:w-auto border-white/10 hover:bg-white/5 text-xs text-mist hover:text-white group transition-colors">
                            <Download className="h-3.5 w-3.5 mr-2 group-hover:scale-110 transition-transform" /> View Asset
                          </Button>
                        </a>
                      )}
                      {d.status !== 'approved' && (
                        <Button 
                          onClick={() => markApproved(d)}
                          className="flex-1 sm:flex-none text-white border-none shadow-lg text-xs"
                          style={{ backgroundColor: brandColor, boxShadow: `0 4px 14px 0 ${brandColor}40` }}
                        >
                          Approve <ChevronRight className="h-3.5 w-3.5 ml-1" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Updates Feed */}
        <aside className="md:col-span-1 border-t md:border-t-0 md:border-l border-white/5 pt-12 md:pt-0 md:pl-8 space-y-6">
          <div className="flex items-center gap-3 mb-8">
            <Activity className="h-5 w-5" style={{ color: brandColor }} />
            <h2 className="text-xl font-bold">Activity Feed</h2>
          </div>

          <div className="relative border-l-2 border-white/5 ml-4 pl-6 space-y-8 pb-8">
            {updates.length === 0 ? (
              <p className="text-sm text-mist/50">No recent updates.</p>
            ) : (
              updates.map(u => (
                <div key={u.id} className="relative">
                  <div className="absolute -left-[30px] top-1.5 h-3 w-3 rounded-full border-2 border-ink" style={{ backgroundColor: brandColor }} />
                  <p className="text-[10px] uppercase tracking-widest text-mist/40 font-bold mb-2">
                    {format(new Date(u.created_at), "MMM d, yyyy")}
                  </p>
                  <div className="bg-surface/50 border border-white/5 p-4 rounded-2xl text-sm leading-relaxed text-mist/90">
                    {u.content}
                  </div>
                </div>
              ))
            )}
          </div>
        </aside>
      </main>
    </div>
  );
}
