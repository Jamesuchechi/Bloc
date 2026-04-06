import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "@/hooks/useAuth";
import { focusApi, Project } from "@/modules/focus/api";
import { shiplogApi } from "../api";
import { useShipLogStore } from "@/store/shipLogStore";
import { toast } from "react-hot-toast";

interface LogEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entry?: any; // If provided, we are editing
}

export const LogEntryModal: React.FC<LogEntryModalProps> = ({ isOpen, onClose, entry }) => {
  const { user } = useAuth();
  const { createEntry, updateEntry } = useShipLogStore();
  
  const [description, setDescription] = useState("");
  const [projectId, setProjectId] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [durationMins, setDurationMins] = useState<number>(0);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      focusApi.getProjects(user.id).then(setProjects);
    }
  }, [user]);

  useEffect(() => {
    if (entry) {
      setDescription(entry.description || "");
      setProjectId(entry.project_id || "");
      setDate(entry.date || new Date().toISOString().split("T")[0]);
      setDurationMins(entry.duration_mins || 0);
    } else {
      setDescription("");
      setProjectId("");
      setDate(new Date().toISOString().split("T")[0]);
      setDurationMins(0);
    }
  }, [entry, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !description.trim()) return;

    setIsSaving(true);
    try {
      const payload = {
        user_id: user.id,
        description,
        project_id: projectId || null,
        date,
        duration_mins: durationMins || null,
      };

      if (entry) {
        await updateEntry(entry.id, payload);
        toast.success("Log entry updated");
      } else {
        await createEntry(payload);
        toast.success("Log entry created");
      }
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Failed to save log entry");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={entry ? "Edit Log Entry" : "Create Log Entry"}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-mist">
            Description (Markdown supported)
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What did you ship today?"
            className="w-full h-32 bg-surface2 border border-border rounded-xl p-4 text-chalk placeholder:text-mist/30 focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all resize-none shadow-inner"
            required
            autoFocus
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-mist">Date</label>
            <Input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-surface2 border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-mist">Duration (mins)</label>
            <Input
              type="number"
              value={durationMins || ""}
              onChange={(e) => setDurationMins(parseInt(e.target.value) || 0)}
              className="bg-surface2 border-border"
              placeholder="0"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-widest text-mist">Project</label>
          <select
            value={projectId}
            onChange={(e) => setProjectId(e.target.value)}
            className="w-full bg-surface2 border border-border rounded-xl px-4 py-2.5 text-chalk focus:outline-none focus:ring-2 focus:ring-amber/50 focus:border-amber/50 transition-all shadow-inner"
          >
            <option value="" className="bg-ink">No Project</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id} className="bg-ink">
                {p.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-[2] bg-amber hover:bg-amber/90 text-ink font-bold"
            disabled={isSaving || !description.trim()}
          >
            {isSaving ? "Saving..." : entry ? "Save Changes" : "Create Entry"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
