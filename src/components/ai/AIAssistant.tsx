import React, { useState } from "react";
import { Sparkles, Wand2, Check, X, RefreshCw, ChevronDown, Highlighter, Zap, MessageSquareQuote } from "lucide-react";
import { ai } from "@/lib/ai";
import { Button } from "@/components/ui/Button";
import { AIStatus } from "./AIStatus";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface AIAssistantProps {
  context?: string;
  onApply: (text: string) => void;
  variant?: 'inline' | 'floating';
  label?: string;
}

export const AIAssistant: React.FC<AIAssistantProps> = ({ context, onApply, variant = 'inline', label = "Ask AI Assistant" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const handleGenerate = async (instruction: string) => {
    if (!ai.isConfigured) {
      toast.error("AI API Key missing. Check your settings.");
      return;
    }

    setIsThinking(true);
    setIsOpen(false);
    try {
      const prompt = context 
        ? `${instruction} based on this context: "${context}"`
        : instruction;
      
      const result = await ai.complete(prompt, {
        systemPrompt: "You are an expert at professional business writing for independent developers. Be concise and professional."
      });
      
      setSuggestion(result || null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsThinking(false);
    }
  };

  const options = [
    { id: 'draft', label: 'Draft Scope', icon: Wand2, instruction: 'Draft a professional project scope' },
    { id: 'refine', label: 'Refine Text', icon: Highlighter, instruction: 'Rewrite this professionally and concisely' },
    { id: 'expand', label: 'Expand Details', icon: Zap, instruction: 'Expand on these details with professional business language' },
    { id: 'summary', label: 'Shorten Summary', icon: MessageSquareQuote, instruction: 'Summarize this concisely' },
  ];

  return (
    <div className="relative inline-block">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          variant="ghost"
          className={`h-8 px-3 text-[10px] uppercase font-black tracking-widest gap-2 bg-amber/5 border border-amber/20 hover:bg-amber/10 hover:border-amber/40 transition-all ${isThinking ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Sparkles className="h-3 w-3 text-amber" />
          {label}
          <ChevronDown className={`h-3 w-3 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </Button>
        <AIStatus isThinking={isThinking} />
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute left-0 mt-2 w-56 bg-surface border border-border shadow-2xl rounded-2xl p-2 z-50 overflow-hidden backdrop-blur-xl"
          >
            <div className="text-[10px] font-black uppercase tracking-widest text-mist/40 px-3 py-2 mb-1 border-b border-white/5 flex items-center justify-between">
              Assistant Brain
              <Sparkles className="h-2 w-2" />
            </div>
            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleGenerate(opt.instruction)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-mist hover:bg-amber hover:text-ink transition-all group"
              >
                <opt.icon className="h-3.5 w-3.5 group-hover:scale-110 transition-transform" />
                {opt.label}
              </button>
            ))}
          </motion.div>
        )}

        {suggestion && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
          >
            <div className="bg-surface border border-border/50 shadow-[0_0_50px_rgba(0,0,0,0.5)] rounded-[2.5rem] w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-300">
               <div className="p-8 border-b border-border/5 bg-surface2/30 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber/10 rounded-xl">
                      <Sparkles className="h-5 w-5 text-amber" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black uppercase tracking-widest text-chalk">AI Synthesis</h3>
                      <p className="text-[10px] font-medium text-mist uppercase tracking-widest">Review and apply to your builder space</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => setSuggestion(null)} className="h-8 w-8 text-mist hover:text-chalk rounded-full">
                    <X className="h-4 w-4" />
                  </Button>
               </div>
               <div className="p-10 max-h-[50vh] overflow-y-auto">
                 <div className="prose prose-invert prose-sm max-w-none text-mist leading-relaxed font-medium whitespace-pre-wrap selection:bg-amber selection:text-ink">
                    {suggestion}
                 </div>
               </div>
               <div className="p-8 bg-surface2/30 border-t border-border/5 flex items-center gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setSuggestion(null)}
                    className="flex-1 h-12 uppercase font-black text-xs tracking-widest border border-border/10"
                  >
                    Discard Build
                  </Button>
                  <Button
                    type="button"
                    onClick={() => { onApply(suggestion); setSuggestion(null); }}
                    className="flex-[2] h-12 bg-amber hover:bg-amber/90 text-ink uppercase font-black text-xs tracking-widest shadow-xl shadow-amber/20 gap-3"
                  >
                    <Check className="h-4 w-4" /> Finalize & Apply
                  </Button>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
