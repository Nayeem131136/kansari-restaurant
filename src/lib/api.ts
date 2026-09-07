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
import { supabase, UPLOADS_BUCKET } from './supabaseClient';

// ---------------------------------------------------------------------------
// Row <-> App-type mappers (Postgres uses snake_case columns; the app's
// TypeScript types use camelCase).
// ---------------------------------------------------------------------------

function rowToCategory(r: any): MenuCategory {
  return {
    id: r.id,
    name: r.name,
    bengaliName: r.bengali_name,
    subLabel: r.sub_label ?? undefined,
    sortOrder: r.sort_order,
    isVisible: r.is_visible
  };
}

function rowToMenuItem(r: any): MenuItem {
  return {
    id: r.id,
    categoryId: r.category_id,
    name: r.name,
    bengaliName: r.bengali_name,
    price: r.price,
    description: r.description ?? '',
    bengaliDescription: r.bengali_description ?? '',
    image: r.image ?? '',
    tag: r.tag ?? undefined,
    badge: r.badge ?? undefined,
    featured: r.featured,
    available: r.available,
    sortOrder: r.sort_order,
    createdAt: r.created_at ?? undefined,
    updatedAt: r.updated_at ?? undefined
  };
}

function rowToGalleryItem(r: any): GalleryItem {
  return {
    id: r.id,
    url: r.url,
    title: r.title,
    bengali: r.bengali,
    aspect: r.aspect,
    sortOrder: r.sort_order,
    featured: r.featured,
    createdAt: r.created_at ?? undefined
  };
}

function rowToReview(r: any): Review {
  return {
    id: r.id,
    name: r.name,
    text: r.text,
    date: r.date,
    rating: r.rating,
    published: r.published,
    createdAt: r.created_at ?? undefined,
    updatedAt: r.updated_at ?? undefined
  };
}

function rowToReservation(r: any): Reservation {
  return {
    id: r.id,
    customerName: r.customer_name,
    phone: r.phone,
    date: r.date,
    time: r.time,
    guests: r.guests,
    notes: r.notes ?? '',
    status: r.status,
    createdAt: r.created_at,
    updatedAt: r.updated_at
  };
}

function rowToActivityLog(r: any): ActivityLog {
  return {
    id: r.id,
    action: r.action,
    description: r.description,
    userEmail: r.user_email,
    timestamp: r.timestamp,
    entityType: r.entity_type ?? undefined
  };
}

function throwIfError(context: string, error: any) {
  if (error) {
    console.error(`Supabase error in ${context}:`, error);
    throw new Error(error.message || `Failed: ${context}`);
  }
}

async function logActivity(entry: { action: string; description: string; userEmail: string; entityType?: ActivityLog['entityType'] }) {
  try {
    await supabase.from('activity_logs').insert({
      action: entry.action,
      description: entry.description,
      user_email: entry.userEmail,
      entity_type: entry.entityType ?? null
    });
  } catch (err) {
    console.error('Failed to log activity:', err);
  }
}

function currentUserToAdminUser(email: string | undefined, userId: string | undefined, name?: string): AdminUser {
  return {
    id: userId || 'admin',
    email: email || '',
    role: 'admin',
    name: name || 'Kansari General Manager'
  };
}

export const api = {
  // --- Public APIs ---------------------------------------------------------
  async getRestaurantData(): Promise<{ settings: RestaurantSettings }> {
    const { data, error } = await supabase.from('settings').select('data').eq('id', 'main').single();
    throwIfError('getRestaurantData', error);
    return { settings: data.data as RestaurantSettings };
  },

  async getMenu(): Promise<{ categories: MenuCategory[]; menuItems: MenuItem[] }> {
    const [catRes, itemRes] = await Promise.all([
      supabase.from('categories').select('*').eq('is_visible', true).order('sort_order'),
      supabase.from('menu_items').select('*').order('sort_order')
    ]);
    throwIfError('getMenu:categories', catRes.error);
    throwIfError('getMenu:items', itemRes.error);
    return {
      categories: (catRes.data || []).map(rowToCategory),
      menuItems: (itemRes.data || []).map(rowToMenuItem)
    };
  },

  async getFeaturedMenu(): Promise<{ featuredItems: MenuItem[] }> {
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .eq('featured', true)
      .eq('available', true)
      .order('sort_order');
    throwIfError('getFeaturedMenu', error);
    return { featuredItems: (data || []).map(rowToMenuItem) };
  },

  async getGallery(): Promise<{ gallery: GalleryItem[] }> {
    const { data, error } = await supabase.from('gallery').select('*').order('sort_order');
    throwIfError('getGallery', error);
    return { gallery: (data || []).map(rowToGalleryItem) };
  },

  async getReviews(): Promise<{ reviews: Review[] }> {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('published', true)
      .order('created_at', { ascending: false });
    throwIfError('getReviews', error);
    return { reviews: (data || []).map(rowToReview) };
  },

  async createReservation(data: {
    name: string;
    phone: string;
    date: string;
    time: string;
    guests: string | number;
    notes?: string;
  }): Promise<{ success: boolean; message: string; reservation: Reservation }> {
    const { data: row, error } = await supabase
      .from('reservations')
      .insert({
        customer_name: data.name.trim(),
        phone: data.phone.trim(),
        date: data.date,
        time: data.time,
        guests: Number(data.guests) || 2,
        notes: data.notes?.trim() || '',
        status: 'PENDING'
      })
      .select()
      .single();
    throwIfError('createReservation', error);
    const reservation = rowToReservation(row);
    await logActivity({
      action: 'NEW_RESERVATION',
      description: `New booking request from ${reservation.customerName} (${reservation.guests} guests on ${reservation.date} at ${reservation.time})`,
      userEmail: 'customer',
      entityType: 'RESERVATION'
    });
    return { success: true, message: 'আপনার reservation request গ্রহণ করা হয়েছে।', reservation };
  },

  // --- Auth APIs (Supabase Auth) -------------------------------------------
  async login(email: string, password: string): Promise<{ token: string; user: AdminUser }> {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(error.message || 'Login failed');
    const user = currentUserToAdminUser(data.user?.email, data.user?.id, data.user?.user_metadata?.name);
    await logActivity({
      action: 'ADMIN_LOGIN',
      description: `Admin ${user.email} logged in successfully`,
      userEmail: user.email,
      entityType: 'AUTH'
    });
    return { token: data.session?.access_token || '', user };
  },

  async getMe(): Promise<{ user: AdminUser }> {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw new Error('Authentication check failed');
    return { user: currentUserToAdminUser(data.user.email, data.user.id, data.user.user_metadata?.name) };
  },

  async logoutSupabase(): Promise<void> {
    await supabase.auth.signOut();
  },

  async updateAdminProfile(data: {
    name?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }): Promise<{ success: boolean; token?: string; user: AdminUser }> {
    const updates: { email?: string; password?: string; data?: { name?: string } } = {};
    if (data.email) updates.email = data.email.trim().toLowerCase();
    if (data.newPassword) {
      if (data.newPassword.length < 6) throw new Error('New password must be at least 6 characters long');
      updates.password = data.newPassword;
    }
    if (data.name) updates.data = { name: data.name.trim() };

    const { data: updated, error } = await supabase.auth.updateUser(updates);
    if (error) throw new Error(error.message || 'Failed to update profile');

    const user = currentUserToAdminUser(updated.user?.email, updated.user?.id, updated.user?.user_metadata?.name);
    await logActivity({
      action: 'ADMIN_PROFILE_UPDATED',
      description: `Admin profile/credentials updated for ${user.email}`,
      userEmail: user.email,
      entityType: 'AUTH'
    });

    const { data: sessionData } = await supabase.auth.getSession();
    return { success: true, token: sessionData.session?.access_token, user };
  },

  // --- Admin Analytics & Activities -----------------------------------------
  async getAnalytics(): Promise<{ analytics: DashboardAnalytics }> {
    const [reservationsRes, menuItemsRes, reviewsRes, logsRes] = await Promise.all([
      supabase.from('reservations').select('*').order('created_at', { ascending: false }),
      supabase.from('menu_items').select('*'),
      supabase.from('reviews').select('*'),
      supabase.from('activity_logs').select('*').order('timestamp', { ascending: false }).limit(15)
    ]);
    throwIfError('getAnalytics:reservations', reservationsRes.error);
    throwIfError('getAnalytics:menuItems', menuItemsRes.error);
    throwIfError('getAnalytics:reviews', reviewsRes.error);
    throwIfError('getAnalytics:logs', logsRes.error);

    const reservations = (reservationsRes.data || []).map(rowToReservation);
    const menuItems = (menuItemsRes.data || []).map(rowToMenuItem);
    const reviews = (reviewsRes.data || []).map(rowToReview);
    const logs = (logsRes.data || []).map(rowToActivityLog);

    const todayStr = new Date().toISOString().split('T')[0];
    const todayReservations = reservations.filter(r => r.date === todayStr);

    const statusCounts: Record<ReservationStatus, number> = {
      PENDING: 0, CONFIRMED: 0, COMPLETED: 0, CANCELLED: 0, NO_SHOW: 0
    };
    reservations.forEach(r => { statusCounts[r.status] = (statusCounts[r.status] || 0) + 1; });

    const weeklyTrend: { date: string; dayName: string; count: number; guests: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayRes = reservations.filter(r => r.date === dStr);
      weeklyTrend.push({
        date: dStr,
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        count: dayRes.length,
        guests: dayRes.reduce((sum, r) => sum + (r.guests || 0), 0)
      });
    }

    const analytics: DashboardAnalytics = {
      todayReservationsCount: todayReservations.length,
      pendingReservationsCount: statusCounts.PENDING,
      confirmedReservationsCount: statusCounts.CONFIRMED,
      completedReservationsCount: statusCounts.COMPLETED,
      cancelledReservationsCount: statusCounts.CANCELLED,
      totalGuestsToday: todayReservations.reduce((sum, r) => sum + (r.guests || 0), 0),
      totalMenuItemsCount: menuItems.length,
      activeMenuCount: menuItems.filter(m => m.available).length,
      publishedReviewsCount: reviews.filter(r => r.published).length,
      weeklyTrend,
      statusDistribution: (Object.keys(statusCounts) as ReservationStatus[]).map(status => ({
        status,
        count: statusCounts[status]
      })),
      todayReservations,
      recentActivities: logs
    };

    return { analytics };
  },

  async getActivityLogs(): Promise<{ logs: ActivityLog[] }> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50);
    throwIfError('getActivityLogs', error);
    return { logs: (data || []).map(rowToActivityLog) };
  },

  // --- Admin Reservations ---------------------------------------------------
  async getAdminReservations(params?: {
    search?: string;
    status?: string;
    timeframe?: string;
    date?: string;
    sortBy?: string;
    page?: number;
    limit?: number;
  }): Promise<{ reservations: Reservation[]; totalCount: number; page: number; totalPages: number }> {
    const { data, error } = await supabase.from('reservations').select('*');
    throwIfError('getAdminReservations', error);
    let items = (data || []).map(rowToReservation);

    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    if (params?.search?.trim()) {
      const q = params.search.toLowerCase().trim();
      items = items.filter(r =>
        r.customerName.toLowerCase().includes(q) ||
        r.phone.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    }
    if (params?.status && params.status !== 'ALL') {
      items = items.filter(r => r.status === params.status);
    }
    if (params?.timeframe) {
      if (params.timeframe === 'today') items = items.filter(r => r.date === todayStr);
      else if (params.timeframe === 'tomorrow') items = items.filter(r => r.date === tomorrowStr);
      else if (params.timeframe === 'upcoming') items = items.filter(r => r.date >= todayStr);
      else if (params.timeframe === 'past') items = items.filter(r => r.date < todayStr);
    }
    if (params?.date?.trim()) {
      items = items.filter(r => r.date === params.date!.trim());
    }

    const sortBy = params?.sortBy || 'newest';
    items.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      if (sortBy === 'reservation_date') return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
      if (sortBy === 'guests_desc') return b.guests - a.guests;
      return 0;
    });

    const pageNum = params?.page || 1;
    const limitNum = params?.limit || 50;
    const totalCount = items.length;
    const start = (pageNum - 1) * limitNum;
    const paginatedItems = items.slice(start, start + limitNum);

    return { reservations: paginatedItems, totalCount, page: pageNum, totalPages: Math.ceil(totalCount / limitNum) };
  },

  async updateReservationStatus(id: string, status: ReservationStatus): Promise<{ success: boolean; reservation: Reservation }> {
    const { data: existing } = await supabase.from('reservations').select('*').eq('id', id).single();
    const { data, error } = await supabase.from('reservations').update({ status }).eq('id', id).select().single();
    throwIfError('updateReservationStatus', error);
    const reservation = rowToReservation(data);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({
      action: 'RESERVATION_STATUS_CHANGE',
      description: `Reservation for ${reservation.customerName} marked from ${existing?.status} to ${status}.`,
      userEmail: userData.user?.email || 'admin',
      entityType: 'RESERVATION'
    });
    return { success: true, reservation };
  },

  async deleteReservation(id: string): Promise<{ success: boolean }> {
    const { data: existing } = await supabase.from('reservations').select('*').eq('id', id).single();
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    throwIfError('deleteReservation', error);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({
      action: 'RESERVATION_DELETED',
      description: `Reservation for ${existing?.customer_name || id} deleted.`,
      userEmail: userData.user?.email || 'admin',
      entityType: 'RESERVATION'
    });
    return { success: true };
  },

  // CSV export is now generated entirely client-side (see exportReservationsCsv
  // below) since there's no backend to stream it from.
  getExportCsvUrl(): string {
    return '';
  },

  async exportReservationsCsv(): Promise<string> {
    const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    throwIfError('exportReservationsCsv', error);
    const reservations = (data || []).map(rowToReservation);
    const headers = ['Customer Name', 'Phone', 'Date', 'Time', 'Guests', 'Status', 'Special Request', 'Created At'];
    const rows = reservations.map(r => [
      `"${r.customerName.replace(/"/g, '""')}"`,
      `"${r.phone.replace(/"/g, '""')}"`,
      `"${r.date}"`,
      `"${r.time}"`,
      r.guests,
      `"${r.status}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
      `"${new Date(r.createdAt).toLocaleString('en-US', { timeZone: 'Asia/Dhaka' })}"`
    ]);
    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  // --- Admin Menu & Categories -----------------------------------------------
  async getAdminCategories(): Promise<{ categories: MenuCategory[] }> {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order');
    throwIfError('getAdminCategories', error);
    return { categories: (data || []).map(rowToCategory) };
  },

  async createCategory(data: Partial<MenuCategory>): Promise<{ success: boolean; category: MenuCategory }> {
    const id = data.name!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString(36);
    const { data: row, error } = await supabase
      .from('categories')
      .insert({
        id,
        name: data.name,
        bengali_name: data.bengaliName,
        sub_label: data.subLabel || '',
        sort_order: data.sortOrder || 1,
        is_visible: data.isVisible !== false
      })
      .select()
      .single();
    throwIfError('createCategory', error);
    const category = rowToCategory(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'CATEGORY_ADDED', description: `Category "${category.name}" added.`, userEmail: userData.user?.email || 'admin', entityType: 'MENU' });
    return { success: true, category };
  },

  async updateCategory(id: string, data: Partial<MenuCategory>): Promise<{ success: boolean; category: MenuCategory }> {
    const patch: any = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.bengaliName !== undefined) patch.bengali_name = data.bengaliName;
    if (data.subLabel !== undefined) patch.sub_label = data.subLabel;
    if (data.sortOrder !== undefined) patch.sort_order = data.sortOrder;
    if (data.isVisible !== undefined) patch.is_visible = data.isVisible;
    const { data: row, error } = await supabase.from('categories').update(patch).eq('id', id).select().single();
    throwIfError('updateCategory', error);
    const category = rowToCategory(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'CATEGORY_UPDATED', description: `Category "${category.name}" updated.`, userEmail: userData.user?.email || 'admin', entityType: 'MENU' });
    return { success: true, category };
  },

  async deleteCategory(id: string): Promise<{ success: boolean }> {
    const { count } = await supabase.from('menu_items').select('id', { count: 'exact', head: true }).eq('category_id', id);
    if (count && count > 0) {
      throw new Error(`Cannot delete: ${count} menu item(s) belong to this category. Reassign or delete them first.`);
    }
    const { error } = await supabase.from('categories').delete().eq('id', id);
    throwIfError('deleteCategory', error);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'CATEGORY_DELETED', description: `Category ${id} deleted.`, userEmail: userData.user?.email || 'admin', entityType: 'MENU' });
    return { success: true };
  },

  async createMenuItem(data: Partial<MenuItem>): Promise<{ success: boolean; item: MenuItem }> {
    const priceStr = String(data.price || '').trim();
    const { data: row, error } = await supabase
      .from('menu_items')
      .insert({
        category_id: data.categoryId,
        name: data.name,
        bengali_name: data.bengaliName,
        price: priceStr.startsWith('৳') ? priceStr : `৳${priceStr}`,
        description: data.description || '',
        bengali_description: data.bengaliDescription || '',
        image: data.image || 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=900&auto=format&fit=crop',
        tag: data.tag || '',
        badge: data.badge || '',
        featured: Boolean(data.featured),
        available: data.available !== false,
        sort_order: data.sortOrder || 1
      })
      .select()
      .single();
    throwIfError('createMenuItem', error);
    const item = rowToMenuItem(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'MENU_ITEM_ADDED', description: `Food item "${item.name}" (${item.bengaliName}) added to menu.`, userEmail: userData.user?.email || 'admin', entityType: 'MENU' });
    return { success: true, item };
  },

  async updateMenuItem(id: string, data: Partial<MenuItem>): Promise<{ success: boolean; item: MenuItem }> {
    const patch: any = {};
    if (data.categoryId !== undefined) patch.category_id = data.categoryId;
    if (data.name !== undefined) patch.name = data.name;
    if (data.bengaliName !== undefined) patch.bengali_name = data.bengaliName;
    if (data.price !== undefined) {
      const p = String(data.price).trim();
      patch.price = p.startsWith('৳') ? p : `৳${p}`;
    }
    if (data.description !== undefined) patch.description = data.description;
    if (data.bengaliDescription !== undefined) patch.bengali_description = data.bengaliDescription;
    if (data.image !== undefined) patch.image = data.image;
    if (data.tag !== undefined) patch.tag = data.tag;
    if (data.badge !== undefined) patch.badge = data.badge;
    if (data.featured !== undefined) patch.featured = data.featured;
    if (data.available !== undefined) patch.available = data.available;
    if (data.sortOrder !== undefined) patch.sort_order = data.sortOrder;

    const { data: row, error } = await supabase.from('menu_items').update(patch).eq('id', id).select().single();
    throwIfError('updateMenuItem', error);
    const item = rowToMenuItem(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'MENU_ITEM_UPDATED', description: `Food item "${item.name}" updated.`, userEmail: userData.user?.email || 'admin', entityType: 'MENU' });
    return { success: true, item };
  },

  async toggleMenuItemAvailability(id: string): Promise<{ success: boolean; item: MenuItem }> {
    const { data: current } = await supabase.from('menu_items').select('*').eq('id', id).single();
    const { data: row, error } = await supabase.from('menu_items').update({ available: !current.available }).eq('id', id).select().single();
    throwIfError('toggleMenuItemAvailability', error);
    const item = rowToMenuItem(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'MENU_AVAILABILITY_TOGGLED', description: `Item "${item.name}" marked as ${item.available ? 'AVAILABLE' : 'UNAVAILABLE'}.`, userEmail: userData.user?.email || 'admin', entityType: 'MENU' });
    return { success: true, item };
  },

  async toggleMenuItemFeatured(id: string): Promise<{ success: boolean; item: MenuItem }> {
    const { data: current } = await supabase.from('menu_items').select('*').eq('id', id).single();
    const { data: row, error } = await supabase.from('menu_items').update({ featured: !current.featured }).eq('id', id).select().single();
    throwIfError('toggleMenuItemFeatured', error);
    const item = rowToMenuItem(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'MENU_FEATURED_TOGGLED', description: `Item "${item.name}" marked as ${item.featured ? 'FEATURED' : 'STANDARD'}.`, userEmail: userData.user?.email || 'admin', entityType: 'MENU' });
    return { success: true, item };
  },

  async deleteMenuItem(id: string): Promise<{ success: boolean }> {
    const { data: current } = await supabase.from('menu_items').select('*').eq('id', id).single();
    const { error } = await supabase.from('menu_items').delete().eq('id', id);
    throwIfError('deleteMenuItem', error);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'MENU_ITEM_DELETED', description: `Food item "${current?.name || id}" removed from menu.`, userEmail: userData.user?.email || 'admin', entityType: 'MENU' });
    return { success: true };
  },

  // --- Admin Gallery ---------------------------------------------------------
  async createGalleryItem(data: Partial<GalleryItem>): Promise<{ success: boolean; item: GalleryItem }> {
    const { data: row, error } = await supabase
      .from('gallery')
      .insert({
        url: data.url,
        title: data.title,
        bengali: data.bengali || '',
        aspect: data.aspect || 'square',
        sort_order: data.sortOrder || 1,
        featured: Boolean(data.featured)
      })
      .select()
      .single();
    throwIfError('createGalleryItem', error);
    const item = rowToGalleryItem(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'GALLERY_ITEM_ADDED', description: `Gallery image "${item.title}" added.`, userEmail: userData.user?.email || 'admin', entityType: 'GALLERY' });
    return { success: true, item };
  },

  async deleteGalleryItem(id: string): Promise<{ success: boolean }> {
    const { error } = await supabase.from('gallery').delete().eq('id', id);
    throwIfError('deleteGalleryItem', error);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'GALLERY_ITEM_DELETED', description: `Gallery item ${id} deleted.`, userEmail: userData.user?.email || 'admin', entityType: 'GALLERY' });
    return { success: true };
  },

  // --- Admin Reviews -----------------------------------------------------------
  async getAdminReviews(): Promise<{ reviews: Review[] }> {
    const { data, error } = await supabase.from('reviews').select('*').order('created_at', { ascending: false });
    throwIfError('getAdminReviews', error);
    return { reviews: (data || []).map(rowToReview) };
  },

  async createReview(data: Partial<Review>): Promise<{ success: boolean; review: Review }> {
    const { data: row, error } = await supabase
      .from('reviews')
      .insert({
        name: data.name,
        text: data.text,
        date: data.date || new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' }),
        rating: data.rating || 5,
        published: data.published !== false
      })
      .select()
      .single();
    throwIfError('createReview', error);
    const review = rowToReview(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'REVIEW_ADDED', description: `Review from "${review.name}" created.`, userEmail: userData.user?.email || 'admin', entityType: 'REVIEW' });
    return { success: true, review };
  },

  async updateReview(id: string, data: Partial<Review>): Promise<{ success: boolean; review: Review }> {
    const patch: any = {};
    if (data.name !== undefined) patch.name = data.name;
    if (data.text !== undefined) patch.text = data.text;
    if (data.date !== undefined) patch.date = data.date;
    if (data.rating !== undefined) patch.rating = data.rating;
    if (data.published !== undefined) patch.published = data.published;
    const { data: row, error } = await supabase.from('reviews').update(patch).eq('id', id).select().single();
    throwIfError('updateReview', error);
    const review = rowToReview(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'REVIEW_UPDATED', description: `Review from "${review.name}" updated.`, userEmail: userData.user?.email || 'admin', entityType: 'REVIEW' });
    return { success: true, review };
  },

  async toggleReviewPublish(id: string): Promise<{ success: boolean; review: Review }> {
    const { data: current } = await supabase.from('reviews').select('*').eq('id', id).single();
    const { data: row, error } = await supabase.from('reviews').update({ published: !current.published }).eq('id', id).select().single();
    throwIfError('toggleReviewPublish', error);
    const review = rowToReview(row);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'REVIEW_STATUS_CHANGED', description: `Review from "${review.name}" marked as ${review.published ? 'PUBLISHED' : 'UNPUBLISHED'}.`, userEmail: userData.user?.email || 'admin', entityType: 'REVIEW' });
    return { success: true, review };
  },

  async deleteReview(id: string): Promise<{ success: boolean }> {
    const { error } = await supabase.from('reviews').delete().eq('id', id);
    throwIfError('deleteReview', error);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'REVIEW_DELETED', description: `Review ${id} deleted.`, userEmail: userData.user?.email || 'admin', entityType: 'REVIEW' });
    return { success: true };
  },

  // --- Admin Restaurant Settings & Hours ---------------------------------------
  async updateRestaurantInfo(data: Partial<RestaurantSettings>): Promise<{ success: boolean; settings: RestaurantSettings }> {
    const { data: currentRow } = await supabase.from('settings').select('data').eq('id', 'main').single();
    const current = currentRow.data as RestaurantSettings;
    const merged: RestaurantSettings = {
      ...current,
      ...data,
      socials: data.socials ? { ...current.socials, ...data.socials } : current.socials
    };
    const { error } = await supabase.from('settings').update({ data: merged }).eq('id', 'main');
    throwIfError('updateRestaurantInfo', error);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'RESTAURANT_INFO_UPDATED', description: 'Restaurant profile and contact details updated.', userEmail: userData.user?.email || 'admin', entityType: 'SETTINGS' });
    return { success: true, settings: merged };
  },

  async updateOpeningHours(openingHours: any[], specialClosureNotice?: string): Promise<{ success: boolean; settings: RestaurantSettings }> {
    const { data: currentRow } = await supabase.from('settings').select('data').eq('id', 'main').single();
    const current = currentRow.data as RestaurantSettings;
    const merged: RestaurantSettings = { ...current, openingHours, specialClosureNotice: specialClosureNotice ?? current.specialClosureNotice };
    const { error } = await supabase.from('settings').update({ data: merged }).eq('id', 'main');
    throwIfError('updateOpeningHours', error);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'OPENING_HOURS_UPDATED', description: 'Weekly operating hours and special closures updated.', userEmail: userData.user?.email || 'admin', entityType: 'SETTINGS' });
    return { success: true, settings: merged };
  },

  async updateWebsiteContent(content: Partial<RestaurantSettings['content']>): Promise<{ success: boolean; settings: RestaurantSettings }> {
    const { data: currentRow } = await supabase.from('settings').select('data').eq('id', 'main').single();
    const current = currentRow.data as RestaurantSettings;
    const merged: RestaurantSettings = { ...current, content: { ...current.content, ...content } };
    const { error } = await supabase.from('settings').update({ data: merged }).eq('id', 'main');
    throwIfError('updateWebsiteContent', error);
    const { data: userData } = await supabase.auth.getUser();
    await logActivity({ action: 'WEBSITE_CONTENT_UPDATED', description: 'Website text content and story copy updated.', userEmail: userData.user?.email || 'admin', entityType: 'SETTINGS' });
    return { success: true, settings: merged };
  },

  // --- Image Upload (directly to Supabase Storage from the browser) -----------
  async uploadImage(file: File): Promise<{ success: boolean; url: string }> {
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 30);
    const path = `${cleanName || 'image'}-${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;

    const { error } = await supabase.storage.from(UPLOADS_BUCKET).upload(path, file, {
      contentType: file.type,
      upsert: false
    });
    if (error) throw new Error(error.message || 'Image upload failed');

    const { data } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(path);
    return { success: true, url: data.publicUrl };
  }
};
