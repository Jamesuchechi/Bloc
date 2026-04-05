import { LucideIcon } from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "./Button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-[400px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface/50 p-8 text-center animate-in fade-in zoom-in duration-300",
        className
      )}
    >
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface2/80 ring-1 ring-border">
        {Icon ? (
          <Icon className="h-10 w-10 text-amber" />
        ) : (
          <div className="h-10 w-10 rounded-full bg-amber/20" />
        )}
      </div>
      <h3 className="mt-6 text-xl font-semibold text-chalk">{title}</h3>
      <p className="mt-2 mb-8 max-w-sm text-sm text-mist">{description}</p>
      {action && (
        <Button onClick={action.onClick} variant="primary">
          {action.label}
        </Button>
      )}
    </div>
  );
}
