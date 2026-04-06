import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipboardList, Plus, Search, FileText, CheckCircle2, XCircle, Send } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProposalStore } from "@/store/proposalStore";
import { usePortalStore } from "@/store/portalStore";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

export default function ProposalsPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { proposals, fetchProposals, isLoading } = useProposalStore();
  const { clients, fetchClients } = usePortalStore();
  
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (user) {
      fetchProposals(user.id);
      fetchClients(user.id);
    }
  }, [user, fetchProposals, fetchClients]);

  const filteredProposals = proposals.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreateNew = async () => {
    if (!user) return;
    try {
      const newProposal = await useProposalStore.getState().createProposal({
        user_id: user.id,
        title: "Untitled Proposal",
        status: "draft",
        total_value: 0
      });
      navigate(`/proposals/${newProposal.id}`);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const getStatusConfig = (status: string) => {
    switch(status) {
      case 'signed': return { icon: CheckCircle2, color: 'text-green-400', bg: 'bg-green-400/10' };
      case 'sent': return { icon: Send, color: 'text-blue-400', bg: 'bg-blue-400/10' };
      case 'viewed': return { icon: FileText, color: 'text-amber', bg: 'bg-amber/10' };
      case 'declined': return { icon: XCircle, color: 'text-red-400', bg: 'bg-red-400/10' };
      default: return { icon: FileText, color: 'text-mist', bg: 'bg-surface2' };
    }
  };

  const getClientName = (clientId: string | null) => {
    if (!clientId) return "No Client Assigned";
    const c = clients.find(c => c.id === clientId);
    return c ? c.name : "Unknown Client";
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-chalk tracking-tight flex items-center gap-3">
            <ClipboardList className="h-8 w-8 text-amber" />
            Proposals
          </h1>
          <p className="text-mist mt-1 text-sm">Create, send, and track professional scopes of work.</p>
        </div>

        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/60" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search proposals..."
              className="pl-10 bg-surface border-border/30"
            />
          </div>
          <Button 
            onClick={handleCreateNew}
            className="bg-amber hover:bg-amber/90 text-ink gap-2 shadow-lg shadow-amber/10"
          >
            <Plus className="h-5 w-5" />
            New Proposal
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1,2,3].map(i => <div key={i} className="h-24 bg-surface/50 animate-pulse rounded-2xl border border-border/20" />)}
        </div>
      ) : filteredProposals.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {filteredProposals.map(proposal => {
            const StatusIcon = getStatusConfig(proposal.status).icon;
            return (
              <Link key={proposal.id} to={`/proposals/${proposal.id}`}>
                <div className="group bg-surface/50 border border-border/30 rounded-2xl p-6 hover:bg-surface/80 hover:border-amber/30 transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-full flex items-center justify-center ${getStatusConfig(proposal.status).bg}`}>
                      <StatusIcon className={`h-5 w-5 ${getStatusConfig(proposal.status).color}`} />
                    </div>
                    <div>
                      <h3 className="text-chalk font-bold text-lg group-hover:text-amber transition-colors">{proposal.title}</h3>
                      <p className="text-mist/70 text-sm flex items-center gap-2 mt-1">
                        <span className="font-semibold text-mist/90">{getClientName(proposal.client_id)}</span>
                        <span>•</span>
                        <span>{format(new Date(proposal.created_at), "MMM d, yyyy")}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6 w-full md:w-auto">
                    <div className="text-left md:text-right flex-1">
                      <p className="text-xs uppercase tracking-widest text-mist/50 font-bold mb-1">Total Value</p>
                      <p className="text-chalk font-bold">${proposal.total_value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    </div>
                    <div className={`hidden md:flex px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold ${getStatusConfig(proposal.status).bg} ${getStatusConfig(proposal.status).color}`}>
                      {proposal.status}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-24 bg-surface/20 rounded-3xl border border-border/10 border-dashed">
          <ClipboardList className="h-12 w-12 text-mist/30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-chalk mb-1">No proposals yet</h3>
          <p className="text-mist/70 mb-6">Create your first proposal to win new business.</p>
          <Button onClick={handleCreateNew} className="bg-surface2 hover:bg-surface2/80 text-chalk border-border/30 shadow">
            <Plus className="h-4 w-4 mr-2" /> Create Proposal
          </Button>
        </div>
      )}
    </div>
  );
}
