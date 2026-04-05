import React from 'react';
import { motion } from 'framer-motion';

const modules = [
  {
    num: "01",
    icon: "⚡",
    title: "FOCUS SESSION",
    desc: "One question: what are you working on right now? Start a session. The timer runs. Everything else disappears. When you're done, the work is logged automatically.",
    tags: ["Timer", "Deep work", "Pomodoro mode"],
    accent: "SESSION"
  },
  {
    num: "02",
    icon: "📦",
    title: "SHIP LOG",
    desc: "A reverse-chronological record of everything you've shipped. Sessions auto-log. Add manual entries. Generate a weekly summary and share it — or send it to a client.",
    tags: ["Auto-logging", "Weekly summary", "Shareable"],
    accent: "LOG"
  },
  {
    num: "03",
    icon: "🔗",
    title: "CLIENT PORTAL",
    desc: "Send each client a unique link. They see project status, recent updates, and deliverables. They can approve work and leave comments — no login required on their end.",
    tags: ["No client login", "Approvals", "Realtime"],
    accent: "PORTAL"
  },
  {
    num: "04",
    icon: "📄",
    title: "PROPOSAL BUILDER",
    desc: "Pick services. Set prices. Write a scope. Send a link. The client signs digitally — and BLOC automatically creates their project in your workspace. Deal closed, work begins.",
    tags: ["Digital signing", "Auto-onboarding", "PDF export"],
    accent: "BUILDER"
  }
];

const Modules: React.FC = () => {
  return (
    <section className="py-28 px-6 md:px-10 bg-ink" id="modules">
      <div className="flex items-center gap-3 mb-16">
        <div className="w-8 h-px bg-border2" />
        <span className="font-mono text-[11px] text-mist tracking-[0.3em] uppercase">
          The four modules
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-border overflow-hidden">
        {modules.map((m, i) => (
          <motion.div
            key={i}
            className="group relative bg-ink p-14 bg-gradient-to-br from-transparent to-transparent hover:to-surface/50 transition-all duration-300 cursor-default"
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="font-mono text-[11px] text-border2 tracking-widest mb-8">
              {m.num}
            </div>
            <span className="text-4xl mb-6 block leading-none">
              {m.icon}
            </span>
            <h3 className="font-bebas text-[2.8rem] tracking-[0.08em] text-chalk leading-none mb-4">
              {m.title.split(' ')[0]}<br />
              <span className="text-amber">{m.accent}</span>
            </h3>
            <p className="text-[14px] text-mist leading-[1.75] font-light max-w-[340px] mb-6">
              {m.desc}
            </p>
            <div className="flex flex-wrap gap-2">
              {m.tags.map((tag, idx) => (
                <span key={idx} className="px-2.5 py-1 border border-border2 font-mono text-[10px] text-mist tracking-widest uppercase">
                  {tag}
                </span>
              ))}
            </div>

            <div className="absolute top-12 right-12 text-xl text-amber opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 font-light">
              ↗
            </div>
            <div className="absolute bottom-0 left-0 h-[2px] bg-amber w-0 group-hover:w-full transition-all duration-500 ease-out" />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Modules;
