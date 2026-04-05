import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Product", href: "#modules" },
    { name: "How it works", href: "#how" },
    { name: "Pricing", href: "#pricing" },
    { name: "Docs", href: "#" },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-[60] flex items-center justify-between px-6 md:px-10 h-[60px] border-b border-border bg-[#0c0c0b]/92 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-2.5 group">
          <img 
            src="/logo.png" 
            alt="BLOC Logo" 
            className="w-8 h-8 object-contain transition-transform duration-300 group-hover:scale-110"
          />
          <div className="font-bebas text-[22px] tracking-[0.2em] text-chalk leading-none pt-1">
            BLOC
          </div>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-[13px] text-mist hover:text-chalk transition-colors tracking-[0.04em]"
            >
              {link.name}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2.5">
            <Link 
              to="/login"
              className="px-4 py-1.5 text-[13px] font-sora text-mist bg-transparent border border-border2 hover:text-chalk hover:border-mist transition-all tracking-[0.03em] flex items-center justify-center cursor-pointer"
            >
              Sign in
            </Link>
            <Link 
              to="/signup"
              className="px-[18px] py-[7px] text-[13px] font-sora font-semibold text-ink bg-amber hover:bg-[#f0aa28] hover:-translate-y-[1px] transition-all tracking-[0.03em] flex items-center justify-center cursor-pointer shadow-[0_0_15px_rgba(232,160,32,0.2)]"
            >
              Get early access →
            </Link>
          </div>

          <button 
            className="md:hidden text-chalk p-1"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-50 bg-ink pt-[60px] md:hidden"
          >
            <div className="flex flex-col p-6 gap-6">
              {navLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className="text-2xl font-bold text-chalk border-b border-border/50 pb-4"
                >
                  {link.name}
                </a>
              ))}
              <div className="flex flex-col gap-4 pt-4">
                <Link 
                  to="/login" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-center text-chalk border border-border rounded-lg text-lg font-medium"
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  onClick={() => setIsOpen(false)}
                  className="w-full py-4 text-center text-ink bg-amber rounded-lg text-lg font-bold flex items-center justify-center gap-2"
                >
                  Get early access <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
