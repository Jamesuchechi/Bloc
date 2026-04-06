import React from "react";
import { Sparkles, Loader2 } from "lucide-react";

interface AIStatusProps {
  isThinking: boolean;
  statusText?: string;
}

export const AIStatus: React.FC<AIStatusProps> = ({ isThinking, statusText = "AI is thinking..." }) => {
  if (!isThinking) return null;

  return (
    <div className="flex items-center gap-3 px-4 py-2 bg-amber/5 border border-amber/20 rounded-full animate-in fade-in duration-300">
      <div className="relative">
        <Sparkles className="h-4 w-4 text-amber animate-pulse" />
        <Loader2 className="h-4 w-4 text-amber/40 absolute inset-0 animate-spin" />
      </div>
      <span className="text-[10px] font-black uppercase tracking-widest text-amber">
        {statusText}
      </span>
    </div>
  );
};
