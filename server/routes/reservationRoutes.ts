import { Router, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth, AuthenticatedRequest } from '../auth';
import { ReservationStatus } from '../types';

export const reservationRouter = Router();

// Track recent submissions in memory to prevent rapid duplicate spam
const recentSubmissions = new Map<string, number>();

// PUBLIC: POST /api/reservations (Customer Booking Submission)
reservationRouter.post('/reservations', async (req, res) => {
  try {
    const { name, phone, date, time, guests, notes } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid full name (minimum 2 characters).' });
    }

    if (!phone || typeof phone !== 'string' || phone.trim().length < 6) {
      return res.status(400).json({ error: 'Please provide a valid contact phone number.' });
    }

    if (!date || typeof date !== 'string') {
      return res.status(400).json({ error: 'Please select a valid reservation date.' });
    }

    // Basic date validation - prevent past reservations (before today in Bangladesh/local time)
    const todayStr = new Date().toISOString().split('T')[0];
    if (date < todayStr) {
      return res.status(400).json({ error: 'Reservation date cannot be in the past.' });
    }

    if (!time || typeof time !== 'string') {
      return res.status(400).json({ error: 'Please select a dining time slot.' });
    }

    const guestCount = parseInt(guests, 10);
    if (isNaN(guestCount) || guestCount < 1 || guestCount > 50) {
      return res.status(400).json({ error: 'Party size must be between 1 and 50 guests.' });
    }

    // Anti-spam key: phone + date + time within 15 seconds
    const spamKey = `${phone.trim()}_${date}_${time}`;
    const now = Date.now();
    const lastSub = recentSubmissions.get(spamKey);
    if (lastSub && now - lastSub < 15000) {
      return res.status(429).json({ error: 'Your request was already submitted. Please wait a moment.' });
    }
    recentSubmissions.set(spamKey, now);

    const newRes = await db.addReservation({
      customerName: name,
      phone,
      date,
      time,
      guests: guestCount,
      notes: notes || ''
    });

    return res.status(201).json({
      success: true,
      message: 'আপনার reservation request গ্রহণ করা হয়েছে।',
      reservation: newRes
    });
  } catch (err) {
    console.error('Reservation submission error:', err);
    return res.status(500).json({ error: 'Failed to process reservation. Please try again or call directly.' });
  }
});

// ADMIN: GET /api/admin/reservations
reservationRouter.get('/admin/reservations', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      search, 
      status, 
      timeframe, 
      date, 
      sortBy = 'newest',
      page = '1',
      limit = '50'
    } = req.query;

    let items = await db.getReservations();
    const todayStr = new Date().toISOString().split('T')[0];
    const tomorrowStr = new Date(Date.now() + 86400000).toISOString().split('T')[0];

    // Filter by search (name or phone)
    if (search && typeof search === 'string' && search.trim()) {
      const q = search.toLowerCase().trim();
      items = items.filter(r => 
        r.customerName.toLowerCase().includes(q) || 
        r.phone.toLowerCase().includes(q) ||
        (r.notes && r.notes.toLowerCase().includes(q))
      );
    }

    // Filter by status
    if (status && typeof status === 'string' && status !== 'ALL') {
      items = items.filter(r => r.status === status);
    }

    // Filter by timeframe
    if (timeframe && typeof timeframe === 'string') {
      if (timeframe === 'today') {
        items = items.filter(r => r.date === todayStr);
      } else if (timeframe === 'tomorrow') {
        items = items.filter(r => r.date === tomorrowStr);
      } else if (timeframe === 'upcoming') {
        items = items.filter(r => r.date >= todayStr);
      } else if (timeframe === 'past') {
        items = items.filter(r => r.date < todayStr);
      }
    }

    // Filter by specific date
    if (date && typeof date === 'string' && date.trim()) {
      items = items.filter(r => r.date === date.trim());
    }

    // Sorting
    items.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      } else if (sortBy === 'reservation_date') {
        return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
      } else if (sortBy === 'guests_desc') {
        return b.guests - a.guests;
      }
      return 0;
    });

    const pageNum = parseInt(page as string, 10) || 1;
    const limitNum = parseInt(limit as string, 10) || 50;
    const totalCount = items.length;
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedItems = items.slice(startIndex, startIndex + limitNum);

    return res.json({
      reservations: paginatedItems,
      totalCount,
      page: pageNum,
      totalPages: Math.ceil(totalCount / limitNum)
    });
  } catch (err) {
    console.error('Error fetching reservations:', err);
    return res.status(500).json({ error: 'Failed to load reservations' });
  }
});

// ADMIN: PATCH /api/admin/reservations/:id/status
reservationRouter.patch('/admin/reservations/:id/status', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: ReservationStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid reservation status' });
    }

    const updated = await db.updateReservationStatus(id, status, req.adminUser?.email || 'kansari@nayeem.com');
    if (!updated) {
      return res.status(404).json({ error: 'Reservation not found' });
    }

    return res.json({ success: true, reservation: updated });
  } catch (err) {
    console.error('Status update error:', err);
    return res.status(500).json({ error: 'Failed to update reservation status' });
  }
});

// ADMIN: DELETE /api/admin/reservations/:id
reservationRouter.delete('/admin/reservations/:id', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await db.deleteReservation(id, req.adminUser?.email || 'kansari@nayeem.com');
    if (!deleted) {
      return res.status(404).json({ error: 'Reservation not found' });
    }
    return res.json({ success: true, message: 'Reservation deleted successfully' });
  } catch (err) {
    console.error('Delete reservation error:', err);
    return res.status(500).json({ error: 'Failed to delete reservation' });
  }
});

// ADMIN: GET /api/admin/reservations/export/csv
reservationRouter.get('/admin/reservations/export/csv', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reservations = await db.getReservations();

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

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="kansari-reservations-${new Date().toISOString().split('T')[0]}.csv"`);
    return res.send(csvContent);
  } catch (err) {
    console.error('CSV export error:', err);
    return res.status(500).json({ error: 'Failed to export CSV' });
  }
});
