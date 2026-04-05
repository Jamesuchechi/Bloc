import React from 'react';

const Ticker: React.FC = () => {
  const items = [
    "Focus Sessions",
    "Ship Log",
    "Client Portal",
    "Proposal Builder",
    "Built for freelancers",
    "React + Vite",
    "Supabase powered",
    "No tool switching",
  ];

  return (
    <div className="bg-amber py-2.5 overflow-hidden border-none cursor-default">
      <div className="flex w-max animate-ticker">
        {[...items, ...items].map((item, i) => (
          <span key={i} className="inline-flex items-center gap-2.5 px-5 font-mono text-[11px] text-ink tracking-[0.2em] uppercase whitespace-nowrap font-medium">
            {item}
            <span className="w-1 h-1 bg-ink rounded-full opacity-40" />
          </span>
        ))}
      </div>
    </div>
  );
};

export default Ticker;
