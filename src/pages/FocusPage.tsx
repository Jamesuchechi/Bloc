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
    <div className="container mx-auto px-4 py-8 max-w-6xl space-y-12">
      {!activeSession ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <SessionSetup onStart={handleStartSession} />
          </div>
          <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l border-zinc-900 lg:pl-12 pt-12 lg:pt-0">
            <SessionHistory />
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
