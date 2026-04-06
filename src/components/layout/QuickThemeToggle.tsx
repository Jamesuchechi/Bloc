import { useAppStore } from "../../store/appStore";
import { Moon, Sun, Palette, Check } from "lucide-react";
import { Button } from "../ui/Button";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ACCENT_COLORS = [
  { name: "Amber", value: "#e8a020" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Purple", value: "#8b5cf6" },
  { name: "Crimson", value: "#f43f5e" },
];

export function QuickThemeToggle({ minimal = false }: { minimal?: boolean }) {
  const { theme, setTheme, accentColor, setAccentColor } = useAppStore();
  const [isAccentOpen, setIsAccentOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (minimal) {
    return (
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
        className="h-10 w-full flex items-center justify-center rounded-xl text-mist hover:text-amber hover:bg-white/5 transition-all"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-1 bg-surface2/40 p-1 rounded-full border border-border/10 backdrop-blur-sm">
      {/* Theme Toggle */}
      <Button 
        variant="ghost" 
        size="icon" 
        onClick={toggleTheme}
        className="h-8 w-8 rounded-full text-mist hover:text-amber hover:bg-white/5 transition-all"
        title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      >
        {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
      </Button>

      <div className="h-4 w-px bg-border/20 mx-0.5" />

      {/* Accent Toggle */}
      <div className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsAccentOpen(!isAccentOpen)}
          className={`h-8 w-8 rounded-full transition-all ${isAccentOpen ? 'text-amber bg-white/5' : 'text-mist hover:text-amber'}`}
          title="Change accent color"
        >
          <Palette className="h-4 w-4" />
        </Button>

        <AnimatePresence>
          {isAccentOpen && (
            <>
              <div 
                className="fixed inset-0 z-40" 
                onClick={() => setIsAccentOpen(false)} 
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="absolute right-0 top-full mt-2 bg-surface border border-border/20 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1 min-w-[140px]"
              >
                <p className="text-[9px] uppercase tracking-widest text-mist/40 font-black px-2 py-1">Accents</p>
                {ACCENT_COLORS.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setAccentColor(c.value);
                      setIsAccentOpen(false);
                    }}
                    className={`flex items-center justify-between w-full px-3 py-2 rounded-xl text-[10px] font-bold transition-all hover:bg-white/5 ${accentColor === c.value ? 'text-amber' : 'text-mist'}`}
                  >
                    <div className="flex items-center gap-2">
                       <div className="h-3 w-3 rounded-full" style={{ backgroundColor: c.value }} />
                       {c.name}
                    </div>
                    {accentColor === c.value && <Check className="h-3 w-3" />}
                  </button>
                ))}
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
