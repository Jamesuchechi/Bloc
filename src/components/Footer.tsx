import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-10 px-6 md:px-10 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
      <div className="flex items-center gap-2.5">
        <div className="w-[20px] h-[20px] bg-amber flex items-center justify-center font-bebas text-[12px] text-ink leading-none">
          B
        </div>
        <div className="font-bebas text-[18px] tracking-[0.2em] text-chalk leading-none pt-0.5">
          BLOC
        </div>
      </div>

      <div className="flex items-center gap-6">
        <a href="#" className="text-[12px] text-mist hover:text-chalk transition-all tracking-[0.04em]">Product</a>
        <a href="#" className="text-[12px] text-mist hover:text-chalk transition-all tracking-[0.04em]">Docs</a>
        <a href="#" className="text-[12px] text-mist hover:text-chalk transition-all tracking-[0.04em]">Pricing</a>
        <a href="#" className="text-[12px] text-mist hover:text-chalk transition-all tracking-[0.04em]">GitHub</a>
        <a href="#" className="text-[12px] text-mist hover:text-chalk transition-all tracking-[0.04em]">Twitter</a>
      </div>

      <div className="font-mono text-[10px] text-border2 tracking-widest uppercase">
        MIT License · Built with React + Vite
      </div>
    </footer>
  );
};

export default Footer;
