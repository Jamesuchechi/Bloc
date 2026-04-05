import { EmptyState } from "../components/ui/EmptyState";
import { LucideIcon } from "lucide-react";

interface PlaceholderPageProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function PlaceholderPage({ title, description, icon }: PlaceholderPageProps) {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <EmptyState
        title={title}
        description={description}
        icon={icon}
        className="max-w-md border-none bg-transparent"
      />
    </div>
  );
}
