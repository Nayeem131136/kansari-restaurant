import bcrypt from 'bcryptjs';
import { supabase } from './supabaseClient';
import {
  Reservation,
  MenuItem,
  MenuCategory,
  GalleryItem,
  Review,
  RestaurantSettings,
  ActivityLog,
} from './types';

// ---------------------------------------------------------------------------
// Row <-> App-type mappers (Postgres uses snake_case columns; the app's
// TypeScript types use camelCase, matching the original JSON-file schema so
// the frontend and route files didn't need to change).
// ---------------------------------------------------------------------------

function rowToCategory(r: any): MenuCategory {
  return {
    id: r.id,
    name: r.name,
    bengaliName: r.bengali_name,
    subLabel: r.sub_label ?? undefined,
    sortOrder: r.sort_order,
    isVisible: r.is_visible,
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
    updatedAt: r.updated_at ?? undefined,
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
    createdAt: r.created_at ?? undefined,
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
    updatedAt: r.updated_at ?? undefined,
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
    updatedAt: r.updated_at,
  };
}

function rowToActivityLog(r: any): ActivityLog {
  return {
    id: r.id,
    action: r.action,
    description: r.description,
    userEmail: r.user_email,
    timestamp: r.timestamp,
    entityType: r.entity_type ?? undefined,
  };
}

function genId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

function throwIfError(context: string, error: any) {
  if (error) {
    console.error(`Supabase error in ${context}:`, error);
    throw new Error(`Database error (${context}): ${error.message || 'unknown error'}`);
  }
}

// ---------------------------------------------------------------------------
// Database — same public method names/signatures as the original JSON-file
// version, but every method is now async and backed by Supabase Postgres.
// Every route file already sits behind try/catch, so callers just need an
// `await` added in front of each call.
// ---------------------------------------------------------------------------
class Database {
  private adminEnsured = false;

  /**
   * Makes sure the single admin_user row exists. Runs once, lazily, the
   * first time any admin-auth-related call happens — avoids a synchronous
   * constructor (Supabase calls are always async).
   */
  private async ensureAdminUser() {
    if (this.adminEnsured) return;
    const { data, error } = await supabase.from('admin_user').select('id').limit(1);
    throwIfError('ensureAdminUser:select', error);
    if (!data || data.length === 0) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync('nayeem@131', salt);
      const { error: insertError } = await supabase.from('admin_user').insert({
        id: 'admin-kansari-1',
        email: 'kansari@nayeem.com',
        name: 'Kansari General Manager',
        password_hash: passwordHash,
        role: 'admin',
      });
      throwIfError('ensureAdminUser:insert', insertError);
    }
    this.adminEnsured = true;
  }

  // --- Admin user -----------------------------------------------------
  async getAdminUser() {
    await this.ensureAdminUser();
    const { data, error } = await supabase.from('admin_user').select('*').limit(1).single();
    throwIfError('getAdminUser', error);
    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      name: data.name,
      role: data.role,
      lastLogin: data.last_login ?? undefined,
    };
  }

  async updateAdminUser(updates: { email?: string; passwordHash?: string; name?: string; lastLogin?: string }) {
    await this.ensureAdminUser();
    const patch: any = {};
    if (updates.email !== undefined) patch.email = updates.email;
    if (updates.passwordHash !== undefined) patch.password_hash = updates.passwordHash;
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.lastLogin !== undefined) patch.last_login = updates.lastLogin;

    const { data, error } = await supabase
      .from('admin_user')
      .update(patch)
      .eq('id', 'admin-kansari-1')
      .select()
      .single();
    throwIfError('updateAdminUser', error);
    return {
      id: data.id,
      email: data.email,
      passwordHash: data.password_hash,
      name: data.name,
      role: data.role,
      lastLogin: data.last_login ?? undefined,
    };
  }

  // --- Settings ---------------------------------------------------------
  async getSettings(): Promise<RestaurantSettings> {
    const { data, error } = await supabase.from('settings').select('data').eq('id', 'main').single();
    throwIfError('getSettings', error);
    return data.data as RestaurantSettings;
  }

  async updateSettings(updates: Partial<RestaurantSettings>): Promise<RestaurantSettings> {
    const current = await this.getSettings();
    const merged = { ...current, ...updates };
    const { error } = await supabase.from('settings').update({ data: merged }).eq('id', 'main');
    throwIfError('updateSettings', error);
    return merged;
  }

  // --- Categories ---------------------------------------------------------
  async getCategories(): Promise<MenuCategory[]> {
    const { data, error } = await supabase.from('categories').select('*').order('sort_order');
    throwIfError('getCategories', error);
    return (data || []).map(rowToCategory);
  }

  async addCategory(category: Omit<MenuCategory, 'id'>): Promise<MenuCategory> {
    const id = genId('cat');
    const { data, error } = await supabase
      .from('categories')
      .insert({
        id,
        name: category.name,
        bengali_name: category.bengaliName,
        sub_label: category.subLabel ?? null,
        sort_order: category.sortOrder,
        is_visible: category.isVisible,
      })
      .select()
      .single();
    throwIfError('addCategory', error);
    return rowToCategory(data);
  }

  async updateCategory(id: string, updates: Partial<MenuCategory>): Promise<MenuCategory | null> {
    const patch: any = {};
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.bengaliName !== undefined) patch.bengali_name = updates.bengaliName;
    if (updates.subLabel !== undefined) patch.sub_label = updates.subLabel;
    if (updates.sortOrder !== undefined) patch.sort_order = updates.sortOrder;
    if (updates.isVisible !== undefined) patch.is_visible = updates.isVisible;

    const { data, error } = await supabase.from('categories').update(patch).eq('id', id).select().maybeSingle();
    throwIfError('updateCategory', error);
    return data ? rowToCategory(data) : null;
  }

  async deleteCategory(id: string): Promise<{ success: boolean; error?: string }> {
    const { count, error: countError } = await supabase
      .from('menu_items')
      .select('id', { count: 'exact', head: true })
      .eq('category_id', id);
    throwIfError('deleteCategory:count', countError);
    if (count && count > 0) {
      return { success: false, error: `Cannot delete: ${count} menu item(s) belong to this category. Reassign or delete them first.` };
    }
    const { error } = await supabase.from('categories').delete().eq('id', id);
    throwIfError('deleteCategory', error);
    return { success: true };
  }

  // --- Menu items ---------------------------------------------------------
  async getMenuItems(): Promise<MenuItem[]> {
    const { data, error } = await supabase.from('menu_items').select('*').order('sort_order');
    throwIfError('getMenuItems', error);
    return (data || []).map(rowToMenuItem);
  }

  async getMenuItemById(id: string): Promise<MenuItem | null> {
    const { data, error } = await supabase.from('menu_items').select('*').eq('id', id).maybeSingle();
    throwIfError('getMenuItemById', error);
    return data ? rowToMenuItem(data) : null;
  }

  async addMenuItem(item: Omit<MenuItem, 'id'>): Promise<MenuItem> {
    const now = new Date().toISOString();
    const id = genId('item');
    const { data, error } = await supabase
      .from('menu_items')
      .insert({
        id,
        category_id: item.categoryId,
        name: item.name,
        bengali_name: item.bengaliName,
        price: item.price,
        description: item.description,
        bengali_description: item.bengaliDescription,
        image: item.image,
        tag: item.tag ?? null,
        badge: item.badge ?? null,
        featured: item.featured,
        available: item.available,
        sort_order: item.sortOrder,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    throwIfError('addMenuItem', error);
    return rowToMenuItem(data);
  }

  async updateMenuItem(id: string, updates: Partial<MenuItem>): Promise<MenuItem | null> {
    const patch: any = { updated_at: new Date().toISOString() };
    if (updates.categoryId !== undefined) patch.category_id = updates.categoryId;
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.bengaliName !== undefined) patch.bengali_name = updates.bengaliName;
    if (updates.price !== undefined) patch.price = updates.price;
    if (updates.description !== undefined) patch.description = updates.description;
    if (updates.bengaliDescription !== undefined) patch.bengali_description = updates.bengaliDescription;
    if (updates.image !== undefined) patch.image = updates.image;
    if (updates.tag !== undefined) patch.tag = updates.tag;
    if (updates.badge !== undefined) patch.badge = updates.badge;
    if (updates.featured !== undefined) patch.featured = updates.featured;
    if (updates.available !== undefined) patch.available = updates.available;
    if (updates.sortOrder !== undefined) patch.sort_order = updates.sortOrder;

    const { data, error } = await supabase.from('menu_items').update(patch).eq('id', id).select().maybeSingle();
    throwIfError('updateMenuItem', error);
    return data ? rowToMenuItem(data) : null;
  }

  async deleteMenuItem(id: string): Promise<boolean> {
    const { data, error } = await supabase.from('menu_items').delete().eq('id', id).select();
    throwIfError('deleteMenuItem', error);
    return !!data && data.length > 0;
  }

  // --- Gallery ---------------------------------------------------------
  async getGallery(): Promise<GalleryItem[]> {
    const { data, error } = await supabase.from('gallery').select('*').order('sort_order');
    throwIfError('getGallery', error);
    return (data || []).map(rowToGalleryItem);
  }

  async addGalleryItem(item: Omit<GalleryItem, 'id'>): Promise<GalleryItem> {
    const id = genId('g');
    const { data, error } = await supabase
      .from('gallery')
      .insert({
        id,
        url: item.url,
        title: item.title,
        bengali: item.bengali,
        aspect: item.aspect,
        sort_order: item.sortOrder,
        featured: item.featured ?? false,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    throwIfError('addGalleryItem', error);
    return rowToGalleryItem(data);
  }

  async deleteGalleryItem(id: string): Promise<boolean> {
    const { data, error } = await supabase.from('gallery').delete().eq('id', id).select();
    throwIfError('deleteGalleryItem', error);
    return !!data && data.length > 0;
  }

  // --- Reviews ---------------------------------------------------------
  async getReviews(onlyPublished = false): Promise<Review[]> {
    let query = supabase.from('reviews').select('*').order('created_at', { ascending: false });
    if (onlyPublished) query = query.eq('published', true);
    const { data, error } = await query;
    throwIfError('getReviews', error);
    return (data || []).map(rowToReview);
  }

  async addReview(review: Omit<Review, 'id'>): Promise<Review> {
    const now = new Date().toISOString();
    const id = genId('rev');
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        id,
        name: review.name,
        text: review.text,
        date: review.date,
        rating: review.rating,
        published: review.published,
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    throwIfError('addReview', error);
    return rowToReview(data);
  }

  async updateReview(id: string, updates: Partial<Review>): Promise<Review | null> {
    const patch: any = { updated_at: new Date().toISOString() };
    if (updates.name !== undefined) patch.name = updates.name;
    if (updates.text !== undefined) patch.text = updates.text;
    if (updates.date !== undefined) patch.date = updates.date;
    if (updates.rating !== undefined) patch.rating = updates.rating;
    if (updates.published !== undefined) patch.published = updates.published;

    const { data, error } = await supabase.from('reviews').update(patch).eq('id', id).select().maybeSingle();
    throwIfError('updateReview', error);
    return data ? rowToReview(data) : null;
  }

  async deleteReview(id: string): Promise<boolean> {
    const { data, error } = await supabase.from('reviews').delete().eq('id', id).select();
    throwIfError('deleteReview', error);
    return !!data && data.length > 0;
  }

  // --- Reservations ---------------------------------------------------------
  async getReservations(): Promise<Reservation[]> {
    const { data, error } = await supabase.from('reservations').select('*').order('created_at', { ascending: false });
    throwIfError('getReservations', error);
    return (data || []).map(rowToReservation);
  }

  async getReservationById(id: string): Promise<Reservation | null> {
    const { data, error } = await supabase.from('reservations').select('*').eq('id', id).maybeSingle();
    throwIfError('getReservationById', error);
    return data ? rowToReservation(data) : null;
  }

  async addReservation(data: { customerName: string; phone: string; date: string; time: string; guests: number; notes?: string }): Promise<Reservation> {
    const now = new Date().toISOString();
    const id = genId('res');
    const { data: row, error } = await supabase
      .from('reservations')
      .insert({
        id,
        customer_name: data.customerName.trim(),
        phone: data.phone.trim(),
        date: data.date,
        time: data.time,
        guests: Number(data.guests) || 2,
        notes: data.notes?.trim() || '',
        status: 'PENDING',
        created_at: now,
        updated_at: now,
      })
      .select()
      .single();
    throwIfError('addReservation', error);
    const newRes = rowToReservation(row);
    await this.logActivity({
      action: 'NEW_RESERVATION',
      description: `New booking request from ${newRes.customerName} (${newRes.guests} guests on ${newRes.date} at ${newRes.time})`,
      userEmail: 'customer',
      entityType: 'RESERVATION',
    });
    return newRes;
  }

  async updateReservationStatus(id: string, status: Reservation['status'], userEmail = 'kansari@nayeem.com'): Promise<Reservation | null> {
    const existing = await this.getReservationById(id);
    if (!existing) return null;
    const prevStatus = existing.status;

    const { data, error } = await supabase
      .from('reservations')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();
    throwIfError('updateReservationStatus', error);
    const updated = rowToReservation(data);
    await this.logActivity({
      action: 'RESERVATION_STATUS_CHANGE',
      description: `Reservation for ${updated.customerName} marked from ${prevStatus} to ${status}.`,
      userEmail,
      entityType: 'RESERVATION',
    });
    return updated;
  }

  async deleteReservation(id: string, userEmail = 'kansari@nayeem.com'): Promise<boolean> {
    const existing = await this.getReservationById(id);
    if (!existing) return false;
    const { error } = await supabase.from('reservations').delete().eq('id', id);
    throwIfError('deleteReservation', error);
    await this.logActivity({
      action: 'RESERVATION_DELETED',
      description: `Reservation for ${existing.customerName} (${existing.date}) deleted.`,
      userEmail,
      entityType: 'RESERVATION',
    });
    return true;
  }

  // --- Activity logs ---------------------------------------------------------
  async getActivityLogs(limit = 25): Promise<ActivityLog[]> {
    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);
    throwIfError('getActivityLogs', error);
    return (data || []).map(rowToActivityLog);
  }

  async logActivity(log: Omit<ActivityLog, 'id' | 'timestamp'>) {
    const id = genId('act');
    const { error } = await supabase.from('activity_logs').insert({
      id,
      action: log.action,
      description: log.description,
      user_email: log.userEmail,
      entity_type: log.entityType ?? null,
      timestamp: new Date().toISOString(),
    });
    throwIfError('logActivity', error);

    // Keep max 200 activity logs — best-effort trim, not critical if it
    // occasionally skips (avoids failing the calling operation over this).
    try {
      const { data: countRows } = await supabase.from('activity_logs').select('id').order('timestamp', { ascending: false });
      if (countRows && countRows.length > 200) {
        const idsToDelete = countRows.slice(200).map((r: any) => r.id);
        await supabase.from('activity_logs').delete().in('id', idsToDelete);
      }
    } catch (trimErr) {
      console.error('Non-fatal: failed to trim old activity logs', trimErr);
    }
  }
}

export const db = new Database();
