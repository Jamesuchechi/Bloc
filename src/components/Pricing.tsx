import React from 'react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: "Starter",
    price: "Free",
    period: "forever",
    features: [
      "Focus sessions (unlimited)",
      "Ship Log",
      "1 client portal",
      "3 proposals/month"
    ],
    cta: "Get started free",
    style: "default"
  },
  {
    name: "Builder",
    price: "$15",
    period: "/month",
    features: [
      "Everything in Starter",
      "Unlimited client portals",
      "Unlimited proposals",
      "Weekly summary emails",
      "Portal branding",
      "Priority support"
    ],
    cta: "Start 14-day trial",
    style: "amber",
    popular: true
  },
  {
    name: "Studio",
    price: "$39",
    period: "/month",
    features: [
      "Everything in Builder",
      "Up to 5 seats",
      "Custom domain portal",
      "Invoicing (coming soon)",
      "Slack support channel"
    ],
    cta: "Contact us",
    style: "default"
  }
];

const Pricing: React.FC = () => {
  return (
    <section className="py-28 px-6 md:px-10" id="pricing">
      <div className="flex items-center gap-3 mb-16">
        <div className="w-8 h-px bg-border2" />
        <span className="font-mono text-[11px] text-mist tracking-[0.3em] uppercase">
          Pricing
        </span>
      </div>

      <motion.h2 
        className="font-bebas text-[clamp(3.5rem,8vw,7rem)] tracking-[0.05em] text-chalk leading-[0.95] mb-4"
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      >
        SIMPLE.<br />
        <span className="text-outline-thin">HONEST.</span>
      </motion.h2>

      <p className="text-[15px] text-mist font-light mb-16">
        Start free. Upgrade when it makes sense.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-border overflow-hidden">
        {plans.map((p, i) => (
          <div 
            key={i}
            className={`relative p-10 transition-colors duration-300 ${p.popular ? 'bg-surface2 border border-amber' : 'bg-ink hover:bg-surface'}`}
          >
            {p.popular && (
              <div className="absolute top-[-1px] left-10 bg-amber font-mono text-[9px] tracking-widest uppercase text-ink px-2.5 py-0.5 font-medium">
                Most popular
              </div>
            )}
            <div className="font-mono text-[10px] tracking-widest uppercase text-mist mb-6">
              {p.name}
            </div>
            <div className="font-bebas text-[4rem] tracking-[0.05em] text-chalk leading-none flex items-baseline gap-1">
              {p.price} <span className="font-sora text-[14px] text-mist font-light tracking-normal">{p.period}</span>
            </div>

            <div className="my-8 flex flex-col gap-2.5">
              {p.features.map((feat, idx) => (
                <div key={idx} className="flex gap-2.5 text-[13px] text-mist font-light">
                  <span className="text-amber text-sm shrink-0">✓</span>
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <button className={`w-full py-2.5 px-4 text-[13px] font-medium tracking-widest uppercase transition-all duration-200 border ${
              p.style === 'amber' 
                ? 'bg-amber text-ink border-amber hover:bg-[#f0aa28]'
                : 'bg-transparent text-chalk border-border2 hover:border-mist'
            }`}>
              {p.cta}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Pricing;
