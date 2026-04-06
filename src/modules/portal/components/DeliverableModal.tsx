import React, { useState } from "react";
import { UploadCloud, Link as LinkIcon, Loader2 } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { PortalUpdate, portalApi } from "@/modules/portal/api";
import { toast } from "react-hot-toast";

interface DeliverableModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  onSuccess: () => void;
}

export const DeliverableModal: React.FC<DeliverableModalProps> = ({ isOpen, onClose, projectId, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [uploadType, setUploadType] = useState<"link" | "file">("link");
  const [linkUrl, setLinkUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    if (uploadType === "link" && !linkUrl.trim()) {
      toast.error("URL is required for external links");
      return;
    }
    if (uploadType === "file" && !file) {
      toast.error("Please select a file to upload");
      return;
    }

    setIsSubmitting(true);
    let finalUrl = linkUrl;

    try {
      if (uploadType === "file" && file) {
        toast.loading("Uploading file...", { id: "upload" });
        finalUrl = await portalApi.uploadDeliverableFile(file, projectId);
        toast.success("File uploaded", { id: "upload" });
      }

      await portalApi.createDeliverable({
        project_id: projectId,
        title,
        status: "pending",
        file_url: finalUrl || null,
      });

      toast.success("Deliverable posted!");
      
      // reset state
      setTitle("");
      setLinkUrl("");
      setFile(null);
      
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Failed to post deliverable", { id: "upload" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Deliverable">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="text-xs font-bold text-mist/60 uppercase tracking-widest mb-2 block">
            Deliverable Title
          </label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. V1 High Fidelity Mockups"
            className="w-full bg-surface2 border-border/20"
            autoFocus
          />
        </div>

        <div>
          <label className="text-xs font-bold text-mist/60 uppercase tracking-widest mb-3 block">
            Asset Type
          </label>
          <div className="flex gap-2 bg-surface2/50 p-1.5 rounded-xl border border-border/20">
            <button
              type="button"
              onClick={() => setUploadType("link")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${uploadType === 'link' ? 'bg-surface border border-border/50 text-amber shadow-sm' : 'text-mist hover:text-chalk'}`}
            >
              <LinkIcon className="h-4 w-4" /> External Link
            </button>
            <button
              type="button"
              onClick={() => setUploadType("file")}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors ${uploadType === 'file' ? 'bg-surface border border-border/50 text-amber shadow-sm' : 'text-mist hover:text-chalk'}`}
            >
              <UploadCloud className="h-4 w-4" /> Raw File
            </button>
          </div>
        </div>

        {uploadType === "link" ? (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300">
            <label className="text-xs font-bold text-mist/60 uppercase tracking-widest mb-2 block">
              Asset Link (Figma, Drive, Loom)
            </label>
            <Input
              type="url"
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="https://..."
              className="w-full bg-surface2 border-border/20"
            />
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-top-2 duration-300 border-2 border-dashed border-border/40 rounded-xl p-6 text-center hover:bg-surface2/20 transition-colors relative cursor-pointer group">
            <input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            {file ? (
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 bg-amber/10 rounded-full flex items-center justify-center mb-2">
                  <CheckCircle className="h-5 w-5 text-amber" />
                </div>
                <p className="text-chalk font-semibold text-sm">{file.name}</p>
                <p className="text-mist/50 text-xs mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-10 w-10 bg-surface2 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="h-5 w-5 text-mist" />
                </div>
                <p className="text-mist font-medium text-sm">Click or drag a file to upload</p>
                <p className="text-mist/40 text-xs mt-1 uppercase tracking-widest">Powered by Supabase Storage</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose} className="w-full text-mist" disabled={isSubmitting}>
            Cancel
          </Button>
          <Button type="submit" className="w-full bg-amber hover:bg-amber/90 text-ink shadow-lg shadow-amber/10" disabled={isSubmitting}>
            {isSubmitting ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Uploading...</>
            ) : (
              "Post Deliverable"
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

function CheckCircle(props: any) {
  return <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
}
