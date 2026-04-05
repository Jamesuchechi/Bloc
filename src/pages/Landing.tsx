import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../store/appStore';
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
  const { user, isAuthLoading } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthLoading && user) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-ink">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-amber" />
      </div>
    );
  }

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
