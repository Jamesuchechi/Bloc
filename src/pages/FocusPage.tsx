import { useState } from "react";
import { useFocusStore } from "@/store/focusStore";
import { useAppStore } from "@/store/appStore";
import { focusApi } from "@/modules/focus/api";
import { notificationsApi } from "@/modules/notifications/api";
import { SessionSetup } from "@/modules/focus/components/SessionSetup";
import { ActiveSession } from "@/modules/focus/components/ActiveSession";
import { SessionHistory } from "@/modules/focus/components/SessionHistory";
import { EndSessionModal } from "@/modules/focus/components/EndSessionModal";
import { toast } from "react-hot-toast";
import { Timer, Play } from "lucide-react";

export default function FocusPage() {
  const { user } = useAppStore();
  const { activeSession, setActiveSession, startTimer, resetTimer, elapsed } = useFocusStore();
  const [showEndModal, setShowEndModal] = useState(false);

  const handleStartSession = async (title: string, projectId: string | null) => {
    if (!user) return;
    
    try {
      const session = await focusApi.createSession({
        userId: user.id,
        title,
        projectId,
        startedAt: new Date().toISOString(),
      });
      
      setActiveSession({
        id: session.id,
        title: session.title,
        projectId: session.project_id,
        startedAt: session.started_at,
      });
      
      resetTimer();
      startTimer();
      toast.success("Focus session launched!");
    } catch (error) {
      console.error("Failed to start session:", error);
      toast.error("Could not start session. Please try again.");
    }
  };

  const handleStopSession = () => {
    setShowEndModal(true);
  };

  const handleConfirmEndSession = async (notes: string) => {
    if (!activeSession || !user) return;
    
    try {
      const endedAt = new Date().toISOString();
      const durationMins = Math.max(1, Math.round(elapsed / 60));
      
      await focusApi.endSession(activeSession.id, {
        endedAt,
        durationMins,
        notes,
      });
      
      // Auto-create log entry for the Ship Log
      await focusApi.createLogEntry({
        user_id: user.id,
        project_id: activeSession.projectId,
        session_id: activeSession.id,
        date: endedAt.split("T")[0],
        description: notes || `Focus Session: ${activeSession.title}`,
        duration_mins: durationMins,
        tags: ["focus"],
      });

      // Notification
      await notificationsApi.createNotification({
        user_id: user.id,
        type: 'info',
        title: 'Focus Goal Reached! 🚀',
        message: `You just finished a ${durationMins}m session: "${activeSession.title}"`,
      });

      setActiveSession(null);
      resetTimer();
      setShowEndModal(false);
      toast.success("Session completed and logged!");
      
      // Refresh history (automatically happens on re-render of SessionHistory)
    } catch (error) {
      console.error("Failed to end session:", error);
      toast.error("Could not save session properly.");
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 min-h-screen relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-amber/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      {!activeSession ? (
        <div className="relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-amber font-black tracking-[0.3em] uppercase text-xs">
                <Timer className="h-5 w-5" />
                Vessel Focus
                <span className="ml-4 px-2 py-0.5 rounded-full bg-amber/10 border border-amber/20 text-[10px] lowercase tracking-normal font-bold">Alpha</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-chalk tracking-tighter leading-tight">
                Focus <span className="text-amber">Timer.</span>
              </h1>
              <p className="text-mist max-w-lg text-lg leading-relaxed">
                Deep work is the bridge to shipping. Eliminate distractions, enter the flow state, and compound your progress one block at a time.
              </p>
            </div>
            
            {/* Quick Stats Stats Placeholder matches ShipLog style */}
            <div className="hidden lg:flex items-center gap-6 p-4 rounded-2xl bg-surface/30 border border-border/10 backdrop-blur-sm">
               <div className="h-10 w-10 rounded-xl bg-amber/10 flex items-center justify-center border border-amber/20">
                  <Play className="h-5 w-5 text-amber fill-current" />
               </div>
               <div className="flex flex-col">
                 <span className="text-xs font-bold text-chalk uppercase tracking-widest">Ready to Build?</span>
                 <span className="text-[10px] text-mist font-medium">Select a project to begin.</span>
               </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Main Launcher */}
            <div className="lg:col-span-8 flex flex-col min-w-0">
               <SessionSetup onStart={handleStartSession} />
            </div>

            {/* Sidebar History */}
            <aside className="lg:col-span-4 sticky top-24">
               <div className="p-6 rounded-2xl bg-surface/30 border border-border/10 backdrop-blur-sm">
                  <SessionHistory />
               </div>
            </aside>
          </div>
        </div>
      ) : (
        <ActiveSession onStop={handleStopSession} />
      )}

      <EndSessionModal
        isOpen={showEndModal}
        onClose={() => setShowEndModal(false)}
        onConfirm={handleConfirmEndSession}
      />
    </div>
  );
}
