import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { Printer, CheckCircle, Clock, ShieldCheck, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Proposal, ProposalService, proposalApi } from "@/modules/proposals/api";
import { notificationsApi } from "@/modules/notifications/api";
import { Client } from "@/modules/portal/api";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { format } from "date-fns";
import ReactMarkdown from 'react-markdown';

export default function PublicProposalPage() {
  const { token } = useParams<{ token: string }>();
  
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [services, setServices] = useState<ProposalService[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [builderName, setBuilderName] = useState("BLOC Professional");
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [signedName, setSignedName] = useState("");
  
  useEffect(() => {
    if (!token) return;
    
    // Fetch Proposal
    proposalApi.getProposalByToken(token)
      .then(async (prop) => {
        setProposal(prop);
        const srvs = await proposalApi.getServicesForProposal(prop.id);
        setServices(srvs);
        
        // Fetch Client info if attached
        if (prop.client_id) {
          const { data: clientData } = await supabase.from('clients').select('*').eq('id', prop.client_id).single();
          if (clientData) setClient(clientData);
        }
        
        // Fetch Builder info (User)
        const { data: userData } = await supabase.from('users').select('full_name').eq('id', prop.user_id).single();
        if (userData && userData.full_name) setBuilderName(userData.full_name);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Invalid proposal link");
      })
      .finally(() => setIsLoading(false));
  }, [token]);

  const handleSign = async () => {
    if (!signedName.trim()) {
      toast.error("Please enter your legal name to sign.");
      return;
    }
    if (!proposal) return;
    
    setIsSigning(true);
    try {
      await proposalApi.signProposal(proposal.id, signedName);
      
      // Notify the builder
      await notificationsApi.createNotification({
        user_id: proposal.user_id,
        type: 'proposal_signed',
        title: 'Proposal Signed! ✍️',
        message: `${signedName} has just signed the proposal: "${proposal.title}"`,
        link: `/proposals/${proposal.id}`
      });

      setProposal({ ...proposal, status: 'signed', signed_name: signedName, signed_at: new Date().toISOString() });
      toast.success("Proposal successfully signed and accepted!");
    } catch (e: any) {
      toast.error(e.message);
    } finally {
      setIsSigning(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) return <div className="min-h-screen bg-white flex items-center justify-center"><div className="animate-pulse h-12 w-12 rounded-xl bg-zinc-200" /></div>;
  if (!proposal) return <div className="min-h-screen bg-white flex items-center justify-center text-zinc-500 font-sora">Proposal not found.</div>;

  const totalValue = proposal.total_value;
  const isSigned = proposal.status === 'signed';

  return (
    <div className="min-h-screen bg-zinc-50 font-sora text-zinc-900 selection:bg-amber/20 print:bg-white print:text-black pb-32">
      
      {/* Floating Action Bar (Hidden in Print) */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-zinc-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 print:hidden border border-zinc-800">
        <span className="text-xs font-bold uppercase tracking-widest text-zinc-400">Total:</span>
        <span className="font-black">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
        <div className="w-px h-6 bg-zinc-800 mx-2" />
        <Button onClick={handlePrint} variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-full h-8 w-8">
          <Printer className="h-4 w-4" />
        </Button>
      </div>

      <main className="max-w-4xl mx-auto pt-16 px-6 sm:px-12 print:pt-0 print:px-0">
        
        {/* Proposal Header */}
        <header className="border-b border-zinc-200 pb-12 mb-12 flex flex-col md:flex-row justify-between items-start md:items-end gap-8">
          <div>
            <h1 className="text-5xl font-black tracking-tight mb-4">{proposal.title}</h1>
            <p className="text-lg text-zinc-500">Prepared for <span className="font-bold text-zinc-900">{client ? client.name : "Valued Client"}</span></p>
            {client?.company && <p className="text-zinc-500">{client.company}</p>}
          </div>
          <div className="text-left md:text-right space-y-1">
            <p className="text-sm font-bold text-zinc-900">{builderName}</p>
            {proposal.timeline_start && (
              <p className="text-sm text-zinc-500">Issued: {format(new Date(proposal.timeline_start), "MMM d, yyyy")}</p>
            )}
            {proposal.timeline_end && (
              <p className="text-sm text-zinc-500">Valid Until: {format(new Date(proposal.timeline_end), "MMM d, yyyy")}</p>
            )}
          </div>
        </header>

        {isSigned && (
          <div className="mb-12 bg-green-50 border border-green-200 text-green-800 p-6 rounded-2xl flex items-start gap-4 print:border-zinc-300 print:text-black print:bg-white">
            <CheckCircle className="h-6 w-6 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-bold text-lg">Proposal Accepted</h3>
              <p className="text-sm opacity-80 mt-1">
                Digitally signed by {proposal.signed_name} on {format(new Date(proposal.signed_at!), "MMMM d, yyyy 'at' h:mm a")}.
              </p>
            </div>
          </div>
        )}

        {/* Scope Context */}
        {proposal.scope && (
          <section className="mb-16 prose prose-zinc max-w-none prose-headings:font-black prose-a:text-amber">
            <ReactMarkdown>{proposal.scope}</ReactMarkdown>
          </section>
        )}

        {/* Breakdown Table */}
        <section className="mb-16">
          <h3 className="text-2xl font-black mb-6">Investment Overview</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-zinc-900">
                  <th className="pb-4 font-bold text-zinc-900">Service Line Item</th>
                  <th className="pb-4 font-bold text-zinc-900 text-right w-24">Qty</th>
                  <th className="pb-4 font-bold text-zinc-900 text-right w-32">Unit Price</th>
                  <th className="pb-4 font-bold text-zinc-900 text-right w-32">Line Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {services.map(s => {
                  const lineTotal = (s.quantity || 1) * (s.unit_price || 0);
                  return (
                    <tr key={s.id} className="group">
                      <td className="py-6 pr-4">
                        <p className="font-bold text-zinc-900">{s.name}</p>
                        {s.description && <p className="text-sm text-zinc-500 mt-1 max-w-lg">{s.description}</p>}
                      </td>
                      <td className="py-6 text-right text-zinc-600 align-top">{s.quantity}</td>
                      <td className="py-6 text-right text-zinc-600 align-top">${(s.unit_price || 0).toLocaleString()}</td>
                      <td className="py-6 text-right font-bold text-zinc-900 align-top">${lineTotal.toLocaleString()}</td>
                    </tr>
                  )
                })}
              </tbody>
              <tfoot className="border-t-2 border-zinc-900">
                <tr>
                  <td colSpan={3} className="pt-6 text-right text-sm font-bold uppercase tracking-widest text-zinc-500">Total Investment</td>
                  <td className="pt-6 text-right text-2xl font-black text-zinc-900">${totalValue.toLocaleString(undefined, {minimumFractionDigits: 2})}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </section>

        {/* Terms Box */}
        <section className="mb-24 p-8 bg-zinc-100 rounded-3xl print:border print:border-zinc-300 print:bg-white text-sm">
          <h4 className="font-bold mb-4 flex items-center gap-2"><Clock className="h-4 w-4" /> Payment Terms</h4>
          <p className="text-zinc-600 leading-relaxed">
            {proposal.payment_terms === 'full' ? "100% upfront payment required to commence work." :
             proposal.payment_terms === '50_50' ? "50% non-refundable deposit to commence work, followed by 50% upon final delivery." :
             proposal.payment_terms === 'net_30' ? "Invoices will be drafted upon completion, payable Net 30 days." :
             "Monthly ongoing retainer arrangement."}
          </p>
        </section>

        {/* Signature Area (Hidden in Print) */}
        {!isSigned && (
          <section className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl print:hidden">
            <h3 className="text-2xl font-black mb-2">Ready to move forward?</h3>
            <p className="text-zinc-400 mb-8">By typing your legal name below, you officially accept this proposal, scope, and the attached payment terms.</p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-xl">
              <Input
                value={signedName}
                onChange={e => setSignedName(e.target.value)}
                placeholder="Type your full legal name"
                className="bg-zinc-800 border-zinc-700 h-14 text-white focus:border-amber focus:ring-amber/20"
              />
              <Button 
                onClick={handleSign} 
                disabled={isSigning || !signedName.trim()} 
                className="h-14 px-8 bg-amber hover:bg-amber/90 text-zinc-900 font-bold whitespace-nowrap"
              >
                {isSigning ? "Signing..." : "Sign & Accept"}
              </Button>
            </div>
            <p className="text-xs text-zinc-500 flex items-center gap-1 mt-6">
              <ShieldCheck className="h-3 w-3" /> Legally binding digital acceptance via BLOC.
            </p>
          </section>
        )}

      </main>
    </div>
  );
}
