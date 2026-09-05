import React, { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { useRestaurant } from '../../../context/RestaurantContext';
import { Clock, Save, AlertTriangle } from 'lucide-react';

interface DaySchedule {
  day: string;
  bengaliDay: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  specialNote?: string;
}

export function OpeningHoursView() {
  const { success, error } = useToast();
  const { settings, refreshData } = useRestaurant();

  const [schedules, setSchedules] = useState<DaySchedule[]>([]);
  const [specialClosureNotice, setSpecialClosureNotice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (settings?.openingHours) {
      setSchedules(settings.openingHours);
      setSpecialClosureNotice(settings.specialClosureNotice || '');
    }
  }, [settings]);

  const handleToggleOpen = (index: number) => {
    setSchedules(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], isOpen: !updated[index].isOpen };
      return updated;
    });
  };

  const handleFieldChange = (index: number, field: keyof DaySchedule, value: string) => {
    setSchedules(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.updateOpeningHours(schedules, specialClosureNotice);
      success('Opening hours updated successfully');
      refreshData();
    } catch (err: any) {
      error(err.message || 'Failed to update schedule');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
            Opening Hours & Service Schedule
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure weekly operational hours, Friday Jummah timings, and emergency closure notices.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Emergency Notice Box */}
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-5 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs sm:text-sm">
            <AlertTriangle size={17} />
            <span>Special Closure / Announcement Banner (Optional)</span>
          </div>
          <p className="text-xs text-slate-400">
            If provided, this notice will be prominently displayed on the customer-facing website and reservation form.
          </p>
          <input
            type="text"
            value={specialClosureNotice}
            onChange={(e) => setSpecialClosureNotice(e.target.value)}
            placeholder="e.g. বিশেষ বিজ্ঞপ্তি: আগামী সোমবার প্রাইভেট অনুষ্ঠানের জন্য সাধারণ ডাইনিং বন্ধ থাকবে।"
            className="w-full px-3 py-2 bg-slate-950/90 border border-slate-800 rounded-lg text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-amber-500 text-xs sm:text-sm"
          />
        </div>

        {/* Weekly Day-by-Day Table */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center gap-2">
            <Clock size={16} className="text-amber-400" />
            <h2 className="text-xs sm:text-sm font-semibold text-slate-100">
              Weekly Dining Schedule
            </h2>
          </div>

          <div className="divide-y divide-slate-800/60">
            {schedules.map((day, idx) => (
              <div key={day.day} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                
                {/* Day Name & Toggle */}
                <div className="flex items-center gap-3 min-w-[160px]">
                  <button
                    type="button"
                    onClick={() => handleToggleOpen(idx)}
                    className={`w-11 h-6 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                      day.isOpen ? 'bg-emerald-500' : 'bg-slate-700'
                    }`}
                  >
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                        day.isOpen ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                  <div>
                    <span className="font-semibold text-slate-100 text-sm block">
                      {day.day}
                    </span>
                    <span className="font-serif text-xs text-amber-400 block">
                      {day.bengaliDay}
                    </span>
                  </div>
                </div>

                {/* Hours Inputs */}
                {day.isOpen ? (
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Opening Time</label>
                      <input
                        type="text"
                        value={day.openTime}
                        onChange={(e) => handleFieldChange(idx, 'openTime', e.target.value)}
                        placeholder="11:30 AM"
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Closing Time</label>
                      <input
                        type="text"
                        value={day.closeTime}
                        onChange={(e) => handleFieldChange(idx, 'closeTime', e.target.value)}
                        placeholder="11:00 PM"
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 mb-0.5">Note (Optional)</label>
                      <input
                        type="text"
                        value={day.specialNote || ''}
                        onChange={(e) => handleFieldChange(idx, 'specialNote', e.target.value)}
                        placeholder="যেমন: জুমার পর শুরু"
                        className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded text-xs text-slate-100 font-serif"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 text-xs text-rose-400 font-medium py-1">
                    Closed for dining on {day.day}
                  </div>
                )}

              </div>
            ))}
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
            <span>{saving ? 'Saving Schedule...' : 'Save Opening Hours'}</span>
          </button>
        </div>

      </form>

    </div>
  );
}
