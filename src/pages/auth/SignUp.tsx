import * as React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { ArrowRight, Github, Chrome } from "lucide-react";
import { motion } from "framer-motion";

export default function SignUp() {
  const { signUp, signInWithOAuth } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await signUp(email, password, fullName);
      navigate("/focus");
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'github' | 'google') => {
    setLoading(true);
    setError(null);
    try {
      await signInWithOAuth(provider);
    } catch (err: any) {
      setError(err.message || `Failed to sign in with ${provider}`);
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-4">
      <div className="hero-glow opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-border/50 bg-surface/80 backdrop-blur-xl shadow-2xl">
          <CardHeader className="space-y-1 text-center">
             <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl bg-surface/50 p-2 shadow-[0_0_30px_rgba(232,160,32,0.15)] border border-border/50">
              <img 
                src="/logo.png" 
                alt="BLOC Logo" 
                className="h-full w-full object-contain drop-shadow-[0_0_12px_rgba(232,160,32,0.4)]"
              />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight text-chalk uppercase">Create an Account</CardTitle>
            <CardDescription className="text-mist">Get started with BLOC for free</CardDescription>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-mist" htmlFor="fullName">Full Name</label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="John Doe"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-ink/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-mist" htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-ink/50"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-mist" htmlFor="password">Password</label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-ink/50"
                />
                <p className="text-[10px] text-mist/60 mt-1 uppercase tracking-tighter">Must be at least 8 characters long</p>
              </div>

              {error && (
                <div className="rounded-md bg-red-500/10 p-3 text-sm text-red-400 border border-red-500/20">
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full group" disabled={loading}>
                {loading ? "Creating..." : "Create Account"}
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </form>

            <div className="relative my-6 text-center text-xs uppercase tracking-widest text-border">
              <span className="relative z-10 bg-surface px-2">Or join with</span>
              <div className="absolute top-1/2 w-full h-[1px] bg-border" />
            </div>

            <div className="flex flex-col gap-3">
              <Button 
                variant="outline" 
                className="w-full gap-2 border-border/50 hover:bg-ink/30 transition-colors" 
                disabled={loading}
                onClick={() => handleOAuth('google')}
              >
                <Chrome className="h-5 w-5 text-amber" />
                Google
              </Button>
              <Button 
                variant="outline" 
                className="w-full gap-2 border-border/50 hover:bg-ink/30 transition-colors" 
                disabled={loading}
                onClick={() => handleOAuth('github')}
              >
                <Github className="h-5 w-5" />
                GitHub
              </Button>
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-wrap items-center justify-center gap-1 text-sm text-mist">
            Already have an account? 
            <Link to="/login" className="font-semibold text-amber hover:underline">Sign In</Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
