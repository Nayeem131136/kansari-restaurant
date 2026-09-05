import React, { useState } from 'react';
import { Section, FadeIn } from '../ui/Section';
import { Button } from '../ui/Button';
import { motion, AnimatePresence } from 'motion/react';
import { useRestaurant } from '../../context/RestaurantContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { Calendar, Clock, Users, Phone, MessageSquare, CheckCircle2, AlertCircle, AlertTriangle } from 'lucide-react';

export function Reservation() {
  const { settings } = useRestaurant();
  const { error } = useToast();

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [createdReservation, setCreatedReservation] = useState<any>(null);

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    date: '',
    time: '',
    guests: 2,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date || !formData.time) {
      error('সবগুলো আবশ্যক তথ্য পূরণ করুন (নাম, ফোন, তারিখ ও সময়)');
      return;
    }

    try {
      setLoading(true);
      const res = await api.createReservation({
        name: formData.name,
        phone: formData.phone,
        date: formData.date,
        time: formData.time,
        guests: Number(formData.guests) || 2,
        notes: formData.notes
      });
      setCreatedReservation(res.reservation);
      setSubmitted(true);
    } catch (err: any) {
      error(err.message || 'টেবিল বুকিং সম্পন্ন করা সম্ভব হয়নি। অনুগ্রহ করে ফোন করুন।');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSubmitted(false);
    setCreatedReservation(null);
    setFormData({
      name: '',
      phone: '',
      date: '',
      time: '',
      guests: 2,
      notes: ''
    });
  };

  const timeSlots = [
    { value: "12:30 PM", label: "12:30 PM (Lunch)" },
    { value: "01:30 PM", label: "1:30 PM (Lunch)" },
    { value: "02:30 PM", label: "2:30 PM (Lunch)" },
    { value: "07:00 PM", label: "7:00 PM (Dinner)" },
    { value: "08:00 PM", label: "8:00 PM (Dinner)" },
    { value: "09:00 PM", label: "9:00 PM (Dinner)" },
    { value: "09:45 PM", label: "9:45 PM (Dinner)" },
  ];

  const phone = settings?.phone || '+880 1711-234567';
  const whatsapp = settings?.whatsapp || '+880 1811-987654';
  const cleanWhatsapp = whatsapp.replace(/[^0-9]/g, '');

  return (
    <Section id="reservation" className="bg-ivory py-16 md:py-24 border-t border-charcoal/5">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        
        {/* Info Side */}
        <div className="w-full lg:w-5/12">
          <FadeIn>
            <div className="inline-flex items-center gap-2 mb-2">
              <span className="w-6 h-[1.5px] bg-terracotta" />
              <span className="font-sans text-xs tracking-[0.25em] text-terracotta uppercase font-medium">
                SAVE YOUR SEAT · টেবিল বুকিং
              </span>
            </div>
            
            <h2 className="font-bengali text-3xl sm:text-4xl lg:text-5xl text-charcoal font-medium mb-3 tracking-tight">
              আপনার টেবিল অপেক্ষায়।
            </h2>
            
            <p className="font-bengali text-sm sm:text-base text-charcoal/80 mb-6 font-normal leading-relaxed">
              প্রিয় মানুষজনকে নিয়ে আসন নিশ্চিত করুন—বাকি আপ্যায়নের পরম দায়িত্ব আমাদের। উইকএন্ডে অগ্রিম বুকিং দিয়ে রাখলে ভালো হয়।
            </p>

            {/* Special Notice from Admin if active */}
            {settings?.specialClosureNotice && (
              <div className="mb-6 p-4 bg-terracotta/10 border border-terracotta/30 flex items-start gap-3">
                <AlertTriangle size={18} className="text-terracotta shrink-0 mt-0.5" />
                <p className="font-bengali text-xs text-charcoal leading-relaxed font-medium">
                  {settings.specialClosureNotice}
                </p>
              </div>
            )}

            <div className="space-y-4 bg-[#F2F1EC] p-5 sm:p-6 border border-charcoal/10">
              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-ivory border border-charcoal/10 flex items-center justify-center text-terracotta shrink-0 mt-0.5">
                  <Phone size={15} />
                </div>
                <div>
                  <span className="font-bengali text-[11px] tracking-wider text-charcoal/60 uppercase block">
                    সরাসরি কল করুন (DIRECT CALL)
                  </span>
                  <a href={`tel:${phone}`} className="font-serif text-lg text-charcoal hover:text-terracotta transition-colors font-medium">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-8 h-8 rounded-full bg-ivory border border-charcoal/10 flex items-center justify-center text-terracotta shrink-0 mt-0.5">
                  <MessageSquare size={15} />
                </div>
                <div>
                  <span className="font-bengali text-[11px] tracking-wider text-charcoal/60 uppercase block">
                    হোয়াটসঅ্যাপ কনসিয়ার্জ (WHATSAPP)
                  </span>
                  <a 
                    href={`https://wa.me/${cleanWhatsapp}`} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="font-serif text-lg text-charcoal hover:text-terracotta transition-colors font-medium"
                  >
                    {whatsapp}
                  </a>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Form Side */}
        <div className="w-full lg:w-7/12 relative">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="reservation-form"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
                onSubmit={handleSubmit}
                className="space-y-6 bg-[#F2F1EC] p-6 sm:p-8 border border-charcoal/10 shadow-2xs"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="res-name" className="font-sans text-xs tracking-widest text-charcoal/70 uppercase block font-medium">
                      Full Name (আপনার নাম) *
                    </label>
                    <input 
                      required 
                      type="text" 
                      id="res-name" 
                      placeholder="e.g. Abrar Fahad"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-transparent border-b border-charcoal/25 py-2 font-serif text-lg text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-terracotta transition-colors rounded-none" 
                    />
                  </div>

                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="res-phone" className="font-sans text-xs tracking-widest text-charcoal/70 uppercase block font-medium">
                      Phone Number (মোবাইল নম্বর) *
                    </label>
                    <input 
                      required 
                      type="tel" 
                      id="res-phone" 
                      placeholder="+880 1..."
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full bg-transparent border-b border-charcoal/25 py-2 font-serif text-lg text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-terracotta transition-colors rounded-none" 
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <label htmlFor="res-date" className="font-sans text-xs tracking-widest text-charcoal/70 uppercase block font-medium">
                      Reservation Date (তারিখ) *
                    </label>
                    <div className="relative">
                      <input 
                        required 
                        type="date" 
                        id="res-date" 
                        value={formData.date}
                        min={new Date().toISOString().split('T')[0]}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full bg-transparent border-b border-charcoal/25 py-2 font-serif text-lg text-charcoal focus:outline-none focus:border-terracotta transition-colors rounded-none cursor-pointer" 
                      />
                    </div>
                  </div>

                  {/* Time */}
                  <div className="space-y-2">
                    <label htmlFor="res-time" className="font-sans text-xs tracking-widest text-charcoal/70 uppercase block font-medium">
                      Preferred Time (পছন্দের সময়) *
                    </label>
                    <select 
                      required 
                      id="res-time" 
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full bg-transparent border-b border-charcoal/25 py-2 font-serif text-lg text-charcoal focus:outline-none focus:border-terracotta transition-colors rounded-none cursor-pointer"
                    >
                      <option value="" disabled>Select Time Slot</option>
                      {timeSlots.map((slot) => (
                        <option key={slot.value} value={slot.value}>
                          {slot.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Guests */}
                  <div className="space-y-3 sm:col-span-2">
                    <label className="font-sans text-xs tracking-widest text-charcoal/70 uppercase block font-medium">
                      Number of Guests (অতিথির সংখ্যা): <span className="text-terracotta font-serif text-base ml-1">{formData.guests} {formData.guests === 1 ? 'Person' : 'Guests'}</span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() => setFormData({ ...formData, guests: num })}
                          className={`w-10 h-10 rounded-none text-xs font-sans tracking-wider border transition-all cursor-pointer ${
                            formData.guests === num 
                              ? 'bg-terracotta text-ivory border-terracotta font-semibold' 
                              : 'bg-ivory/60 text-charcoal border-charcoal/20 hover:border-charcoal/50'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Special Requests */}
                  <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="res-notes" className="font-sans text-xs tracking-widest text-charcoal/70 uppercase block font-medium">
                      Special Requests / Seating Preference (বিশেষ নির্দেশনা বা পছন্দ)
                    </label>
                    <input 
                      type="text" 
                      id="res-notes" 
                      placeholder="e.g., Quiet corner table, anniversary, allergy notice"
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="w-full bg-transparent border-b border-charcoal/25 py-2 font-serif text-base text-charcoal placeholder:text-charcoal/30 focus:outline-none focus:border-terracotta transition-colors rounded-none" 
                    />
                  </div>
                </div>
                
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <Button 
                    id="submit-reservation-btn"
                    type="submit" 
                    variant="primary" 
                    size="md"
                    disabled={loading}
                    className="w-full sm:w-auto disabled:opacity-50"
                  >
                    {loading ? 'প্রক্রিয়াধীন...' : 'REQUEST A RESERVATION'}
                  </Button>
                  <span className="text-[11px] font-sans tracking-wider text-charcoal/50">
                    Instant confirmation via SMS/WhatsApp
                  </span>
                </div>
              </motion.form>
            ) : (
              <motion.div
                key="reservation-success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4 }}
                className="h-full min-h-[460px] flex flex-col items-center justify-center text-center bg-[#F2F1EC] p-8 sm:p-14 border border-charcoal/10 shadow-xs"
              >
                <div className="w-16 h-16 rounded-full bg-terracotta/10 text-terracotta flex items-center justify-center mb-6">
                  <CheckCircle2 size={32} />
                </div>
                
                <h3 className="font-bengali text-3xl md:text-4xl mb-2 text-charcoal font-medium">
                  ধন্যবাদ, {formData.name || 'অতিথি'}!
                </h3>
                
                <p className="font-serif text-lg text-charcoal/80 mb-6">
                  আপনার টেবিল সংরক্ষণের আবেদনটি ডাটাবেজে সফলভাবে সংরক্ষিত হয়েছে।
                </p>

                {/* Reservation Summary Card */}
                <div className="w-full max-w-sm bg-ivory p-6 border border-charcoal/10 text-left space-y-3 mb-8 text-xs font-sans">
                  {createdReservation?.id && (
                    <div className="flex justify-between border-b border-charcoal/10 pb-2">
                      <span className="text-charcoal/50 uppercase tracking-wider">Booking ID</span>
                      <span className="font-mono font-bold text-terracotta">{createdReservation.id}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-b border-charcoal/10 pb-2">
                    <span className="text-charcoal/50 uppercase tracking-wider flex items-center gap-1.5"><Calendar size={12} /> Date</span>
                    <span className="font-medium text-charcoal">{formData.date || 'Pending'}</span>
                  </div>
                  <div className="flex justify-between border-b border-charcoal/10 pb-2">
                    <span className="text-charcoal/50 uppercase tracking-wider flex items-center gap-1.5"><Clock size={12} /> Time</span>
                    <span className="font-medium text-charcoal">{formData.time}</span>
                  </div>
                  <div className="flex justify-between border-b border-charcoal/10 pb-2">
                    <span className="text-charcoal/50 uppercase tracking-wider flex items-center gap-1.5"><Users size={12} /> Party Size</span>
                    <span className="font-medium text-charcoal">{formData.guests} Guests</span>
                  </div>
                  {formData.notes && (
                    <div className="pt-1 text-charcoal/70 italic">
                      Note: &quot;{formData.notes}&quot;
                    </div>
                  )}
                </div>

                <Button 
                  id="book-another-btn"
                  variant="outline" 
                  size="sm"
                  onClick={handleReset}
                >
                  MAKE ANOTHER RESERVATION
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </Section>
  );
}
