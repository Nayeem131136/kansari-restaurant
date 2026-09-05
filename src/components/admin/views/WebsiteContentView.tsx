import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { useRestaurant } from '../../../context/RestaurantContext';
import { LayoutTemplate, Save } from 'lucide-react';

export function WebsiteContentView() {
  const { success, error } = useToast();
  const { settings, refreshData } = useRestaurant();

  const [formData, setFormData] = useState({
    heroHeadline: '',
    heroBengaliHeadline: '',
    heroSupportingText: '',
    storyHeadline: '',
    storyBengaliHeadline: '',
    storyText: '',
    finalCtaHeading: ''
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.content) {
      setFormData({
        heroHeadline: settings.content.heroHeadline || '',
        heroBengaliHeadline: settings.content.heroBengaliHeadline || '',
        heroSupportingText: settings.content.heroSupportingText || '',
        storyHeadline: settings.content.storyHeadline || '',
        storyBengaliHeadline: settings.content.storyBengaliHeadline || '',
        storyText: settings.content.storyText || '',
        finalCtaHeading: settings.content.finalCtaHeading || ''
      });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateWebsiteContent(formData);
      success('Website content text updated successfully');
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to update content');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
            Website Content & Storytelling
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Edit the English and Bengali copy displayed across the homepage, story, and call-to-actions.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Hero Section Copy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
            <LayoutTemplate size={18} />
            <h2 className="text-sm font-semibold text-slate-100">Hero Section Copy</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Hero Bengali Headline (বাংলা প্রধান শিরোনাম)
              </label>
              <input
                type="text"
                value={formData.heroBengaliHeadline}
                onChange={(e) => setFormData({ ...formData, heroBengaliHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Hero English Headline
              </label>
              <input
                type="text"
                value={formData.heroHeadline}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Hero Supporting Paragraph
            </label>
            <textarea
              rows={2}
              value={formData.heroSupportingText}
              onChange={(e) => setFormData({ ...formData, heroSupportingText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Story Section Copy */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
            <LayoutTemplate size={18} />
            <h2 className="text-sm font-semibold text-slate-100">Heritage Story & Culinary Philosophy</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Story Bengali Heading (বাংলা শিরোনাম)
              </label>
              <input
                type="text"
                value={formData.storyBengaliHeadline}
                onChange={(e) => setFormData({ ...formData, storyBengaliHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif text-xs sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Story English Heading
              </label>
              <input
                type="text"
                value={formData.storyHeadline}
                onChange={(e) => setFormData({ ...formData, storyHeadline: e.target.value })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Philosophy Story Copy
            </label>
            <textarea
              rows={3}
              value={formData.storyText}
              onChange={(e) => setFormData({ ...formData, storyText: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Final CTA Headline */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 sm:p-6 space-y-4 shadow-sm">
          <div className="flex items-center gap-2 text-amber-400 pb-2 border-b border-slate-800">
            <LayoutTemplate size={18} />
            <h2 className="text-sm font-semibold text-slate-100">Bottom Invitation Headline</h2>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Final Invitation / Reservation Callout
            </label>
            <input
              type="text"
              value={formData.finalCtaHeading}
              onChange={(e) => setFormData({ ...formData, finalCtaHeading: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 focus:outline-none focus:border-amber-500 font-serif text-xs sm:text-sm"
            />
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
            <span>{saving ? 'Saving...' : 'Save Website Copy'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
