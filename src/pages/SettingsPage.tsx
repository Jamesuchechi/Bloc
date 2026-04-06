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
  const { user, setUser, theme, setTheme, accentColor, setAccentColor } = useAppStore();
  const { signOut } = useAuth();
  
  // Profile State
  const [fullName, setFullName] = useState(user?.user_metadata?.full_name || "");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // Security State
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  // Notification State (Stored in user_metadata)
  const [prefs, setPrefs] = useState({
    email_proposals: user?.user_metadata?.prefs?.email_proposals ?? true,
    email_deliverables: user?.user_metadata?.prefs?.email_deliverables ?? true,
    email_sessions: user?.user_metadata?.prefs?.email_sessions ?? false,
    browser_alerts: user?.user_metadata?.prefs?.browser_alerts ?? true,
  });

  // Region State
  const [region, setRegion] = useState({
    timezone: user?.user_metadata?.region?.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    dateFormat: user?.user_metadata?.region?.dateFormat || "MMM d, yyyy",
  });

  const timezones = (Intl as any).supportedValuesOf ? (Intl as any).supportedValuesOf('timeZone') : ['UTC', 'Europe/London', 'America/New_York', 'Africa/Lagos'];

  useEffect(() => {
    if (user?.user_metadata?.full_name) setFullName(user.user_metadata.full_name);
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
        toast.success("Profile updated");
        setShowSaveSuccess(true);
        setTimeout(() => setShowSaveSuccess(false), 3000);
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      toast.success("Password updated successfully");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const updateMetadata = async (key: string, value: any) => {
    try {
      const currentMetadata = user?.user_metadata || {};
      const { data, error } = await supabase.auth.updateUser({
        data: { ...currentMetadata, [key]: value }
      });
      if (error) throw error;
      if (data.user) setUser(data.user as any);
      toast.success("Settings saved");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const scrollIntoView = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
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
        <div className="lg:col-span-1 space-y-4 sticky top-10 h-fit">
           <SettingsSection title="Personal" items={[
             { id: 'profile', label: 'Builder Profile', icon: User, active: true, onClick: () => scrollIntoView('profile') },
             { id: 'account', label: 'Account Security', icon: Shield, active: true, onClick: () => scrollIntoView('security') },
           ]} />
           <SettingsSection title="Preferences" items={[
             { id: 'appearance', label: 'Interface & Themes', icon: Palette, active: true, onClick: () => scrollIntoView('appearance') },
             { id: 'notifications', label: 'Notification Rules', icon: Bell, active: true, onClick: () => scrollIntoView('notifications') },
           ]} />
           <SettingsSection title="Workspace" items={[
             { id: 'integrations', label: 'Third-Party Links', icon: Zap, active: false },
             { id: 'region', label: 'Region & Timezone', icon: Globe, active: true, onClick: () => scrollIntoView('region') },
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
        <div className="lg:col-span-2 space-y-12">
           
           {/* Profile Section */}
           <motion.div variants={item} id="profile">
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
                               className="h-12 bg-surface2 border-border text-chalk focus:border-amber/40 shadow-inner"
                               placeholder="e.g. Satoshi Nakamoto"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-mist/40 cursor-not-allowed">Email Address</label>
                            <div className="relative">
                              <Input 
                                 value={user?.email || ""}
                                 disabled
                                 className="h-12 bg-black/40 border-border/10 text-mist/30 cursor-not-allowed italic shadow-inner"
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

           {/* Security Section */}
           <motion.div variants={item} id="security">
             <Card className="bg-surface/20 border-border/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-border/5 mb-6">
                   <CardTitle className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3">
                      <Shield className="h-4 w-4 text-amber" /> Security
                   </CardTitle>
                   <CardDescription>Update your credentials to keep your workspace safe.</CardDescription>
                </CardHeader>
                <CardContent>
                   <form onSubmit={handleUpdatePassword} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-mist/40">New Password</label>
                            <Input 
                               type="password"
                               value={newPassword}
                               onChange={(e) => setNewPassword(e.target.value)}
                               className="h-12 bg-surface2 border-border text-chalk focus:border-amber/40 shadow-inner"
                               placeholder="Min. 6 characters"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-mist/40">Confirm Password</label>
                            <Input 
                               type="password"
                               value={confirmPassword}
                               onChange={(e) => setConfirmPassword(e.target.value)}
                               className="h-12 bg-surface2 border-border text-chalk focus:border-amber/40 shadow-inner"
                               placeholder="Repeat password"
                            />
                         </div>
                      </div>
                      <div className="flex justify-end">
                        <Button 
                          type="submit"
                          disabled={isUpdatingPassword || !newPassword}
                          className="bg-amber hover:bg-amber/90 text-ink h-12 px-8 font-black uppercase tracking-widest text-xs"
                        >
                          {isUpdatingPassword ? "Updating..." : "Update Password"}
                        </Button>
                      </div>
                   </form>
                </CardContent>
             </Card>
           </motion.div>

           {/* Appearance Section */}
           <motion.div variants={item} id="appearance">
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
                               onClick={() => setAccentColor(c.value)}
                               className={`h-12 w-12 rounded-2xl border-2 transition-all flex items-center justify-center group ${c.value === accentColor ? 'border-chalk shadow-[0_0_15px_var(--amber-dim)] scale-110' : 'border-border/10 hover:border-border/40'}`}
                               style={{ backgroundColor: `${c.value}10` }}
                            >
                               <div className="h-4 w-4 rounded-full" style={{ backgroundColor: c.value }} />
                            </button>
                         ))}
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <ThemeButton 
                        icon={Sun} 
                        label="Light" 
                        active={theme === 'light'} 
                        onClick={() => setTheme('light')}
                      />
                      <ThemeButton 
                        icon={Moon} 
                        label="Dark" 
                        active={theme === 'dark'} 
                        onClick={() => setTheme('dark')}
                      />
                      <ThemeButton 
                        icon={Monitor} 
                        label="System" 
                        active={theme === 'system'} 
                        onClick={() => setTheme('system')}
                      />
                   </div>

                </CardContent>
             </Card>
           </motion.div>

           {/* Notifications Section */}
           <motion.div variants={item} id="notifications">
             <Card className="bg-surface/20 border-border/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-border/5 mb-6">
                   <CardTitle className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3">
                      <Bell className="h-4 w-4 text-amber" /> Notifications
                   </CardTitle>
                   <CardDescription>Choose how you want to be alerted of business events.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                   <div className="flex items-center justify-between p-4 bg-surface2/30 rounded-2xl border border-border/5">
                      <div>
                        <p className="font-bold text-chalk">New Proposal Signed</p>
                        <p className="text-xs text-mist/60">Email alert when a client accepts your bid.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefs.email_proposals} 
                        onChange={e => {
                          const newPrefs = { ...prefs, email_proposals: e.target.checked };
                          setPrefs(newPrefs);
                          updateMetadata('prefs', newPrefs);
                        }}
                        className="h-5 w-5 rounded border-amber/20 bg-ink text-amber focus:ring-amber/50"
                      />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-surface2/30 rounded-2xl border border-border/5">
                      <div>
                        <p className="font-bold text-chalk">Deliverable Approved</p>
                        <p className="text-xs text-mist/60">Notification when milestones are marked done.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        checked={prefs.email_deliverables} 
                        onChange={e => {
                          const newPrefs = { ...prefs, email_deliverables: e.target.checked };
                          setPrefs(newPrefs);
                          updateMetadata('prefs', newPrefs);
                        }}
                        className="h-5 w-5 rounded border-amber/20 bg-ink text-amber focus:ring-amber/50"
                      />
                   </div>
                   <div className="flex items-center justify-between p-4 bg-surface2/30 rounded-2xl border border-border/5 opacity-50">
                      <div>
                        <p className="font-bold text-chalk text-mist/60 italic">Daily Focus Summary (Coming Soon)</p>
                      </div>
                      <div className="h-5 w-5 rounded border-border/10 bg-ink/50" />
                   </div>
                </CardContent>
             </Card>
           </motion.div>

           {/* Region Section */}
           <motion.div variants={item} id="region">
             <Card className="bg-surface/20 border-border/10 backdrop-blur-3xl overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-border/5 mb-6">
                   <CardTitle className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3">
                      <Globe className="h-4 w-4 text-amber" /> Region
                   </CardTitle>
                   <CardDescription>Adjust localization for dates and time displays.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-mist/40">Timezone</label>
                      <select 
                        value={region.timezone}
                        onChange={e => {
                          const newReg = { ...region, timezone: e.target.value };
                          setRegion(newReg);
                          updateMetadata('region', newReg);
                        }}
                        className="w-full h-12 bg-surface2 border-border text-chalk rounded-xl px-4 focus:border-amber/40 focus:ring-2 focus:ring-amber/20 outline-none transition-all shadow-inner"
                      >
                        {timezones.map((tz: string) => <option key={tz} value={tz} className="bg-ink">{tz}</option>)}
                      </select>
                   </div>
                   <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-mist/40">Date Format</label>
                      <select 
                        value={region.dateFormat}
                        onChange={e => {
                          const newReg = { ...region, dateFormat: e.target.value };
                          setRegion(newReg);
                          updateMetadata('region', newReg);
                        }}
                        className="w-full h-12 bg-surface2 border-border text-chalk rounded-xl px-4 focus:border-amber/40 focus:ring-2 focus:ring-amber/20 outline-none transition-all shadow-inner"
                      >
                        <option value="MMM d, yyyy" className="bg-ink">Oct 24, 2023</option>
                        <option value="dd/MM/yyyy" className="bg-ink">24/10/2023</option>
                        <option value="MM/dd/yyyy" className="bg-ink">10/24/2023</option>
                        <option value="yyyy-MM-dd" className="bg-ink">2023-10-24</option>
                      </select>
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
              onClick={item.onClick}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${item.active ? 'hover:bg-amber/5 text-mist/80 hover:text-amber' : 'text-mist/40 cursor-not-allowed'}`}
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

function ThemeButton({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`p-6 rounded-3xl border transition-all flex flex-col items-center gap-3 group ${active ? 'bg-amber/10 border-amber/40 text-chalk shadow-[0_0_20px_var(--amber-dim)]' : 'bg-surface2/30 border-border/5 text-mist/40 hover:border-border/20'}`}
    >
       <Icon className={`h-6 w-6 ${active ? 'text-amber' : 'group-hover:text-mist'}`} />
       <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  )
}
