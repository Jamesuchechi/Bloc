import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import Modules from '../components/Modules';
import HowItWorks from '../components/HowItWorks';
import Quote from '../components/Quote';
import Pricing from '../components/Pricing';
import CTA from '../components/CTA';
import Footer from '../components/Footer';

const Landing: React.FC = () => {
  return (
    <div className="min-h-screen bg-ink">
      <Navbar />
      <Hero />
      <Ticker />
      <Modules />
      <HowItWorks />
      <Quote />
      <Pricing />
      <CTA />
      <Footer />
    </div>
  );
};

export default Landing;
