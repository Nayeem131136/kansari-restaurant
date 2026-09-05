import { useRestaurant } from '../../context/RestaurantContext';
import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
  const { settings } = useRestaurant();
  const whatsappNumber = (settings.whatsapp || '').replace(/[^0-9]/g, '');

  if (!whatsappNumber) return null;

  const message = 'আসসালামু আলাইকুম, আমি কাঁসারী সম্পর্কে জানতে চাই।';
  const href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="আমাদের সাথে WhatsApp-এ যোগাযোগ করুন"
      className="fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#1fb855] shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)] transition-transform duration-200 hover:scale-105 motion-reduce:hover:scale-100"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-60 animate-ping motion-reduce:hidden" />
      <MessageCircle size={26} className="relative text-white" fill="white" fillOpacity={0.15} />
    </a>
  );
}
