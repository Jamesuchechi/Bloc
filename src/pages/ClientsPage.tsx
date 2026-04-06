import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Users, Plus, ExternalLink, Settings, Building2, Search } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { usePortalStore } from "@/store/portalStore";
import { ClientModal } from "@/modules/portal/components/ClientModal";
import { Client } from "@/modules/portal/api";

export default function ClientsPage() {
  const { user } = useAuth();
  const { clients, fetchClients, isLoading } = usePortalStore();
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    if (user) {
      fetchClients(user.id);
    }
  }, [user, fetchClients]);

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) || 
    (c.company && c.company.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-chalk tracking-tight flex items-center gap-3">
            <Users className="h-8 w-8 text-amber" />
            Clients & Portals
          </h1>
          <p className="text-mist mt-1 text-sm">Manage your client relationships and their dedicated portals.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/60" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search clients..."
              className="pl-10 bg-surface border-border/30"
            />
          </div>
          <Button 
            onClick={() => { setEditingClient(null); setModalOpen(true); }}
            className="bg-amber hover:bg-amber/90 text-ink gap-2 shadow-lg shadow-amber/10"
          >
            <Plus className="h-5 w-5" />
            New Client
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1,2,3].map(i => (
            <div key={i} className="h-48 bg-surface/50 animate-pulse rounded-3xl border border-border/20" />
          ))}
        </div>
      ) : filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredClients.map(client => (
            <div key={client.id} className="group bg-surface/50 border border-border/30 rounded-3xl p-6 hover:bg-surface/80 hover:border-amber/30 transition-all duration-300 flex flex-col h-full">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div 
                    className="h-12 w-12 rounded-2xl flex items-center justify-center font-bold text-lg text-white shadow-lg"
                    style={{ backgroundColor: client.color || '#e8a020' }}
                  >
                    {client.name.substring(0,2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-chalk font-bold text-lg truncate w-32" title={client.name}>{client.name}</h3>
                    {client.company && (
                      <p className="text-mist/70 text-xs flex items-center gap-1.5 mt-0.5 w-32 truncate" title={client.company}>
                        <Building2 className="h-3 w-3 shrink-0" /> {client.company}
                      </p>
                    )}
                  </div>
                </div>
                
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-mist hover:text-chalk bg-surface2/50 border border-border/30"
                  onClick={(e) => { e.preventDefault(); setEditingClient(client); setModalOpen(true); }}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <div className="mt-auto pt-6 flex gap-3">
                <Link to={`/clients/${client.id}`} className="flex-1">
                  <Button className="w-full bg-surface2 hover:bg-surface2/80 text-chalk border border-border/30 gap-2 text-xs">
                    Manage Portal
                  </Button>
                </Link>
                <a 
                  href={`/portal/${client.portal_token}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full border-border/30 hover:border-amber/50 hover:text-amber gap-2 text-xs">
                    <ExternalLink className="h-3.5 w-3.5" /> Client View
                  </Button>
                </a>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface/20 rounded-3xl border border-border/10 border-dashed">
          <Users className="h-12 w-12 text-mist/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-chalk mb-1">No clients found</h3>
          <p className="text-mist/70 mb-6">Add your first client to start building their portal.</p>
          <Button onClick={() => { setEditingClient(null); setModalOpen(true); }} className="bg-surface2 hover:bg-surface2/80 text-chalk border-border/30 shadow">
            <Plus className="h-4 w-4 mr-2" /> Create Client
          </Button>
        </div>
      )}

      <ClientModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        client={editingClient} 
      />
    </div>
  );
}
