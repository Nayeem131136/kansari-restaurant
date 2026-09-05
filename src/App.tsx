import { useState, useEffect } from 'react';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RestaurantProvider } from './context/RestaurantContext';

import { CustomCursor } from './components/ui/CustomCursor';
import { ScrollProgress } from './components/ui/ScrollProgress';
import { PageIntro } from './components/ui/PageIntro';
import { FloatingWhatsApp } from './components/ui/FloatingWhatsApp';
import { Navbar } from './components/sections/Navbar';
import { Hero } from './components/sections/Hero';
import { BrandStatement } from './components/sections/BrandStatement';
import { SignatureDishes } from './components/sections/SignatureDishes';
import { InteractiveMenu } from './components/sections/InteractiveMenu';
import { OurStory } from './components/sections/OurStory';
import { DiningExperience } from './components/sections/DiningExperience';
import { Gallery } from './components/sections/Gallery';
import { Reviews } from './components/sections/Reviews';
import { Reservation } from './components/sections/Reservation';
import { Location } from './components/sections/Location';
import { FinalCTA } from './components/sections/FinalCTA';
import { Footer } from './components/sections/Footer';

import { AdminLayout } from './components/admin/AdminLayout';
import { AdminLogin } from './components/admin/AdminLogin';

function MainApp() {
  const { isAuthenticated, isLoading } = useAuth();
  
  // Detect if admin mode was requested via URL (e.g. /admin or ?admin=true or #admin)
  const [isAdminMode, setIsAdminMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const search = window.location.search;
      const hash = window.location.hash;
      const path = window.location.pathname;
      return search.includes('admin') || hash === '#admin' || path.startsWith('/admin');
    }
    return false;
  });

  // Listen for hash change or history popstate
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#admin') {
        setIsAdminMode(true);
      }
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Keyboard shortcut (Alt + A) to quickly toggle Admin portal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        e.preventDefault();
        setIsAdminMode(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // If in Admin Mode
  if (isAdminMode) {
    if (isLoading) {
      return (
        <div className="min-h-screen w-full bg-[#0F1012] flex items-center justify-center text-amber-400 font-sans text-sm">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
            <span className="tracking-widest uppercase text-xs">Authenticating Portal...</span>
          </div>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <AdminLogin 
          onSuccess={() => setIsAdminMode(true)} 
          onNavigateHome={() => {
            setIsAdminMode(false);
            if (window.location.hash === '#admin') {
              window.history.pushState(null, '', window.location.pathname + window.location.search);
            }
          }} 
        />
      );
    }

    return (
      <AdminLayout 
        onNavigateHome={() => {
          setIsAdminMode(false);
          if (window.location.hash === '#admin') {
            window.history.pushState(null, '', window.location.pathname + window.location.search);
          }
        }} 
      />
    );
  }

  // Customer-Facing Premium Website
  return (
    <div className="w-full relative bg-ivory text-charcoal selection:bg-terracotta selection:text-ivory">
      <PageIntro />
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <BrandStatement />
        <SignatureDishes />
        <InteractiveMenu />
        <OurStory />
        <DiningExperience />
        <Gallery />
        <Reviews />
        <Reservation />
        <Location />
        <FinalCTA />
      </main>
      <Footer onOpenAdmin={() => setIsAdminMode(true)} />
      <FloatingWhatsApp />
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <RestaurantProvider>
          <MainApp />
        </RestaurantProvider>
      </AuthProvider>
    </ToastProvider>
  );
}
