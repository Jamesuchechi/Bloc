import React from 'react';
import { motion } from 'framer-motion';
import { Github, Twitter, Linkedin, Globe, ArrowRight, Zap } from 'lucide-react';
import { Button } from './ui/Button';
import { Input } from './ui/Input';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Focus Timer', href: '#modules' },
      { name: 'Ship Log', href: '#modules' },
      { name: 'Client Portals', href: '#modules' },
      { name: 'Proposal Builder', href: '#modules' },
    ],
    resources: [
      { name: 'Documentation', href: '#' },
      { name: 'Help Center', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Changelog', href: '#' },
    ],
    company: [
      { name: 'About', href: '#' },
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    social: [
      { name: 'Twitter', icon: Twitter, href: '#' },
      { name: 'GitHub', icon: Github, href: '#' },
      { name: 'LinkedIn', icon: Linkedin, href: '#' },
      { name: 'Discord', icon: Globe, href: '#' },
    ]
  };

  return (
    <footer className="bg-[#0c0c0b] pt-24 pb-12 px-6 md:px-10 border-t border-border overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-px bg-gradient-to-r from-transparent via-amber/30 to-transparent" />
      
      <div className="max-w-7xl mx-auto">
        {/* Top Section: CTA & Newsletter */}
        <div className="flex flex-col lg:flex-row justify-between gap-16 mb-24">
          <div className="max-w-xl">
            <motion.h2 
              className="font-bebas text-[clamp(2.5rem,6vw,5rem)] leading-none tracking-tight text-chalk mb-6"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              READY TO <span className="text-amber">SHIP</span> THE NEXT BIG THING?
            </motion.h2>
            <p className="text-mist text-lg font-light leading-relaxed mb-8">
              Join 2,500+ solo builders receiving weekly deep-work strategies and product updates.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md">
              <Input 
                type="email" 
                placeholder="builder@work.com" 
                className="bg-surface/50 border-border/50 h-12 focus:border-amber/50 transition-all"
              />
              <Button className="h-12 px-8 font-bold gap-2 whitespace-nowrap shadow-[0_0_20px_rgba(232,160,32,0.2)]">
                Join the Buildup <ArrowRight className="h-4 w-4" />
              </Button>
            </form>
          </div>

          <div className="flex-shrink-0 flex items-center justify-center lg:justify-end">
            <div className="relative group">
              <div className="absolute -inset-4 bg-amber/5 rounded-full blur-3xl group-hover:bg-amber/10 transition-all" />
              <img 
                src="/logo.png" 
                alt="BLOC Logo" 
                className="relative h-32 w-32 object-contain opacity-50 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700 hover:rotate-12"
              />
            </div>
          </div>
        </div>

        {/* Middle Section: Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-24">
          <div>
            <h4 className="font-bebas text-lg tracking-widest text-chalk mb-6 uppercase">Product</h4>
            <ul className="space-y-4">
              {footerLinks.product.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="text-[14px] text-mist hover:text-amber transition-colors font-light">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bebas text-lg tracking-widest text-chalk mb-6 uppercase">Resources</h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="text-[14px] text-mist hover:text-amber transition-colors font-light">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bebas text-lg tracking-widest text-chalk mb-6 uppercase">Company</h4>
            <ul className="space-y-4">
              {footerLinks.company.map((l) => (
                <li key={l.name}>
                  <a href={l.href} className="text-[14px] text-mist hover:text-amber transition-colors font-light">
                    {l.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-bebas text-lg tracking-widest text-chalk mb-6 uppercase">Follow our Build</h4>
            <div className="flex flex-wrap gap-4">
              {footerLinks.social.map((s) => (
                <a key={s.name} href={s.href} className="p-2.5 rounded-lg border border-border/50 text-mist hover:text-amber hover:border-amber/50 hover:bg-amber/5 transition-all">
                  <s.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Section: Branding & Meta */}
        <div className="pt-8 border-t border-border/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-[18px] h-[18px] bg-amber flex items-center justify-center font-bebas text-[10px] text-ink leading-none">
                B
              </div>
              <div className="font-bebas text-[16px] tracking-[0.2em] text-chalk pt-0.5">
                BLOC
              </div>
            </div>
            <span className="hidden sm:block h-4 w-[1px] bg-border/50" />
            <p className="text-[11px] text-mist uppercase tracking-widest font-medium">
              © {currentYear} BLOC.INC · Built for builders.
            </p>
          </div>

          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                <span className="text-[10px] font-mono text-mist uppercase tracking-widest">All systems operational</span>
             </div>
             <span className="h-4 w-[1px] bg-border/50" />
             <div className="flex items-center gap-2 group cursor-default">
                <Zap className="h-3 w-3 text-amber opacity-50 group-hover:opacity-100 transition-opacity" />
                <span className="text-[10px] font-mono text-mist uppercase tracking-widest">v0.1.0-alpha.5</span>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
