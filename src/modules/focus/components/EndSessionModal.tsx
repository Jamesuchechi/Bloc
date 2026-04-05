import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useFocusStore } from "@/store/focusStore";

interface EndSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (notes: string) => void;
}

export const EndSessionModal: React.FC<EndSessionModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const { activeSession, elapsed } = useFocusStore();
  const [notes, setNotes] = useState("");
  const durationMins = Math.max(1, Math.round(elapsed / 60));

  const handleConfirm = () => {
    onConfirm(notes);
    setNotes("");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Wrap up this session"
    >
      <div className="space-y-6 pt-2">
        <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl space-y-1">
          <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-600">Summary</div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-300 font-medium">{activeSession?.title}</span>
            <span className="text-sm text-orange-500 font-bold">{durationMins}m tracked</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-zinc-400">What did you complete? (Optional)</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Built the login API, fixed the sidebar bug, and added primary buttons..."
            className="w-full h-32 bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-orange-500/50 transition-all resize-none"
          />
          <p className="text-[10px] text-zinc-600 italic">This will be saved to your Ship Log automatically.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1 py-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-[2] py-6 bg-orange-500 hover:bg-orange-600 font-black tracking-tight"
          >
            Save & Log Session
          </Button>
        </div>
      </div>
    </Modal>
  );
};
