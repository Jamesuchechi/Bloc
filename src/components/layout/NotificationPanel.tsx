import React from "react";
import { formatDistanceToNow, parseISO } from "date-fns";
import { 
  Bell, 
  CheckCheck, 
  MessageSquare, 
  Briefcase, 
  Zap, 
  Info, 
  X,
  ExternalLink
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNotificationStore } from "@/store/notificationStore";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "../ui/Button";
import { Badge } from "../ui/Badge";
import { useNavigate } from "react-router-dom";

export function NotificationPanel({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { user } = useAuth();
  const { notifications, markAsRead, markAllAsRead, unreadCount } = useNotificationStore();
  const navigate = useNavigate();

  const handleMarkAllRead = () => {
    if (user) markAllAsRead(user.id);
  };

  const handleNotificationClick = (n: any) => {
    markAsRead(n.id);
    if (n.link) {
      navigate(n.link);
      onClose();
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'proposal_signed': return <Briefcase className="h-4 w-4 text-emerald-400" />;
      case 'deliverable_approved': return <CheckCheck className="h-4 w-4 text-blue-400" />;
      case 'info': return <Info className="h-4 w-4 text-amber" />;
      default: return <Zap className="h-4 w-4 text-purple-400" />;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop for mobile */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
          />
          
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-16 right-0 w-80 md:w-96 max-h-[500px] bg-surface/90 border border-border/20 shadow-2xl rounded-3xl backdrop-blur-2xl z-[60] overflow-hidden flex flex-col"
          >
            <div className="p-5 border-b border-border/10 flex items-center justify-between bg-white/5">
               <div className="flex items-center gap-2">
                 <h3 className="font-black text-chalk uppercase tracking-widest text-xs">Notifications</h3>
                 {unreadCount > 0 && <Badge variant="amber" className="h-4 px-1.5 text-[10px]">{unreadCount}</Badge>}
               </div>
               <div className="flex items-center gap-1">
                 <Button variant="ghost" size="sm" onClick={handleMarkAllRead} className="h-8 text-[10px] font-bold uppercase tracking-widest text-mist hover:text-amber">
                   Mark all read
                 </Button>
                 <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-mist">
                   <X className="h-4 w-4" />
                 </Button>
               </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-2">
              {notifications.length > 0 ? (
                <div className="space-y-1">
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`w-full text-left p-4 rounded-2xl transition-all flex gap-4 group hover:bg-white/5 ${!n.is_read ? 'bg-amber/5 border-l-2 border-amber' : 'opacity-70'}`}
                    >
                      <div className={`h-10 w-10 shrink-0 rounded-xl flex items-center justify-center border border-border/10 shadow-inner ${!n.is_read ? 'bg-amber/10' : 'bg-surface2'}`}>
                        {getIcon(n.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className={`text-sm font-bold truncate ${!n.is_read ? 'text-chalk' : 'text-mist'}`}>{n.title}</h4>
                          <span className="text-[9px] font-medium text-mist/40 uppercase whitespace-nowrap ml-2">
                            {formatDistanceToNow(parseISO(n.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-mist/60 line-clamp-2 leading-relaxed italic">{n.message}</p>
                        {n.link && (
                           <div className="mt-2 flex items-center gap-1 text-[9px] font-black uppercase text-amber opacity-0 group-hover:opacity-100 transition-opacity">
                              View details <ExternalLink className="h-2.5 w-2.5" />
                           </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="py-20 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-surface2 flex items-center justify-center mx-auto opacity-40">
                    <Bell className="h-6 w-6 text-mist" />
                  </div>
                  <p className="text-xs text-mist/40 font-bold uppercase tracking-widest italic">All clear for now.</p>
                </div>
              )}
            </div>

            <div className="p-3 border-t border-border/5 text-center bg-black/20">
               <button className="text-[10px] font-black uppercase tracking-[0.2em] text-mist/40 hover:text-amber transition-colors">
                  View full history
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
