import { create } from "zustand";

interface FocusSession {
  id: string;
  name: string;
  duration: number; // minutes
}

interface FocusState {
  activeSession: FocusSession | null;
  elapsed: number; // seconds
  isRunning: boolean;
  isPaused: boolean;
  _intervalID: NodeJS.Timeout | null;

  startSession: (session: FocusSession) => void;
  pauseSession: () => void;
  resumeSession: () => void;
  endSession: () => { session: FocusSession | null; duration: number };
}

export const useFocusStore = create<FocusState>((set, get) => ({
  activeSession: null,
  elapsed: 0,
  isRunning: false,
  isPaused: false,
  _intervalID: null,

  startSession: (session: FocusSession) => {
    const { _intervalID } = get();
    if (_intervalID) clearInterval(_intervalID);

    const id = setInterval(() => {
      if (get().isRunning) {
        set((s) => ({ elapsed: s.elapsed + 1 }));
      }
    }, 1000);

    set({
      activeSession: session,
      elapsed: 0,
      isRunning: true,
      isPaused: false,
      _intervalID: id as any as NodeJS.Timeout,
    });
  },

  pauseSession: () => set({ isRunning: false, isPaused: true }),
  resumeSession: () => set({ isRunning: true, isPaused: false }),

  endSession: () => {
    const { _intervalID, activeSession, elapsed } = get();
    if (_intervalID) clearInterval(_intervalID);
    
    const duration = Math.floor(elapsed / 60);
    set({
      activeSession: null,
      elapsed: 0,
      isRunning: false,
      isPaused: false,
      _intervalID: null,
    });
    
    return { session: activeSession, duration };
  },
}));
