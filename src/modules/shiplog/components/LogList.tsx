import React from "react";
import { format, isToday, isYesterday, parseISO } from "date-fns";
import { LogItem } from "./LogItem";
import { LogEntryExtended } from "../api";
import { useShipLogStore } from "@/store/shipLogStore";
import { Loader2, Inbox } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LogListProps {
  onEdit: (entry: LogEntryExtended) => void;
  onDelete: (id: string) => void;
}

export const LogList: React.FC<LogListProps> = ({ onEdit, onDelete }) => {
  const { entries, isLoading, hasMore, fetchEntries, offset } = useShipLogStore();
  const { user } = React.useMemo(() => ({ user: JSON.parse(localStorage.getItem('bloc-auth-storage') || '{}').state?.user }), []);

  if (isLoading && entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 text-amber animate-spin" />
        <p className="text-mist text-sm font-medium animate-pulse uppercase tracking-widest">Fetching Ship Log...</p>
      </div>
    );
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-border/30 rounded-3xl bg-surface/20">
        <div className="h-16 w-16 mb-6 rounded-full bg-ink/50 flex items-center justify-center border border-border/30 shadow-inner">
          <Inbox className="h-8 w-8 text-mist/40" />
        </div>
        <h3 className="text-xl font-bold text-chalk mb-2">No logs found</h3>
        <p className="text-mist max-w-xs mx-auto">
          You haven't shipped anything that matches these filters yet. Start a focus session to auto-log!
        </p>
      </div>
    );
  }

  // Group entries by date
  const groupedEntries: { [key: string]: LogEntryExtended[] } = {};
  entries.forEach((entry) => {
    const dateStr = entry.date;
    if (!groupedEntries[dateStr]) {
      groupedEntries[dateStr] = [];
    }
    groupedEntries[dateStr].push(entry);
  });

  const sortedDates = Object.keys(groupedEntries).sort((a, b) => b.localeCompare(a));

  const getDateLabel = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "EEEE, MMMM do");
  };

  return (
    <div className="space-y-12 pb-20">
      {sortedDates.map((dateStr) => (
        <section key={dateStr} className="space-y-6">
          <div className="sticky top-0 z-10 py-4 bg-ink/90 backdrop-blur-md flex items-center gap-4">
            <h2 className="text-xs font-bold uppercase tracking-[0.3em] text-amber whitespace-nowrap">
              {getDateLabel(dateStr)}
            </h2>
            <div className="h-[1px] w-full bg-gradient-to-r from-amber/20 to-transparent" />
          </div>
          
          <div className="flex flex-col gap-6">
            {groupedEntries[dateStr].map((entry) => (
              <LogItem 
                key={entry.id} 
                entry={entry} 
                onEdit={onEdit} 
                onDelete={onDelete} 
              />
            ))}
          </div>
        </section>
      ))}

      {hasMore && (
        <div className="flex justify-center pt-8">
          <Button 
            variant="outline" 
            onClick={() => user && fetchEntries(user.id, true)}
            disabled={isLoading}
            className="border-border/50 text-mist hover:bg-surface2"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Load More Entries
          </Button>
        </div>
      )}
    </div>
  );
};
