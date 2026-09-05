import { 
  Reservation, 
  MenuItem, 
  MenuCategory, 
  GalleryItem, 
  Review, 
  RestaurantSettings, 
  DashboardAnalytics, 
  ActivityLog, 
  AdminUser,
  ReservationStatus
} from '../types/admin';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('kansari_admin_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Public APIs
  async getRestaurantData(): Promise<{ settings: RestaurantSettings }> {
    const res = await fetch(`${API_BASE}/restaurant`);
    if (!res.ok) throw new Error('Failed to load restaurant data');
    return res.json();
  },

  async getMenu(): Promise<{ categories: MenuCategory[]; menuItems: MenuItem[] }> {
    const res = await fetch(`${API_BASE}/menu`);
    if (!res.ok) throw new Error('Failed to load menu');
    return res.json();
  },

  async getFeaturedMenu(): Promise<{ featuredItems: MenuItem[] }> {
    const res = await fetch(`${API_BASE}/menu/featured`);
    if (!res.ok) throw new Error('Failed to load featured items');
    return res.json();
  },

  async getGallery(): Promise<{ gallery: GalleryItem[] }> {
    const res = await fetch(`${API_BASE}/gallery`);
    if (!res.ok) throw new Error('Failed to load gallery');
    return res.json();
  },

  async getReviews(): Promise<{ reviews: Review[] }> {
    const res = await fetch(`${API_BASE}/reviews`);
    if (!res.ok) throw new Error('Failed to load reviews');
    return res.json();
  },

  async createReservation(data: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: string | number;
    notes?: string;
  }): Promise<{ success: boolean; message: string; reservation: Reservation }> {
    const res = await fetch(`${API_BASE}/reservations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to submit reservation');
    return json;
  },

  // Auth APIs
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Login failed');
    return json;
  },

  async getMe(): Promise<{ user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Authentication check failed');
    return json;
  },

  async updateAdminProfile(data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; token?: string; user: AdminUser }> {
    const res = await fetch(`${API_BASE}/auth/update-profile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update profile');
    return json;
  },

  // Admin Analytics & Activities
  async getAnalytics(): Promise<{ analytics: DashboardAnalytics }> {
    const res = await fetch(`${API_BASE}/admin/analytics`, {
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load analytics');
    return json;
  },

  async getActivityLogs(): Promise<{ logs: ActivityLog[] }> {
    const res = await fetch(`${API_BASE}/admin/activity-logs`, {
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load activity logs');
    return json;
  },

  // Admin Reservations
  async getAdminReservations(params?: {
    search?: string;
    status?: string;
    timeframe?: string;
    date?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ reservations: Reservation[]; totalCount: number; page: number; totalPages: number }> {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([k, v]) => {
        if (v !== undefined && v !== '') query.append(k, String(v));
      });
    }
    const res = await fetch(`${API_BASE}/admin/reservations?${query.toString()}`, {
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load reservations');
    return json;
  },

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<{ success: boolean; reservation: Reservation }> {
    const res = await fetch(`${API_BASE}/admin/reservations/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ status })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update reservation');
    return json;
  },

  async deleteReservation(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/reservations/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete reservation');
    return json;
  },

  getExportCsvUrl(): string {
    return `${API_BASE}/admin/reservations/export/csv`;
  },

  // Admin Menu & Categories
  async getAdminCategories(): Promise<{ categories: MenuCategory[] }> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load categories');
    return json;
  },

  async createCategory(data: Partial<MenuCategory>): Promise<{ success: boolean; category: MenuCategory }> {
    const res = await fetch(`${API_BASE}/admin/categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create category');
    return json;
  },

  async updateCategory(id: string, data: Partial<MenuCategory>): Promise<{ success: boolean; category: MenuCategory }> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update category');
    return json;
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/categories/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete category');
    return json;
  },

  async createMenuItem(data: Partial<MenuItem>): Promise<{ success: boolean; item: MenuItem }> {
    const res = await fetch(`${API_BASE}/admin/menu`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to create food item');
    return json;
  },

  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<{ success: boolean; item: MenuItem }> {
    const res = await fetch(`${API_BASE}/admin/menu/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update food item');
    return json;
  },

  async toggleMenuItemAvailability(id: string): Promise<{ success: boolean; item: MenuItem }> {
    const res = await fetch(`${API_BASE}/admin/menu/${id}/toggle-available`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to toggle availability');
    return json;
  },

  async toggleMenuItemFeatured(id: string): Promise<{ success: boolean; item: MenuItem }> {
    const res = await fetch(`${API_BASE}/admin/menu/${id}/toggle-featured`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to toggle featured');
    return json;
  },

  async deleteMenuItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/menu/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete menu item');
    return json;
  },

  // Admin Gallery
  async createGalleryItem(data: Partial<GalleryItem>): Promise<{ success: boolean; item: GalleryItem }> {
    const res = await fetch(`${API_BASE}/admin/gallery`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to add gallery item');
    return json;
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/gallery/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete gallery item');
    return json;
  },

  // Admin Reviews
  async getAdminReviews(): Promise<{ reviews: Review[] }> {
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to load reviews');
    return json;
  },

  async createReview(data: Partial<Review>): Promise<{ success: boolean; review: Review }> {
    const res = await fetch(`${API_BASE}/admin/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to add review');
    return json;
  },

  async updateReview(id: string, data: Partial<Review>): Promise<{ success: boolean; review: Review }> {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update review');
    return json;
  },

  async toggleReviewPublish(id: string): Promise<{ success: boolean; review: Review }> {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}/toggle-publish`, {
      method: 'PATCH',
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to toggle review status');
    return json;
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    const res = await fetch(`${API_BASE}/admin/reviews/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to delete review');
    return json;
  },

  // Admin Restaurant Settings & Hours
  async updateRestaurantInfo(data: Partial<RestaurantSettings>): Promise<{ success: boolean; settings: RestaurantSettings }> {
    const res = await fetch(`${API_BASE}/admin/restaurant`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update restaurant info');
    return json;
  },

  async updateOpeningHours(openingHours: any[], specialClosureNotice?: string): Promise<{ success: boolean; settings: RestaurantSettings }> {
    const res = await fetch(`${API_BASE}/admin/opening-hours`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify({ openingHours, specialClosureNotice })
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update opening hours');
    return json;
  },

  async updateWebsiteContent(content: Partial<RestaurantSettings['content']>): Promise<{ success: boolean; settings: RestaurantSettings }> {
    const res = await fetch(`${API_BASE}/admin/website-content`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      },
      body: JSON.stringify(content)
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Failed to update website content');
    return json;
  },

  // Image Upload
  async uploadImage(file: File): Promise<{ success: boolean; url: string }> {
    const formData = new FormData();
    formData.append('image', file);

    const token = localStorage.getItem('kansari_admin_token');
    const res = await fetch(`${API_BASE}/admin/upload`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: formData
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error || 'Image upload failed');
    return json;
  }
};
