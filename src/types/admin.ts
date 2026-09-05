export type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW';

export interface Reservation {
  id: string;
  customerName: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm or labeled slot
  guests: number;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MenuItem {
  id: string;
  categoryId: string;
  name: string;
  bengaliName: string;
  price: string;
  description: string;
  bengaliDescription: string;
  image: string;
  tag?: string;
  badge?: string;
  featured: boolean;
  available: boolean;
  sortOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface MenuCategory {
  id: string;
  name: string;
  bengaliName: string;
  subLabel?: string;
  sortOrder: number;
  isVisible: boolean;
}

export interface GalleryItem {
  id: string;
  url: string;
  title: string;
  bengali: string;
  aspect: 'video' | 'square' | 'portrait';
  sortOrder: number;
  featured?: boolean;
  createdAt?: string;
}

export interface Review {
  id: string;
  name: string;
  text: string;
  date: string;
  rating: number; // 1-5
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface OpeningHourDay {
  day: string;
  bengaliDay: string;
  isOpen: boolean;
  openTime: string;
  closeTime: string;
  specialNote?: string;
}

export interface RestaurantSettings {
  name: string;
  bengaliName: string;
  tagline: string;
  englishTagline: string;
  description: string;
  englishDescription: string;
  location: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  socials: {
    facebook: string;
    instagram: string;
  };
  openingHours: OpeningHourDay[];
  specialClosureNotice?: string;
  content: {
    heroHeadline: string;
    heroBengaliHeadline: string;
    heroSupportingText: string;
    storyHeadline: string;
    storyBengaliHeadline: string;
    storyText: string;
    finalCtaHeading: string;
  };
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  userEmail: string;
  timestamp: string;
  entityType?: 'RESERVATION' | 'MENU' | 'GALLERY' | 'REVIEW' | 'SETTINGS' | 'AUTH';
}

export interface DashboardAnalytics {
  todayReservationsCount: number;
  pendingReservationsCount: number;
  confirmedReservationsCount: number;
  completedReservationsCount: number;
  cancelledReservationsCount: number;
  totalGuestsToday: number;
  totalMenuItemsCount: number;
  activeMenuCount: number;
  publishedReviewsCount: number;
  weeklyTrend: { date: string; dayName: string; count: number; guests: number }[];
  statusDistribution: { status: ReservationStatus; count: number }[];
  todayReservations: Reservation[];
  recentActivities: ActivityLog[];
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'manager';
  name: string;
  lastLogin?: string;
}
