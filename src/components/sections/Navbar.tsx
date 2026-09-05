import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '@/config/data';
import { Button } from '../ui/Button';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const sections = ['home', 'signature-dishes', 'menu', 'story', 'experience', 'gallery', 'reviews', 'reservation', 'location'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll and listen for Escape when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setMobileMenuOpen(false);
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    } else {
      document.body.style.overflow = '';
    }
  }, [mobileMenuOpen]);

  const navLinks = [
    { name: 'HOME', href: '#home', id: 'home' },
    { name: 'SIGNATURES', href: '#signature-dishes', id: 'signature-dishes' },
    { name: 'MENU', href: '#menu', id: 'menu' },
    { name: 'OUR STORY', href: '#story', id: 'story' },
    { name: 'EXPERIENCE', href: '#experience', id: 'experience' },
    { name: 'ATMOSPHERE', href: '#gallery', id: 'gallery' },
    { name: 'REVIEWS', href: '#reviews', id: 'reviews' },
    { name: 'LOCATION', href: '#location', id: 'location' },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <>
      <motion.header
        id="main-navbar"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled 
            ? 'bg-[#12110F]/90 backdrop-blur-md py-4 shadow-[0_4px_30px_rgba(0,0,0,0.3)] border-b border-ivory/10' 
            : 'bg-transparent py-7'
        }`}
      >
        <div className="max-w-[1920px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 flex items-center justify-between">
          
          {/* Logo & Bengali Wordmark */}
          <a 
            href="#home" 
            onClick={(e) => scrollToSection(e, '#home')}
            className="flex items-center gap-3 group z-[60]"
          >
            <span className="text-2xl md:text-3xl tracking-[0.25em] font-serif font-medium text-ivory group-hover:text-terracotta transition-colors">
              {siteConfig.restaurant.name}
            </span>
            <span className="font-bengali text-xs tracking-wider text-ivory/60 border-l border-ivory/20 pl-3 pr-1 hidden sm:inline-block">
              {siteConfig.restaurant.bengaliName}
            </span>
          </a>

          {/* Desktop Nav Links + Reserve CTA + Hamburger — grouped together on
              the right so nothing floats awkwardly in the middle when the
              nav links are hidden at narrower widths. */}
          <div className="flex items-center gap-5 sm:gap-8">
            <nav className="hidden min-[1360px]:flex items-center gap-6 ml-4" aria-label="Main Navigation">
              {navLinks.map((link) => {
                const isActive = activeSection === link.id;
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => scrollToSection(e, link.href)}
                    className={`text-[11px] font-sans tracking-[0.25em] uppercase whitespace-nowrap transition-colors duration-300 relative py-1 ${
                      isActive ? 'text-terracotta font-medium' : 'text-ivory/80 hover:text-terracotta'
                    }`}
                  >
                    {link.name}
                    {isActive ? (
                      <motion.span 
                        layoutId="nav-underline"
                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-terracotta"
                        transition={{ type: "spring", stiffness: 350, damping: 35 }}
                      />
                    ) : (
                      <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-terracotta origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ease-out" />
                    )}
                  </a>
                );
              })}
            </nav>

            {/* Reserve CTA */}
            <div className="hidden sm:flex items-center">
              <Button 
                id="navbar-reserve-btn"
                variant="primary" 
                size="sm"
                onClick={() => document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' })}
                className="shadow-md cursor-pointer"
              >
                RESERVE A TABLE
              </Button>
            </div>

            {/* Mobile Menu Hamburger Toggle */}
            <button
              id="mobile-menu-toggle"
              className="min-[1360px]:hidden z-[60] flex flex-col justify-center items-center gap-1.5 w-10 h-10 rounded-full hover:bg-ivory/10 transition-colors focus:outline-none cursor-pointer"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <motion.span 
                animate={mobileMenuOpen ? { rotate: 45, y: 7.5 } : { rotate: 0, y: 0 }} 
                className="w-5 h-[1.5px] bg-ivory block transition-transform origin-center"
              />
              <motion.span 
                animate={mobileMenuOpen ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }} 
                className="w-5 h-[1.5px] bg-ivory block transition-all"
              />
              <motion.span 
                animate={mobileMenuOpen ? { rotate: -45, y: -7.5 } : { rotate: 0, y: 0 }} 
                className="w-5 h-[1.5px] bg-ivory block transition-transform origin-center"
              />
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Fullscreen Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            id="mobile-nav-overlay"
            initial={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            animate={{ opacity: 1, clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
            exit={{ opacity: 0, clipPath: 'polygon(0 0, 100% 0, 100% 0, 0 0)' }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[55] bg-[#12110F]/98 backdrop-blur-xl flex flex-col justify-between p-8 md:p-16 pt-28 text-ivory"
          >
            <nav className="flex flex-col gap-5 text-center my-auto">
              <span className="font-bengali text-terracotta text-sm tracking-widest uppercase mb-1">
                {siteConfig.restaurant.bengaliName}
              </span>
              {navLinks.map((link, i) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 + i * 0.05, duration: 0.4 }}
                  onClick={(e) => scrollToSection(e, link.href)}
                  className={`text-xl md:text-2xl font-serif tracking-widest transition-colors ${
                    activeSection === link.id ? 'text-terracotta font-medium' : 'text-ivory/80 hover:text-terracotta'
                  }`}
                >
                  {link.name}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.4 }}
                className="pt-4"
              >
                <Button 
                  id="mobile-reserve-cta"
                  variant="primary"
                  size="md"
                  onClick={() => { 
                    setMobileMenuOpen(false); 
                    document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' }); 
                  }}
                  className="w-full max-w-xs mx-auto"
                >
                  RESERVE A TABLE
                </Button>
              </motion.div>
            </nav>

            <div className="text-center font-sans text-xs tracking-widest text-ivory/40 uppercase border-t border-ivory/10 pt-6">
              {siteConfig.restaurant.location} · {siteConfig.restaurant.phone}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
