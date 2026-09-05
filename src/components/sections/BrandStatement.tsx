import { motion } from 'motion/react';

export function BrandStatement() {
  return (
    <section 
      id="brand-statement" 
      className="bg-ivory py-24 sm:py-32 md:py-40 px-6 sm:px-12 md:px-16 lg:px-24 flex items-center justify-center relative overflow-hidden"
    >
      <div className="max-w-5xl mx-auto text-center space-y-8 md:space-y-12">
        
        {/* Subtle Category Accent */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="inline-flex items-center gap-3"
        >
          <span className="w-8 h-[1px] bg-terracotta/40" />
          <span className="font-bengali text-xs md:text-sm tracking-[0.25em] text-terracotta uppercase font-medium">
            আমাদের দর্শন ও পথচলা
          </span>
          <span className="w-8 h-[1px] bg-terracotta/40" />
        </motion.div>
        
        {/* Headline Line-by-Line Editorial Reveal */}
        <div className="space-y-2 overflow-hidden">
          <motion.h2 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-bengali text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-charcoal leading-[1.25] font-medium text-balance tracking-tight"
          >
            যে স্বাদ চেনা,
            <br />
            তবুও প্রতিবার নতুন।
          </motion.h2>
        </div>
        
        {/* Supporting Narrative Paragraphs */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="space-y-4 max-w-3xl mx-auto"
        >
          <p className="font-bengali text-lg sm:text-xl md:text-2xl text-charcoal/80 leading-relaxed font-normal text-balance">
            কাঁসার থালায় ঐতিহ্যের ছোঁয়া, মাটির পাত্রে ধোঁয়া ওঠা সুবাস আর প্রতিটি পদে খাঁটি বাঙালিয়ানার আধুনিক রূপ।
          </p>
          <p className="font-serif text-sm sm:text-base md:text-lg text-charcoal/50 leading-relaxed font-light italic max-w-2xl mx-auto">
            At Kansari, familiar Bangali flavours meet a contemporary table—celebrating the recipes we grew up with, elevated with quiet culinary precision.
          </p>
        </motion.div>
        
        {/* Architectural Divider */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="flex flex-col items-center gap-2 pt-4 origin-top"
        >
          <div className="w-[1px] h-12 sm:h-16 bg-gradient-to-b from-terracotta to-transparent mx-auto" />
          <div className="w-1.5 h-1.5 rounded-full bg-terracotta/60" />
        </motion.div>

      </div>
    </section>
  );
}
