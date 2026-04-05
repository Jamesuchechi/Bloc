import React from 'react';
import { motion } from 'framer-motion';

const CTA: React.FC = () => {
  return (
    <section className="relative py-32 px-6 md:px-10 overflow-hidden bg-surface">
      <div className="absolute inset-0 bg-surface" />
      <div className="cta-glow" />

      <div className="relative z-10 text-center max-w-[680px] mx-auto">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-1.5 h-1.5 bg-amber rounded-full animate-pulse" />
          <span className="font-mono text-[11px] text-amber tracking-[0.3em] uppercase">
            Now in early access
          </span>
        </div>

        <motion.h2 
          className="font-instrument text-[clamp(2.5rem,6vw,4.5rem)] text-chalk leading-[1.15] mb-6"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Stop switching tools.<br />
          <span className="text-amber italic">Start shipping.</span>
        </motion.h2>

        <p className="text-[15px] text-mist font-light mb-12">
          Join independent builders who use BLOC as their one place for focus, logging, clients, and closing deals.
        </p>

        <div className="flex flex-col md:flex-row items-center justify-center gap-3">
          <button className="px-8 py-4 text-[15px] font-semibold text-ink bg-amber hover:bg-[#f0aa28] transition-all tracking-[0.03em] flex items-center gap-2">
            Get early access free <span>→</span>
          </button>
          <button className="px-6 py-4 text-[14px] text-chalk border border-border2 hover:border-mist transition-all tracking-[0.03em]">
            Read the docs
          </button>
        </div>

        <p className="mt-6 font-mono text-[10px] text-border2 tracking-[0.2em] uppercase">
          No credit card · Free plan lives forever · Cancel anytime
        </p>
      </div>
    </section>
  );
};

export default CTA;
