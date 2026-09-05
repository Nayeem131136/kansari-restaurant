import { Router, Response } from 'express';
import { db } from '../db';
import { requireAdminAuth, AuthenticatedRequest } from '../auth';
import { DashboardAnalytics, ReservationStatus } from '../types';

export const analyticsRouter = Router();

// ADMIN: GET /api/admin/analytics
analyticsRouter.get('/admin/analytics', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const reservations = await db.getReservations();
    const menuItems = await db.getMenuItems();
    const reviews = await db.getReviews(false);
    const activityLogs = await db.getActivityLogs(15);

    const todayStr = new Date().toISOString().split('T')[0];

    const todayReservations = reservations.filter(r => r.date === todayStr);
    const pendingReservations = reservations.filter(r => r.status === 'PENDING');
    const confirmedReservations = reservations.filter(r => r.status === 'CONFIRMED');
    const completedReservations = reservations.filter(r => r.status === 'COMPLETED');
    const cancelledReservations = reservations.filter(r => r.status === 'CANCELLED');

    const totalGuestsToday = todayReservations
      .filter(r => r.status !== 'CANCELLED' && r.status !== 'NO_SHOW')
      .reduce((sum, r) => sum + r.guests, 0);

    // Build 7-day trend (last 6 days + today)
    const weeklyTrend: { date: string; dayName: string; count: number; guests: number }[] = [];
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    for (let i = 6; i >= 0; i--) {
      const d = new Date(Date.now() - i * 86400000);
      const dateStr = d.toISOString().split('T')[0];
      const dayName = dayNames[d.getDay()];
      
      const dayReservations = reservations.filter(r => r.date === dateStr);
      const count = dayReservations.length;
      const guests = dayReservations.reduce((sum, r) => sum + r.guests, 0);

      weeklyTrend.push({
        date: dateStr,
        dayName,
        count,
        guests
      });
    }

    const statuses: ReservationStatus[] = ['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'];
    const statusDistribution = statuses.map(st => ({
      status: st,
      count: reservations.filter(r => r.status === st).length
    }));

    const analyticsData: DashboardAnalytics = {
      todayReservationsCount: todayReservations.length,
      pendingReservationsCount: pendingReservations.length,
      confirmedReservationsCount: confirmedReservations.length,
      completedReservationsCount: completedReservations.length,
      cancelledReservationsCount: cancelledReservations.length,
      totalGuestsToday,
      totalMenuItemsCount: menuItems.length,
      activeMenuCount: menuItems.filter(m => m.available).length,
      publishedReviewsCount: reviews.filter(r => r.published).length,
      weeklyTrend,
      statusDistribution,
      todayReservations: todayReservations.slice(0, 10),
      recentActivities: activityLogs
    };

    return res.json({ analytics: analyticsData });
  } catch (err) {
    console.error('Analytics calculation error:', err);
    return res.status(500).json({ error: 'Failed to compute analytics' });
  }
});

// ADMIN: GET /api/admin/activity-logs
analyticsRouter.get('/admin/activity-logs', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await db.getActivityLogs(50);
    return res.json({ logs });
  } catch (err) {
    console.error('Error fetching activity logs:', err);
    return res.status(500).json({ error: 'Failed to load activity logs' });
  }
});
