import { Router, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth, AuthenticatedRequest } from '../auth';

export const reviewRouter = Router();

// PUBLIC: GET /api/reviews (Only Admin-Approved / Published Reviews)
reviewRouter.get('/reviews', async (req, res) => {
  try {
    const reviews = await db.getReviews(true);
    return res.json({ reviews });
  } catch (err) {
    console.error('Error fetching reviews:', err);
    return res.status(500).json({ error: 'Failed to load reviews' });
  }
});

// ADMIN: GET /api/admin/reviews (All Reviews)
reviewRouter.get('/admin/reviews', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reviews = await db.getReviews(false);
    return res.json({ reviews });
  } catch (err) {
    console.error('Error fetching admin reviews:', err);
    return res.status(500).json({ error: 'Failed to load reviews' });
  }
});

// ADMIN: POST /api/admin/reviews
reviewRouter.post('/admin/reviews', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, text, date, rating, published } = req.body;
    if (!name || !text) {
      return res.status(400).json({ error: 'Reviewer name and review text are required' });
    }

    const newRev = await db.addReview({
      name: name.trim(),
      text: text.trim(),
      date: date?.trim() || new Date().toLocaleDateString('bn-BD', { month: 'long', year: 'numeric' }),
      rating: Number(rating) || 5,
      published: published !== false
    });

    await db.logActivity({
      action: 'REVIEW_ADDED',
      description: `Review from "${newRev.name}" created (Published: ${newRev.published}).`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'REVIEW'
    });

    return res.status(201).json({ success: true, review: newRev });
  } catch (err) {
    console.error('Add review error:', err);
    return res.status(500).json({ error: 'Failed to create review' });
  }
});

// ADMIN: PUT /api/admin/reviews/:id
reviewRouter.put('/admin/reviews/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, text, date, rating, published } = req.body;

    const updated = await db.updateReview(id, {
      name: name?.trim(),
      text: text?.trim(),
      date: date?.trim(),
      rating: rating !== undefined ? Number(rating) : undefined,
      published: published !== undefined ? Boolean(published) : undefined
    });

    if (!updated) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await db.logActivity({
      action: 'REVIEW_UPDATED',
      description: `Review from "${updated.name}" updated.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'REVIEW'
    });

    return res.json({ success: true, review: updated });
  } catch (err) {
    console.error('Update review error:', err);
    return res.status(500).json({ error: 'Failed to update review' });
  }
});

// ADMIN: PATCH /api/admin/reviews/:id/toggle-publish
reviewRouter.patch('/admin/reviews/:id/toggle-publish', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const reviews = await db.getReviews(false);
    const rev = reviews.find(r => r.id === id);
    if (!rev) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const updated = await db.updateReview(id, { published: !rev.published });
    await db.logActivity({
      action: 'REVIEW_STATUS_CHANGED',
      description: `Review from "${rev.name}" marked as ${updated?.published ? 'PUBLISHED' : 'UNPUBLISHED'}.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'REVIEW'
    });

    return res.json({ success: true, review: updated });
  } catch (err) {
    console.error('Toggle publish error:', err);
    return res.status(500).json({ error: 'Failed to toggle publish status' });
  }
});

// ADMIN: DELETE /api/admin/reviews/:id
reviewRouter.delete('/admin/reviews/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteReview(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Review not found' });
    }

    await db.logActivity({
      action: 'REVIEW_DELETED',
      description: `Review ${id} deleted.`,
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'REVIEW'
    });

    return res.json({ success: true, message: 'Review deleted successfully' });
  } catch (err) {
    console.error('Delete review error:', err);
    return res.status(500).json({ error: 'Failed to delete review' });
  }
});
