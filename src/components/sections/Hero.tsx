import { motion } from 'motion/react';
import { siteConfig } from '@/config/data';
import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../ui/Button';
import { ChevronDown, MapPin, Clock, ArrowRight } from 'lucide-react';

export function Hero() {
  const { settings, menuItems } = useRestaurant();

  const scrollToReservation = () => {
    document.getElementById('reservation')?.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToMenu = () => {
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  };

  const bengaliHeadline = settings?.content?.heroBengaliHeadline || "স্বাদের শিকড়।\nনতুন এক আয়োজন।";
  const englishHeadline = settings?.content?.heroHeadline || settings?.englishTagline || siteConfig.restaurant.englishTagline;
  const supportingText = settings?.content?.heroSupportingText || settings?.description || siteConfig.restaurant.description;
  const location = settings?.location || siteConfig.restaurant.location;

  const featuredDish = (menuItems && menuItems.find(m => m.featured)) || (menuItems && menuItems[0]) || siteConfig.signatureDishes[0];

  return (
    <section 
      id="home" 
      className="relative w-full min-h-screen flex flex-col justify-between overflow-hidden bg-[#12110F] text-ivory pt-24 sm:pt-28 md:pt-32 pb-8 sm:pb-12"
    >
      {/* Background Cinematic Food Photography with subtle depth */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1.02, opacity: 0.55 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
          src="https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/hero-section.jpg"
          alt="Kansari Contemporary Bangali Dining"
          className="w-full h-full object-cover object-center filter brightness-90 contrast-105"
          loading="eager"
        />
        {/* Editorial Gradients for ultra-sharp typography contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#12110F] via-[#12110F]/85 to-[#12110F]/40 z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12110F] via-transparent to-[#12110F]/60 z-10" />
        {/* Warm Ambient Glow */}
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-terracotta/15 rounded-full blur-[140px] pointer-events-none z-10" />
      </div>

      {/* Main Content Area - Asymmetrical Editorial Layout */}
      <div className="relative z-20 w-full max-w-[1920px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 my-auto py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          
          {/* Left Column: Staggered Editorial Typography (Span 7) */}
          <div className="lg:col-span-7 space-y-6 sm:space-y-8">
            
            {/* Step 1: Wordmark & Category Meta */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="flex items-center gap-3"
            >
              <span className="w-8 h-[1.5px] bg-terracotta" />
              <span className="text-[11px] sm:text-xs font-sans tracking-[0.3em] text-terracotta uppercase font-medium">
                CONTEMPORARY BANGALI DINING
              </span>
            </motion.div>

            {/* Step 2: Main Bengali Headline with Line-by-Line Reveal */}
            <div className="overflow-hidden">
              <motion.h1 
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="font-bengali text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-ivory font-medium leading-[1.2] sm:leading-[1.25] tracking-tight whitespace-pre-line"
              >
                {bengaliHeadline}
              </motion.h1>
            </div>

            {/* Step 3: English Supporting Line */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.55 }}
              className="space-y-3"
            >
              <p className="font-serif text-xl sm:text-2xl md:text-3xl text-ivory/90 font-light italic tracking-wide">
                {englishHeadline}
              </p>
              
              {/* Supporting Copy */}
              <p className="font-bengali text-sm sm:text-base md:text-lg text-ivory/70 max-w-xl leading-relaxed font-light">
                {supportingText}
              </p>
            </motion.div>

            {/* Step 4: Primary & Secondary CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.75 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2"
            >
              <Button 
                id="hero-reserve-btn"
                variant="primary" 
                size="md"
                onClick={scrollToReservation}
                className="w-full sm:w-auto shadow-lg group cursor-pointer"
              >
                <span>RESERVE A TABLE</span>
                <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                id="hero-menu-btn"
                variant="outline" 
                size="md"
                className="w-full sm:w-auto text-ivory border-ivory/30 hover:border-ivory hover:bg-ivory/10 transition-all cursor-pointer" 
                onClick={scrollToMenu}
              >
                EXPLORE MENU
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Editorial Highlight Plate Preview Card (Span 5) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="hidden lg:flex lg:col-span-5 flex-col items-end"
          >
            <div className="w-full max-w-md bg-ivory/5 backdrop-blur-md border border-ivory/15 p-5 relative overflow-hidden group">
              <div className="aspect-[4/3] overflow-hidden mb-4 relative">
                <img 
                  src={featuredDish.image}
                  alt={featuredDish.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 bg-[#12110F]/85 backdrop-blur-sm px-3 py-1 text-xs font-serif text-ivory border border-ivory/10">
                  FEATURED DISH
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <h3 className="font-serif text-lg text-ivory tracking-wide">
                  {featuredDish.name}
                </h3>
                <span className="font-serif text-lg text-terracotta font-semibold">
                  {featuredDish.price}
                </span>
              </div>
              <p className="font-bengali text-xs text-ivory/65 leading-relaxed">
                {featuredDish.bengaliDescription || featuredDish.description}
              </p>
            </div>
          </motion.div>

        </div>
      </div>

      {/* Bottom Metadata & Scroll Indicator - Crisp Framing */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.9 }}
        className="relative z-20 w-full max-w-[1920px] mx-auto px-6 sm:px-10 md:px-16 lg:px-24 pt-6 border-t border-ivory/10 flex flex-col sm:flex-row justify-between items-center text-[10px] sm:text-xs font-sans tracking-[0.25em] text-ivory/60 uppercase gap-4"
      >
        {/* Location Metadata */}
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-terracotta" />
          <span>{location.toUpperCase()}</span>
        </div>
        
        {/* Interactive Scroll Down */}
        <button 
          onClick={scrollToMenu}
          className="flex items-center gap-2 text-ivory/70 hover:text-ivory transition-colors cursor-pointer py-1 px-3 rounded-full hover:bg-ivory/5"
          aria-label="Scroll to menu"
        >
          <span className="text-[10px] tracking-widest font-medium">DISCOVER</span>
          <motion.div
            animate={{ y: [0, 4, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown size={15} />
          </motion.div>
        </button>

        {/* Operating Status */}
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-terracotta" />
          <span>OPEN TODAY · 11:30 AM – 11:00 PM</span>
        </div>
      </motion.div>
    </section>
  );
}
