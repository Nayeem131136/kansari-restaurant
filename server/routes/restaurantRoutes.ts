import { Router, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth, AuthenticatedRequest } from '../auth';

export const restaurantRouter = Router();

// PUBLIC: GET /api/restaurant (All public settings and info)
restaurantRouter.get('/restaurant', async (req, res) => {
  try {
    const settings = await db.getSettings();
    return res.json({ settings });
  } catch (err) {
    console.error('Error fetching restaurant settings:', err);
    return res.status(500).json({ error: 'Failed to load restaurant settings' });
  }
});

// ADMIN: PUT /api/admin/restaurant (General Info & Contacts)
restaurantRouter.put('/admin/restaurant', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      name, 
      bengaliName, 
      tagline, 
      englishTagline, 
      description, 
      englishDescription, 
      location, 
      address, 
      phone, 
      whatsapp, 
      email, 
      socials,
      specialClosureNotice
    } = req.body;

    const current = await db.getSettings();
    const updated = await db.updateSettings({
      name: name?.trim() || current.name,
      bengaliName: bengaliName?.trim() || current.bengaliName,
      tagline: tagline?.trim() || current.tagline,
      englishTagline: englishTagline?.trim() || current.englishTagline,
      description: description?.trim() || current.description,
      englishDescription: englishDescription?.trim() || current.englishDescription,
      location: location?.trim() || current.location,
      address: address?.trim() || current.address,
      phone: phone?.trim() || current.phone,
      whatsapp: whatsapp?.trim() || current.whatsapp,
      email: email?.trim() || current.email,
      socials: socials ? { ...current.socials, ...socials } : current.socials,
      specialClosureNotice: specialClosureNotice !== undefined ? specialClosureNotice : current.specialClosureNotice
    });

    await db.logActivity({
      action: 'RESTAURANT_INFO_UPDATED',
      description: 'Restaurant profile and contact details updated.',
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'SETTINGS'
    });

    return res.json({ success: true, settings: updated });
  } catch (err) {
    console.error('Update restaurant info error:', err);
    return res.status(500).json({ error: 'Failed to update restaurant settings' });
  }
});

// ADMIN: PUT /api/admin/opening-hours
restaurantRouter.put('/admin/opening-hours', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { openingHours, specialClosureNotice } = req.body;
    if (!Array.isArray(openingHours)) {
      return res.status(400).json({ error: 'openingHours must be an array of days' });
    }

    const updated = await db.updateSettings({
      openingHours,
      specialClosureNotice: specialClosureNotice !== undefined ? specialClosureNotice : undefined
    });

    await db.logActivity({
      action: 'OPENING_HOURS_UPDATED',
      description: 'Weekly operating hours and special closures updated.',
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'SETTINGS'
    });

    return res.json({ success: true, settings: updated });
  } catch (err) {
    console.error('Update opening hours error:', err);
    return res.status(500).json({ error: 'Failed to update opening hours' });
  }
});

// ADMIN: PUT /api/admin/website-content
restaurantRouter.put('/admin/website-content', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      heroHeadline, 
      heroBengaliHeadline, 
      heroSupportingText, 
      storyHeadline, 
      storyBengaliHeadline, 
      storyText, 
      finalCtaHeading 
    } = req.body;

    const current = await db.getSettings();
    const updated = await db.updateSettings({
      content: {
        heroHeadline: heroHeadline ?? current.content.heroHeadline,
        heroBengaliHeadline: heroBengaliHeadline ?? current.content.heroBengaliHeadline,
        heroSupportingText: heroSupportingText ?? current.content.heroSupportingText,
        storyHeadline: storyHeadline ?? current.content.storyHeadline,
        storyBengaliHeadline: storyBengaliHeadline ?? current.content.storyBengaliHeadline,
        storyText: storyText ?? current.content.storyText,
        finalCtaHeading: finalCtaHeading ?? current.content.finalCtaHeading
      }
    });

    await db.logActivity({
      action: 'WEBSITE_CONTENT_UPDATED',
      description: 'Website text content and story copy updated.',
      userEmail: req.adminUser?.email || 'admin',
      entityType: 'SETTINGS'
    });

    return res.json({ success: true, settings: updated });
  } catch (err) {
    console.error('Update website content error:', err);
    return res.status(500).json({ error: 'Failed to update website content' });
  }
});
