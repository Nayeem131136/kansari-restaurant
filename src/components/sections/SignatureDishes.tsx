import { motion } from 'motion/react';
import { Section, FadeIn } from '../ui/Section';
import { useRestaurant } from '../../context/RestaurantContext';
import { siteConfig } from '@/config/data';
import { ArrowUpRight } from 'lucide-react';

export function SignatureDishes() {
  const { menuItems, settings } = useRestaurant();
  const whatsappNumber = (settings.whatsapp || '').replace(/[^0-9]/g, '');

  const featuredItems = (menuItems && menuItems.filter(m => m.featured).length > 0)
    ? menuItems.filter(m => m.featured)
    : siteConfig.signatureDishes;

  const featuredDish = featuredItems[0] || siteConfig.signatureDishes[0];
  const companionDishes = featuredItems.slice(1, 4).length > 0
    ? featuredItems.slice(1, 4)
    : siteConfig.signatureDishes.slice(1);

  const featuredOrderLink = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `আসসালামু আলাইকুম, আমি কাঁসারী থেকে অর্ডার করতে চাই:\n\n${featuredDish.bengaliName} (${featuredDish.name}) — ${featuredDish.price}\n\nদয়া করে জানান কীভাবে এগোতে হবে।`
      )}`
    : undefined;

  return (
    <Section id="signature-dishes" className="bg-ivory py-20 md:py-28 border-t border-charcoal/10">
      
      {/* Editorial Header */}
      <FadeIn className="max-w-4xl mb-12 sm:mb-16">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-[1.5px] bg-terracotta" />
          <span className="font-sans text-xs tracking-[0.3em] text-terracotta uppercase font-medium">
            CHEF'S SIGNATURES · রান্নাঘরের সেরা আয়োজন
          </span>
        </div>
        <h2 className="font-bengali text-3xl sm:text-5xl lg:text-6xl text-charcoal font-medium tracking-tight mb-4 text-balance">
          কিছু স্বাদ, ফিরে আসার অজুহাত।
        </h2>
        <p className="font-bengali text-charcoal/70 text-base sm:text-lg max-w-2xl font-light">
          ধীর আঁচে রান্না, তাজা মসলার ঘ্রাণ আর খাঁটি কাঁচামালের ব্যবহারে তৈরি আমাদের প্রধান পদগুলো।
        </p>
      </FadeIn>

      {/* Asymmetric Editorial Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch max-w-[1920px] mx-auto">
        
        {/* Large Dominant Featured Dish (Col 1-7) */}
        <div className="lg:col-span-7 flex flex-col">
          <FadeIn className="h-full">
            <div className="group relative h-full flex flex-col justify-between bg-[#F2F0E8] border border-charcoal/10 p-6 sm:p-8 hover:border-terracotta/40 transition-colors duration-500 overflow-hidden">
              
              {/* Image Container with smooth zoom */}
              <div className="relative aspect-[16/11] sm:aspect-[16/10] overflow-hidden bg-charcoal/10 mb-6">
                <motion.img 
                  src={featuredDish.image} 
                  alt={featuredDish.name}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12110F]/70 via-transparent to-transparent" />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-terracotta text-ivory text-[10px] sm:text-xs font-sans tracking-[0.2em] uppercase px-3.5 py-1.5 font-medium shadow-md">
                  {featuredDish.tag || "SIGNATURE"}
                </div>

                {/* Price in Image Corner */}
                <div className="absolute bottom-4 right-4 bg-[#12110F]/90 backdrop-blur-sm text-ivory font-serif text-xl sm:text-2xl px-4 py-1.5 border border-ivory/15 font-semibold">
                  {featuredDish.price}
                </div>
              </div>

              {/* Title & Narrative */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
                  <div>
                    <h3 className="font-serif text-2xl sm:text-3xl text-charcoal group-hover:text-terracotta transition-colors duration-300">
                      {featuredDish.name}
                    </h3>
                    <span className="font-bengali text-base sm:text-lg text-terracotta font-medium block mt-0.5">
                      {featuredDish.bengaliName}
                    </span>
                  </div>
                  <a
                    href={featuredOrderLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="হোয়াটসঅ্যাপে অর্ডার করুন"
                    className="w-10 h-10 rounded-full border border-charcoal/15 flex items-center justify-center text-charcoal hover:bg-terracotta hover:text-ivory hover:border-terracotta transition-all duration-300 shrink-0"
                  >
                    <ArrowUpRight size={18} />
                  </a>
                </div>

                <p className="font-bengali text-charcoal/80 text-sm sm:text-base leading-relaxed">
                  {featuredDish.bengaliDescription || featuredDish.description}
                </p>
                {featuredDish.description && (
                  <p className="font-serif text-charcoal/60 text-xs sm:text-sm font-light italic leading-relaxed">
                    {featuredDish.description}
                  </p>
                )}
              </div>

            </div>
          </FadeIn>
        </div>

        {/* Companion Dishes Stacked (Col 8-12) */}
        <div className="lg:col-span-5 flex flex-col justify-between gap-6">
          {companionDishes.map((dish, idx) => (
            <FadeIn key={dish.id} delay={idx * 0.12}>
              <div className="group bg-[#F2F0E8] border border-charcoal/10 p-4 sm:p-5 hover:border-terracotta/40 transition-colors duration-500 flex flex-col sm:flex-row gap-5 items-center">
                
                {/* Smaller Thumbnail */}
                <div className="w-full sm:w-36 aspect-[4/3] sm:aspect-square overflow-hidden shrink-0 bg-charcoal/10 relative">
                  <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 bg-[#12110F]/80 text-ivory text-[9px] font-sans tracking-widest px-2 py-0.5 uppercase">
                    {dish.tag || "SPECIAL"}
                  </div>
                </div>

                {/* Info */}
                <div className="flex-1 w-full space-y-1.5">
                  <div className="flex justify-between items-baseline border-b border-charcoal/10 pb-1.5">
                    <div>
                      <h4 className="font-serif text-lg text-charcoal group-hover:text-terracotta transition-colors duration-300">
                        {dish.name}
                      </h4>
                      <span className="font-bengali text-xs sm:text-sm text-terracotta font-medium block">
                        {dish.bengaliName}
                      </span>
                    </div>
                    <span className="font-serif text-base sm:text-lg text-charcoal font-semibold ml-3 shrink-0">
                      {dish.price}
                    </span>
                  </div>

                  <p className="font-bengali text-charcoal/75 text-xs leading-relaxed line-clamp-2">
                    {dish.bengaliDescription || dish.description}
                  </p>
                </div>

              </div>
            </FadeIn>
          ))}
        </div>

      </div>
    </Section>
  );
}
