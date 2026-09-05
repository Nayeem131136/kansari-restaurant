import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db';
import { generateToken, requireAdminAuth, AuthenticatedRequest } from '../auth';

export const authRouter = Router();

// POST /api/auth/login
authRouter.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const admin = await db.getAdminUser();
    if (email.trim().toLowerCase() !== admin.email.toLowerCase()) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    // Update last login
    await db.updateAdminUser({ lastLogin: new Date().toISOString() });
    await db.logActivity({
      action: 'ADMIN_LOGIN',
      description: `Admin ${admin.email} logged in successfully`,
      userEmail: admin.email,
      entityType: 'AUTH'
    });

    const token = generateToken({ id: admin.id, email: admin.email, role: admin.role });

    return res.json({
      token,
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Authentication failed due to internal error' });
  }
});

// GET /api/auth/me
authRouter.get('/me', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const admin = await db.getAdminUser();
    return res.json({
      user: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
        lastLogin: admin.lastLogin
      }
    });
  } catch (err) {
    console.error('Get admin user error:', err);
    return res.status(500).json({ error: 'Failed to load admin profile' });
  }
});

// POST /api/auth/update-profile
authRouter.post('/update-profile', requireAdminAuth, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, email, currentPassword, newPassword } = req.body;
    const admin = await db.getAdminUser();

    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, admin.passwordHash);
      if (!isMatch) {
        return res.status(400).json({ error: 'Current password does not match' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'New password must be at least 6 characters long' });
      }
      const salt = await bcrypt.genSalt(10);
      const newHash = await bcrypt.hash(newPassword, salt);
      await db.updateAdminUser({ passwordHash: newHash });
    }

    if (name || email) {
      await db.updateAdminUser({
        name: name ? name.trim() : admin.name,
        email: email ? email.trim().toLowerCase() : admin.email
      });
    }

    const updated = await db.getAdminUser();
    await db.logActivity({
      action: 'ADMIN_PROFILE_UPDATED',
      description: `Admin profile/credentials updated for ${updated.email}`,
      userEmail: updated.email,
      entityType: 'AUTH'
    });

    const token = generateToken({ id: updated.id, email: updated.email, role: updated.role });

    return res.json({
      success: true,
      token,
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        role: updated.role,
        lastLogin: updated.lastLogin
      }
    });
  } catch (err) {
    console.error('Update profile error:', err);
    return res.status(500).json({ error: 'Failed to update admin profile' });
  }
});
