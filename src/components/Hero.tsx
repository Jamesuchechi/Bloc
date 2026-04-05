import React from 'react';
import { motion } from 'framer-motion';

const Hero: React.FC = () => {
  return (
    <section className="relative min-h-screen flex flex-col justify-center md:justify-end px-6 md:px-10 pb-20 pt-[80px] md:pt-[60px] overflow-hidden">
      <div className="hero-grid" />
      <div className="hero-glow" />

      <div className="relative z-10">
        <motion.div 
          className="flex items-center justify-center md:justify-start gap-3 mb-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        >
          <div className="hidden md:block w-8 h-px bg-amber" />
          <span className="font-mono text-[11px] text-amber tracking-[0.35em] uppercase text-center md:text-left">
            For solo builders & freelancers
          </span>
        </motion.div>

        <motion.h1 
          className="font-bebas text-[clamp(2.8rem,13vw,12rem)] leading-[1.1] md:leading-[0.92] tracking-[0.02em] mb-12 text-center md:text-left"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>YOUR WORK.</div>
          <div className="text-outline">YOUR CLIENTS.</div>
          <div className="text-amber">ONE BLOC.</div>
        </motion.h1>

        <div className="flex flex-col md:flex-row items-end justify-between gap-8 mt-12">
          <motion.p 
            className="text-base md:text-lg text-mist max-w-[380px] leading-relaxed font-light text-center md:text-left mx-auto md:mx-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Focus on your work. Log what you ship.{" "}
            <strong className="text-chalk font-medium">
              Impress your clients. Close more deals.
            </strong>{" "}
            The operating system built for people who do serious work alone.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <button className="w-full sm:w-auto px-7 py-3 text-sm font-semibold text-ink bg-amber hover:bg-[#f0aa28] hover:-translate-y-0.5 transition-all tracking-[0.03em] flex items-center justify-center gap-2">
              Start for free <span>→</span>
            </button>
            <button className="w-full sm:w-auto px-6 py-3 text-sm text-chalk border border-border2 hover:border-mist transition-all tracking-[0.03em]">
              See how it works
            </button>
          </motion.div>
        </div>

        <motion.div 
          className="grid grid-cols-2 md:flex gap-y-10 gap-x-8 md:gap-x-12 mt-16 pt-8 border-t border-border"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          {[
            { n: '10ms', l: 'Session start' },
            { n: '4-in-1', l: 'Modules' },
            { n: 'Zero', l: 'Tool switching' },
            { n: 'Free', l: 'To start' },
          ].map((stat, i) => (
            <div key={i}>
              <div className="font-bebas text-[2.8rem] text-amber tracking-[0.1em] leading-none mb-1">
                {stat.n}
              </div>
              <div className="font-mono text-[10px] text-mist tracking-[0.2em] uppercase">
                {stat.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
