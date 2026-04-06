import React, { useEffect, useMemo } from "react";
import { format, parseISO, isSameDay, subDays } from "date-fns";
import { 
  Bell, 
  CheckCheck, 
  Briefcase, 
  Zap, 
  Info, 
  Trash2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/appStore";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/Card";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function NotificationsPage() {
  const { user } = useAuth();
  const { setActiveModule } = useAppStore();
  const { notifications, markAsRead, markAllAsRead, unreadCount, fetchNotifications } = useNotificationStore();
  const navigate = useNavigate();

  useEffect(() => {
    setActiveModule("notifications");
    if (user) {
      fetchNotifications(user.id);
    }
  }, [user, fetchNotifications, setActiveModule]);

  const handleMarkAllRead = () => {
    if (user) markAllAsRead(user.id);
  };

  const handleNotificationClick = (n: any) => {
    markAsRead(n.id);
    if (n.link) {
      navigate(n.link);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'proposal_signed': return <Briefcase className="h-5 w-5 text-emerald-400" />;
      case 'deliverable_approved': return <CheckCheck className="h-5 w-5 text-blue-400" />;
      case 'info': return <Info className="h-5 w-5 text-amber" />;
      default: return <Zap className="h-5 w-5 text-purple-400" />;
    }
  };

  // Group notifications by day
  const groupedNotifications = useMemo(() => {
    const groups: Record<string, typeof notifications> = {};
    notifications.forEach(n => {
      const date = format(parseISO(n.created_at), 'MMMM d, yyyy');
      if (!groups[date]) groups[date] = [];
      groups[date].push(n);
    });
    return Object.entries(groups);
  }, [notifications]);

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-chalk tracking-tighter flex items-center gap-4">
            <Bell className="h-10 w-10 text-amber" />
            Inbox
          </h1>
          <p className="text-mist mt-1 text-lg font-medium opacity-70 italic">Your live feed of business events and ship achievements.</p>
        </div>
        
        <div className="flex gap-3">
          {unreadCount > 0 && (
            <Button 
                variant="outline" 
                onClick={handleMarkAllRead}
                className="h-12 border-white/5 hover:bg-white/5 font-black uppercase tracking-widest text-xs"
            >
              <CheckCheck className="h-4 w-4 mr-2" /> Mark All Read
            </Button>
          )}
          <Button 
              variant="ghost" 
              className="h-12 text-mist hover:text-red-400 font-bold"
          >
             <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-32 space-y-6 opacity-30">
           <div className="h-24 w-24 rounded-full border-2 border-dashed border-mist/20 flex items-center justify-center">
             <Bell className="h-10 w-10 text-mist" />
           </div>
           <p className="text-lg font-bold uppercase tracking-widest text-mist italic">Quiet as a graveyard.</p>
        </div>
      ) : (
        <motion.div variants={container} initial="hidden" animate="show" className="space-y-12">
          {groupedNotifications.map(([date, items]) => (
            <section key={date} className="space-y-6">
               <div className="flex items-center gap-4">
                 <h2 className="text-xs font-black text-mist/40 uppercase tracking-[0.4em] whitespace-nowrap">{date}</h2>
                 <div className="h-px w-full bg-border/10" />
               </div>

               <div className="grid gap-4">
                 {items.map((n) => (
                    <motion.div key={n.id} variants={item}>
                      <Card 
                        onClick={() => handleNotificationClick(n)}
                        className={`bg-surface/30 border-border/10 backdrop-blur-xl group hover:border-amber/20 transition-all cursor-pointer overflow-hidden ${!n.is_read ? 'border-l-4 border-l-amber' : ''}`}
                      >
                        <CardContent className="p-6 flex gap-6 items-center">
                           <div className={`h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center border border-border/10 shadow-inner ${!n.is_read ? 'bg-amber/10 text-amber' : 'bg-surface2 text-mist'}`}>
                             {getIcon(n.type)}
                           </div>
                           
                           <div className="flex-1 min-w-0">
                              <h3 className={`text-lg font-black tracking-tight ${!n.is_read ? 'text-chalk' : 'text-mist'}`}>{n.title}</h3>
                              <p className="text-sm text-mist/60 font-medium leading-relaxed mt-1">{n.message}</p>
                           </div>

                           <div className="flex flex-col items-end gap-3">
                              <span className="text-[10px] font-bold text-mist/30 uppercase">{format(parseISO(n.created_at), 'h:mm a')}</span>
                              {n.link && (
                                <div className="h-8 w-8 rounded-full bg-white/5 border border-white/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                                   <ChevronRight className="h-4 w-4 text-amber" />
                                </div>
                              )}
                           </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                 ))}
               </div>
            </section>
          ))}
        </motion.div>
      )}

    </div>
  );
}
