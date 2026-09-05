import { Router, Response } from 'express';
import multer from 'multer';
import { requireAdminAuth, AuthenticatedRequest } from '../auth';
import { supabase, UPLOADS_BUCKET } from '../supabaseClient';

export const uploadRouter = Router();

// Files are held in memory only just long enough to forward them to
// Supabase Storage — nothing is written to local/serverless disk, so this
// works identically on Vercel and in local dev, and uploaded images
// persist permanently (unlike the old local-disk approach).
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 8 * 1024 * 1024 // 8MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/jpg'];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Allowed: JPG, PNG, WEBP, GIF.'));
    }
  }
});

let bucketEnsured = false;
async function ensureBucketExists() {
  if (bucketEnsured) return;
  const { data: buckets, error } = await supabase.storage.listBuckets();
  if (error) {
    console.error('Failed to list Supabase storage buckets:', error);
    return; // Fall through — the upload call below will surface a clearer error if the bucket truly is missing.
  }
  const exists = buckets?.some((b) => b.name === UPLOADS_BUCKET);
  if (!exists) {
    const { error: createError } = await supabase.storage.createBucket(UPLOADS_BUCKET, {
      public: true,
      fileSizeLimit: '8MB',
    });
    if (createError) {
      console.error('Failed to auto-create Supabase storage bucket:', createError);
    }
  }
  bucketEnsured = true;
}

// ADMIN: POST /api/admin/upload
uploadRouter.post('/admin/upload', requireAdminAuth, upload.single('image'), async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided' });
    }

    await ensureBucketExists();

    const ext = (req.file.originalname.split('.').pop() || 'jpg').toLowerCase();
    const cleanName = req.file.originalname
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const storagePath = `${cleanName || 'food'}-${uniqueSuffix}.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from(UPLOADS_BUCKET)
      .upload(storagePath, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false,
      });

    if (uploadError) {
      console.error('Supabase storage upload error:', uploadError);
      return res.status(500).json({ error: 'Image upload failed while saving to storage.' });
    }

    const { data: publicUrlData } = supabase.storage.from(UPLOADS_BUCKET).getPublicUrl(storagePath);

    return res.status(201).json({
      success: true,
      url: publicUrlData.publicUrl,
      filename: storagePath,
      size: req.file.size
    });
  } catch (err: any) {
    console.error('Upload handling error:', err);
    return res.status(500).json({ error: err.message || 'Image upload failed' });
  }
});
