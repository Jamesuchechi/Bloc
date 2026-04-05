import React, { useState, useEffect } from "react";
import { Play, Pause, Square, Maximize2, Minimize2, CheckCircle2, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useFocusStore } from "@/store/focusStore";
import { useFocusTimer } from "../hooks/useFocusTimer";
import { Button } from "@/components/ui/Button";

interface ActiveSessionProps {
  onStop: () => void;
}

export const ActiveSession: React.FC<ActiveSessionProps> = ({ onStop }) => {
  const { activeSession, isPaused, togglePause, isRunning, timerMode } = useFocusStore();
  const { formatTime, remainingTime, progress, isFinished } = useFocusTimer();
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Full Screen Toggle Handler
  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullScreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullScreen(false);
      }
    }
  };

  // Sync state with ESC key
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullScreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-[500px] w-full transition-all duration-700 ${
      isFullScreen ? "fixed inset-0 bg-black z-[100] p-12" : ""
    }`}>
      
      {/* Background Glow */}
      <div className={`absolute inset-0 pointer-events-none transition-all duration-1000 overflow-hidden ${
        isFullScreen ? "opacity-100" : "opacity-0"
      }`}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center space-y-12">
        
        {/* Session Info */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-block px-4 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] uppercase font-bold tracking-widest text-zinc-500"
          >
            {timerMode === "stopwatch" ? "Deep Focus" : "Pomodoro Cycle"}
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-5xl font-bold tracking-tight text-white capitalize"
          >
            {activeSession?.title}
          </motion.h2>
        </div>

        {/* Timer Display */}
        <div className="relative group">
          <svg className="w-64 h-64 md:w-80 md:h-80 -rotate-90">
            <circle
              cx="50%"
              cy="50%"
              r="48%"
              className="stroke-zinc-900 fill-none"
              strokeWidth="4"
            />
            {timerMode === "countdown" && (
              <motion.circle
                cx="50%"
                cy="50%"
                r="48%"
                className="stroke-orange-500 fill-none"
                strokeWidth="4"
                strokeLinecap="round"
                initial={{ strokeDasharray: "301.59 301.59", strokeDashoffset: 301.59 }}
                animate={{ strokeDashoffset: 301.59 * (1 - progress / 100) }}
                transition={{ duration: 1, ease: "linear" }}
                style={{ strokeDasharray: 301.59 }}
              />
            )}
          </svg>
          
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <motion.div 
              key={formatTime(remainingTime)}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-7xl md:text-9xl font-black tracking-tighter text-white tabular-nums"
            >
              {formatTime(remainingTime)}
            </motion.div>
          </div>
        </div>

        {/* Controls */}
        <AnimatePresence mode="wait">
          {!isFinished ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex items-center gap-6"
            >
              <button
                onClick={togglePause}
                className="w-20 h-20 rounded-full flex items-center justify-center bg-white text-black hover:scale-110 active:scale-95 transition-all shadow-xl"
              >
                {isPaused ? <Play className="w-8 h-8 fill-current translate-x-0.5" /> : <Pause className="w-8 h-8 fill-current" />}
              </button>

              <button
                onClick={onStop}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-red-500/50 transition-all"
              >
                <Square className="w-6 h-6 fill-current" />
              </button>

              <button
                onClick={toggleFullScreen}
                className="w-16 h-16 rounded-full flex items-center justify-center bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
              >
                {isFullScreen ? <Minimize2 className="w-6 h-6" /> : <Maximize2 className="w-6 h-6" />}
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center space-y-6"
            >
              <div className="flex flex-col items-center space-y-2 text-orange-500">
                <CheckCircle2 className="w-12 h-12" />
                <span className="font-bold tracking-widest uppercase text-xs">Session Complete</span>
              </div>
              <Button 
                onClick={onStop}
                className="bg-orange-500 text-white font-bold py-6 px-12 text-lg rounded-2xl"
              >
                Log Progress & End
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Zen Mode Hints */}
      {isFullScreen && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-zinc-600 text-[10px] font-medium tracking-widest uppercase animate-pulse">
          Esc to exit Zen Mode
        </div>
      )}
    </div>
  );
};
