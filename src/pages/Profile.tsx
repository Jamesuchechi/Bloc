import React from 'react';
import { useAppStore } from '../store/appStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { User, Mail, Shield, Zap, LogOut, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAppStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Builder";

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-10 min-h-screen relative overflow-hidden">
      {/* Background Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-amber/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-emerald-500/5 blur-[100px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 space-y-12"
      >
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3 text-amber font-black tracking-[0.3em] uppercase text-xs">
              <Shield className="h-5 w-5" />
              Security Sector
              <span className="ml-4 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] lowercase tracking-normal font-bold text-emerald-500 font-mono">Encrypted</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-chalk tracking-tighter leading-tight">
              Account <span className="text-amber">Profile.</span>
            </h1>
            <p className="text-mist max-w-lg text-lg leading-relaxed">
              Manage your builder identity, security keys, and sector preferences from your centralized command hub.
            </p>
          </div>
          
          <div className="flex items-center gap-3">
             <Button 
               variant="outline" 
               className="h-12 px-6 gap-2 border-border/10 bg-surface/30 backdrop-blur-sm hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30 transition-all font-bold text-xs uppercase tracking-widest"
             >
               <LogOut className="h-4 w-4" />
               Sign Out
             </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Main Content - Identity Details */}
          <div className="lg:col-span-8 space-y-8">
            <Card className="border-border/10 bg-surface/30 backdrop-blur-xl p-8 rounded-3xl shadow-2xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-amber/5 blur-3xl rounded-full -mr-32 -mt-32 transition-colors group-hover:bg-amber/10" />
              
              <div className="relative z-10 space-y-10">
                <div className="flex items-center justify-between border-b border-border/10 pb-6">
                   <div className="space-y-1">
                      <h3 className="text-sm font-black text-chalk uppercase tracking-widest flex items-center gap-2">
                         <Zap className="h-4 w-4 text-amber" />
                         Information Protocol
                      </h3>
                      <p className="text-xs text-mist font-medium">Personal identity and encrypted access tokens</p>
                   </div>
                   <Button 
                      variant={isEditing ? "primary" : "outline"} 
                      size="sm"
                      onClick={() => setIsEditing(!isEditing)}
                      className="text-[10px] font-black uppercase tracking-widest h-9 px-6 transition-all"
                   >
                      {isEditing ? "Commit Changes" : "Edit Identity"}
                   </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-mist/40 uppercase tracking-[0.2em] ml-1">Full Builder Name</label>
                      <div className="relative group">
                         <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-amber/30 group-focus-within:text-amber transition-colors" />
                         <Input 
                            disabled={!isEditing}
                            value={userName}
                            className="pl-12 h-14 bg-surface/50 border-border/10 rounded-2xl text-sm font-bold text-chalk focus:border-amber/50 focus:ring-amber/10 transition-all disabled:opacity-50"
                         />
                      </div>
                   </div>

                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-mist/40 uppercase tracking-[0.2em] ml-1">Linked Email Terminal</label>
                      <div className="relative">
                         <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mist/20" />
                         <Input 
                            disabled
                            value={user?.email || ""}
                            className="pl-12 h-14 bg-ink/20 border-border/5 rounded-2xl text-sm font-bold text-mist/40 cursor-not-allowed"
                         />
                      </div>
                   </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                   <div className="flex items-center gap-5 p-5 rounded-2xl bg-surface/50 border border-border/10 group hover:border-amber/30 transition-all">
                      <div className="h-12 w-12 rounded-xl bg-ink flex items-center justify-center border border-border/20 shadow-inner">
                         <Clock className="h-5 w-5 text-amber" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-mist/40 uppercase tracking-widest">Commission Date</p>
                         <p className="text-sm text-chalk font-bold uppercase tracking-tight">Active Since April 2026</p>
                      </div>
                   </div>

                   <div className="flex items-center gap-5 p-5 rounded-2xl bg-surface/50 border border-border/10 group hover:border-emerald-500/30 transition-all">
                      <div className="h-12 w-12 rounded-xl bg-ink flex items-center justify-center border border-border/20 shadow-inner">
                         <Globe className="h-5 w-5 text-emerald-500" />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] font-black text-mist/40 uppercase tracking-widest">Network Status</p>
                         <div className="flex items-center gap-2">
                           <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                           <p className="text-sm text-chalk font-bold uppercase tracking-tight font-mono">Encrypted_Bypass</p>
                         </div>
                      </div>
                   </div>
                </div>
              </div>
            </Card>

            <div className="flex items-center justify-center gap-8 px-4 opacity-20">
               <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border/20" />
               <span className="text-[8px] font-black uppercase tracking-[0.4em] text-mist">Core Identity Sync</span>
               <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border/20" />
            </div>
          </div>

          {/* Sidebar - Profile Summary */}
          <aside className="lg:col-span-4 sticky top-24 space-y-8">
            <Card className="border-border/10 bg-surface/30 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative overflow-hidden group/card">
              <div className="absolute inset-0 bg-gradient-to-br from-amber/5 to-transparent pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center text-center space-y-6">
                <div className="relative mx-auto w-28 h-28">
                  <div className="absolute inset-0 bg-amber/20 rounded-3xl blur-2xl group-hover/card:bg-amber/30 transition-all duration-700" />
                  <div className="relative h-full w-full rounded-3xl bg-ink border-2 border-amber/20 flex items-center justify-center p-2 shadow-2xl overflow-hidden group-hover/card:border-amber/50 transition-all">
                     <User className="h-12 w-12 text-amber" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-2xl border-2 border-ink">
                     <Shield className="h-5 w-5 text-ink" />
                  </div>
                </div>

                <div className="space-y-1">
                  <h2 className="text-2xl font-black text-chalk tracking-tight uppercase">{userName}</h2>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber/10 border border-amber/20">
                    <Zap className="h-3 w-3 text-amber fill-amber animate-pulse" />
                    <span className="text-[10px] font-black text-amber uppercase tracking-widest">Elite Builder</span>
                  </div>
                </div>

                <div className="w-full pt-6 border-t border-border/10 space-y-4">
                   <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                         <span className="text-mist/40">Build Mastery</span>
                         <span className="text-amber">85%</span>
                      </div>
                      <div className="w-full h-1.5 bg-ink rounded-full overflow-hidden border border-border/5">
                         <motion.div 
                           initial={{ width: 0 }}
                           animate={{ width: "85%" }}
                           transition={{ duration: 1.5, ease: "easeOut" }}
                           className="h-full bg-amber shadow-[0_0_10px_rgba(232,160,32,0.6)]" 
                         />
                      </div>
                   </div>
                   
                   <div className="grid grid-cols-2 gap-4">
                      <div className="bg-ink/40 p-3 rounded-xl border border-border/5 text-center">
                         <p className="text-[8px] font-black text-mist/40 uppercase tracking-widest mb-1">Streak</p>
                         <p className="text-sm font-black text-chalk uppercase">12D</p>
                      </div>
                      <div className="bg-ink/40 p-3 rounded-xl border border-border/5 text-center">
                         <p className="text-[8px] font-black text-mist/40 uppercase tracking-widest mb-1">Level</p>
                         <p className="text-sm font-black text-chalk uppercase">S2</p>
                      </div>
                   </div>
                </div>

                <p className="text-[10px] text-mist/30 italic uppercase tracking-[0.2em] leading-relaxed">
                   "Vessels navigate not by the stars, but by the fire they carry within."
                </p>
              </div>
            </Card>
          </aside>
        </div>
      </motion.div>
    </div>
  );
}
