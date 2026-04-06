import { LogEntryExtended } from "@/modules/shiplog/api";

export function downloadLogsAsCSV(entries: LogEntryExtended[]) {
  if (!entries || entries.length === 0) return;

  const headers = ["ID", "Date", "Project", "Description", "Duration (mins)", "Tags"];
  
  const csvRows = entries.map(entry => {
    return [
      entry.id,
      entry.date,
      entry.projects?.name || "Uncategorized",
      `"${(entry.description || "").replace(/"/g, '""')}"`, // escape quotes for CSV
      entry.duration_mins || 0,
      entry.tags ? `"${entry.tags.join(', ')}"` : '""'
    ].join(",");
  });

  const csvContent = [headers.join(","), ...csvRows].join("\n");
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `bloc_shiplog_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
