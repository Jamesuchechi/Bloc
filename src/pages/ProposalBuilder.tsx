import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Save, ExternalLink, Calculator, List, Copy, Trash2, GripVertical, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { Proposal, ProposalService, ServiceSnippet, proposalApi } from "@/modules/proposals/api";
import { usePortalStore } from "@/store/portalStore";
import { useProposalStore } from "@/store/proposalStore";
import { toast } from "react-hot-toast";

export default function ProposalBuilder() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { clients, fetchClients } = usePortalStore();
  const { snippets, fetchSnippets } = useProposalStore();
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [services, setServices] = useState<Partial<ProposalService>[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchClients(user.id);
    fetchSnippets(user.id);
  }, [user, fetchClients, fetchSnippets]);

  useEffect(() => {
    if (!id) return;
    
    Promise.all([
      proposalApi.getProposalById(id),
      proposalApi.getServicesForProposal(id)
    ])
    .then(([prop, srvs]) => {
      setProposal(prop);
      setServices(srvs);
    })
    .catch(e => {
      toast.error(e.message);
      navigate('/proposals');
    })
    .finally(() => setIsLoading(false));
  }, [id, navigate]);

  const handlePropChange = (field: keyof Proposal, value: any) => {
    setProposal(prev => prev ? { ...prev, [field]: value } : null);
  };

  const handleServiceChange = (index: number, field: keyof ProposalService, value: any) => {
    setServices(prev => {
      const newSrv = [...prev];
      newSrv[index] = { ...newSrv[index], [field]: value };
      return newSrv;
    });
  };

  const addService = () => {
    setServices(prev => [
      ...prev, 
      { name: "", description: "", quantity: 1, unit_price: 0, position: prev.length }
    ]);
  };

  const removeService = (index: number) => {
    setServices(prev => prev.filter((_, i) => i !== index));
  };
  
  const applySnippet = (snippet: ServiceSnippet) => {
    setServices(prev => [
      ...prev,
      { name: snippet.name, description: snippet.description || "", quantity: 1, unit_price: snippet.unit_price, position: prev.length }
    ]);
    toast.success("Snippet applied");
  };

  const totalValue = services.reduce((acc, s) => acc + ((s.quantity || 1) * (s.unit_price || 0)), 0);

  const saveProposal = async () => {
    if (!proposal || !id) return;
    setIsSaving(true);
    try {
      await proposalApi.updateProposal(id, {
        title: proposal.title,
        client_id: proposal.client_id,
        scope: proposal.scope,
        timeline_start: proposal.timeline_start,
        timeline_end: proposal.timeline_end,
        payment_terms: proposal.payment_terms,
        status: proposal.status,
        total_value: totalValue
      });
      await proposalApi.saveServicesForProposal(id, services);
      toast.success("Proposal saved securely");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSaving(false);
    }
  };

  const renderSnippetsMenu = () => {
     // A very crude dropdown or list for MVP
     if (snippets.length === 0) return <div className="text-xs text-mist p-2">No snippets saved. Run the SQL and create some.</div>;
     return snippets.map(snip => (
       <button key={snip.id} onClick={() => applySnippet(snip)} className="block w-full text-left p-2 hover:bg-surface2 text-xs text-chalk rounded">
         {snip.name} - ${snip.unit_price}
       </button>
     ));
  };

  if (isLoading) return <div className="animate-pulse h-screen w-full bg-ink flex items-center justify-center text-amber">Loading builder...</div>;
  if (!proposal) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-32 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-surface2/30 p-4 rounded-2xl border border-border/20 sticky top-0 z-10 backdrop-blur-md">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <Link to="/proposals">
            <Button variant="ghost" size="icon" className="h-10 w-10 border border-border/20 bg-surface rounded-full">
              <ArrowLeft className="h-4 w-4 text-mist" />
            </Button>
          </Link>
          <Input 
            value={proposal.title} 
            onChange={e => handlePropChange('title', e.target.value)}
            className="text-xl font-bold bg-transparent border-none px-0 h-10 w-full focus:ring-0 max-w-xs"
          />
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="text-right mr-4 hidden md:block">
            <p className="text-[10px] uppercase tracking-widest text-mist/60 font-bold mb-1">Status</p>
            <select
              value={proposal.status}
              onChange={e => handlePropChange('status', e.target.value)}
              className="bg-transparent text-sm text-amber font-semibold focus:outline-none cursor-pointer"
            >
              <option value="draft" className="bg-ink">Draft</option>
              <option value="sent" className="bg-ink">Sent</option>
              <option value="viewed" className="bg-ink">Viewed</option>
              <option value="signed" className="bg-ink">Signed</option>
              <option value="declined" className="bg-ink">Declined</option>
            </select>
          </div>
          <a href={`/proposal/${proposal.share_token}`} target="_blank" rel="noopener noreferrer" className="flex-1">
            <Button variant="outline" className="w-full border-border/30 hover:text-amber gap-2">
              <ExternalLink className="h-4 w-4" /> Preview
            </Button>
          </a>
          <Button onClick={saveProposal} disabled={isSaving} className="flex-1 bg-amber hover:bg-amber/90 text-ink shadow-lg shadow-amber/10 gap-2">
            <Save className="h-4 w-4" /> {isSaving ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Metadata */}
        <div className="space-y-6 lg:col-span-1">
          <div className="bg-surface/50 border border-border/30 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-chalk mb-4 flex items-center gap-2">
              <Settings2 className="h-5 w-5 text-amber" /> Parameters
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-mist/60 uppercase tracking-widest mb-2 block">Client</label>
                <select 
                  value={proposal.client_id || ''} 
                  onChange={e => handlePropChange('client_id', e.target.value || null)}
                  className="w-full h-10 px-3 bg-surface2 border border-border/20 rounded-xl text-sm focus:border-amber/40 focus:outline-none"
                >
                  <option value="">-- No Client Assigned --</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-mist/60 uppercase tracking-widest mb-2 block">Issue Date</label>
                <Input 
                  type="date" 
                  value={proposal.timeline_start || ''} 
                  onChange={e => handlePropChange('timeline_start', e.target.value)}
                  className="bg-surface2 border-border/20" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-mist/60 uppercase tracking-widest mb-2 block">Valid Until</label>
                <Input 
                  type="date" 
                  value={proposal.timeline_end || ''} 
                  onChange={e => handlePropChange('timeline_end', e.target.value)}
                  className="bg-surface2 border-border/20" 
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-mist/60 uppercase tracking-widest mb-2 block">Payment Terms</label>
                <select 
                  value={proposal.payment_terms || 'full'} 
                  onChange={e => handlePropChange('payment_terms', e.target.value)}
                  className="w-full h-10 px-3 bg-surface2 border border-border/20 rounded-xl text-sm focus:border-amber/40 focus:outline-none"
                >
                  <option value="full">100% Upfront</option>
                  <option value="50_50">50% Deposit / 50% on Completion</option>
                  <option value="net_30">Net 30 Days</option>
                  <option value="retainer">Monthly Retainer</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="bg-surface/50 border border-border/30 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-chalk mb-4 flex items-center gap-2">
              <Copy className="h-5 w-5 text-amber" /> Saved Snippets
            </h3>
            <div className="space-y-2 border border-border/20 rounded-xl p-2 bg-black/20">
               {renderSnippetsMenu()}
            </div>
            <p className="text-[10px] text-mist/40 mt-3">Click a snippet to add it as a line item instantly.</p>
          </div>
        </div>

        {/* Right Col: Scope & Items */}
        <div className="space-y-6 lg:col-span-2">
          
          <div className="bg-surface/50 border border-border/30 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-chalk mb-4">Project Scope / Summary</h3>
            <textarea
              value={proposal.scope || ''}
              onChange={e => handlePropChange('scope', e.target.value)}
              placeholder="Provide a high level overview of the project scope. Markdown is officially supported in the public view..."
              className="w-full min-h-[160px] p-4 bg-surface2 border border-border/20 rounded-xl text-sm text-chalk placeholder:text-mist/40 focus:border-amber/40 focus:outline-none resize-y"
            />
          </div>

          <div className="bg-surface/50 border border-border/30 rounded-3xl p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-chalk flex items-center gap-2">
                <List className="h-5 w-5 text-amber" /> Line Items
              </h3>
              <div className="bg-surface2 px-4 py-1.5 rounded-full border border-border/20">
                <span className="text-[10px] uppercase text-mist mr-2 font-bold tracking-widest">Subtotal</span>
                <span className="font-black text-chalk">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
              </div>
            </div>

            <div className="space-y-4">
              {services.map((srv, idx) => (
                <div key={idx} className="group bg-surface2/30 border border-border/20 p-4 rounded-2xl flex gap-4 transition-colors hover:border-border/40">
                  <div className="pt-2 text-mist/30 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
                    <GripVertical className="h-5 w-5" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <Input 
                          value={srv.name} 
                          onChange={e => handleServiceChange(idx, 'name', e.target.value)} 
                          placeholder="Service Name"
                          className="bg-surface border-border/20 h-10 text-sm font-semibold"
                        />
                      </div>
                      <div className="flex gap-2">
                        <div className="w-20">
                          <Input 
                            type="number" 
                            min="1"
                            value={srv.quantity} 
                            onChange={e => handleServiceChange(idx, 'quantity', parseInt(e.target.value))} 
                            className="bg-surface border-border/20 h-10 text-center text-sm"
                          />
                        </div>
                        <div className="w-28 relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-mist text-sm">$</span>
                          <Input 
                            type="number" 
                            min="0"
                            value={srv.unit_price} 
                            onChange={e => handleServiceChange(idx, 'unit_price', parseFloat(e.target.value))} 
                            className="bg-surface border-border/20 h-10 pl-7 text-sm font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                    <div>
                      <Input 
                        value={srv.description || ''} 
                        onChange={e => handleServiceChange(idx, 'description', e.target.value)} 
                        placeholder="Brief description of the deliverable (Optional)"
                        className="bg-surface2/50 border-transparent focus:border-border/20 text-xs h-8 text-mist"
                      />
                    </div>
                  </div>
                  <div className="pt-1">
                    <Button variant="ghost" size="icon" onClick={() => removeService(idx)} className="text-mist hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={addService} variant="outline" className="w-full mt-6 border-dashed border-border/30 text-mist hover:text-amber hover:border-amber/40">
              <Plus className="h-4 w-4 mr-2" /> Add Custom Line Item
            </Button>

          </div>

        </div>
      </div>
    </div>
  );
}
