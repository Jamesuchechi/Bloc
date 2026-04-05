import * as React from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "../../components/ui/Card";
import { motion } from "framer-motion";

export default function VerifyEmail() {
  const [resending, setResending] = React.useState(false);
  const [sent, setSent] = React.useState(false);

  const handleResend = () => {
    setResending(true);
    // Mimic resend logic (actual implementation could call a supabase method if needed)
    setTimeout(() => {
      setResending(false);
      setSent(true);
    }, 1500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-4 text-center">
      <div className="hero-glow opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md z-10"
      >
        <Card className="border-border/50 bg-surface/80 backdrop-blur-xl shadow-2xl p-6">
          <CardHeader className="space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber/10 p-4 border border-amber/20 shadow-[0_0_30px_rgba(232,160,32,0.1)]">
              <Mail className="h-10 w-10 text-amber animate-pulse" />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-2xl font-bold tracking-tight text-chalk uppercase">Check Your Email</CardTitle>
              <CardDescription className="text-mist text-base">
                We've sent a verification link to your inbox. <br />
                Please click the link to activate your account.
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="rounded-xl bg-ink/50 p-4 text-sm text-mist border border-border/30">
              Can't find the email? Check your spam folder or try resending the link.
            </div>
          </CardContent>
          
          <CardFooter className="flex flex-col gap-4 pt-6">
            <Button 
              variant="outline" 
              className="w-full gap-2 border-border/50 hover:bg-ink/30 transition-colors" 
              onClick={handleResend}
              disabled={resending || sent}
            >
              {resending ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : sent ? (
                "Verification Link Sent!"
              ) : (
                "Resend Verification Link"
              )}
            </Button>
            
            <Link to="/login" className="flex items-center justify-center gap-2 text-sm font-semibold text-mist hover:text-chalk transition-colors">
              <ArrowLeft className="h-4 w-4" />
              Back to Sign In
            </Link>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
}
