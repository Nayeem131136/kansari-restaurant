import { Router, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth, AuthenticatedRequest } from '../auth';

export const galleryRouter = Router();

// PUBLIC: GET /api/gallery
galleryRouter.get('/gallery', async (req, res) => {
  try {
    const gallery = await db.getGallery();
    return res.json({ gallery });
  } catch (err) {
    console.error('Error fetching gallery:', err);
    return res.status(500).json({ error: 'Failed to load gallery items' });
  }
});

// ADMIN: POST /api/admin/gallery
galleryRouter.post('/admin/gallery', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { url, title, bengali, aspect, sortOrder, featured } = req.body;
    if (!url || !title) {
      return res.status(400).json({ error: 'Image URL and title are required' });
    }

    const newItem = await db.addGalleryItem({
      url: url.trim(),
      title: title.trim(),
      bengali: bengali?.trim() || '',
      aspect: aspect || 'square',
      sortOrder: Number(sortOrder) || 1,
      featured: Boolean(featured)
    });

    await db.logActivity({
      action: 'GALLERY_ITEM_ADDED',
      description: `Gallery image "${newItem.title}" added.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'GALLERY'
    });

    return res.status(201).json({ success: true, item: newItem });
  } catch (err) {
    console.error('Add gallery error:', err);
    return res.status(500).json({ error: 'Failed to add gallery item' });
  }
});

// ADMIN: DELETE /api/admin/gallery/:id
galleryRouter.delete('/admin/gallery/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteGalleryItem(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Gallery item not found' });
    }

    await db.logActivity({
      action: 'GALLERY_ITEM_DELETED',
      description: `Gallery item ${id} deleted.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'GALLERY'
    });

    return res.json({ success: true, message: 'Gallery item deleted successfully' });
  } catch (err) {
    console.error('Delete gallery error:', err);
    return res.status(500).json({ error: 'Failed to delete gallery item' });
  }
});
