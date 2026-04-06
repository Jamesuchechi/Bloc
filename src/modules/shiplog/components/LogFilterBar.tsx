import React, { useState, useEffect } from "react";
import { Search, Filter, Calendar, X, Plus, Download } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { focusApi, Project } from "@/modules/focus/api";
import { useShipLogStore } from "@/store/shipLogStore";
import { downloadLogsAsCSV } from "@/lib/exportUtils";
import { useAuth } from "@/hooks/useAuth";

interface LogFilterBarProps {
  onAddEntry: () => void;
}

export const LogFilterBar: React.FC<LogFilterBarProps> = ({ onAddEntry }) => {
  const { user } = useAuth();
  const { filters, setFilters, entries } = useShipLogStore();
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchValue, setSearchValue] = useState(filters.search);

  useEffect(() => {
    if (user) {
      focusApi.getProjects(user.id).then(setProjects);
    }
  }, [user]);

  // Handle interior search value separately to debounce if needed
  useEffect(() => {
    const timer = setTimeout(() => {
      setFilters({ search: searchValue });
    }, 400);
    return () => clearTimeout(timer);
  }, [searchValue, setFilters]);

  const clearFilters = () => {
    setFilters({ projectId: null, search: "", startDate: null, endDate: null });
    setSearchValue("");
  };

  const hasActiveFilters = filters.projectId || filters.search || filters.startDate || filters.endDate;

  return (
    <div className="flex flex-col md:flex-row items-center gap-4 py-6 px-4 md:px-0">
      {/* Search Input */}
      <div className="relative w-full md:w-80 group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/60 group-focus-within:text-amber transition-colors" />
        <Input 
          type="text" 
          placeholder="Search entries..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="pl-10 bg-surface2/50 border-border/30 focus:border-amber/40 focus:ring-amber/5"
        />
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {/* Project Filter */}
        <select 
          value={filters.projectId || ""} 
          onChange={(e) => setFilters({ projectId: e.target.value || null })}
          className="h-10 px-4 bg-surface2/50 border border-border/30 rounded-xl text-xs font-semibold text-mist uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-amber/10 transition-all cursor-pointer hover:bg-surface2"
        >
          <option value="">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Date Filter Placeholder */}
        <div className="h-10 flex items-center gap-2 px-4 bg-surface2/50 border border-border/30 rounded-xl text-xs font-semibold text-mist uppercase tracking-widest cursor-pointer hover:bg-surface2 text-nowrap">
          <Calendar className="h-3.5 w-3.5 text-amber" />
          This Week
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={clearFilters}
            className="flex items-center gap-1.5 text-mist hover:text-red-400 transition-colors"
          >
            <X className="h-4 w-4" />
            Clear
          </Button>
        )}
      </div>

      <div className="flex-1" />

      {/* Action Buttons */}
      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
        <Button 
          variant="outline"
          onClick={() => downloadLogsAsCSV(entries)}
          className="h-11 px-4 border-border/30 hover:bg-surface2 hover:text-amber transition-all shadow-sm"
          title="Export as CSV"
        >
          <Download className="h-5 w-5" />
        </Button>
        <Button 
          onClick={onAddEntry}
          className="w-full md:w-auto h-11 bg-amber hover:bg-amber/90 text-ink font-bold gap-2 px-6 shadow-lg shadow-amber/10"
        >
          <Plus className="h-5 w-5" />
          Ship Log Entry
        </Button>
      </div>
    </div>
  );
};
