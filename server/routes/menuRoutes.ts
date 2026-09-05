import { Router, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth, AuthenticatedRequest } from '../auth';

export const menuRouter = Router();

// PUBLIC: GET /api/menu (Categories + Menu Items)
menuRouter.get('/menu', async (req, res) => {
  try {
    const allCategories = await db.getCategories();
    const categories = allCategories.filter(c => c.isVisible);
    const menuItems = await db.getMenuItems();
    return res.json({
      categories,
      menuItems
    });
  } catch (err) {
    console.error('Error loading menu:', err);
    return res.status(500).json({ error: 'Failed to load menu' });
  }
});

// PUBLIC: GET /api/menu/featured (Signature Dishes)
menuRouter.get('/menu/featured', async (req, res) => {
  try {
    const allItems = await db.getMenuItems();
    const featuredItems = allItems.filter(m => m.featured && m.available);
    return res.json({ featuredItems });
  } catch (err) {
    console.error('Error loading featured items:', err);
    return res.status(500).json({ error: 'Failed to load featured items' });
  }
});

// ADMIN: GET /api/admin/categories
menuRouter.get('/admin/categories', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = await db.getCategories();
    return res.json({ categories });
  } catch (err) {
    console.error('Error loading categories:', err);
    return res.status(500).json({ error: 'Failed to load categories' });
  }
});

// ADMIN: POST /api/admin/categories
menuRouter.post('/admin/categories', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, bengaliName, subLabel, sortOrder, isVisible } = req.body;
    if (!name || !bengaliName) {
      return res.status(400).json({ error: 'Category English and Bengali names are required' });
    }

    const newCat = await db.addCategory({
      name: name.trim(),
      bengaliName: bengaliName.trim(),
      subLabel: subLabel?.trim() || '',
      sortOrder: Number(sortOrder) || 1,
      isVisible: isVisible !== false
    });

    await db.logActivity({
      action: 'CATEGORY_ADDED',
      description: `Category "${newCat.name}" (${newCat.bengaliName}) added.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'MENU'
    });

    return res.status(201).json({ success: true, category: newCat });
  } catch (err) {
    console.error('Add category error:', err);
    return res.status(500).json({ error: 'Failed to create category' });
  }
});

// ADMIN: PUT /api/admin/categories/:id
menuRouter.put('/admin/categories/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, bengaliName, subLabel, sortOrder, isVisible } = req.body;

    const updated = await db.updateCategory(id, {
      name: name?.trim(),
      bengaliName: bengaliName?.trim(),
      subLabel: subLabel !== undefined ? subLabel.trim() : undefined,
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined,
      isVisible: isVisible !== undefined ? Boolean(isVisible) : undefined
    });

    if (!updated) {
      return res.status(404).json({ error: 'Category not found' });
    }

    await db.logActivity({
      action: 'CATEGORY_UPDATED',
      description: `Category "${updated.name}" updated.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'MENU'
    });

    return res.json({ success: true, category: updated });
  } catch (err) {
    console.error('Update category error:', err);
    return res.status(500).json({ error: 'Failed to update category' });
  }
});

// ADMIN: DELETE /api/admin/categories/:id
menuRouter.delete('/admin/categories/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const result = await db.deleteCategory(id);
    if (!result.success) {
      return res.status(400).json({ error: result.error || 'Failed to delete category' });
    }

    await db.logActivity({
      action: 'CATEGORY_DELETED',
      description: `Category ${id} deleted.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'MENU'
    });

    return res.json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    console.error('Delete category error:', err);
    return res.status(500).json({ error: 'Failed to delete category' });
  }
});

// ADMIN: POST /api/admin/menu (Create Menu Item)
menuRouter.post('/admin/menu', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      name, 
      bengaliName, 
      price, 
      categoryId, 
      description, 
      bengaliDescription, 
      image, 
      tag, 
      badge, 
      featured, 
      available, 
      sortOrder 
    } = req.body;

    if (!name || !bengaliName || !price || !categoryId) {
      return res.status(400).json({ error: 'Name, Bengali name, price, and category are required' });
    }

    const priceStr = String(price).trim();
    const newItem = await db.addMenuItem({
      name: name.trim(),
      bengaliName: bengaliName.trim(),
      price: priceStr.startsWith('৳') ? priceStr : `৳${priceStr}`,
      categoryId: categoryId.trim(),
      description: description?.trim() || '',
      bengaliDescription: bengaliDescription?.trim() || '',
      image: image?.trim() || '',
      tag: tag?.trim() || '',
      badge: badge?.trim() || '',
      featured: Boolean(featured),
      available: available !== false,
      sortOrder: Number(sortOrder) || 1
    });

    await db.logActivity({
      action: 'MENU_ITEM_ADDED',
      description: `Food item "${newItem.name}" (${newItem.bengaliName}) added to menu.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'MENU'
    });

    return res.status(201).json({ success: true, item: newItem });
  } catch (err) {
    console.error('Add menu item error:', err);
    return res.status(500).json({ error: 'Failed to create menu item' });
  }
});

// ADMIN: PUT /api/admin/menu/:id (Update Menu Item)
menuRouter.put('/admin/menu/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { 
      name, 
      bengaliName, 
      price, 
      categoryId, 
      description, 
      bengaliDescription, 
      image, 
      tag, 
      badge, 
      featured, 
      available, 
      sortOrder 
    } = req.body;

    const formattedPrice = price !== undefined && price !== null && price !== ''
      ? (() => {
          const p = String(price).trim();
          return p.startsWith('৳') ? p : `৳${p}`;
        })()
      : undefined;

    const updated = await db.updateMenuItem(id, {
      name: name?.trim(),
      bengaliName: bengaliName?.trim(),
      price: formattedPrice,
      categoryId: categoryId?.trim(),
      description: description !== undefined ? description.trim() : undefined,
      bengaliDescription: bengaliDescription !== undefined ? bengaliDescription.trim() : undefined,
      image: image !== undefined ? image.trim() : undefined,
      tag: tag !== undefined ? tag.trim() : undefined,
      badge: badge !== undefined ? badge.trim() : undefined,
      featured: featured !== undefined ? Boolean(featured) : undefined,
      available: available !== undefined ? Boolean(available) : undefined,
      sortOrder: sortOrder !== undefined ? Number(sortOrder) : undefined
    });

    if (!updated) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    await db.logActivity({
      action: 'MENU_ITEM_UPDATED',
      description: `Food item "${updated.name}" updated (Price: ${updated.price}, Available: ${updated.available}).`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'MENU'
    });

    return res.json({ success: true, item: updated });
  } catch (err) {
    console.error('Update menu item error:', err);
    return res.status(500).json({ error: 'Failed to update menu item' });
  }
});

// ADMIN: PATCH /api/admin/menu/:id/toggle-available
menuRouter.patch('/admin/menu/:id/toggle-available', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const current = await db.getMenuItemById(id);
    if (!current) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const updated = await db.updateMenuItem(id, { available: !current.available });
    await db.logActivity({
      action: 'MENU_AVAILABILITY_TOGGLED',
      description: `Item "${current.name}" marked as ${updated?.available ? 'AVAILABLE' : 'UNAVAILABLE'}.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'MENU'
    });

    return res.json({ success: true, item: updated });
  } catch (err) {
    console.error('Toggle availability error:', err);
    return res.status(500).json({ error: 'Failed to toggle availability' });
  }
});

// ADMIN: PATCH /api/admin/menu/:id/toggle-featured
menuRouter.patch('/admin/menu/:id/toggle-featured', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const current = await db.getMenuItemById(id);
    if (!current) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    const updated = await db.updateMenuItem(id, { featured: !current.featured });
    await db.logActivity({
      action: 'MENU_FEATURED_TOGGLED',
      description: `Item "${current.name}" marked as ${updated?.featured ? 'FEATURED' : 'STANDARD'}.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'MENU'
    });

    return res.json({ success: true, item: updated });
  } catch (err) {
    console.error('Toggle featured error:', err);
    return res.status(500).json({ error: 'Failed to toggle featured status' });
  }
});

// ADMIN: DELETE /api/admin/menu/:id
menuRouter.delete('/admin/menu/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const current = await db.getMenuItemById(id);
    const deleted = await db.deleteMenuItem(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Menu item not found' });
    }

    await db.logActivity({
      action: 'MENU_ITEM_DELETED',
      description: `Food item "${current?.name || id}" removed from menu.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'MENU'
    });

    return res.json({ success: true, message: 'Menu item deleted' });
  } catch (err) {
    console.error('Delete menu item error:', err);
    return res.status(500).json({ error: 'Failed to delete menu item' });
  }
});
