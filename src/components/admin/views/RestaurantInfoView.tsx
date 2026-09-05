import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { useRestaurant } from '../../../context/RestaurantContext';
import { Save, Building2, Phone, Mail, MapPin, Globe } from 'lucide-react';

export function RestaurantInfoView() {
  const { success, error } = useToast();
  const { settings, refreshData } = useRestaurant();

  const [formData, setFormData] = useState({
    name: '',
    bengaliName: '',
    tagline: '',
    englishTagline: '',
    description: '',
    englishDescription: '',
    location: '',
    address: '',
    phone: '',
    whatsapp: '',
    email: '',
    facebook: '',
    instagram: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setFormData({
        name: settings.name || 'KANSARI',
        bengaliName: settings.bengaliName || 'কাঁসারী',
        tagline: settings.tagline || '',
        englishTagline: settings.englishTagline || '',
        description: settings.description || '',
        englishDescription: settings.englishDescription || '',
        location: settings.location || '',
        address: settings.address || '',
        phone: settings.phone || '',
        whatsapp: settings.whatsapp || '',
        email: settings.email || '',
        facebook: settings.socials?.facebook || '',
        instagram: settings.socials?.instagram || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateRestaurantInfo({
        name: formData.name,
        bengaliName: formData.bengaliName,
        tagline: formData.tagline,
        englishTagline: formData.englishTagline,
        description: formData.description,
        englishDescription: formData.englishDescription,
        location: formData.location,
        address: formData.address,
        phone: formData.phone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        socials: {
          facebook: formData.facebook,
          instagram: formData.instagram
        }
      });
      success('Restaurant details saved successfully');
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to update restaurant information');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
            Restaurant Information & Contacts
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Update restaurant name, location, address, hotline, WhatsApp concierge, and social links.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Brand & Identity Card */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
            <Building2 size={18} />
            <h2 className="text-sm font-semibold text-slate-100">Brand Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Restaurant Name (English)
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bengali Brand Name (বাংলা নাম)
              </label>
              <input
                type="text"
                required
                value={formData.bengaliName}
                onChange={(e) => setFormData({ ...formData, bengaliName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bengali Tagline (বাংলা মূলমন্ত্র)
              </label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                English Tagline
              </label>
              <input
                type="text"
                value={formData.englishTagline}
                onChange={(e) => setFormData({ ...formData, englishTagline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Bengali Bio (বাংলা সংক্ষিপ্ত পরিচিতি)
              </label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif text-xs leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                English Bio & Concept
              </label>
              <textarea
                rows={3}
                value={formData.englishDescription}
                onChange={(e) => setFormData({ ...formData, englishDescription: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Location & Contact Channels */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
            <Phone size={18} />
            <h2 className="text-sm font-semibold text-slate-100">Location & Concierge Contact</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Neighborhood / City
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Reservation Phone Hotline
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-mono text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                WhatsApp Concierge Number
              </label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-mono text-xs sm:text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Contact Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Full Physical Address (Displays in Footer & Contact)
              </label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
            <Globe size={18} />
            <h2 className="text-sm font-semibold text-slate-100">Social Media & Online Links</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebook}
                onChange={(e) => setFormData({ ...formData, facebook: e.target.value })}
                placeholder="https://facebook.com/kansari"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagram}
                onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                placeholder="https://instagram.com/kansari"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-2 cursor-pointer shadow-lg shadow-amber-500/20 disabled:opacity-50"
          >
            <Save size={16} />
            <span>{saving ? 'Saving...' : 'Save Restaurant Settings'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
