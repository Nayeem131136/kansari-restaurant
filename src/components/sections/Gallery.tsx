import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Section, FadeIn } from '../ui/Section';
import { useRestaurant } from '../../context/RestaurantContext';
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Gallery() {
  const { gallery: backendGallery } = useRestaurant();

  const defaultGallery = [
    { 
      id: "g1", 
      url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/dining-room.jpg", 
      title: "The Dining Room", 
      bengali: "শান্ত ও রুচিশীল সান্ধ্যকালীন আবহ", 
      aspect: "video" 
    },
    { 
      id: "g2", 
      url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/kitchen-cooking-process.jpg", 
      title: "Slow-Cooked Kacchi", 
      bengali: "দম কাচ্চির সুবাস ও জাফরানি চাল", 
      aspect: "portrait" 
    },
    { 
      id: "g7", 
      url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/grand-kansari-thali.jpg", 
      title: "The Grand Kansari Thali", 
      bengali: "ঐতিহ্যবাহী কাঁসার পাত্রে পরিবেশন", 
      aspect: "square" 
    },
    { 
      id: "g3", 
      url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/exterior-signage-close-up.jpg", 
      title: "The Kansari Mark", 
      bengali: "কাঁসারীর ঐতিহ্যবাহী প্রতীক", 
      aspect: "portrait" 
    },
    { 
      id: "g5", 
      url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/spices.jpg", 
      title: "Artisanal Spices", 
      bengali: "শিল-পাটায় বাটা খাঁটি মসলার জাদু", 
      aspect: "video" 
    },
    { 
      id: "g6", 
      url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/hospitality-moment.jpg", 
      title: "Hospitality & Details", 
      bengali: "আন্তরিক সেবা ও যত্নশীল আতিথেয়তা", 
      aspect: "square" 
    },
  ];

  const galleryItems = (backendGallery && backendGallery.length > 0)
    ? backendGallery
    : defaultGallery;

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    document.body.style.overflow = '';
  }, []);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  }, [galleryItems.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  }, [galleryItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, closeLightbox, nextImage, prevImage]);

  return (
    <Section id="gallery" className="bg-ivory py-20 sm:py-28 md:py-36 border-t border-charcoal/10">
      
      {/* Header */}
      <FadeIn className="max-w-4xl mb-12 sm:mb-16">
        <div className="flex items-center gap-3 mb-3">
          <span className="w-8 h-[1.5px] bg-terracotta" />
          <span className="font-sans text-xs tracking-[0.3em] text-terracotta uppercase font-medium">
            MOMENTS & AMBIENCE · পরিবেশ ও মুহূর্ত
          </span>
        </div>
        <h2 className="font-bengali text-3xl sm:text-5xl lg:text-6xl text-charcoal font-medium tracking-tight mb-4">
          মুহূর্তগুলো স্মৃতির ফ্রেমে।
        </h2>
        <p className="font-serif text-sm sm:text-base text-charcoal/65 italic max-w-xl font-light">
          The Kansari Atmosphere · রন্ধনশিল্প, কাঁসা-পিতলের আলোছায়া আর আন্তরিক গল্প
        </p>
      </FadeIn>

      {/* Masonry Layout */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 max-w-[1920px] mx-auto">
        {galleryItems.map((img, index) => (
          <FadeIn key={img.id || index} delay={index * 0.08}>
            <div 
              className="relative overflow-hidden group cursor-pointer break-inside-avoid bg-charcoal/10 border border-charcoal/10"
              data-cursor="view"
              onClick={() => openLightbox(index)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') openLightbox(index); }}
              aria-label={`View photo: ${img.title}`}
            >
              <img
                src={img.url}
                alt={img.title}
                className={cn(
                  "w-full h-auto object-cover transition-transform duration-700 ease-out group-hover:scale-105",
                  img.aspect === 'video' ? 'aspect-[16/10]' : img.aspect === 'square' ? 'aspect-square' : 'aspect-[3/4]'
                )}
                loading="lazy"
              />
              
              {/* Overlay with subtle metadata */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#12110F]/80 via-[#12110F]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-6">
                <div className="flex justify-end">
                  <span className="p-2 rounded-full bg-ivory/20 backdrop-blur-md text-ivory">
                    <Maximize2 size={16} />
                  </span>
                </div>
                <div className="space-y-1">
                  <span className="font-sans text-xs tracking-[0.2em] text-ivory uppercase font-medium block">
                    {img.title}
                  </span>
                  {img.bengali && (
                    <span className="font-bengali text-xs text-ivory/75 font-normal block">
                      {img.bengali}
                    </span>
                  )}
                </div>
              </div>

            </div>
          </FadeIn>
        ))}
      </div>

      {/* Fullscreen Lightbox */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-[#12110F]/95 backdrop-blur-md flex items-center justify-center p-4 md:p-12 cursor-default"
            onClick={closeLightbox}
          >
            {/* Close Button */}
            <button 
              className="absolute top-6 right-6 text-ivory/70 hover:text-ivory bg-ivory/10 hover:bg-ivory/20 rounded-full p-3 transition-all z-50 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
              aria-label="Close Lightbox"
            >
              <X size={22} />
            </button>

            {/* Left Nav */}
            <button 
              className="absolute left-4 md:left-8 text-ivory/70 hover:text-ivory bg-ivory/10 hover:bg-ivory/20 rounded-full p-3.5 transition-all z-50 cursor-pointer"
              onClick={prevImage}
              aria-label="Previous Image"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Main Image */}
            <div className="relative max-w-5xl max-h-[85vh] flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                src={galleryItems[currentIndex].url}
                alt={galleryItems[currentIndex].title}
                className="max-w-[90vw] max-h-[75vh] object-contain shadow-2xl border border-ivory/10"
              />
              <div className="mt-4 text-center space-y-1">
                <p className="font-serif text-lg text-ivory tracking-wide">
                  {galleryItems[currentIndex].title}
                </p>
                {galleryItems[currentIndex].bengali && (
                  <p className="font-bengali text-xs text-ivory/70">
                    {galleryItems[currentIndex].bengali}
                  </p>
                )}
                <p className="font-sans text-[10px] tracking-[0.25em] text-ivory/40 pt-1">
                  {currentIndex + 1} OF {galleryItems.length}
                </p>
              </div>
            </div>

            {/* Right Nav */}
            <button 
              className="absolute right-4 md:right-8 text-ivory/70 hover:text-ivory bg-ivory/10 hover:bg-ivory/20 rounded-full p-3.5 transition-all z-50 cursor-pointer"
              onClick={nextImage}
              aria-label="Next Image"
            >
              <ChevronRight size={28} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </Section>
  );
}
