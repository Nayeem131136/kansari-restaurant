import { motion } from 'motion/react';
import { Section, FadeIn } from '../ui/Section';

export function OurStory() {
  const values = [
    { 
      title: 'খাঁটি ও তাজা উপাদান', 
      english: 'FRESH INGREDIENTS',
      desc: 'গ্রাম-বাংলার কৃষক ও নদী থেকে সংগৃহীত সেরা মসলা, খাঁটি সরিষার তেল ও টাটকা খাদ্যদ্রব্য।' 
    },
    { 
      title: 'ধীর আঁচের পরম যত্ন', 
      english: 'THOUGHTFUL COOKING',
      desc: 'হাড়িপাতার ধোঁয়া ওঠা ঐতিহ্য, পরিমিত মসলা এবং প্রতি লোকমায় খাঁটি ঐতিহ্যের ছোঁয়া।' 
    },
    { 
      title: 'উষ্ণ ও আন্তরিক আপ্যায়ন', 
      english: 'WARM HOSPITALITY',
      desc: 'ঘরের মতো উষ্ণ ও আন্তরিক আপ্যায়ন, যা আপনাকে বারবার আমাদের টেবিলে ফিরিয়ে আনবে।' 
    }
  ];

  return (
    <Section id="story" className="bg-ivory py-20 sm:py-28 md:py-36 border-t border-charcoal/10 overflow-hidden">
      <div className="max-w-[1920px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        
        {/* Cinematic Large Image with Curtain/Mask Reveal (Col 1-6) */}
        <div className="lg:col-span-6 overflow-hidden">
          <motion.div
            initial={{ opacity: 0, clipPath: 'inset(10% 0% 10% 0%)' }}
            whileInView={{ opacity: 1, clipPath: 'inset(0% 0% 0% 0%)' }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="relative aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] overflow-hidden bg-charcoal/10 group"
          >
            <motion.img 
              src="https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/grand-kansari-thali.jpg" 
              alt="Traditional brass kansha thali table setting with bowls, a clay diya lamp, and fresh coriander" 
              className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/40 via-transparent to-transparent pointer-events-none" />
            
            <div className="absolute bottom-6 left-6 right-6 p-4 bg-ivory/95 backdrop-blur-md border border-charcoal/10 shadow-xs">
              <span className="font-sans text-[10px] tracking-[0.25em] text-terracotta uppercase font-semibold block mb-1">
                HERITAGE & CRAFT
              </span>
              <p className="font-bengali text-xs text-charcoal/80">
                ঐতিহ্যবাহী কাঁসা-পিতলের ছোঁয়া, ধীর রান্নার মায়াবী ঘ্রাণ আর নির্ভেজাল কাঁচামাল।
              </p>
            </div>
          </motion.div>
        </div>

        {/* Editorial Narrow Text Column with Intentional Whitespace (Col 7-12) */}
        <div className="lg:col-span-6 space-y-8 max-w-xl">
          
          <FadeIn delay={0.15}>
            <div className="flex items-center gap-3 mb-3">
              <span className="w-8 h-[1.5px] bg-terracotta" />
              <span className="font-sans text-xs tracking-[0.3em] text-terracotta uppercase font-medium">
                ROOTED HERE. INSPIRED EVERYWHERE.
              </span>
            </div>
            
            <h2 className="font-bengali text-4xl sm:text-5xl lg:text-6xl text-charcoal font-medium leading-[1.2] tracking-tight mb-4 text-balance">
              শিকড়টা এখানেই।
            </h2>

            <p className="font-serif text-lg sm:text-xl text-charcoal/90 font-light italic leading-relaxed mb-4">
              Bangali flavours, thoughtfully reimagined for a modern table.
            </p>
          </FadeIn>
          
          <FadeIn delay={0.3}>
            <p className="font-bengali text-base sm:text-lg text-charcoal/80 leading-relaxed font-normal mb-4">
              খাবারের সাথে আমাদের সম্পর্ক কেবল স্বাদের নয়, স্মৃতির। কাঁসারী তৈরি হয়েছে সেই চিরচেনা স্মৃতিগুলোকে আধুনিক রুচিশীল আবহে পুনরুজ্জীবিত করতে।
            </p>
            <p className="font-bengali text-sm text-charcoal/65 leading-relaxed font-light">
              মাটির সানকি থেকে কাঁসার থালা—প্রতিটি রেসিপিতে আমরা ধরে রেখেছি শৈশবের পরম স্বস্তি আর সমসাময়িক রন্ধনশিল্পের মেলবন্ধন।
            </p>
          </FadeIn>

          {/* Value List */}
          <FadeIn delay={0.45} className="space-y-5 border-t border-charcoal/10 pt-6">
            {values.map((v, i) => (
              <div key={i} className="group cursor-default">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-4 h-[1.5px] bg-terracotta/40 group-hover:w-8 group-hover:bg-terracotta transition-all duration-300" />
                  <span className="font-bengali text-sm sm:text-base font-semibold text-charcoal group-hover:text-terracotta transition-colors">
                    {v.title}
                  </span>
                  <span className="font-sans text-[10px] tracking-wider text-charcoal/40 uppercase">
                    ({v.english})
                  </span>
                </div>
                <p className="font-bengali text-xs sm:text-sm text-charcoal/65 pl-7 sm:pl-11 font-light leading-relaxed">
                  {v.desc}
                </p>
              </div>
            ))}
          </FadeIn>

        </div>

      </div>
    </Section>
  );
}
