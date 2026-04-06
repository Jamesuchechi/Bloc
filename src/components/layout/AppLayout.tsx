import { Outlet, useLocation } from "react-router-dom";
import { SideBar } from "../../app/SideBar";
import { TopBar } from "./TopBar";
import { useAppStore } from "../../store/appStore";
import { useEffect } from "react";
import { GlobalSearch } from "./GlobalSearch";

export function AppLayout() {
  const { 
    mobileMenuOpen, 
    setMobileMenuOpen, 
    theme, 
    accentColor,
    setSearchOpen 
  } = useAppStore();
  const location = useLocation();

  useEffect(() => {
    // Apply Theme
    const root = document.documentElement;
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.setAttribute('data-theme', systemTheme);
    } else {
      root.setAttribute('data-theme', theme);
    }

    // Apply Accent Color
    root.style.setProperty('--amber', accentColor);
    
    // Simple helper to dim the color (30% opacity equivalent for shadows/borders)
    root.style.setProperty('--amber-dim', `${accentColor}4d`);
  }, [theme, accentColor]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [setSearchOpen]);

  // Reset scroll on navigation
  useEffect(() => {
    const main = document.querySelector('main');
    if (main) main.scrollTop = 0;
  }, [location.pathname]);

  return (
    <div className="flex bg-ink min-h-screen text-chalk font-sora antialiased relative">
      <SideBar />
      <GlobalSearch />
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <TopBar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
