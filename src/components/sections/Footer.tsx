import { useRestaurant } from '../../context/RestaurantContext';
import { siteConfig } from '@/config/data';
import { ArrowUp, Lock } from 'lucide-react';

interface FooterProps {
  onOpenAdmin?: () => void;
}

export function Footer({ onOpenAdmin }: FooterProps) {
  const { settings } = useRestaurant();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const name = settings?.name || siteConfig.restaurant.name;
  const bengaliName = settings?.bengaliName || siteConfig.restaurant.bengaliName;
  const tagline = settings?.tagline || siteConfig.restaurant.tagline;
  const englishTagline = settings?.englishTagline || siteConfig.restaurant.englishTagline;
  const address = settings?.address || siteConfig.restaurant.address;
  const phone = settings?.phone || siteConfig.restaurant.phone;
  const fb = settings?.socials?.facebook || siteConfig.restaurant.socials.facebook;
  const insta = settings?.socials?.instagram || siteConfig.restaurant.socials.instagram;

  const navLinks = [
    { label: 'হোম (Home)', href: '#home' },
    { label: 'স্পেশাল ডিশ (Signatures)', href: '#signature-dishes' },
    { label: 'মেনু তালিকা (Menu)', href: '#menu' },
    { label: 'আমাদের গল্প (Our Story)', href: '#story' },
    { label: 'ভোজ অভিজ্ঞতা (Experience)', href: '#experience' },
    { label: 'আবহ ও গ্যালারি (Gallery)', href: '#gallery' },
    { label: 'টেবিল বুকিং (Reservations)', href: '#reservation' },
    { label: 'যোগাযোগ ও ঠিকানা (Location)', href: '#location' },
  ];

  return (
    <footer className="bg-[#100F0D] text-ivory pt-16 md:pt-20 pb-10 px-6 sm:px-10 md:px-16 lg:px-24 border-t border-ivory/10">
      <div className="max-w-[1920px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
          
          {/* Brand & Manifesto (Col 1-5) */}
          <div className="lg:col-span-5 space-y-4">
            <div>
              <h3 className="font-serif text-3xl tracking-[0.25em] text-ivory mb-1">
                {name}
              </h3>
              <p className="font-bengali text-terracotta text-lg font-medium">
                {bengaliName}
              </p>
            </div>
            
            <p className="font-bengali text-ivory/80 max-w-sm text-sm leading-relaxed font-light">
              {tagline}
            </p>
            
            <p className="font-serif text-ivory/50 text-xs sm:text-sm max-w-sm leading-relaxed font-light italic">
              {englishTagline}
            </p>

            <div className="pt-2">
              <div className="w-10 h-[1.5px] bg-terracotta" />
            </div>
          </div>

          {/* Nav Links (Col 6-9) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-sans text-xs tracking-[0.25em] text-terracotta uppercase font-semibold">
              NAVIGATION
            </h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
              {navLinks.map((item) => (
                <li key={item.label}>
                  <a 
                    href={item.href} 
                    className="font-bengali text-xs sm:text-sm text-ivory/70 hover:text-terracotta transition-colors block py-0.5"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Social (Col 10-12) */}
          <div className="lg:col-span-3 space-y-4">
            <div>
              <h4 className="font-sans text-xs tracking-[0.25em] text-terracotta uppercase mb-2 font-semibold">
                LOCATION & INQUIRIES
              </h4>
              <p className="font-serif text-xs sm:text-sm text-ivory/80 whitespace-pre-line leading-relaxed mb-2">
                {address}
              </p>
              <p className="font-sans text-xs sm:text-sm">
                <a href={`tel:${phone}`} className="text-ivory hover:text-terracotta transition-colors font-medium">
                  {phone}
                </a>
              </p>
            </div>

            <div className="pt-2">
              <div className="flex gap-2">
                <a 
                  href={fb} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-sans text-[11px] tracking-wider text-ivory/60 hover:text-ivory uppercase border border-ivory/20 px-3 py-1 hover:border-terracotta transition-colors"
                >
                  Facebook
                </a>
                <a 
                  href={insta} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="font-sans text-[11px] tracking-wider text-ivory/60 hover:text-ivory uppercase border border-ivory/20 px-3 py-1 hover:border-terracotta transition-colors"
                >
                  Instagram
                </a>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ivory/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs font-sans tracking-wider text-ivory/40">
          <p>© {new Date().getFullYear()} {name} Dhaka, Bangladesh. সর্বস্বত্ব সংরক্ষিত।</p>
          
          <div className="flex items-center gap-6">
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="inline-flex items-center gap-1.5 text-ivory/40 hover:text-terracotta transition-colors cursor-pointer text-xs"
              >
                <Lock size={12} />
                <span>Admin Login</span>
              </button>
            )}

            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-2 text-ivory/60 hover:text-terracotta transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <span className="font-bengali text-xs">উপরে চলুন</span>
              <ArrowUp size={13} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
