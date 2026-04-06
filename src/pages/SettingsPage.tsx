import React, { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Bell, 
  Palette, 
  Shield, 
  LogOut, 
  Zap,
  Globe,
  Monitor,
  Moon,
  Sun,
  AtSign,
  Save,
  Check
} from "lucide-react";
import { useAppStore } from "@/store/appStore";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";

const container = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0 }
};

const ACCENT_COLORS = [
  { name: "Bloc Amber", value: "#e8a020" },
  { name: "Electric Blue", value: "#3b82f6" },
  { name: "Emerald", value: "#10b981" },
  { name: "Royal Purple", value: "#8b5cf6" },
  { name: "Crimson", value: "#f43f5e" },
];

export default function SettingsPage() {
  const { user, setUser } = useAppStore();
  const { signOut } = useAuth();
  
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    }
  }, [user]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    try {
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: fullName }
      });
      
      if (error) throw error;
      
      if (data.user) {
        setUser(data.user as any);
        toast.success("Profile updated successfully!");
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update profile");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl md:text-5xl font-black text-chalk tracking-tighter flex items-center gap-4">
          <Settings className="h-10 w-10 text-amber animate-spin-slow" />
          System Control
        </h1>
        <p className="text-mist mt-1 text-lg font-medium opacity-70 italic">Manage your builder identity, security, and global preferences.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-3 gap-8"
      >
        
        {/* Navigation Sidebar (Local) */}
        <div className="lg:col-span-1 space-y-4">
           <SettingsSection title="Personal" items={[
             { id: 'profile', label: 'Builder Profile', icon: User, active: true },
             { id: 'account', label: 'Account Security', icon: Shield },
           ]} />
           <SettingsSection title="Preferences" items={[
             { id: 'appearance', label: 'Interface & Themes', icon: Palette },
             { id: 'notifications', label: 'Notification Rules', icon: Bell },
           ]} />
           <SettingsSection title="Workspace" items={[
             { id: 'integrations', label: 'Third-Party Links', icon: Zap },
             { id: 'region', label: 'Region & Timezone', icon: Globe },
           ]} />
           
           <div className="pt-6">
             <Button 
                variant="outline" 
                onClick={() => signOut()}
                className="w-full h-12 border-red-500/10 text-red-400 hover:bg-red-500/10 font-black uppercase tracking-widest text-xs"
             >
               <LogOut className="h-4 w-4 mr-2" /> Sign Out
             </Button>
           </div>
        </div>

        {/* Settings Content */}
        <div className="lg:col-span-2 space-y-8">
           
           {/* Profile Section */}
           <motion.div variants={item}>
             <Card className="bg-surface/20 border-border/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-border/5 mb-6">
                   <CardTitle className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3">
                      <User className="h-4 w-4 text-amber" /> Identity
                   </CardTitle>
                   <CardDescription>Your details are used for client portals and proposal branding.</CardDescription>
                </CardHeader>
                <CardContent>
                   <form onSubmit={handleUpdateProfile} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-mist/40">Full Name</label>
                            <Input 
                               value={fullName}
                               onChange={(e) => setFullName(e.target.value)}
                               className="h-12 bg-surface2/50 border-border/10 text-chalk focus:border-amber/40"
                               placeholder="e.g. Satoshi Nakamoto"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-mist/40 cursor-not-allowed">Email Address</label>
                            <div className="relative">
                              <Input 
                                 value={user?.email || ""}
                                 disabled
                                 className="h-12 bg-black/20 border-border/5 text-mist/40 cursor-not-allowed italic"
                              />
                              <AtSign className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/20" />
                            </div>
                         </div>
                      </div>
                      
                      <div className="flex justify-end items-center gap-4">
                         {showSaveSuccess && (
                            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                               <Check className="h-3 w-3" /> Changes saved!
                            </span>
                         )}
                         <Button 
                            type="submit" 
                            disabled={isUpdatingProfile}
                            className="bg-amber hover:bg-amber/90 text-ink h-12 px-8 font-black uppercase tracking-widest text-xs shadow-xl shadow-amber/10"
                         >
                            {isUpdatingProfile ? "Saving..." : "Save Identity"} <Save className="h-4 w-4 ml-2" />
                         </Button>
                      </div>
                   </form>
                </CardContent>
             </Card>
           </motion.div>

           {/* Appearance Section */}
           <motion.div variants={item}>
             <Card className="bg-surface/20 border-border/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-border/5 mb-6">
                   <CardTitle className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3">
                      <Palette className="h-4 w-4 text-amber" /> Theming
                   </CardTitle>
                   <CardDescription>Customize the look and feel of your builder workspace.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                   
                   <div className="space-y-4">
                      <label className="text-[10px] font-black uppercase tracking-widest text-mist/40">Global Accent Color</label>
                      <div className="flex flex-wrap gap-4">
                         {ACCENT_COLORS.map((c) => (
                            <button 
                               key={c.value}
                               className={`h-12 w-12 rounded-2xl border-2 transition-all flex items-center justify-center group ${c.value === '#e8a020' ? 'border-amber shadow-[0_0_15px_rgba(232,160,32,0.3)]' : 'border-border/10'}`}
                               style={{ backgroundColor: `${c.value}10` }}
                            >
                               <div className="h-4 w-4 rounded-full" style={{ backgroundColor: c.value }} />
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ThemeButton icon={Sun} label="Light" active={false} />
                      <ThemeButton icon={Moon} label="Dark" active={true} />
                      <ThemeButton icon={Monitor} label="System" active={false} />
                   </div>

                </CardContent>
             </Card>
           </motion.div>

           {/* Notifications Toggle (Mock) */}
           <motion.div variants={item}>
              <Card className="bg-surface/20 border-border/10 backdrop-blur-3xl opacity-60">
                 <CardContent className="p-8 flex items-center justify-between">
                    <div className="flex items-center gap-6">
                       <div className="h-14 w-14 rounded-2xl bg-surface2 border border-border/10 flex items-center justify-center text-amber">
                          <Bell className="h-6 w-6" />
                       </div>
                       <div>
                          <h4 className="font-black text-chalk text-lg tracking-tight">Desktop Notifications</h4>
                          <p className="text-mist/60 text-xs font-medium">Receive real-time alerts even when application is in background.</p>
                       </div>
                    </div>
                    <div className="h-8 w-14 bg-surface2 border border-border/10 rounded-full relative p-1 cursor-not-allowed">
                       <div className="h-6 w-6 bg-mist/20 rounded-full" />
                    </div>
                 </CardContent>
              </Card>
           </motion.div>

        </div>
      </motion.div>

    </div>
  );
}

function SettingsSection({ title, items }: { title: string, items: any[] }) {
  return (
    <div className="space-y-2">
       <label className="text-[9px] font-black uppercase tracking-[0.3em] text-mist/20 px-4">{title}</label>
       <div className="bg-surface/40 border border-border/10 rounded-3xl p-2 backdrop-blur-md">
          {items.map(item => (
            <button 
              key={item.id}
              disabled={!item.active}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${item.active ? 'bg-amber/10 text-amber' : 'text-mist/40 hover:bg-white/5 cursor-not-allowed'}`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
              {!item.active && <Badge variant="outline" className="ml-auto text-[8px] border-border/10 text-mist/20">SOON</Badge>}
            </button>
          ))}
       </div>
    </div>
  )
}

function ThemeButton({ icon: Icon, label, active }: { icon: any, label: string, active: boolean }) {
  return (
    <button className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 group ${active ? 'bg-amber/10 border-amber/40 text-chalk' : 'bg-surface2/30 border-border/5 text-mist/40 hover:border-border/20'}`}>
       <Icon className={`h-6 w-6 ${active ? 'text-amber' : 'group-hover:text-mist'}`} />
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  )
}
