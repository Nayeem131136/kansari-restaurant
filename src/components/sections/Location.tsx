import { useState } from 'react';
import { Section, FadeIn } from '../ui/Section';
import { Button } from '../ui/Button';
import { useRestaurant } from '../../context/RestaurantContext';
import { siteConfig } from '@/config/data';
import { MapPin, Navigation, Clock, Check, Copy, Phone, MessageSquare } from 'lucide-react';

export function Location() {
  const { settings } = useRestaurant();
  const [copied, setCopied] = useState(false);

  const restaurantName = settings?.name || siteConfig.restaurant.name;
  const bengaliName = settings?.bengaliName || siteConfig.restaurant.bengaliName;
  const address = settings?.address || siteConfig.restaurant.address;
  const phone = settings?.phone || siteConfig.restaurant.phone;
  const whatsapp = settings?.whatsapp || siteConfig.restaurant.whatsapp;
  const location = settings?.location || siteConfig.restaurant.location;

  const copyAddress = () => {
    navigator.clipboard.writeText(address.replace(/\n/g, ', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = whatsapp.startsWith('http')
    ? whatsapp
    : `https://wa.me/${whatsapp.replace(/[^0-9]/g, '')}`;

  return (
    <Section id="location" className="bg-ivory py-20 sm:py-28 md:py-36 border-t border-charcoal/10">
      <div className="max-w-[1920px] mx-auto flex flex-col lg:flex-row gap-10 lg:gap-16 items-stretch">
        
        {/* Info Column */}
        <div className="w-full lg:w-5/12 flex flex-col justify-between space-y-6">
          <FadeIn>
            <div className="inline-flex items-center gap-3 mb-3">
              <span className="w-8 h-[1.5px] bg-terracotta" />
              <span className="font-sans text-xs tracking-[0.3em] text-terracotta uppercase font-medium">
                FIND OUR TABLE · ঠিকানা ও সময়সূচি
              </span>
            </div>

            <h2 className="font-bengali text-3xl sm:text-4xl lg:text-5xl text-charcoal font-medium mb-3 tracking-tight">
              দেখা হবে কাঁসারীতে।
            </h2>
            <p className="font-bengali text-sm sm:text-base text-charcoal/70 mb-6 font-light leading-relaxed">
              ঢাকার কোলাহল ছেড়ে এক চিলতে শান্তির আবহ—আমাদের প্রতিটি আসন আপনার অপেক্ষায় প্রস্তুত।
            </p>

            <div className="space-y-5 mb-8">
              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="font-bengali text-xs tracking-wider text-charcoal/50 uppercase block mb-1 font-semibold">
                    রেস্তোরাঁর অবস্থান (ADDRESS)
                  </span>
                  <p className="font-serif text-base sm:text-lg text-charcoal whitespace-pre-line leading-relaxed">
                    {address}
                  </p>
                  <button
                    onClick={copyAddress}
                    className="inline-flex items-center gap-1.5 text-xs font-sans text-charcoal/60 hover:text-terracotta transition-colors pt-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check size={13} className="text-terracotta" />
                        <span className="text-terracotta font-medium">ঠিকানা কপি হয়েছে!</span>
                      </>
                    ) : (
                      <>
                        <Copy size={13} />
                        <span>ঠিকানা কপি করুন</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-4 pt-4 border-t border-charcoal/10">
                <div className="w-9 h-9 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center shrink-0 mt-0.5">
                  <Clock size={16} />
                </div>
                <div className="flex-1">
                  <span className="font-bengali text-xs tracking-wider text-charcoal/50 uppercase block mb-2 font-semibold">
                    খোলার সময়সূচি (OPENING HOURS)
                  </span>
                  <ul className="space-y-2">
                    {settings?.openingHours ? (
                      settings.openingHours.map((h, i) => (
                        <li key={i} className="flex justify-between items-center text-xs sm:text-sm font-sans py-1 border-b border-charcoal/5">
                          <span className="text-charcoal font-medium">{h.day} ({h.bengaliDay})</span>
                          <span className="font-serif text-charcoal/80 font-medium">
                            {h.isOpen ? `${h.openTime} – ${h.closeTime}` : 'Closed'}
                          </span>
                        </li>
                      ))
                    ) : (
                      siteConfig.restaurant.hours.map((h, i) => (
                        <li key={i} className="flex justify-between items-center text-xs sm:text-sm font-sans py-1 border-b border-charcoal/5">
                          <span className="text-charcoal font-medium">{h.days}</span>
                          <span className="font-serif text-charcoal/80 font-medium">{h.time}</span>
                        </li>
                      ))
                    )}
                  </ul>
                </div>
              </div>
            </div>

            {/* Action Buttons: GET DIRECTIONS, CALL NOW, WHATSAPP */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName + ' ' + location)}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="sm" className="gap-2 cursor-pointer shadow-sm">
                  <Navigation size={14} />
                  <span>GET DIRECTIONS</span>
                </Button>
              </a>
              
              <a href={`tel:${phone}`}>
                <Button variant="outline" size="sm" className="gap-2 cursor-pointer">
                  <Phone size={14} />
                  <span>CALL NOW</span>
                </Button>
              </a>

              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="terracotta-outline" size="sm" className="gap-2 cursor-pointer">
                  <MessageSquare size={14} />
                  <span>WHATSAPP</span>
                </Button>
              </a>
            </div>
          </FadeIn>
        </div>

        {/* Map Treatment Frame */}
        <div className="w-full lg:w-7/12 min-h-[440px] relative">
          <FadeIn delay={0.2} className="w-full h-full min-h-[440px]">
            <div className="w-full h-full min-h-[440px] bg-[#EAE8DD] border border-charcoal/15 relative overflow-hidden flex items-center justify-center p-6 sm:p-10">
              
              {/* Dhaka map styling pattern grid */}
              <div className="absolute inset-0 opacity-15 pointer-events-none">
                <div className="absolute top-1/4 left-0 right-0 h-[1.5px] bg-charcoal -rotate-6" />
                <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-charcoal/80 rotate-12" />
                <div className="absolute top-3/4 left-0 right-0 h-[1px] bg-charcoal -rotate-3" />
                <div className="absolute top-0 bottom-0 left-1/4 w-[1.5px] bg-charcoal rotate-6" />
                <div className="absolute top-0 bottom-0 left-1/2 w-[2px] bg-charcoal/70 -rotate-12" />
                <div className="absolute top-0 bottom-0 left-3/4 w-[1px] bg-charcoal rotate-3" />
              </div>

              {/* Pin Card */}
              <div className="relative z-10 flex flex-col items-center text-center p-6 sm:p-8 bg-ivory/95 backdrop-blur-md border border-charcoal/15 shadow-xl max-w-sm w-full">
                <div className="w-12 h-12 rounded-full bg-terracotta text-ivory flex items-center justify-center mb-3 shadow-md">
                  <MapPin size={22} />
                </div>
                <h3 className="font-serif text-2xl text-charcoal font-semibold mb-0.5">
                  {restaurantName}
                </h3>
                <p className="font-bengali text-terracotta text-sm mb-3">
                  {bengaliName}
                </p>
                <p className="font-sans text-xs text-charcoal/70 mb-4 whitespace-pre-line leading-relaxed">
                  {address}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurantName + ' ' + location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[11px] font-sans tracking-[0.2em] uppercase text-terracotta hover:underline font-semibold"
                >
                  OPEN IN GOOGLE MAPS &rarr;
                </a>
              </div>

              <div className="absolute bottom-4 right-6 text-right">
                <span className="font-sans text-[10px] tracking-widest text-charcoal/40 uppercase block">
                  {location} · 23.7771° N, 90.3994° E
                </span>
              </div>
            </div>
          </FadeIn>
        </div>

      </div>
    </Section>
  );
}
