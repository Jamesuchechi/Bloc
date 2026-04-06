import React, { useState } from "react";
import { MessageSquare, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { portalApi } from "@/modules/portal/api";
import { toast } from "react-hot-toast";

interface UpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSuccess: () => void;
}

export const UpdateModal: React.FC<UpdateModalProps> = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    setIsSubmitting(true);

    try {
      await portalApi.createPortalUpdate({
        project_id: projectId,
        content,
        visible: true, // Always visible for MVP unless we build a toggle
      });

      toast.success("Update published to client portal!");
      setContent("");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to publish update");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="New Portal Update">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs font-bold text-mist/60 uppercase tracking-widest mb-2 flex items-center gap-2">
            <MessageSquare className="h-4 w-4" /> Message to Client
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What did you get done today? e.g. Finished the landing page wireframes."
            className="w-full min-h-[120px] p-4 bg-surface2 border border-border/20 rounded-xl text-chalk placeholder:text-mist/40 focus:border-amber/40 focus:ring-amber/10 resize-none font-medium"
            autoFocus
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="w-full text-mist" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="w-full bg-amber hover:bg-amber/90 text-ink shadow-lg shadow-amber/10" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Publishing...</>
            ) : (
              "Publish Update"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
