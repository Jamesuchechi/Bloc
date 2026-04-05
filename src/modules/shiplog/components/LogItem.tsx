import React from "react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Edit2, Trash2, Calendar, Clock, Tag } from "lucide-react";
import { LogEntryExtended } from "../api";
import { Button } from "@/components/ui/Button";

interface LogItemProps {
  entry: LogEntryExtended;
  onEdit: (entry: LogEntryExtended) => void;
  onDelete: (id: string) => void;
}

export const LogItem: React.FC<LogItemProps> = ({ entry, onEdit, onDelete }) => {
  const formattedDate = format(new Date(entry.date), "MMM d, yyyy");
  
  return (
    <div className="group relative bg-surface/50 border border-border/30 rounded-2xl p-6 hover:bg-surface/80 hover:border-amber/20 hover:shadow-[0_0_40px_rgba(232,160,32,0.05)] transition-all duration-300">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Date & Meta Column */}
        <div className="md:w-32 flex flex-col gap-2 shrink-0">
          <div className="flex items-center gap-2 text-xs font-bold text-mist uppercase tracking-widest">
            <Calendar className="h-3.5 w-3.5 text-amber" />
            {formattedDate}
          </div>
          {entry.duration_mins && (
            <div className="flex items-center gap-2 text-xs font-medium text-mist/70">
              <Clock className="h-3.5 w-3.5" />
              {entry.duration_mins}m
            </div>
          )}
        </div>

        {/* Content Column */}
        <div className="flex-1 min-w-0">
          {entry.projects && (
            <div className="flex items-center gap-2 mb-3">
              <div 
                className="h-2 w-2 rounded-full" 
                style={{ backgroundColor: entry.projects.color || "#e8a020" }} 
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-mist/80">
                {entry.projects.name}
              </span>
            </div>
          )}

          <div className="prose prose-sm prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {entry.description}
            </ReactMarkdown>
          </div>

          {entry.tags && entry.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {entry.tags.map((tag) => (
                <div key={tag} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-[10px] font-medium text-mist/60">
                  <Tag className="h-3 w-3" />
                  {tag}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Actions Column */}
        <div className="flex items-start gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onEdit(entry)}
            className="h-9 w-9 rounded-full bg-surface2/50 border border-border/30 hover:text-amber hover:border-amber/50"
          >
            <Edit2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onDelete(entry.id)}
            className="h-9 w-9 rounded-full bg-surface2/50 border border-border/30 hover:text-red-400 hover:border-red-400/50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
