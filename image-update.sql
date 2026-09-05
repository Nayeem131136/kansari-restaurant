-- Kansari Restaurant — Real image update
-- Run this in Supabase SQL Editor AFTER uploading the images from
-- kansari-images-for-supabase-upload.zip to the 'kansari-uploads' bucket.

-- Menu item photos (20 dishes)
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/grand-kansari-mutton-kacchi.jpg' where name = 'Grand Kansari Mutton Kacchi';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/authentic-chittagong-kala-bhuna.jpg' where name = 'Authentic Chittagong Kala Bhuna';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/padma-river-shorshe-ilish.jpg' where name = 'Padma River Shorshe Ilish';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/biyer-barir-shahi-chicken-roast.jpg' where name = 'Biyer Barir Shahi Chicken Roast';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/puran-dhaka-shorshe-beef-tehari.jpg' where name = 'Puran Dhaka Shorshe Beef Tehari';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/golda-chingri-malai-curry.jpg' where name = 'Golda Chingri Malai Curry';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/royal-mughlai-mutton-rezala.jpg' where name = 'Royal Mughlai Mutton Rezala';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/bhuna-khichuri-with-beef-kosha.jpg' where name = 'Bhuna Khichuri with Beef Kosha';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/heritage-panch-bhorta-platter.jpg' where name = 'Heritage Panch Bhorta Platter';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/dhakai-shahi-morog-polao.jpg' where name = 'Dhakai Shahi Morog Polao';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/crispy-pan-fried-silver-rupchanda.jpg' where name = 'Crispy Pan-Fried Silver Rupchanda';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/special-crispy-fuchka-platter.jpg' where name = 'Special Crispy Fuchka Platter';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/crispy-beguni-piyaju-basket.jpg' where name = 'Crispy Beguni & Piyaju Basket';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/puran-dhaka-shami-kabab-2-pcs.jpg' where name = 'Puran Dhaka Shami Kabab (2 Pcs)';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/shahi-dhakai-borhani.jpg' where name = 'Shahi Dhakai Borhani';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/pora-kancha-aamer-panna.jpg' where name = 'Pora Kancha Aamer Panna';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/authentic-bogurar-sura-mishti-doi.jpg' where name = 'Authentic Bogurar Sura Mishti Doi';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/shahi-zafrani-firni-in-matir-patro.jpg' where name = 'Shahi Zafrani Firni in Matir Patro';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/comillar-khas-rosomalai-2-pcs.jpg' where name = 'Comillar Khas Rosomalai (2 Pcs)';
update menu_items set image = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/shahi-tukra-with-malai-rabri.jpg' where name = 'Shahi Tukra with Malai Rabri';

-- Gallery photos — 5 unique restaurant-ambiance photos.
-- (hero-section.jpg is used separately as the homepage hero background,
-- so it is intentionally NOT reused here to avoid a duplicate-image issue.)
update gallery set url = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/dining-room.jpg' where id = 'g1';
update gallery set url = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/kitchen-cooking-process.jpg' where id = 'g2';
update gallery set url = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/exterior-signage-close-up.jpg', title = 'The Kansari Mark', bengali = 'কাঁসারীর ঐতিহ্যবাহী প্রতীক' where id = 'g3';
delete from gallery where id = 'g4'; -- no unique remaining photo for this slot
update gallery set url = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/spices.jpg' where id = 'g5';
update gallery set url = 'https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/hospitality-moment.jpg' where id = 'g6';
