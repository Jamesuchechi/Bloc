import { useEffect, useRef } from "react";
import { useFocusStore } from "@/store/focusStore";

export const useFocusTimer = () => {
  const { isRunning, isPaused, tick, elapsed, timerMode, countdownDuration, soundEnabled } = useFocusStore();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize sound
  useEffect(() => {
    audioRef.current = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3"); // Subtle "Ding"
    audioRef.current.volume = 0.5;
  }, []);

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, isPaused, tick]);

  // Handle countdown finished
  useEffect(() => {
    if (timerMode === "countdown" && isRunning) {
      const totalSeconds = countdownDuration * 60;
      if (elapsed >= totalSeconds) {
        if (soundEnabled && audioRef.current) {
          audioRef.current.play().catch(e => console.warn("Audio playback blocked", e));
        }
      }
    }
  }, [elapsed, timerMode, isRunning, countdownDuration, soundEnabled]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    
    if (h > 0) {
      return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const getRemainingTime = () => {
    if (timerMode === "stopwatch") return elapsed;
    const totalSeconds = countdownDuration * 60;
    return Math.max(0, totalSeconds - elapsed);
  };

  const getProgress = () => {
    if (timerMode === "stopwatch") return 0;
    const totalSeconds = countdownDuration * 60;
    return (elapsed / totalSeconds) * 100;
  };

  return {
    formatTime,
    remainingTime: getRemainingTime(),
    progress: getProgress(),
    isFinished: timerMode === "countdown" && elapsed >= (countdownDuration * 60)
  };
};
