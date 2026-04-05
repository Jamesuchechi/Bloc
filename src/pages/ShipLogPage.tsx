import React, { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useShipLogStore } from "@/store/shipLogStore";
import { LogFilterBar } from "../modules/shiplog/components/LogFilterBar";
import { LogList } from "../modules/shiplog/components/LogList";
import { LogEntryModal } from "../modules/shiplog/components/LogEntryModal";
import { WeeklySummaryPanel } from "../modules/shiplog/components/WeeklySummaryPanel";
import { LogEntryExtended } from "../modules/shiplog/api";
import { motion, AnimatePresence } from "framer-motion";
import { Ship, Info } from "lucide-react";

export default function ShipLogPage() {
  const { user } = useAuth();
  const { fetchEntries, filters } = useShipLogStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<LogEntryExtended | undefined>();

  useEffect(() => {
    if (user) {
      fetchEntries(user.id);
    }
  }, [user, filters, fetchEntries]);

  const handleEdit = (entry: LogEntryExtended) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this log entry?")) {
      await useShipLogStore.getState().deleteEntry(id);
    }
  };

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-amber font-black tracking-[0.3em] uppercase text-xs">
            <Ship className="h-5 w-5" />
            Vessel Log
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-chalk tracking-tighter leading-tight">
            Ship <span className="text-amber">Log.</span>
          </h1>
          <p className="text-mist max-w-lg text-lg leading-relaxed">
            Every commit matters. Track your builds, summarize your weeks, and keep your clients in the loop with zero friction.
          </p>
        </div>
        
        {/* Quick Help / Stats Placeholder */}
        <div className="hidden lg:flex items-center gap-6 p-4 rounded-2xl bg-surface/30 border border-border/10 backdrop-blur-sm">
           <div className="flex -space-x-2">
             {[1,2,3].map(i => (
               <div key={i} className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-surface2" />
             ))}
           </div>
           <div className="flex flex-col">
             <span className="text-xs font-bold text-chalk">Recent Clients</span>
             <span className="text-[10px] text-mist uppercase tracking-widest">3 active portals</span>
           </div>
           <Info className="h-4 w-4 text-mist/40 ml-4 hover:text-amber cursor-help" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Main Feed */}
        <div className="lg:col-span-8 flex flex-col min-w-0">
          <LogFilterBar onAddEntry={() => { setEditingEntry(undefined); setIsModalOpen(true); }} />
          
          <div className="mt-8 border-t border-border/10">
            <LogList onEdit={handleEdit} onDelete={handleDelete} />
          </div>
        </div>

        {/* Sidebar Summary */}
        <aside className="lg:col-span-4 sticky top-24">
          <WeeklySummaryPanel />
        </aside>
      </div>

      <LogEntryModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        entry={editingEntry}
      />
    </div>
  );
}
