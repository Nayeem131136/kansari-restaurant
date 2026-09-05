-- Kansari Restaurant — Add "Grand Kansari Thali" gallery photo
-- Run this in Supabase SQL Editor AFTER uploading grand-kansari-thali.jpg
-- to the 'kansari-uploads' bucket (it's included in the latest
-- kansari-images-for-supabase-upload.zip).

insert into gallery (id, url, title, bengali, aspect, sort_order, featured) values
  ('g7', 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/grand-kansari-thali.jpg', 'The Grand Kansari Thali', 'ঐতিহ্যবাহী কাঁসার পাত্রে পরিবেশন', 'square', 4, true)
on conflict (id) do update set
  url = excluded.url,
  title = excluded.title,
  bengali = excluded.bengali,
  aspect = excluded.aspect,
  sort_order = excluded.sort_order,
  featured = excluded.featured;
