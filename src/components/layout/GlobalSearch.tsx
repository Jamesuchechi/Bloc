import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  Command, 
  Timer, 
  Ship, 
  Users, 
  ClipboardList,
  ArrowRight
} from "lucide-react";
import { useAppStore } from "../../store/appStore";
import { useGlobalSearch, SearchResult } from "../../hooks/useGlobalSearch";
import { cn } from "../../lib/utils";
import { useNavigate } from "react-router-dom";

const IconMap = {
  session: Timer,
  log: Ship,
  client: Users,
  proposal: ClipboardList,
};

export function GlobalSearch() {
  const { searchOpen, setSearchOpen } = useAppStore();
  const { query, setQuery, results, loading } = useGlobalSearch();
  const navigate = useNavigate();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
      setQuery("");
    }
  }, [searchOpen, setQuery]);

  const handleSelect = (path: string) => {
    navigate(path);
    setSearchOpen(false);
  };

  const categories = [
    { type: 'session', label: 'Sessions' },
    { type: 'log', label: 'Log Entries' },
    { type: 'client', label: 'Clients' },
    { type: 'proposal', label: 'Proposals' },
  ] as const;

  return (
    <AnimatePresence>
      {searchOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSearchOpen(false)}
            className="absolute inset-0 bg-ink/80 backdrop-blur-md"
          />

          {/* Search Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-surface2 border border-border shadow-2xl rounded-2xl overflow-hidden mx-4"
          >
            {/* Input Header */}
            <div className="flex items-center gap-4 px-6 py-5 border-b border-border">
              <Search className="h-6 w-6 text-amber" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search across sessions, logs, clients..."
                className="flex-1 bg-transparent border-none outline-none text-chalk placeholder:text-mist/50 text-lg"
              />
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 rounded border border-border bg-surface px-1.5 py-0.5 text-[10px] font-medium text-mist">
                  <Command className="h-3 w-3" />
                  <span>K</span>
                </div>
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-1 hover:bg-surface rounded-md transition-colors"
                >
                  <X className="h-5 w-5 text-mist" />
                </button>
              </div>
            </div>

            {/* Results Area */}
            <div className="max-h-[60vh] overflow-y-auto p-4 custom-scrollbar">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center text-mist gap-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  >
                    <Search className="h-8 w-8 text-amber/40" />
                  </motion.div>
                  <p className="text-sm animate-pulse">Searching the Bloc...</p>
                </div>
              ) : query.length > 0 && results.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-mist gap-2 text-center px-10">
                  <div className="h-12 w-12 rounded-full bg-surface flex items-center justify-center mb-2">
                    <Search className="h-6 w-6 text-mist/30" />
                  </div>
                  <p className="text-chalk font-semibold text-lg">No results found</p>
                  <p className="text-sm text-mist/60">We couldn't find anything matching "{query}" across your workspace.</p>
                </div>
              ) : query.length > 0 ? (
                <div className="space-y-6">
                  {categories.map(cat => {
                    const catResults = results.filter(r => r.type === cat.type);
                    if (catResults.length === 0) return null;

                    return (
                      <div key={cat.type}>
                        <h3 className="px-3 mb-2 text-xs font-bold uppercase tracking-widest text-amber/80 flex items-center gap-2">
                          {cat.label}
                          <span className="h-px flex-1 bg-border/50" />
                        </h3>
                        <div className="space-y-1">
                          {catResults.map((result) => (
                            <ResultItem 
                              key={result.id} 
                              result={result} 
                              onClick={() => handleSelect(result.path)} 
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-12 px-6">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-mist/40 mb-6 px-2">Quick Actions</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "New Project", path: "/projects", icon: ClipboardList },
                      { label: "Time Logs", path: "/log", icon: Ship },
                      { label: "Client CRM", path: "/clients", icon: Users },
                      { label: "Analytics", path: "/analytics", icon: Timer },
                    ].map((action) => (
                      <button
                        key={action.label}
                        onClick={() => handleSelect(action.path)}
                        className="flex items-center gap-4 p-4 rounded-xl border border-border bg-surface hover:bg-surface2 hover:border-amber/30 transition-all group group-hover:shadow-lg"
                      >
                        <div className="h-10 w-10 rounded-lg bg-border/30 flex items-center justify-center text-amber group-hover:scale-110 transition-transform">
                          <action.icon className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-chalk">{action.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-3 border-t border-border bg-surface flex items-center justify-between text-[11px] text-mist/50">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><span className="text-chalk">Enter</span> to select</span>
                <span className="flex items-center gap-1"><span className="text-chalk">↑↓</span> to navigate</span>
              </div>
              <div>
                Press <span className="text-chalk">Esc</span> to close
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function ResultItem({ result, onClick }: { result: SearchResult; onClick: () => void }) {
  const Icon = IconMap[result.type];

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-amber hover:text-ink group transition-all duration-200 text-left"
    >
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-surface flex items-center justify-center text-amber group-hover:bg-ink group-hover:text-amber transition-colors">
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-semibold text-chalk group-hover:text-ink truncate leading-tight">
            {result.title}
          </span>
          {result.subtitle && (
            <span className="text-xs text-mist group-hover:text-black/60 truncate mt-0.5">
              {result.subtitle}
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="h-4 w-4 text-mist group-hover:text-ink opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
    </button>
  );
}
