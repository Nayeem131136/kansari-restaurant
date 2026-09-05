import { motion } from 'motion/react';
import { Button } from '../ui/Button';
import { ArrowRight } from 'lucide-react';

export function FinalCTA() {
  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative w-full min-h-[60vh] sm:min-h-[70vh] flex items-center justify-center overflow-hidden py-24 sm:py-32 bg-[#12110F] text-ivory">
      {/* Background imagery with warm dark gradient */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <motion.img
          initial={{ scale: 1.08 }}
          whileInView={{ scale: 1.02 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease: "easeOut" }}
          src="https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/hospitality-moment.jpg"
          alt="Warm hospitality at Kansari"
          className="w-full h-full object-cover filter brightness-75 contrast-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#12110F] via-[#12110F]/85 to-[#12110F]/65" />
      </div>

      <div className="relative z-20 w-full max-w-4xl mx-auto px-6 sm:px-12 text-center space-y-8">
        
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3"
        >
          <span className="w-8 h-[1.5px] bg-terracotta" />
          <span className="font-sans text-xs tracking-[0.3em] text-terracotta uppercase font-medium">
            AN INVITATION · আন্তরিক আমন্ত্রণ
          </span>
          <span className="w-8 h-[1.5px] bg-terracotta" />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="text-ivory font-bengali text-4xl sm:text-6xl md:text-7xl font-medium tracking-tight text-balance leading-[1.2]"
        >
          খাবারটা মনে থাকবে।
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-2 max-w-xl mx-auto"
        >
          <p className="font-serif text-lg sm:text-xl md:text-2xl text-ivory/90 font-light italic tracking-wide">
            COME FOR THE FOOD. STAY FOR THE FEELING.
          </p>
          <p className="font-bengali text-sm sm:text-base text-ivory/70 font-light">
            স্বাদের শিকড় ছুঁয়ে আধুনিক এক রূপকথা—কাঁসারীতে একটি আসন সর্বদা আপনার অপেক্ষায়।
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4"
        >
          <Button 
            id="final-cta-reserve-btn"
            variant="primary" 
            size="md"
            onClick={() => scrollTo('reservation')}
            className="w-full sm:w-auto shadow-lg group cursor-pointer"
          >
            <span>RESERVE A TABLE</span>
            <ArrowRight size={15} className="transition-transform group-hover:translate-x-1" />
          </Button>
          <Button 
            id="final-cta-menu-btn"
            variant="outline" 
            size="md"
            onClick={() => scrollTo('menu')}
            className="w-full sm:w-auto text-ivory border-ivory/30 hover:border-ivory hover:bg-ivory/10 transition-colors cursor-pointer"
          >
            EXPLORE MENU
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
