import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { RestaurantSettings, MenuItem, MenuCategory, GalleryItem, Review, Reservation } from '../types/admin';
import { siteConfig } from '../config/data';
import { api } from '../lib/api';

interface RestaurantContextType {
  settings: RestaurantSettings;
  categories: MenuCategory[];
  menuItems: MenuItem[];
  featuredItems: MenuItem[];
  gallery: GalleryItem[];
  reviews: Review[];
  isLoading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  submitReservation: (data: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: string | number;
    notes?: string;
  }) => Promise<{ success: boolean; message: string; reservation: Reservation }>;
}

const defaultOpeningHours = [
  { day: "Saturday", bengaliDay: "শনিবার", isOpen: true, openTime: "11:30 AM", closeTime: "11:00 PM" },
  { day: "Sunday", bengaliDay: "রবিবার", isOpen: true, openTime: "11:30 AM", closeTime: "11:00 PM" },
  { day: "Monday", bengaliDay: "সোমবার", isOpen: true, openTime: "11:30 AM", closeTime: "11:00 PM" },
  { day: "Tuesday", bengaliDay: "মঙ্গলবার", isOpen: true, openTime: "11:30 AM", closeTime: "11:00 PM" },
  { day: "Wednesday", bengaliDay: "বুধবার", isOpen: true, openTime: "11:30 AM", closeTime: "11:00 PM" },
  { day: "Thursday", bengaliDay: "বৃহস্পতিবার", isOpen: true, openTime: "11:30 AM", closeTime: "11:00 PM" },
  { day: "Friday", bengaliDay: "শুক্রবার", isOpen: true, openTime: "01:30 PM", closeTime: "11:30 PM", specialNote: "জুমার নামাজের পর শুরু" }
];

const fallbackSettings: RestaurantSettings = {
  name: siteConfig.restaurant.name,
  bengaliName: siteConfig.restaurant.bengaliName,
  tagline: siteConfig.restaurant.tagline,
  englishTagline: siteConfig.restaurant.englishTagline,
  description: siteConfig.restaurant.description,
  englishDescription: siteConfig.restaurant.englishDescription,
  location: siteConfig.restaurant.location,
  address: siteConfig.restaurant.address,
  phone: siteConfig.restaurant.phone,
  whatsapp: siteConfig.restaurant.whatsapp,
  email: "contact@kansari.com",
  socials: {
    facebook: siteConfig.restaurant.socials.facebook,
    instagram: siteConfig.restaurant.socials.instagram
  },
  openingHours: defaultOpeningHours,
  content: {
    heroHeadline: "An Authentic Bangladeshi Culinary Experience",
    heroBengaliHeadline: "স্বাদের শিকড়। নতুন এক আয়োজন।",
    heroSupportingText: "মাটির কাছাকাছি খাঁটি বাংলাদেশি স্বাদ, আধুনিক পরিপাটি পরিবেশে—ঢাকার হৃদয়ে এক নতুন খাবারের অভিজ্ঞতা।",
    storyHeadline: "Roots, Fire & Heritage Brass",
    storyBengaliHeadline: "কাঁসার পাত্রে ঐতিহ্যের সুবাস",
    storyText: "In ancient Bengal, bell metal (কাঁসা) was not just tableware; it was a sacred canvas for hospitality. At Kansari, we revive these sacred culinary traditions.",
    finalCtaHeading: "আপনার জন্য কাঁসার থালায় প্রস্তুত আমাদের আয়োজন।"
  }
};

const RestaurantContext = createContext<RestaurantContextType | undefined>(undefined);

export function RestaurantProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<RestaurantSettings>(fallbackSettings);
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [featuredItems, setFeaturedItems] = useState<MenuItem[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setError(null);
      const [restRes, menuRes, featuredRes, galleryRes, reviewsRes] = await Promise.all([
        api.getRestaurantData().catch(() => ({ settings: fallbackSettings })),
        api.getMenu().catch(() => ({ categories: [], menuItems: [] })),
        api.getFeaturedMenu().catch(() => ({ featuredItems: [] })),
        api.getGallery().catch(() => ({ gallery: [] })),
        api.getReviews().catch(() => ({ reviews: [] }))
      ]);

      if (restRes?.settings) setSettings(restRes.settings);
      if (menuRes?.categories) setCategories(menuRes.categories);
      if (menuRes?.menuItems) setMenuItems(menuRes.menuItems);
      if (featuredRes?.featuredItems) setFeaturedItems(featuredRes.featuredItems);
      if (galleryRes?.gallery) setGallery(galleryRes.gallery);
      if (reviewsRes?.reviews) setReviews(reviewsRes.reviews);
    } catch (err: any) {
      console.error('Error fetching live restaurant data:', err);
      setError(err.message || 'Failed to load restaurant data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const submitReservation = async (data: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: string | number;
    notes?: string;
  }) => {
    return await api.createReservation(data);
  };

  return (
    <RestaurantContext.Provider
      value={{
        settings,
        categories,
        menuItems,
        featuredItems,
        gallery,
        reviews,
        isLoading,
        error,
        refreshData: fetchData,
        submitReservation
      }}
    >
      {children}
    </RestaurantContext.Provider>
  );
}

export function useRestaurant() {
  const context = useContext(RestaurantContext);
  if (!context) {
    throw new Error('useRestaurant must be used within RestaurantProvider');
  }
  return context;
}
