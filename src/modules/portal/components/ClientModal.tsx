import React, { useState, useEffect } from "react";
import { X, User, Briefcase, Mail, Palette, Lock } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Client } from "../api";
import { usePortalStore } from "@/store/portalStore";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-hot-toast";

interface ClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  client?: Client | null;
}

const COLORS = ["#e8a020", "#3b82f6", "#10b981", "#8b5cf6", "#ec4899", "#f43f5e", "#0ea5e9", "#14b8a6", "#84cc16"];

export const ClientModal: React.FC<ClientModalProps> = ({ isOpen, onClose, client }) => {
  const { user } = useAuth();
  const { createClient, updateClient } = usePortalStore();
  
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [color, setColor] = useState(COLORS[0]);
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client && isOpen) {
      setName(client.name);
      setCompany(client.company || "");
      setEmail(client.email || "");
      setColor(client.color || COLORS[0]);
      setPassword(""); // Don't show existing password
    } else if (isOpen) {
      setName("");
      setCompany("");
      setEmail("");
      setColor(COLORS[Math.floor(Math.random() * COLORS.length)]);
      setPassword("");
    }
  }, [client, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name.trim()) {
      toast.error("Client name is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: Partial<Client> = {
        name,
        company: company || null,
        email: email || null,
        color,
        ...(password ? { portal_password_hash: password } : {})
      };

      if (client) {
        await updateClient(client.id, payload);
        toast.success("Client updated successfully");
      } else {
        await createClient({ ...payload, user_id: user.id });
        toast.success("Client created successfully");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message || "Failed to save client");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={client ? "Edit Client" : "New Client"}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/60 group-focus-within:text-amber transition-colors" />
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Client or Contact Name *"
                  className="pl-12 h-14 bg-surface2/50 border-border/20 text-chalk placeholder:text-mist/40 focus:border-amber/40 focus:ring-amber/10 rounded-xl"
                  autoFocus
                />
              </div>

              <div className="relative group">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/60 group-focus-within:text-amber transition-colors" />
                <Input
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Company Name (Optional)"
                  className="pl-12 h-14 bg-surface2/50 border-border/20 text-chalk placeholder:text-mist/40 focus:border-amber/40 focus:ring-amber/10 rounded-xl"
                />
              </div>

              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/60 group-focus-within:text-amber transition-colors" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address (Optional)"
                  className="pl-12 h-14 bg-surface2/50 border-border/20 text-chalk placeholder:text-mist/40 focus:border-amber/40 focus:ring-amber/10 rounded-xl"
                />
              </div>

              <div className="relative group hidden">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/60 group-focus-within:text-amber transition-colors" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={client ? "Portal Password (leave blank to keep current)" : "Portal Password"}
                  className="pl-12 h-14 bg-surface2/50 border-border/20 text-chalk placeholder:text-mist/40 focus:border-amber/40 focus:ring-amber/10 rounded-xl"
                />
              </div>
              {/* Show the password field visibly */}
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-mist/60 group-focus-within:text-amber transition-colors" />
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={client ? "Portal Password (leave blank to keep current)" : "Portal Password (Required for new)"}
                  className="pl-12 h-14 bg-surface2/50 border-border/20 text-chalk placeholder:text-mist/40 focus:border-amber/40 focus:ring-amber/10 rounded-xl"
                  required={!client}
                />
              </div>

              <div className="space-y-3 pt-2">
                <label className="text-xs font-bold text-mist/60 uppercase tracking-widest flex items-center gap-2">
                  <Palette className="h-4 w-4" /> Brand Accent
                </label>
                <div className="flex flex-wrap gap-3">
                  {COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className="h-8 w-8 rounded-full transition-transform hover:scale-110 focus:outline-none flex items-center justify-center shadow-lg"
                      style={{ backgroundColor: c, border: color === c ? '2px solid white' : '2px solid transparent' }}
                    >
                      {color === c && <div className="h-2 w-2 rounded-full bg-white" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={onClose} className="w-full h-12 text-mist" disabled={isSubmitting}>
                Cancel
              </Button>
              <Button type="submit" className="w-full h-12 bg-amber hover:bg-amber/90 text-ink shadow-lg shadow-amber/10" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : client ? "Save Changes" : "Create Client"}
              </Button>
            </div>
          </form>
    </Modal>
  );
};
