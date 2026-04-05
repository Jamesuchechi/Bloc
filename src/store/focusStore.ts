import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ActiveSession {
  id: string;
  title: string;
  projectId: string | null;
  startedAt: string;
}

interface FocusState {
  // Session State
  activeSession: ActiveSession | null;
  
  // Timer State
  elapsed: number; // in seconds
  isRunning: boolean;
  isPaused: boolean;
  timerMode: "stopwatch" | "countdown";
  countdownDuration: number; // in minutes (default 25)
  
  // Settings
  soundEnabled: boolean;
  pomodoroMode: boolean;
  
  // Actions
  setActiveSession: (session: ActiveSession | null) => void;
  setElapsed: (elapsed: number) => void;
  tick: () => void;
  startTimer: () => void;
  pauseTimer: () => void;
  resumeTimer: () => void;
  resetTimer: () => void;
  setTimerMode: (mode: FocusState["timerMode"]) => void;
  setCountdownDuration: (duration: number) => void;
  setSoundEnabled: (enabled: boolean) => void;
  setPomodoroMode: (enabled: boolean) => void;
  togglePause: () => void;
}

export const useFocusStore = create<FocusState>()(
  persist(
    (set) => ({
      activeSession: null,
      elapsed: 0,
      isRunning: false,
      isPaused: false,
      timerMode: "stopwatch",
      countdownDuration: 25,
      soundEnabled: true,
      pomodoroMode: false,

      setActiveSession: (session) => set({ activeSession: session }),
      
      setElapsed: (elapsed) => set({ elapsed }),
      
      tick: () => set((state) => {
        if (!state.isRunning || state.isPaused) return state;
        
        if (state.timerMode === "countdown") {
          const totalSeconds = state.countdownDuration * 60;
          if (state.elapsed >= totalSeconds) {
            return { isRunning: false, isPaused: false };
          }
          return { elapsed: state.elapsed + 1 };
        }
        
        return { elapsed: state.elapsed + 1 };
      }),

      startTimer: () => set({ isRunning: true, isPaused: false }),
      
      pauseTimer: () => set({ isPaused: true }),
      
      resumeTimer: () => set({ isPaused: false }),
      
      resetTimer: () => set({ elapsed: 0, isRunning: false, isPaused: false }),
      
      togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

      setTimerMode: (timerMode) => set({ timerMode }),
      
      setCountdownDuration: (countdownDuration) => set({ countdownDuration }),
      
      setSoundEnabled: (soundEnabled) => set({ soundEnabled }),
      
      setPomodoroMode: (pomodoroMode) => set({ pomodoroMode }),
    }),
    {
      name: "bloc-focus-storage",
      partialize: (state) => ({
        activeSession: state.activeSession,
        elapsed: state.elapsed,
        timerMode: state.timerMode,
        countdownDuration: state.countdownDuration,
        soundEnabled: state.soundEnabled,
        pomodoroMode: state.pomodoroMode,
      }),
    }
  )
);
