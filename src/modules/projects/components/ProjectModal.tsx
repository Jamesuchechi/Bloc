import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { useProjectStore } from "@/store/projectStore";
import { usePortalStore } from "@/store/portalStore";
import { toast } from "react-hot-toast";

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: any;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, onClose, project }) => {
  const { user } = useAuth();
  const { addProject, updateProject } = useProjectStore();
  const { clients, fetchClients } = usePortalStore();
  
  const [name, setName] = useState("");
  const [clientId, setClientId] = useState("");
  const [status, setStatus] = useState<'active' | 'paused' | 'completed' | 'archived'>('active');
  const [color, setColor] = useState("#e8a020");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user && isOpen) {
      fetchClients(user.id);
    }
  }, [user, isOpen, fetchClients]);

  useEffect(() => {
    if (project) {
      setName(project.name || "");
      setClientId(project.client_id || "");
      setStatus(project.status || 'active');
      setColor(project.color || "#e8a020");
    } else {
      setName("");
      setClientId("");
      setStatus('active');
      setColor("#e8a020");
    }
  }, [project, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;

    setIsSaving(true);
    try {
      const payload = {
        user_id: user.id,
        name,
        client_id: clientId || null,
        status,
        color,
      };

      if (project) {
        await updateProject(project.id, payload);
        toast.success("Project updated");
      } else {
        await addProject(payload);
        toast.success("Project created");
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save project");
    } finally {
      setIsSaving(false);
    }
  };

  const COLORS = ["#e8a020", "#3b82f6", "#10b981", "#8b5cf6", "#f43f5e", "#ec4899", "#f59e0b"];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={project ? "Edit Project" : "Create New Project"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase tracking-widest text-mist/60 px-1">Project Name</label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Website Redesign"
            className="h-12 bg-surface2 border-border/30 text-chalk shadow-inner focus:border-amber/50 transition-all font-bold"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-mist/60 px-1">Client (Optional)</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full h-12 bg-surface2 border border-border/30 rounded-xl px-4 text-chalk focus:outline-none focus:ring-2 focus:ring-amber/20 focus:border-amber/50 transition-all shadow-inner font-medium"
            >
              <option value="" className="bg-ink">Direct Project</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id} className="bg-ink">
                  {c.name} {c.company ? `(${c.company})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-mist/60 px-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as any)}
              className="w-full h-12 bg-surface2 border border-border/30 rounded-xl px-4 text-chalk focus:outline-none focus:ring-2 focus:ring-amber/20 focus:border-amber/50 transition-all shadow-inner font-medium"
            >
              <option value="active" className="bg-ink">Active</option>
              <option value="paused" className="bg-ink">Paused</option>
              <option value="completed" className="bg-ink">Completed</option>
              <option value="archived" className="bg-ink">Archived</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-black uppercase tracking-widest text-mist/60 px-1">Identity Color</label>
          <div className="flex flex-wrap gap-3 p-4 bg-ink/30 border border-border/10 rounded-2xl shadow-inner">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-8 w-8 rounded-full border-2 transition-all flex items-center justify-center hover:scale-110 ${c === color ? 'border-chalk shadow-[0_0_15px_rgba(255,255,255,0.2)]' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              >
                {c === color && <div className="h-2 w-2 rounded-full bg-chalk" />}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1 h-12 font-black uppercase tracking-widest text-xs border border-border/20"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-[2] h-12 bg-amber hover:bg-amber/90 text-ink font-black uppercase tracking-widest text-xs shadow-xl shadow-amber/10"
            disabled={isSaving || !name.trim()}
          >
            {isSaving ? "Saving..." : project ? "Update Project" : "Create Project"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
