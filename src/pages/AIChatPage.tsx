import React, { useState, useEffect, useRef } from "react";
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  Trash2, 
  Plus, 
  MessageSquare, 
  ChevronDown, 
  Settings2,
  Zap,
  ShieldCheck,
  Code2,
  Terminal,
  Cpu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ai, AI_MODELS, Message, AIProvider } from "@/lib/ai";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/useAuth";
import { useProjectStore } from "@/store/projectStore";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
}

export default function AIChatPage() {
  const { user } = useAuth();
  const { projects } = useProjectStore();
  
  // Chat State
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  
  // AI Config
  const [selectedProvider, setSelectedProvider] = useState<AIProvider>(ai.defaultProvider);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[ai.defaultProvider][0].id);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeSession = sessions.find(s => s.id === activeSessionId);

  // Load history
  useEffect(() => {
    const saved = localStorage.getItem("bloc-chat-history");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSessions(parsed);
        if (parsed.length > 0) setActiveSessionId(parsed[0].id);
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
  }, []);

  // Save history
  useEffect(() => {
    if (sessions.length > 0) {
      localStorage.setItem("bloc-chat-history", JSON.stringify(sessions));
    }
  }, [sessions]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeSession?.messages, isThinking]);

  const createNewSession = () => {
    const newSession: ChatSession = {
      id: crypto.randomUUID(),
      title: "New Brainstorm",
      messages: [],
      createdAt: new Date().toISOString()
    };
    setSessions([newSession, ...sessions]);
    setActiveSessionId(newSession.id);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSessions = sessions.filter(s => s.id !== id);
    setSessions(newSessions);
    if (activeSessionId === id) {
      setActiveSessionId(newSessions.length > 0 ? newSessions[0].id : null);
    }
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isThinking || !activeSessionId) return;

    const userMessage: Message = { role: "user", content: input };
    const currentInput = input;
    setInput("");
    setIsThinking(true);

    // Update session locally with user message
    setSessions(prev => prev.map(s => {
      if (s.id === activeSessionId) {
        const newTitle = s.messages.length === 0 ? currentInput.substring(0, 30) + (currentInput.length > 30 ? "..." : "") : s.title;
        return { ...s, title: newTitle, messages: [...s.messages, userMessage] };
      }
      return s;
    }));

    try {
      // Inject context if first message
      let contextPrompt = "";
      if (activeSession && activeSession.messages.length === 0 && projects.length > 0) {
        contextPrompt = `\n\n(Context: User has ${projects.length} active projects including ${projects.slice(0, 3).map(p => p.name).join(", ")}. Be aware of this if they mention their work.)`;
      }

      const response = await ai.chat([...(activeSession?.messages || []), userMessage], {
        model: selectedModel,
        provider: selectedProvider,
        systemPrompt: `You are the Bloc Intelligence, a high-performance AI partner for developers and builders. You are professional, technical, and direct. You help with project strategy, code debugging, and business logic.${contextPrompt}`
      });

      const assistantMessage: Message = { role: "assistant", content: response };
      
      setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, assistantMessage] };
        }
        return s;
      }));
    } catch (err: any) {
      const errorMessage: Message = { role: "assistant", content: `**Error:** ${err.message}. I tried to process your request but encountered a provider issue.` };
       setSessions(prev => prev.map(s => {
        if (s.id === activeSessionId) {
          return { ...s, messages: [...s.messages, errorMessage] };
        }
        return s;
      }));
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-140px)] -m-4 md:-m-8 bg-ink border border-border/10 rounded-3xl shadow-2xl relative">
      
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-amber/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {/* Sidebar - Sessions */}
      <div className="w-80 hidden lg:flex flex-col border-r border-border/10 bg-surface/30 backdrop-blur-3xl z-10">
        <div className="p-6 space-y-4">
          <Button 
            onClick={createNewSession}
            className="w-full bg-chalk text-ink hover:bg-white h-12 font-black uppercase tracking-widest text-[10px] gap-3 shadow-xl shadow-white/5 active:scale-95 transition-transform"
          >
            <Plus className="h-4 w-4" /> New Session
          </Button>
          
          <div className="flex items-center justify-between px-2">
             <span className="text-[10px] font-black text-mist/40 uppercase tracking-widest">History</span>
             <Sparkles className="h-3 w-3 text-amber animate-pulse" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 pb-6 space-y-2 scrollbar-hide">
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSessionId(s.id)}
              className={cn(
                "w-full group text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden",
                activeSessionId === s.id 
                  ? "bg-surface2 border-amber/30 shadow-lg shadow-amber/5" 
                  : "bg-surface/10 border-border/5 hover:border-border/20 text-mist/60 hover:text-mist"
              )}
            >
              <div className="flex items-start justify-between relative z-10">
                 <div className="flex items-start gap-3 min-w-0">
                    <MessageSquare className={cn("h-4 w-4 mt-1 shrink-0", activeSessionId === s.id ? "text-amber" : "text-mist/20")} />
                    <span className="text-sm font-bold truncate leading-tight">{s.title}</span>
                 </div>
                 <button 
                  onClick={(e) => deleteSession(s.id, e)}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all"
                 >
                   <Trash2 className="h-3 w-3" />
                 </button>
              </div>
              <div className="mt-2 text-[8px] font-black uppercase tracking-widest text-mist/20">
                {new Date(s.createdAt).toLocaleDateString()}
              </div>
            </button>
          ))}
          {sessions.length === 0 && (
            <div className="text-center py-12 space-y-2">
               <Cpu className="h-10 w-10 text-mist/10 mx-auto" />
               <p className="text-[10px] font-black text-mist/20 uppercase">Intelligence Inactive</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-ink/40 backdrop-blur-xl z-10 relative">
        
        {/* Header - Model Selector */}
        <div className="h-20 border-b border-border/10 flex items-center justify-between px-8 bg-surface/10 rounded-t-3xl">
           <div className="flex items-center gap-4">
              <div className="p-2 bg-amber/10 rounded-xl">
                 <Bot className="h-5 w-5 text-amber" />
              </div>
              <div>
                 <h2 className="text-sm font-black uppercase tracking-tighter text-chalk">Bloc Intelligence</h2>
                 <div className="flex items-center gap-2 mt-0.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-black text-mist/40 uppercase tracking-widest">{selectedProvider} Mode</span>
                 </div>
              </div>
           </div>

           <div className="flex items-center gap-4">
              {/* Provider / Model Control */}
              <div className="flex items-center p-1 bg-surface2 border border-border/10 rounded-xl">
                 <select 
                   value={selectedModel}
                   onChange={(e) => setSelectedModel(e.target.value)}
                   className="bg-transparent text-[10px] font-black text-mist uppercase tracking-widest outline-none px-4 py-2 cursor-pointer hover:text-amber transition-colors"
                 >
                    <optgroup label="Groq Speed Layer" className="bg-ink">
                      {AI_MODELS.groq.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </optgroup>
                    <optgroup label="OpenRouter Expansion" className="bg-ink">
                      {AI_MODELS.openrouter.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                    </optgroup>
                 </select>
              </div>
              <Button variant="ghost" size="icon" className="text-mist/40 hover:text-amber">
                 <Settings2 className="h-4 w-4" />
              </Button>
           </div>
        </div>

        {/* Message List */}
        <div className="flex-1 overflow-y-auto p-8 space-y-8 scroll-smooth scrollbar-hide">
           {activeSession ? (
             <>
               {activeSession.messages.map((m, i) => (
                 <motion.div 
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   key={i} 
                   className={cn(
                     "max-w-4xl flex gap-6",
                     m.role === 'user' ? "ml-auto flex-row-reverse" : ""
                   )}
                 >
                    <div className={cn(
                      "h-10 w-10 shrink-0 rounded-2xl flex items-center justify-center border shadow-lg",
                      m.role === 'user' 
                        ? "bg-amber border-amber/20 text-ink shadow-amber/10" 
                        : "bg-surface2 border-border/10 text-mist shadow-black/20"
                    )}>
                       {m.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                    </div>
                    
                    <div className={cn(
                      "flex flex-col space-y-2 min-w-0",
                      m.role === 'user' ? "items-end" : "items-start"
                    )}>
                       <div className={cn(
                         "p-6 rounded-[2rem] text-sm font-medium leading-relaxed prose prose-invert prose-xs max-w-none",
                         m.role === 'user' 
                          ? "bg-amber/5 border border-amber/10 text-chalk rounded-tr-none" 
                          : "bg-surface2 border border-border/5 text-mist/90 rounded-tl-none shadow-xl"
                       )}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {m.content}
                          </ReactMarkdown>
                       </div>
                       <span className="text-[8px] font-black uppercase tracking-widest text-mist/20 px-4">
                          {m.role === 'user' ? 'Direct Input' : `${selectedProvider} System`}
                       </span>
                    </div>
                 </motion.div>
               ))}
               {isThinking && (
                 <motion.div 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex gap-6 max-w-4xl"
                 >
                    <div className="h-10 w-10 shrink-0 rounded-2xl bg-surface2 border border-border/10 flex items-center justify-center text-amber animate-pulse">
                       <Bot className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col space-y-4 w-full">
                       <div className="h-12 bg-surface2/50 border border-border/5 rounded-[2rem] rounded-tl-none flex items-center px-6 gap-3">
                          <span className="flex gap-1.5 item-center">
                             <div className="h-1.5 w-1.5 bg-amber rounded-full animate-bounce [animation-delay:-0.3s]" />
                             <div className="h-1.5 w-1.5 bg-amber rounded-full animate-bounce [animation-delay:-0.15s]" />
                             <div className="h-1.5 w-1.5 bg-amber rounded-full animate-bounce" />
                          </span>
                          <span className="text-[10px] font-black uppercase text-mist/20 tracking-widest">Synthesizing response...</span>
                       </div>
                    </div>
                 </motion.div>
               )}
               <div ref={messagesEndRef} />
             </>
           ) : (
             <div className="h-full flex flex-col items-center justify-center space-y-12 max-w-2xl mx-auto opacity-40">
                <div className="relative group">
                   <div className="absolute inset-0 bg-amber blur-[60px] opacity-20 group-hover:opacity-40 transition-opacity" />
                   <div className="h-24 w-24 rounded-[3rem] bg-surface2 border border-amber/20 flex items-center justify-center relative z-10 rotate-3 transition-transform group-hover:rotate-6">
                      <Sparkles className="h-10 w-10 text-amber" />
                   </div>
                </div>
                <div className="text-center space-y-6">
                   <h1 className="text-4xl font-black text-chalk tracking-tight uppercase">Bloc Intelligence v1.0</h1>
                   <p className="text-mist/60 font-medium leading-relaxed uppercase tracking-widest text-[10px]">
                      A high-performance neural partner for project architecture, code refinement, and business scaling.
                   </p>
                   <div className="grid grid-cols-2 gap-4 pt-8">
                      {[
                        { icon: Terminal, label: "Debug Logic" },
                        { icon: Zap, label: "Idea Scaling" },
                        { icon: ShieldCheck, label: "Ship Safety" },
                        { icon: Code2, label: "Tech Stack" }
                      ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 bg-surface/5 px-4 py-3 rounded-2xl border border-border/5">
                           <feature.icon className="h-3 w-3 text-amber" />
                           <span className="text-[9px] font-bold text-mist/40 uppercase">{feature.label}</span>
                        </div>
                      ))}
                   </div>
                   <Button 
                    onClick={createNewSession}
                    className="mt-12 h-14 px-12 rounded-2xl bg-amber text-ink font-black uppercase tracking-widest text-xs hover:scale-105 transition-transform shadow-2xl shadow-amber/20"
                   >
                     Initiate Protocol
                   </Button>
                </div>
             </div>
           )}
        </div>

        {/* Input Area */}
        <div className="p-8 pb-10 bg-gradient-to-t from-ink to-transparent">
           <div className="max-w-4xl mx-auto relative group">
              <div className="absolute inset-0 bg-amber/5 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative flex items-center gap-4 p-2 bg-surface2 border border-border/10 rounded-3xl shadow-2xl focus-within:border-amber/40 transition-all duration-500">
                 <Input 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                   placeholder="Type a message or discuss a project build..."
                   className="flex-1 bg-transparent border-none text-chalk placeholder:text-mist/20 focus-visible:ring-0 px-6 h-14 font-medium"
                 />
                 <Button 
                   onClick={handleSendMessage}
                   disabled={isThinking || !input.trim()}
                   className="h-12 w-12 rounded-2xl bg-amber text-ink flex items-center justify-center p-0 transition-transform active:scale-90 disabled:opacity-20 shadow-xl shadow-amber/10"
                 >
                    <Send className="h-5 w-5" />
                 </Button>
              </div>
              <div className="flex items-center justify-between px-6 mt-4">
                 <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
                    <span className="text-[10px] font-black text-mist/20 uppercase tracking-widest whitespace-nowrap">Shortcuts:</span>
                    {["/debug", "/idea", "/summary"].map(s => (
                      <button key={s} className="text-[10px] font-bold text-mist/40 hover:text-amber transition-colors px-2 py-1 rounded-md bg-surface border border-border/5 uppercase tracking-widest">{s}</button>
                    ))}
                 </div>
                 <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-amber" />
                    <span className="text-[10px] font-black text-mist/20 uppercase tracking-widest">Failover Enabled</span>
                 </div>
              </div>
           </div>
        </div>

      </div>
    </div>
  );
}
