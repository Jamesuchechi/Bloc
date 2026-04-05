import React from 'react';
import { motion } from 'framer-motion';

const steps = [
  {
    num: "01",
    title: "Send a proposal. Close the deal. →",
    desc: "Build a beautiful proposal in minutes. Share a link. Client signs digitally — BLOC auto-creates their client record and first project. You never copy-paste again."
  },
  {
    num: "02",
    title: "Start a Focus session. Do the work. →",
    desc: "Name what you're working on. Hit start. A minimal timer takes over. No task lists, no inbox, no distractions. Just you and the work."
  },
  {
    num: "03",
    title: "End the session. It logs itself. →",
    desc: "When the session ends, a Ship Log entry is created automatically. Add a note about what you completed. No re-typing, no copying to a spreadsheet."
  },
  {
    num: "04",
    title: "Push updates to the client portal. →",
    desc: "One click turns a Ship Log entry into a client-facing update. Your client sees real progress. No more 'quick update?' emails. No more chasing."
  }
];

const HowItWorks: React.FC = () => {
  return (
    <section className="py-28 px-6 md:px-10 bg-surface" id="how">
      <div className="max-w-[900px] mx-auto">
        <div className="flex items-center gap-3 mb-16">
          <div className="w-8 h-px bg-border2" />
          <span className="font-mono text-[11px] text-mist tracking-[0.3em] uppercase">
            The full loop
          </span>
        </div>

        <motion.h2 
          className="font-instrument text-[clamp(2.5rem,5vw,4rem)] text-chalk leading-[1.2] mb-16"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          Everything <span className="text-amber italic">flows</span> together.<br />
          Nothing breaks the loop.
        </motion.h2>

        <div className="flex flex-col gap-0">
          {steps.map((step, i) => (
            <motion.div 
              key={i}
              className="flow-step grid grid-cols-[48px_1fr] gap-x-8 md:gap-x-12 relative"
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="w-12 h-12 border border-border2 flex items-center justify-center font-mono text-[12px] text-amber tracking-widest flex-shrink-0 bg-ink z-10">
                {step.num}
              </div>
              <div className="pb-14">
                <h4 className="text-[18px] font-semibold text-chalk mb-2">
                  {step.title.split(' →')[0]} <span className="text-amber text-sm ml-1.5">→</span>
                </h4>
                <p className="text-[14px] text-mist leading-[1.75] font-light">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
