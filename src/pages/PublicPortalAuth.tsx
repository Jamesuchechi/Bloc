import React, { useState } from "react";
import { Lock, ArrowRight, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface PublicPortalAuthProps {
  clientName: string;
  clientColor: string | null;
  onAuthenticate: (password: string) => void;
  error?: string | null;
}

export const PublicPortalAuth: React.FC<PublicPortalAuthProps> = ({ 
  clientName, 
  clientColor, 
  onAuthenticate,
  error
}) => {
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAuthenticate(password);
  };

  const brandColor = clientColor || "#e8a020";

  return (
    <div className="min-h-screen flex items-center justify-center bg-ink p-4 font-sora antialiased font-semibold">
      <div className="w-full max-w-md">
        <div className="bg-surface border border-border/30 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle brand glow */}
          <div 
            className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3"
            style={{ backgroundColor: brandColor }}
          />

          <div className="mb-8 text-center">
            <div 
              className="mx-auto h-16 w-16 rounded-2xl flex items-center justify-center mb-6 shadow-xl"
              style={{ backgroundColor: brandColor, boxShadow: `0 10px 30px -10px ${brandColor}` }}
            >
              <ShieldCheck className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-chalk">{clientName} Portal</h1>
            <p className="text-mist/70 mt-2 text-sm leading-relaxed">
              This workspace is protected. Please enter the portal password to access project updates and deliverables.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative group">
              <Lock 
                className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/50 group-focus-within:text-white transition-colors" 
              />
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Portal Password"
                required
                autoFocus
                className="pl-12 h-14 bg-surface2 text-chalk border-border/20 focus:border-white focus:ring-0 rounded-xl w-full"
                style={{ '--tw-ring-color': 'transparent' } as any}
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 font-bold text-center uppercase tracking-widest">{error}</p>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-white hover:opacity-90 font-bold tracking-wide shadow-lg border-none"
              style={{ backgroundColor: brandColor, boxShadow: `0 4px 14px 0 ${brandColor}50` }}
            >
              Access Workspace <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </form>

          <p className="text-[10px] text-mist/40 text-center mt-8 uppercase tracking-[0.2em] font-bold">
            Powered by BLOC
          </p>
        </div>
      </div>
    </div>
  );
};
