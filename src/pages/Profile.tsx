import React from 'react';
import { useAppStore } from '../store/appStore';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { User, Mail, Shield, Zap, LogOut, Clock, Globe } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Profile() {
  const { user } = useAppStore();
  const [isEditing, setIsEditing] = React.useState(false);
  const userName = user?.user_metadata?.full_name || user?.email?.split('@')[0] || "Builder";

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-2">
          <Badge variant="amber" className="mb-2 uppercase tracking-widest text-[10px]">Security Sector</Badge>
          <h1 className="text-4xl font-bold tracking-tight text-chalk uppercase">
            Account Profile
          </h1>
          <p className="text-mist text-lg max-w-2xl font-light">
            Manage your builder identity, security keys, and sector preferences.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2 border-border/50 hover:bg-red-400/10 hover:text-red-400 hover:border-red-400/30">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Card */}
        <Card className="border-border/50 bg-surface/50 backdrop-blur-xl group">
          <CardHeader className="text-center pb-2">
            <div className="relative mx-auto mb-6 w-24 h-24">
              <div className="absolute inset-0 bg-amber/20 rounded-2xl blur-xl group-hover:bg-amber/30 transition-all duration-700" />
              <div className="relative h-24 w-24 rounded-2xl bg-ink border-2 border-amber/30 flex items-center justify-center p-2 shadow-2xl overflow-hidden">
                 <User className="h-10 w-10 text-amber" />
              </div>
              <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg border-2 border-ink">
                 <Shield className="h-4 w-4 text-ink" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-chalk uppercase tracking-tight">{userName}</CardTitle>
            <CardDescription className="text-mist font-mono uppercase text-[10px] tracking-widest flex items-center justify-center gap-2">
               <Zap className="h-3 w-3 text-amber fill-amber anim-pulse" />
               Level: Solo Builder
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="pt-6 border-t border-border/30">
               <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-mist">Build Streak</span>
                  <span className="text-chalk font-bold">12 Days</span>
               </div>
               <div className="w-full h-1.5 bg-ink rounded-full overflow-hidden">
                  <div className="w-[85%] h-full bg-amber shadow-[0_0_8px_rgba(232,160,32,0.6)]" />
               </div>
            </div>
            <p className="text-xs text-center text-mist italic px-4 uppercase tracking-[0.1em]">
               "Great things are done by a series of small things brought together."
            </p>
          </CardContent>
          <CardFooter>
             <Button variant="outline" className="w-full border-border/50 text-[11px] uppercase tracking-widest font-bold">
                View Ship Log Stats
             </Button>
          </CardFooter>
        </Card>

        {/* Account Details */}
        <Card className="lg:col-span-2 border-border/50 bg-ink/40 backdrop-blur-md">
          <CardHeader>
             <CardTitle className="text-xl uppercase tracking-widest flex items-center gap-2">
                <Shield className="h-5 w-5 text-amber" />
                Information Protocol
             </CardTitle>
             <CardDescription className="text-mist underline decoration-amber/30 decoration-2 underline-offset-4">
                Personal identity and access tokens
             </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-mist uppercase tracking-widest pl-1">Full Name</label>
                   <div className="relative group">
                     <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-amber/50 group-focus-within:text-amber transition-colors" />
                     <Input 
                        disabled={!isEditing}
                        value={userName}
                        className="pl-10 bg-surface/50 border-border/30 h-11"
                     />
                   </div>
                </div>
                <div className="space-y-2">
                   <label className="text-[10px] font-bold text-mist uppercase tracking-widest pl-1">Email Terminal</label>
                   <div className="relative group grayscale">
                     <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mist" />
                     <Input 
                        disabled
                        value={user?.email || ""}
                        className="pl-10 bg-ink/30 border-border/20 h-11 opacity-50 cursor-not-allowed"
                     />
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border/20">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface/30 border border-border/20 group hover:border-amber/50 transition-colors">
                   <div className="h-10 w-10 rounded-lg bg-ink flex items-center justify-center border border-border/50">
                      <Clock className="h-5 w-5 text-amber" />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-mist uppercase tracking-widest">Auth Sector</p>
                      <p className="text-sm text-chalk font-semibold uppercase">Created April 2026</p>
                   </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-xl bg-surface/30 border border-border/20 group hover:border-emerald-500/50 transition-colors">
                   <div className="h-10 w-10 rounded-lg bg-ink flex items-center justify-center border border-border/50">
                      <Globe className="h-5 w-5 text-emerald-500" />
                   </div>
                   <div className="space-y-0.5">
                      <p className="text-[10px] font-bold text-mist uppercase tracking-widest">Network Status</p>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 anim-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                        <p className="text-sm text-chalk font-semibold uppercase">Encrypted_Local</p>
                      </div>
                   </div>
                </div>
             </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-3 pt-6 border-t border-border/20">
             {isEditing ? (
               <>
                 <Button variant="ghost" onClick={() => setIsEditing(false)} className="text-mist uppercase text-[11px] tracking-widest font-bold">Cancel</Button>
                 <Button onClick={() => setIsEditing(false)} className="px-8 shadow-[0_0_20px_rgba(232,160,32,0.3)]">Update Access</Button>
               </>
             ) : (
               <Button onClick={() => setIsEditing(true)} className="px-8 flex items-center gap-2">
                  Edit Identity
               </Button>
             )}
          </CardFooter>
        </Card>
      </div>
    </motion.div>
  );
}
