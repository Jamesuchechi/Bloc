import { Outlet } from "react-router-dom";
import { SideBar } from "../../app/SideBar";
import { TopBar } from "./TopBar";
import { useAppStore } from "../../store/appStore";

export function AppLayout() {
  const { mobileMenuOpen, setMobileMenuOpen } = useAppStore();

  return (
    <div className="flex bg-ink min-h-screen text-chalk font-sora antialiased overflow-hidden relative">
      <SideBar />
      
      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
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
