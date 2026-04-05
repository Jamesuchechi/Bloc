import { useAppStore } from "../../store/appStore";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Search, Bell, User as UserIcon, Menu, X } from "lucide-react";

export function TopBar() {
  const { activeModule, user, mobileMenuOpen, toggleMobileMenu } = useAppStore();

  const moduleTitles: Record<string, string> = {
    focus: "Focus Timer",
    dashboard: "Dashboard",
    modules: "Modules",
    settings: "Settings",
    shiplog: "Ship Log",
    clients: "Clients",
    proposals: "Proposals",
  };

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-surface/50 px-4 md:px-6 backdrop-blur-md sticky top-0 z-40">
      {/* Module Title & Hamburger */}
      <div className="flex items-center gap-3 md:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="lg:hidden h-9 w-9 text-mist hover:text-chalk"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
        <h1 className="text-lg md:text-xl font-bold tracking-tight text-chalk uppercase truncate max-w-[150px] md:max-w-none">
          {moduleTitles[activeModule] || "Overview"}
        </h1>
        <Badge variant="amber" className="hidden sm:inline-flex">Alpha</Badge>
      </div>

      {/* Global Actions & User Profile */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-9 w-9 text-mist hover:text-chalk">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-mist hover:text-chalk relative">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-amber shadow-[0_0_8px_rgba(232,160,32,0.6)]" />
          </Button>
        </div>

        <div className="h-6 w-px bg-border mx-2" />

        <Button variant="outline" className="h-9 gap-2">
           <UserIcon className="h-4 w-4 text-amber" />
           <span className="hidden md:inline text-xs font-semibold">{user?.email || "Account"}</span>
        </Button>
      </div>
    </header>
  );
}
