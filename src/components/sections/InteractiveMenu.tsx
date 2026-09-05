import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, FadeIn } from '../ui/Section';
import { useRestaurant } from '../../context/RestaurantContext';
import { siteConfig } from '@/config/data';
import { Search, Sparkles, UtensilsCrossed, MessageCircle } from 'lucide-react';

export function InteractiveMenu() {
  const { menuItems, settings } = useRestaurant();
  const [searchQuery, setSearchQuery] = useState('');

  const whatsappNumber = (settings.whatsapp || '').replace(/[^0-9]/g, '');

  function buildOrderLink(item: { name: string; bengaliName: string; price: string }) {
    const message = `আসসালামু আলাইকুম, আমি কাঁসারী থেকে অর্ডার করতে চাই:\n\n${item.bengaliName} (${item.name}) — ${item.price}\n\nদয়া করে জানান কীভাবে এগোতে হবে।`;
    return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
  }

  const displayItems = useMemo(() => {
    const raw = (menuItems && menuItems.length > 0) ? menuItems : siteConfig.allItems;
    
    // Sort by sortOrder
    const sorted = [...raw].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    if (!searchQuery.trim()) {
      return sorted;
    }

    const q = searchQuery.toLowerCase();
    return sorted.filter(
      item => (item.name && item.name.toLowerCase().includes(q)) || 
              (item.bengaliName && item.bengaliName.toLowerCase().includes(q)) ||
              (item.description && item.description.toLowerCase().includes(q)) ||
              (item.bengaliDescription && item.bengaliDescription.toLowerCase().includes(q)) ||
              (item.badge && item.badge.toLowerCase().includes(q)) ||
              (item.tag && item.tag.toLowerCase().includes(q))
    );
  }, [menuItems, searchQuery]);

  return (
    <Section id="menu" className="bg-[#F6F5F0] py-20 sm:py-28 md:py-36 border-t border-charcoal/10">
      <div className="max-w-[1920px] mx-auto">
        
        {/* Editorial Section Header */}
        <FadeIn className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-6 h-[1.5px] bg-terracotta" />
            <span className="font-sans text-[11px] sm:text-xs tracking-[0.3em] text-terracotta uppercase font-medium">
              AUTHENTIC BANGLADESHI CUISINE · সম্পূর্ণ মেনু সম্ভার
            </span>
            <span className="w-6 h-[1.5px] bg-terracotta" />
          </div>
          
          <h2 className="font-bengali text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-charcoal mb-3 font-medium tracking-tight text-balance">
            কাঁসারীর প্রতিটি পদের রসনা সম্ভার
          </h2>
          
          <p className="font-bengali text-charcoal/75 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-light leading-relaxed">
            এক নজরে আমাদের সকল আসল বাংলাদেশি খাবার—সরাসরি খাঁটি ছবি, সঠিক নাম ও দামসহ।
          </p>
        </FadeIn>

        {/* Live Filter & Count Bar */}
        <div className="max-w-2xl mx-auto mb-12 px-4">
          <div className="relative mb-3">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-charcoal/40" />
            <input
              type="text"
              placeholder="খাবারের নাম লিখে খুঁজুন (যেমন: কাচ্চি, কালাভুনা, ইলিশ, রোস্ট, বোরহানি, দই, রসমলাই)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-16 py-3.5 bg-ivory border border-charcoal/20 text-sm font-sans text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-terracotta focus:ring-1 focus:ring-terracotta transition-all shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-sans text-charcoal/50 hover:text-terracotta px-2 py-1 cursor-pointer"
              >
                মুছুন
              </button>
            )}
          </div>

          <div className="flex items-center justify-between px-1 text-xs text-charcoal/60 font-sans">
            <div className="flex items-center gap-1.5 font-bengali">
              <UtensilsCrossed size={14} className="text-terracotta" />
              <span>মোট পদ: <strong>{displayItems.length}</strong> টি</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Sparkles size={13} className="text-terracotta" />
              <span className="font-bengali">খাঁটি ছবি ও সঠিক দাম</span>
            </div>
          </div>
        </div>

        {/* Rich Photo Menu Grid - All Items in one seamless gallery */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={searchQuery ? 'search-' + searchQuery : 'all-items'}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8"
            >
              {displayItems.length === 0 ? (
                <div className="col-span-full text-center py-16 bg-ivory border border-charcoal/10 p-8">
                  <p className="font-bengali text-lg text-charcoal/70 mb-3">
                    &quot;{searchQuery}&quot; দিয়ে কোনো খাবার পাওয়া যায়নি।
                  </p>
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="text-xs font-sans tracking-[0.2em] text-terracotta uppercase font-semibold underline cursor-pointer"
                  >
                    সকল পদ দেখুন (VIEW ALL ITEMS)
                  </button>
                </div>
              ) : (
                displayItems.map((item) => (
                  <div 
                    key={item.id}
                    className="group bg-ivory border border-charcoal/15 flex flex-col justify-between overflow-hidden hover:border-terracotta/50 hover:shadow-xl transition-all duration-300 relative"
                  >
                    <div>
                      {/* Authentic Food Photo Container */}
                      <div className="relative aspect-[16/11] overflow-hidden bg-charcoal/10">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className={`w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105 ${
                            item.available === false ? 'grayscale opacity-60' : ''
                          }`}
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#12110F]/70 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Sold out overlay */}
                        {item.available === false && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center pointer-events-none">
                            <span className="bg-rose-600 text-white font-sans text-xs tracking-widest uppercase font-bold px-3 py-1 border border-white/30 shadow-lg">
                              SOLD OUT · আজকের মতো শেষ
                            </span>
                          </div>
                        )}

                        {/* Tag Badge */}
                        {item.tag && (
                          <div className="absolute top-3 left-3 bg-[#12110F]/85 backdrop-blur-sm text-ivory text-[9px] font-sans tracking-[0.2em] uppercase px-2.5 py-1 font-semibold border border-ivory/15">
                            {item.tag}
                          </div>
                        )}

                        {/* Price Badge over Image */}
                        <div className="absolute bottom-3 right-3 bg-terracotta text-ivory font-serif text-lg sm:text-xl px-3 py-1 font-semibold shadow-md">
                          {item.price}
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-5 space-y-2">
                        {/* Bengali Title */}
                        <h4 className="font-bengali text-lg sm:text-xl font-medium text-charcoal group-hover:text-terracotta transition-colors leading-snug">
                          {item.bengaliName}
                        </h4>
                        
                        {/* English Subtitle */}
                        <p className="font-serif text-xs sm:text-sm text-charcoal/60 font-light italic">
                          {item.name}
                        </p>

                        {/* Bengali Description */}
                        <p className="font-bengali text-xs sm:text-sm text-charcoal/80 leading-relaxed font-normal pt-1">
                          {item.bengaliDescription || item.description}
                        </p>
                      </div>
                    </div>

                    {/* Footer Meta on Card */}
                    <div className="px-5 pb-3 pt-2 border-t border-charcoal/10 flex items-center justify-between text-xs font-sans text-charcoal/50">
                      <span className="font-bengali text-[11px] text-terracotta font-medium">
                        {item.badge || "কাঁসারী বিশেষ"}
                      </span>
                      <span className="font-bengali text-[11px]">
                        {item.available === false ? 'সাময়িক অনুপস্থিত' : 'খাঁটি পরিবেশন'}
                      </span>
                    </div>

                    {/* WhatsApp Order Button */}
                    {item.available !== false && whatsappNumber && (
                      <a
                        href={buildOrderLink(item)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mx-5 mb-5 flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1fb855] text-white font-bengali text-sm font-medium py-2.5 transition-colors"
                      >
                        <MessageCircle size={15} />
                        <span>হোয়াটসঅ্যাপে অর্ডার করুন</span>
                      </a>
                    )}

                  </div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Menu Footer Note */}
        <div className="mt-14 pt-8 border-t border-charcoal/15 text-center space-y-2">
          <p className="font-bengali text-xs sm:text-sm text-charcoal/70">
            * সকল মূল্যের সাথে সরকারি ভ্যাট ও সম্পূরক শুল্ক অন্তর্ভুক্ত।
          </p>
          <p className="font-sans text-[11px] text-charcoal/50 tracking-wider uppercase">
            Special dining inquiries or dietary customizations? Please ask our table captain.
          </p>
        </div>

      </div>
    </Section>
  );
}
