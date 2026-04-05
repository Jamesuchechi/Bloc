import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Ghost } from 'lucide-react';
import { Button } from '../components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-ink flex flex-col items-center justify-center p-6 text-center select-none">
      <div className="hero-glow opacity-50" />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10"
      >
        <div className="mb-8 relative inline-block">
          <div className="absolute -inset-4 bg-amber/20 rounded-full blur-2xl animate-pulse" />
          <Ghost className="h-24 w-24 text-amber relative" />
        </div>
        
        <h1 className="font-bebas text-[8rem] leading-none text-chalk tracking-tighter mb-4">
          404
        </h1>
        
        <h2 className="text-2xl font-bold text-chalk uppercase tracking-widest mb-6">
          Lost in the Grid
        </h2>
        
        <p className="text-mist text-lg max-w-md mx-auto mb-10 leading-relaxed font-light">
          The module you're looking for doesn't exist or has been shifted into another sector of the build.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button variant="outline" asChild className="h-12 px-6 gap-2 border-border2 hover:border-mist">
            <Link to={-1 as any}>
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Link>
          </Button>
          <Button asChild className="h-12 px-8 gap-2 shadow-[0_0_20px_rgba(232,160,32,0.3)]">
            <Link to="/dashboard">
              <Home className="h-4 w-4" />
              Return Home
            </Link>
          </Button>
        </div>
      </motion.div>
      
      <div className="fixed bottom-10 font-mono text-[10px] text-border2 tracking-[0.4em] uppercase">
        Error Sector: BLOC_404_PAGE_NOT_FOUND
      </div>
    </div>
  );
}
