import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { siteConfig } from '@/config/data';

export function PageIntro() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Elegant, short 1.1s entrance
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          id="page-intro-curtain"
          initial={{ opacity: 1 }}
          exit={{ 
            opacity: 0, 
            y: -30,
            transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } 
          }}
          className="fixed inset-0 z-[10000] bg-[#141311] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center px-6"
          >
            <span className="text-[10px] font-sans tracking-[0.35em] text-terracotta uppercase mb-3 font-medium">
              DHAKA · EST. 2025
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl tracking-[0.25em] text-ivory font-medium">
              {siteConfig.restaurant.name}
            </h1>
            <span className="font-bengali text-sm text-ivory/60 mt-2 tracking-widest font-normal">
              {siteConfig.restaurant.bengaliName}
            </span>
            <motion.div 
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: "easeInOut" }}
              className="w-16 h-[1.5px] bg-terracotta mt-5 origin-center"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
