import * as React from "react";
import { motion } from "framer-motion";
import { 
  Timer, 
  LayoutDashboard, 
  Settings, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  Bell,
  Layers,
  Ship,
  Users
} from "lucide-react";
import { cn } from "../lib/utils";
import { useAppStore } from "../store/appStore";
import { Button } from "../components/ui/Button";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  id: string;
  isActive: boolean;
  isCollapsed: boolean;
  onClick: () => void;
}

const NavItem = ({ 
  icon: Icon, 
  label, 
  isActive, 
  isCollapsed, 
  onClick 
}: NavItemProps) => (
  <button
    onClick={onClick}
    className={cn(
      "group relative flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200",
      isActive 
        ? "bg-amber text-ink font-semibold" 
        : "text-mist hover:bg-surface2 hover:text-chalk"
    )}
  >
    <Icon className={cn("h-5 w-5 shrink-0", isActive ? "text-ink" : "text-amber group-hover:scale-110 transition-transform")} />
    {!isCollapsed && (
      <span className="text-sm font-medium tracking-wide">
        {label}
      </span>
    )}
    {isCollapsed && isActive && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-ink rounded-r-full" />
    )}
  </button>
);

export function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { 
    sidebarCollapsed, 
    mobileMenuOpen,
    toggleSidebar, 
    setActiveModule,
    setMobileMenuOpen
  } = useAppStore();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { id: "focus", label: "Focus Timer", icon: Timer, path: "/focus" },
    { id: "log", label: "Ship Log", icon: Ship, path: "/log" },
    { id: "clients", label: "Clients", icon: Users, path: "/clients" },
    { id: "modules", label: "Modules", icon: Layers, path: "/modules" },
    { id: "settings", label: "Settings", icon: Settings, path: "/settings" },
  ];

  const handleNavClick = (id: string, path: string) => {
    setActiveModule(id as any);
    navigate(path);
    if (window.innerWidth < 1024) {
      setMobileMenuOpen(false);
    }
  };

  return (
    <motion.aside
      initial={false}
      animate={{ 
        width: sidebarCollapsed ? 80 : 260,
        x: typeof window !== 'undefined' && window.innerWidth < 768 
          ? (mobileMenuOpen ? 0 : -260) 
          : 0
      }}
      className={cn(
        "fixed inset-y-0 left-0 lg:relative flex h-screen flex-col border-r border-border bg-surface px-3 py-6 transition-colors duration-300 overflow-hidden shadow-xl z-50",
        sidebarCollapsed ? "lg:items-center" : "lg:items-stretch"
      )}
    >
      <div className={cn(
        "flex items-center gap-3 mb-10 px-2",
        sidebarCollapsed ? "lg:justify-center" : "justify-start"
      )}>
        <img 
          src="/logo.png" 
          alt="BLOC" 
          className="h-8 w-8 object-contain transition-transform duration-300 hover:scale-110 drop-shadow-[0_0_10px_rgba(232,160,32,0.3)]"
        />
        {( !sidebarCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && (
          <span className="text-xl font-bold tracking-tighter text-chalk uppercase">
            Bloc
          </span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavItem
            key={item.id}
            {...item}
            isActive={location.pathname === item.path}
            isCollapsed={sidebarCollapsed && (typeof window !== 'undefined' && window.innerWidth >= 768)}
            onClick={() => handleNavClick(item.id, item.path)}
          />
        ))}
      </nav>

      {/* Footer Actions */}
      <div className="mt-auto flex flex-col gap-2 border-t border-border pt-6">
        <NavItem
          id="notifications"
          label="Notifications"
          icon={Bell}
          isActive={false}
          isCollapsed={sidebarCollapsed && (typeof window !== 'undefined' && window.innerWidth >= 768)}
          onClick={() => {}}
        />
        
        <Button
          variant="ghost"
          size={sidebarCollapsed ? "icon" : "default"}
          onClick={() => signOut()}
          className={cn(
            "w-full justify-start text-mist hover:text-red-400 hover:bg-red-400/10",
            (sidebarCollapsed && typeof window !== 'undefined' && window.innerWidth >= 768) && "justify-center"
          )}
        >
          <LogOut className="h-5 w-5" />
          {(!sidebarCollapsed || (typeof window !== 'undefined' && window.innerWidth < 768)) && <span className="ml-3">Log Out</span>}
        </Button>

        {/* Collapse Toggle - Hidden on mobile */}
        <button
          onClick={toggleSidebar}
          className="hidden lg:group mt-4 lg:flex items-center justify-center rounded-lg border border-border bg-surface2 p-2 text-mist hover:text-chalk hover:border-amber transition-all shadow-inner"
        >
          {sidebarCollapsed ? (
            <ChevronRight className="h-4 w-4 group-hover:scale-125 transition-transform" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-xs font-semibold uppercase tracking-widest">Collapse</span>
            </div>
          )}
        </button>
      </div>
    </motion.aside>
  );
}
