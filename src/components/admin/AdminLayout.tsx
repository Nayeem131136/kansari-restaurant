import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../lib/api';
import { 
  LayoutDashboard, 
  CalendarCheck2, 
  UtensilsCrossed, 
  FolderTree, 
  Image as ImageIcon, 
  Star, 
  Building2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  LogOut, 
  ExternalLink, 
  Menu, 
  X, 
  Bell,
  ChevronRight
} from 'lucide-react';

import { DashboardView } from './views/DashboardView';
import { ReservationsView } from './views/ReservationsView';
import { MenuView } from './views/MenuView';
import { CategoriesView } from './views/CategoriesView';
import { GalleryView } from './views/GalleryView';
import { ReviewsView } from './views/ReviewsView';
import { RestaurantInfoView } from './views/RestaurantInfoView';
import { OpeningHoursView } from './views/OpeningHoursView';
import { WebsiteContentView } from './views/WebsiteContentView';
import { SecurityView } from './views/SecurityView';

interface AdminLayoutProps {
  onNavigateHome: () => void;
}

export type AdminTab = 
  | 'dashboard' 
  | 'reservations' 
  | 'menu' 
  | 'categories' 
  | 'gallery' 
  | 'reviews' 
  | 'restaurant' 
  | 'hours' 
  | 'content' 
  | 'security';

export function AdminLayout({ onNavigateHome }: AdminLayoutProps) {
  const { user, logout } = useAuth();
  const { info } = useToast();

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [reservationStatusFilter, setReservationStatusFilter] = useState<string | undefined>(undefined);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [pendingCount, setPendingCount] = useState<number>(0);

  // Periodic check for pending reservations badge
  useEffect(() => {
    const checkPending = async () => {
      try {
        const res = await api.getAdminReservations({ status: 'PENDING' });
        setPendingCount(res.totalCount);
      } catch (err) {
        // silent fail
      }
    };
    checkPending();
    const interval = setInterval(checkPending, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    info('Logged out from management portal.');
  };

  const navItems = [
    { id: 'dashboard' as AdminTab, label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'reservations' as AdminTab, label: 'Reservations', icon: CalendarCheck2, badge: pendingCount > 0 ? pendingCount : null },
    { id: 'menu' as AdminTab, label: 'Menu Items', icon: UtensilsCrossed, badge: null },
    { id: 'categories' as AdminTab, label: 'Categories', icon: FolderTree, badge: null },
    { id: 'gallery' as AdminTab, label: 'Gallery', icon: ImageIcon, badge: null },
    { id: 'reviews' as AdminTab, label: 'Reviews', icon: Star, badge: null },
    { id: 'restaurant' as AdminTab, label: 'Restaurant Info', icon: Building2, badge: null },
    { id: 'hours' as AdminTab, label: 'Opening Hours', icon: Clock, badge: null },
    { id: 'content' as AdminTab, label: 'Website Content', icon: FileText, badge: null },
    { id: 'security' as AdminTab, label: 'Security & Access', icon: ShieldCheck, badge: null },
  ];

  const handleNavigateReservations = (filter?: string) => {
    setReservationStatusFilter(filter);
    setActiveTab('reservations');
  };

  return (
    <div className="min-h-screen bg-[#0F1012] text-slate-100 flex font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-slate-950 border-r border-slate-800/80 p-4 justify-between shrink-0 h-screen sticky top-0">
        
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="flex items-center justify-between px-2 pt-1">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <UtensilsCrossed size={16} />
              </div>
              <div>
                <span className="font-serif text-base font-medium tracking-wide text-slate-100 block">
                  KANSARI
                </span>
                <span className="text-[10px] text-amber-400 font-mono block -mt-0.5">
                  ADMIN ENGINE
                </span>
              </div>
            </div>
          </div>

          {/* Nav List */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id !== 'reservations') setReservationStatusFilter(undefined);
                    setActiveTab(item.id);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-semibold shadow-md shadow-amber-500/10'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon size={16} className={isActive ? 'text-slate-950' : 'text-slate-400'} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== null && (
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-slate-950 text-amber-400'
                        : 'bg-amber-500 text-slate-950'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Actions */}
        <div className="space-y-3 pt-4 border-t border-slate-800/80">
          <button
            onClick={onNavigateHome}
            className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 text-xs font-medium transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-2">
              <ExternalLink size={14} className="text-amber-400" />
              <span>Live Website</span>
            </span>
            <ChevronRight size={13} className="text-slate-500" />
          </button>

          <div className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800/60">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs shrink-0">
                {user?.name?.[0] || 'A'}
              </div>
              <div className="truncate text-left">
                <span className="text-xs font-semibold text-slate-200 block truncate">
                  {user?.name || 'Administrator'}
                </span>
                <span className="text-[10px] text-slate-400 font-mono block truncate">
                  {user?.email || 'kansari@nayeem.com'}
                </span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

      </aside>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm flex">
          <div className="w-72 bg-slate-950 p-5 flex flex-col justify-between h-full border-r border-slate-800 animate-in slide-in-from-left duration-200">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <UtensilsCrossed size={18} className="text-amber-400" />
                  <span className="font-serif text-lg font-medium text-slate-100">KANSARI</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id !== 'reservations') setReservationStatusFilter(undefined);
                        setActiveTab(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-amber-500 text-slate-950 font-semibold'
                          : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon size={16} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge !== null && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-amber-500 text-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-800">
              <button
                onClick={onNavigateHome}
                className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg bg-slate-900 text-slate-200 text-xs font-medium"
              >
                <ExternalLink size={14} className="text-amber-400" />
                <span>Return to Website</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          </div>
          <div className="flex-1" onClick={() => setMobileMenuOpen(false)} />
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Navbar */}
        <header className="h-16 bg-slate-950/80 border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-30 backdrop-blur-md">
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-900 cursor-pointer"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Admin Portal</span>
              <span className="text-xs text-slate-600 hidden sm:inline">/</span>
              <span className="text-xs font-semibold text-slate-200 uppercase tracking-wider font-mono">
                {activeTab}
              </span>
            </div>
          </div>

          {/* Quick Actions & Website Shortcut */}
          <div className="flex items-center gap-3">
            {pendingCount > 0 && (
              <button
                onClick={() => handleNavigateReservations('PENDING')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium hover:bg-amber-500/20 transition-colors cursor-pointer"
              >
                <Bell size={13} className="animate-bounce" />
                <span>{pendingCount} Pending Request{pendingCount > 1 ? 's' : ''}</span>
              </button>
            )}

            <button
              onClick={onNavigateHome}
              className="px-3.5 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-medium text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ExternalLink size={13} className="text-amber-400" />
              <span className="hidden sm:inline">View Customer Website</span>
              <span className="sm:hidden">Website</span>
            </button>
          </div>

        </header>

        {/* View Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardView 
              onNavigateToReservations={handleNavigateReservations} 
              onNavigateToMenu={() => setActiveTab('menu')} 
            />
          )}
          {activeTab === 'reservations' && (
            <ReservationsView initialStatusFilter={reservationStatusFilter} />
          )}
          {activeTab === 'menu' && <MenuView />}
          {activeTab === 'categories' && <CategoriesView />}
          {activeTab === 'gallery' && <GalleryView />}
          {activeTab === 'reviews' && <ReviewsView />}
          {activeTab === 'restaurant' && <RestaurantInfoView />}
          {activeTab === 'hours' && <OpeningHoursView />}
          {activeTab === 'content' && <WebsiteContentView />}
          {activeTab === 'security' && <SecurityView />}
        </main>

      </div>

    </div>
  );
}
