import React from 'react';

const Quote: React.FC = () => {
  return (
    <div className="py-24 px-6 md:px-10 border-t border-b border-border">
      <div className="max-w-[780px] mx-auto text-center">
        <div className="font-instrument text-8xl md:text-9xl text-border2 leading-[0.5] mb-8">
          &ldquo;
        </div>
        <p className="font-instrument text-[clamp(1.6rem,3.5vw,2.6rem)] text-chalk italic leading-[1.35]">
          Most tools are built for teams.<br />
          <strong className="text-amber font-normal">
            BLOC is built for one person doing serious work.
          </strong>
        </p>
        <div className="mt-8 font-mono text-[11px] text-mist tracking-[0.25em] uppercase">
          — The BLOC Manifesto
        </div>
      </div>
    </div>
  );
};

export default Quote;
