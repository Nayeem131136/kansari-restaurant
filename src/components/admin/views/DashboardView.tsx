import { useState, useEffect } from 'react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';
import { DashboardAnalytics, Reservation } from '../../../types/admin';
import { 
  CalendarCheck2, 
  Clock, 
  Users, 
  UtensilsCrossed, 
  Sparkles, 
  ArrowUpRight, 
  CheckCircle2, 
  XCircle, 
  Phone,
  MessageSquare,
  Activity,
  ChevronRight,
  TrendingUp
} from 'lucide-react';

interface DashboardViewProps {
  onNavigateToReservations: (statusFilter?: string) => void;
  onNavigateToMenu: () => void;
}

export function DashboardView({ onNavigateToReservations, onNavigateToMenu }: DashboardViewProps) {
  const { error, success } = useToast();
  const [analytics, setAnalytics] = useState<DashboardAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await api.getAnalytics();
      setAnalytics(res.analytics);
    } catch (err: any) {
      error('Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleQuickStatusUpdate = async (id: string, status: Reservation['status']) => {
    try {
      await api.updateReservationStatus(id, status);
      success(`Reservation marked as ${status}`);
      fetchAnalytics();
    } catch (err: any) {
      error(err.message || 'Failed to update reservation');
    }
  };

  if (loading || !analytics) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 bg-slate-900/60 rounded-xl border border-slate-800" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-900/60 rounded-xl border border-slate-800" />
          <div className="h-96 bg-slate-900/60 rounded-xl border border-slate-800" />
        </div>
      </div>
    );
  }

  const maxWeeklyCount = Math.max(...analytics.weeklyTrend.map(w => w.count), 1);

  return (
    <div className="space-y-6">
      
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border border-amber-500/20 shadow-lg">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-slate-100 flex items-center gap-2">
            Restaurant Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time live bookings, menu status, guest volume, and restaurant activity.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onNavigateToReservations()}
            className="px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
          >
            <CalendarCheck2 size={15} />
            <span>Manage All Bookings</span>
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Pending Card */}
        <div 
          onClick={() => onNavigateToReservations('PENDING')}
          className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Pending Requests</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-amber-400">
              {analytics.pendingReservationsCount}
            </span>
            <span className="text-[11px] text-amber-400/80 font-medium group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Review Action <ArrowUpRight size={13} />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Requires confirmation</p>
        </div>

        {/* Today's Reservations */}
        <div 
          onClick={() => onNavigateToReservations('today')}
          className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Today's Bookings</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CalendarCheck2 size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-emerald-400">
              {analytics.todayReservationsCount}
            </span>
            <span className="text-[11px] text-slate-400 group-hover:text-emerald-400 transition-colors flex items-center gap-0.5">
              View Schedule <ChevronRight size={13} />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            {analytics.confirmedReservationsCount} confirmed today
          </p>
        </div>

        {/* Guests Volume */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Expected Guests Today</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-blue-400">
              {analytics.totalGuestsToday}
            </span>
            <span className="text-[11px] text-slate-400 font-mono">Dine-in Seats</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Across all active tables</p>
        </div>

        {/* Active Dishes */}
        <div 
          onClick={onNavigateToMenu}
          className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-amber-500/50 transition-all cursor-pointer group shadow-sm"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Live Menu Items</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <UtensilsCrossed size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold font-mono text-slate-100">
              {analytics.activeMenuCount}
              <span className="text-sm text-slate-400 font-normal"> / {analytics.totalMenuItemsCount}</span>
            </span>
            <span className="text-[11px] text-amber-400/80 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
              Edit Menu <ArrowUpRight size={13} />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">Dishes served on customer site</p>
        </div>

      </div>

      {/* 2-Column Analytics & Live Feeds */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Today's Bookings & Weekly Chart */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Today's Schedule Table */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <h2 className="text-sm font-semibold text-slate-100">
                  Today's Live Bookings & Inquiries
                </h2>
              </div>
              <button
                onClick={() => onNavigateToReservations('today')}
                className="text-xs text-amber-400 hover:text-amber-300 font-medium cursor-pointer"
              >
                View full list ({analytics.todayReservationsCount}) →
              </button>
            </div>

            {analytics.todayReservations.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs border border-dashed border-slate-800 rounded-lg">
                No reservations scheduled for today yet.
              </div>
            ) : (
              <div className="divide-y divide-slate-800/60">
                {analytics.todayReservations.map((res) => (
                  <div key={res.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-semibold text-xs sm:text-sm text-slate-100">
                          {res.customerName}
                        </span>
                        <span className={`text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full ${
                          res.status === 'CONFIRMED'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                            : res.status === 'PENDING'
                            ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {res.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-slate-400">
                        <span className="flex items-center gap-1 font-mono text-slate-300">
                          <Clock size={12} className="text-amber-400" />
                          {res.time}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users size={12} className="text-blue-400" />
                          {res.guests} Guests
                        </span>
                        <a 
                          href={`tel:${res.phone}`}
                          className="text-slate-400 hover:text-amber-400 font-mono transition-colors flex items-center gap-1"
                        >
                          <Phone size={12} />
                          {res.phone}
                        </a>
                      </div>
                      {res.notes && (
                        <p className="text-xs text-slate-400 italic">
                          "{res.notes}"
                        </p>
                      )}
                    </div>

                    {/* Quick Actions */}
                    <div className="flex items-center gap-1.5 self-end sm:self-center">
                      {res.status === 'PENDING' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(res.id, 'CONFIRMED')}
                          className="px-2.5 py-1 rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 size={13} />
                          Confirm
                        </button>
                      )}
                      {res.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(res.id, 'COMPLETED')}
                          className="px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <CheckCircle2 size={13} />
                          Seat / Complete
                        </button>
                      )}
                      {res.status !== 'CANCELLED' && res.status !== 'COMPLETED' && (
                        <button
                          onClick={() => handleQuickStatusUpdate(res.id, 'CANCELLED')}
                          className="px-2 py-1 rounded bg-slate-800 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 text-xs font-medium flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <XCircle size={13} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 7-Day Trend Chart */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp size={16} className="text-amber-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                  7-Day Booking Volume & Traffic
                </h2>
              </div>
              <span className="text-xs text-slate-400 font-mono">Last 7 Days</span>
            </div>

            <div className="pt-4 pb-2">
              <div className="grid grid-cols-7 gap-2 sm:gap-4 items-end h-40 border-b border-slate-800 pb-2">
                {analytics.weeklyTrend.map((item, idx) => {
                  const heightPercent = Math.max((item.count / maxWeeklyCount) * 100, 8);
                  const isToday = idx === analytics.weeklyTrend.length - 1;
                  return (
                    <div key={item.date} className="flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] text-slate-400 font-mono group-hover:text-amber-400 transition-colors">
                        {item.count}
                      </span>
                      <div 
                        className={`w-full max-w-[36px] rounded-t-md transition-all duration-300 ${
                          isToday 
                            ? 'bg-amber-500 group-hover:bg-amber-400 shadow-md shadow-amber-500/20' 
                            : 'bg-slate-800 group-hover:bg-slate-700'
                        }`}
                        style={{ height: `${heightPercent}%` }}
                      />
                      <span className={`text-[11px] font-medium ${isToday ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                        {item.dayName}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400 pt-3">
                <span>Total weekly volume: {analytics.weeklyTrend.reduce((acc, curr) => acc + curr.count, 0)} reservations</span>
                <span>Weekly guests served: {analytics.weeklyTrend.reduce((acc, curr) => acc + curr.guests, 0)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Live Activity Feed & Quick Status Overview */}
        <div className="space-y-6">
          
          {/* Status Breakdown Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-100 mb-3.5">
              Status Distribution
            </h2>
            <div className="space-y-2.5">
              {analytics.statusDistribution.map(item => (
                <div key={item.status} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${
                      item.status === 'CONFIRMED' ? 'bg-emerald-400' :
                      item.status === 'PENDING' ? 'bg-amber-400' :
                      item.status === 'COMPLETED' ? 'bg-blue-400' :
                      item.status === 'CANCELLED' ? 'bg-rose-400' : 'bg-slate-400'
                    }`} />
                    <span className="text-xs text-slate-300 font-medium">{item.status}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-100">{item.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Activity Stream */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3.5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-amber-400" />
                <h2 className="text-sm font-semibold text-slate-100">
                  System Audit Logs
                </h2>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">Live</span>
            </div>

            <div className="space-y-3">
              {analytics.recentActivities.length === 0 ? (
                <p className="text-xs text-slate-400 py-4 text-center">No recent activity logs.</p>
              ) : (
                analytics.recentActivities.slice(0, 7).map(act => (
                  <div key={act.id} className="text-xs border-l-2 border-slate-700 pl-3 py-1 space-y-0.5">
                    <p className="text-slate-300 font-medium leading-tight">{act.description}</p>
                    <div className="flex items-center justify-between text-[10px] text-slate-400">
                      <span>{act.userEmail}</span>
                      <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
