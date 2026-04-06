import React, { useState, useEffect } from "react";
import { 
  Puzzle, 
  Github, 
  CreditCard, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Save,
  Lock,
  ArrowRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { useIntegrationsStore } from "@/store/integrationsStore";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { toast } from "react-hot-toast";

export default function IntegrationsPage() {
  const { user } = useAuth();
  const { integrations, fetchIntegrations, updateIntegration, isLoading } = useIntegrationsStore();

  const [githubToken, setGithubToken] = useState("");
  const [githubRepo, setGithubRepo] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      fetchIntegrations(user.id);
    }
  }, [user, fetchIntegrations]);

  useEffect(() => {
    const gh = integrations.find(i => i.provider === 'github');
    if (gh) {
      setGithubToken(gh.config.token || "");
      setGithubRepo(gh.config.repo || "");
    }
  }, [integrations]);

  const handleSaveGithub = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await updateIntegration(user.id, 'github', { token: githubToken, repo: githubRepo }, !!githubToken);
      toast.success("GitHub integration updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const providers = [
    { 
      id: 'github', 
      name: 'GitHub', 
      icon: Github, 
      description: 'Track your recent commits and development velocity on the dashboard.', 
      status: integrations.find(i => i.provider === 'github')?.is_active ? 'Connected' : 'Not Connected',
      color: 'text-chalk'
    },
    { 
      id: 'stripe', 
      name: 'Stripe', 
      icon: CreditCard, 
      description: 'Sync your invoices and track revenue directly from your project proposals.', 
      status: 'Coming Soon',
      color: 'text-blue-400'
    },
    { 
      id: 'linear', 
      name: 'Linear', 
      icon: Puzzle, 
      description: 'Sync your project tickets and roadmaps with your BLOC ship logs.', 
      status: 'Coming Soon',
      color: 'text-purple-400'
    }
  ];

  return (
    <div className="space-y-10 pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-chalk tracking-tight flex items-center gap-3">
          <Puzzle className="h-8 w-8 text-amber" />
          Integrations
        </h1>
        <p className="text-mist mt-1 text-sm font-medium">Connect your developer tools to create a unified command center.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Provider List */}
        <div className="lg:col-span-1 space-y-4">
          {providers.map((p) => {
             const isActive = p.status === 'Connected';
             return (
               <Card key={p.id} className={`group bg-surface/30 border-border/20 transition-all duration-300 ${isActive ? 'border-amber/40 shadow-lg shadow-amber/5' : 'hover:border-border/40'}`}>
                 <CardContent className="p-5 flex items-center gap-4">
                    <div className={`h-12 w-12 rounded-xl bg-ink border border-border/10 flex items-center justify-center p-0.5 ${p.color} shadow-inner`}>
                      <p.icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <h3 className="font-bold text-chalk truncate">{p.name}</h3>
                        <Badge variant={isActive ? "amber" : "outline"} className="text-[10px] uppercase font-bold px-2 py-0">
                          {p.status}
                        </Badge>
                      </div>
                      <p className="text-xs text-mist/60 truncate italic">{p.id === 'github' ? 'Dev Repository' : 'Payment Processing'}</p>
                    </div>
                 </CardContent>
               </Card>
             );
          })}
        </div>

        {/* Configuration Area */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* GitHub Config */}
          <Card className="bg-surface/30 border-amber/20 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
               <Github className="h-40 w-40 -mr-10 -mt-10" />
            </div>
            
            <CardHeader className="border-b border-border/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-full bg-chalk p-2 flex items-center justify-center">
                    <Github className="h-6 w-6 text-ink" />
                  </div>
                  <div>
                    <CardTitle>GitHub Integration</CardTitle>
                    <CardDescription>Connect to your repositories to sync ship log activity.</CardDescription>
                  </div>
                </div>
                {integrations.find(i => i.provider === 'github')?.is_active && (
                   <CheckCircle2 className="h-6 w-6 text-amber" />
                )}
              </div>
            </CardHeader>
            
            <CardContent className="p-8 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-mist uppercase tracking-widest flex items-center gap-2">
                    <Lock className="h-3 w-3" /> Personal Access Token
                  </label>
                  <Input 
                    type="password"
                    value={githubToken}
                    onChange={(e) => setGithubToken(e.target.value)}
                    placeholder="ghp_xxxxxxxxxxxx"
                    className="bg-surface2 border-border/30 h-11 focus:border-amber/40 focus:ring-amber/10 font-mono text-xs"
                  />
                  <p className="text-[10px] text-mist/40 italic">Tokens should have 'repo' permissions.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-mist uppercase tracking-widest flex items-center gap-2">
                    <Github className="h-3 w-3" /> Target Repository
                  </label>
                  <Input 
                    value={githubRepo}
                    onChange={(e) => setGithubRepo(e.target.value)}
                    placeholder="username/repository"
                    className="bg-surface2 border-border/30 h-11 focus:border-amber/40 focus:ring-amber/10 font-semibold text-sm"
                  />
                  <p className="text-[10px] text-mist/40 italic">Use the owner/repo format.</p>
                </div>
              </div>

              <div className="p-4 bg-ink/40 rounded-2xl border border-border/10 flex items-start gap-4">
                <AlertCircle className="h-5 w-5 text-amber shrink-0 mt-0.5" />
                <div className="text-xs text-mist leading-relaxed italic">
                  Your token is stored securely but transmitted over HTTPS. Always use a <strong>Fine-grained Personal Access Token</strong> for maximum security and only grant the minimum necessary permissions.
                </div>
              </div>

              <div className="flex justify-end pt-4 border-t border-border/10">
                <Button 
                  onClick={handleSaveGithub}
                  disabled={isSaving || !githubToken || !githubRepo}
                  className="bg-amber hover:bg-amber/90 text-ink font-bold h-12 px-8 gap-2 shadow-lg shadow-amber/10 uppercase tracking-widest text-xs"
                >
                  {isSaving ? "Syncing..." : "Update Integration"}
                  {!isSaving && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Coming Soon Card */}
          <Card className="bg-surface/10 border-border/10 opacity-60 grayscale cursor-not-allowed">
            <CardContent className="p-8 text-center">
               <CreditCard className="h-10 w-10 text-mist mx-auto mb-4 opacity-40" />
               <h3 className="text-chalk font-bold">Stripe Integration Coming Soon</h3>
               <p className="text-sm text-mist/60 mt-1 max-w-sm mx-auto">Soon you will be able to connect your Stripe account to automatically send invoices when proposals are signed.</p>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
