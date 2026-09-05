// Master Template Data Configuration for KANSARI (Authentic Contemporary BD Cuisine)
export interface MenuItem {
  id: string;
  name: string;
  bengaliName: string;
  price: string;
  description: string;
  bengaliDescription: string;
  image: string;
  tag?: string;
  badge?: string;
}

export const siteConfig = {
  restaurant: {
    name: "KANSARI",
    bengaliName: "কাঁসারী",
    tagline: "স্বাদের শিকড়। নতুন এক আয়োজন।",
    englishTagline: "Authentic Bangali flavours, thoughtfully crafted.",
    description: "মাটির কাছাকাছি খাঁটি বাংলাদেশি স্বাদ, আধুনিক পরিপাটি পরিবেশে—ঢাকার হৃদয়ে এক নতুন খাবারের অভিজ্ঞতা।",
    englishDescription: "At Kansari, time-honoured Bangladeshi culinary traditions meet contemporary culinary finesse. Celebrating genuine heritage recipes in Dhaka.",
    location: "Mohammadpur, Dhaka",
    address: "House 14, Road 4, Ring Road\nMohammadpur, Dhaka 1207, Bangladesh",
    phone: "+880 1740 527078",
    whatsapp: "+880 1740 527078",
    hours: [
      { days: "Saturday – Thursday", time: "11:30 AM – 11:00 PM" },
      { days: "Friday", time: "1:30 PM – 11:30 PM" }
    ],
    socials: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com"
    }
  },

  signatureDishes: [
    {
      id: "sd1",
      name: "KANSARI KACCHI BIRYANI",
      bengaliName: "কাঁসারী খাসির কাচ্চি",
      price: "৳৪৮০",
      description: "Slow-cooked mutton marinated overnight with fragrant chinigura rice, whole potatoes, saffron, and pure ghee in traditional sealed degchi.",
      bengaliDescription: "১২ ঘণ্টার ধীর আঁচে রান্না—চিনিগুঁড়া চাল, জাফরানের সুবাস আর মাখনের মতো নরম খাসির মাংসের অবিস্মরণীয় মেলবন্ধন।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/grand-kansari-mutton-kacchi.jpg",
      tag: "SIGNATURE MASTERPIECE"
    },
    {
      id: "sd2",
      name: "DHAKAI BEEF KALA BHUNA",
      bengaliName: "ঢাকাই বিফ কালাভুনা",
      price: "৳৫২০",
      description: "Rich, dark, and intensely caramelized beef curry braised with traditional whole roasted spices, mustard oil, and fried onions.",
      bengaliDescription: "চট্টগ্রাম ও পুরান ঢাকার সনাতন কায়দায় ভাজা মসলার গাঢ় সুবাসে তৈরি রসে ভরা খাঁটি কালো ভুনা।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/authentic-chittagong-kala-bhuna.jpg",
      tag: "SLOW BRAISED"
    },
    {
      id: "sd3",
      name: "BHAPA SHORSHE ILISH",
      bengaliName: "ভাপা সরিষা ইলিশ",
      price: "৳৬৫০",
      description: "Fresh Padma River Hilsa fish steamed gently with stone-ground yellow mustard paste, green chilies, and virgin mustard oil.",
      bengaliDescription: "শিল-পাটায় বাটা হলুদ সরিষা ও কাঁচামরিচে ভাপানো পদ্মার রূপালী ইলিশের রাজকীয় স্বাদ।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/padma-river-shorshe-ilish.jpg",
      tag: "PADMA SPECIAL"
    },
    {
      id: "sd4",
      name: "BIYER BARIR CHICKEN ROAST",
      bengaliName: "বিয়ের বাড়ির স্পেশাল চিকেন রোস্ট",
      price: "৳৩৯০",
      description: "Desi farm chicken gently braised in thick yogurt gravy, fried cashew paste, mawa, and aromatic whole garam masala.",
      bengaliDescription: "খাঁটি ঘি, বাদাম বাটা আর টক দইয়ের ঘন সোনালী গ্রেভিতে তৈরি ঐতিহ্যবাহী বিয়ের বাড়ির চিকেন রোস্ট।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/biyer-barir-shahi-chicken-roast.jpg",
      tag: "HOUSE FAVORITE"
    }
  ],

  // Comprehensive Single All-Items Showcase (No Category Barrier, Item-wise curated raw photography)
  allItems: [
    // 1. Kacchi Biryani
    {
      id: "item-1",
      name: "Grand Kansari Mutton Kacchi",
      bengaliName: "গ্র্যান্ড কাঁসারী খাসির কাচ্চি",
      price: "৳৫৮০",
      description: "Slow-cooked tender mutton layered with aromatic chinigura rice, aloo bukhara, saffron, and ghee.",
      bengaliDescription: "১২ ঘণ্টার ধীর আঁচে দম দেওয়া—ঘিয়ে ভাজা আলু, জাফরান চাল আর নরম তুলতুলে খাসির মাংসের অবিস্মরণীয় স্বাদ।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/grand-kansari-mutton-kacchi.jpg",
      tag: "SIGNATURE",
      badge: "জনপ্রিয় সেরা"
    },
    // 2. Kala Bhuna
    {
      id: "item-2",
      name: "Authentic Chittagong Kala Bhuna",
      bengaliName: "চট্টগ্রামের সনাতন কালাভুনা",
      price: "৳৫৬০",
      description: "Prime beef slow-roasted in cast iron with mustard oil, dried red chillies, and 18 aromatic spices.",
      bengaliDescription: "ঘণ্টার পর ঘণ্টা কষানো কুচকুচে কালো মাংসের খাঁটি ঐতিহ্যবাহী মসলাদার স্বাদ ও তীব্র সুবাস।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/authentic-chittagong-kala-bhuna.jpg",
      tag: "SLOW COOKED",
      badge: "সনাতন ঐতিহ্য"
    },
    // 3. Shorshe Ilish
    {
      id: "item-3",
      name: "Padma River Shorshe Ilish",
      bengaliName: "পদ্মার তাজা ভাপা সরিষা ইলিশ",
      price: "৳৯৫০",
      description: "Fresh Padma River Hilsa fish steamed with stone-ground yellow mustard paste and green chilies.",
      bengaliDescription: "শিল-পাটায় বাটা ঝাঁঝালো সরিষা বাটা ও কাঁচামরিচের খাঁটি সরিষার তেলে ভাপানো পদ্মার রূপালী ইলিশ।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/padma-river-shorshe-ilish.jpg",
      tag: "FRESH RIVER CATCH",
      badge: "পদ্মার তাজা ইলিশ"
    },
    // 4. Biyer Barir Chicken Roast
    {
      id: "item-4",
      name: "Biyer Barir Shahi Chicken Roast",
      bengaliName: "বিয়ের বাড়ির শাহি চিকেন রোস্ট",
      price: "৳৩৯০",
      description: "Quarter chicken leg cooked in a rich, mild yogurt, cashew, and mawa gravy with fried onions.",
      bengaliDescription: "খাঁটি গাওয়া ঘি, টকদই, বাদাম বাটা আর বেরেস্তার মিষ্টি সোনালী গ্রেভিতে ডুবানো দেশি মুরগির রোস্ট।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/biyer-barir-shahi-chicken-roast.jpg",
      tag: "TRADITIONAL",
      badge: "বিয়ে বাড়ির স্বাদ"
    },
    // 5. Beef Tehari
    {
      id: "item-5",
      name: "Puran Dhaka Shorshe Beef Tehari",
      bengaliName: "পুরান ঢাকার সরিষার তেলের বিফ তেহারি",
      price: "৳৩৯০",
      description: "Aromatic chinigura rice and tender beef cubes cooked together in pure mustard oil and green chillies.",
      bengaliDescription: "ঝাঁঝালো সরিষার তেলে সুগন্ধি চিনিগুঁড়া চাল ও নরম গরুর মাংসের টুকরো দিয়ে রান্না করা আসল ঢাকাই তেহারি।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/puran-dhaka-shorshe-beef-tehari.jpg",
      tag: "MUSTARD OIL",
      badge: "ঢাকাই ঐতিহ্য"
    },
    // 6. Golda Chingri Malai Curry
    {
      id: "item-6",
      name: "Golda Chingri Malai Curry",
      bengaliName: "গলদা চিংড়ির মালাইকারি",
      price: "৳৬৮০",
      description: "Jumbo fresh-water tiger prawns braised in thick creamy coconut milk, mild spices, and ghee.",
      bengaliDescription: "ঘন নারিকেলের দুধ, খাঁটি ঘি আর মিষ্টি মসলার রাজকীয় মালাই গ্রেভিতে তৈরি জাম্বো গলদা চিংড়ি।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/golda-chingri-malai-curry.jpg",
      tag: "CREAMY DELIGHT",
      badge: "রাজকীয় পদ"
    },
    // 7. Shahi Mutton Rezala
    {
      id: "item-7",
      name: "Royal Mughlai Mutton Rezala",
      bengaliName: "শাহী মোঘলাই মাটন রেজালা",
      price: "৳৫৬০",
      description: "Tender goat meat cooked in silky white gravy of poppy seed paste, yogurt, kewra water, and makhana.",
      bengaliDescription: "পোস্ত বাটা, টকদই, জয়ত্রী আর কেওড়ার সুবাসিত সাদা গ্রেভিতে রান্না করা নরম তুলতুলে খাসির রেজালা।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/royal-mughlai-mutton-rezala.jpg",
      tag: "ROYAL GRAVY",
      badge: "মোঘলাই রেসিপি"
    },
    // 8. Bhuna Khichuri with Beef Kosha
    {
      id: "item-8",
      name: "Bhuna Khichuri with Beef Kosha",
      bengaliName: "ভুনা খিচুড়ি সাথে বিফ কষা",
      price: "৳৪৩০",
      description: "Yellow moong dal and chinigura rice slow-cooked with ghee, paired with tender rich beef kosha.",
      bengaliDescription: "ঘিয়ে ভাজা সোনা মুগ ডাল ও সুগন্ধি চালের ঝরঝরে খিচুড়ির সাথে মুখে মিলিয়ে যাওয়া ঝাল গরুর মাংস।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/bhuna-khichuri-with-beef-kosha.jpg",
      tag: "COMFORT CLASSIC",
      badge: "বৃষ্টি ও শীতের তৃপ্তি"
    },
    // 9. Panch Bhorta Platter
    {
      id: "item-9",
      name: "Heritage Panch Bhorta Platter",
      bengaliName: "ঐতিহ্যবাহী ৫ পদের ভর্তা থালি",
      price: "৳২৫০",
      description: "Assortment of Aloo, Begun, Chingri, Tomato, and Kalijira Bhortas mashed with raw mustard oil and fried chillies.",
      bengaliDescription: "শিল-পাটায় বাটা আলু, পোড়া বেগুন, চিংড়ি, টমেটো ও কালিজিরা ভর্তার সাথে খাঁটি কাঁচা সরিষার তেল।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/heritage-panch-bhorta-platter.jpg",
      tag: "STONE GROUND",
      badge: "বাঙালির প্রাণের স্বাদ"
    },
    // 10. Shahi Morog Polao
    {
      id: "item-10",
      name: "Dhakai Shahi Morog Polao",
      bengaliName: "ঢাকাই শাহী মোরগ পোলাও",
      price: "৳৪২০",
      description: "Fragrant Kalijira rice served with spiced juicy quarter chicken, boiled egg, and sweet golden beresta.",
      bengaliDescription: "গাওয়া ঘিয়ে ভাজা কালিজিরা চালের সুগন্ধি পোলাও এবং ঐতিহ্যবাহী কায়দায় রাঁধা মোরগের নরম মাংস।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/dhakai-shahi-morog-polao.jpg",
      tag: "BESTSELLER",
      badge: "আসল পোলাও"
    },
    // 11. Crispy Rupchanda Fry
    {
      id: "item-11",
      name: "Crispy Pan-Fried Silver Rupchanda",
      bengaliName: "মচমচে রূপচাঁদা ফ্রাই",
      price: "৳৫৮০",
      description: "Whole silver Pomfret marinated with fresh turmeric, red chili paste, and pan-fried crisp with onion relish.",
      bengaliDescription: "কাঁচামরিচ, হলুদ ও লেবুর রসে মেখে কড়কড়ে ভাজা আস্ত রূপচাঁদা মাছ, সাথে পেঁয়াজ-মরিচ ভাঁজা।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/crispy-pan-fried-silver-rupchanda.jpg",
      tag: "CRISPY SEAFOOD",
      badge: "তাজা মাছ"
    },
    // 12. Crispy Fuchka Platter
    {
      id: "item-12",
      name: "Special Crispy Fuchka Platter",
      bengaliName: "স্পেশাল মুচমুচে ফুচকা প্লাটার",
      price: "৳১৬০",
      description: "Handcrafted crispy puri shells stuffed with spiced yellow peas and served with spicy-sour tamarind water.",
      bengaliDescription: "মুচমুচে পুরির ভেতরে ঝাল ডাবলি ঘুঘনি, ডিম কুচি আর জিভে জল আনা খাঁটি টক-মিষ্টি তেঁতুল জল।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/special-crispy-fuchka-platter.jpg",
      tag: "STREET SPECIAL",
      badge: "জিভে জল আনা"
    },
    // 13. Beguni & Piyaju Basket
    {
      id: "item-13",
      name: "Crispy Beguni & Piyaju Basket",
      bengaliName: "মুচমুচে বেগুনী ও ডাল পেঁয়াজু",
      price: "৳১৪০",
      description: "Thinly sliced eggplant and crunchy red lentil fritters spiced with carom seeds and rock salt.",
      bengaliDescription: "মচমচে বেসনে ভাজা বেগুনী ও মুসুর ডালের গরম পেঁয়াজু—বিকেলের আড্ডার প্রিয় সঙ্গী।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/crispy-beguni-piyaju-basket.jpg",
      tag: "CRUNCHY",
      badge: "মুচমুচে স্ন্যাক্স"
    },
    // 14. Shami Kabab
    {
      id: "item-14",
      name: "Puran Dhaka Shami Kabab (2 Pcs)",
      bengaliName: "পুরান ঢাকার স্পেশাল শামী কাবাব",
      price: "৳২০০",
      description: "Melt-in-the-mouth minced beef patties cooked with chana dal, fresh mint, and whole roasted spices.",
      bengaliDescription: "মিহি মাংসের কিমা ও ছোলার ডালের সাথে ভাজা জিরার মিশ্রণে তৈরি মুখে গলে যাওয়া শামী কাবাব।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/puran-dhaka-shami-kabab-2-pcs.jpg",
      tag: "HANDCRAFTED",
      badge: "কাবাব স্পেশাল"
    },
    // 15. Shahi Dhakai Borhani
    {
      id: "item-15",
      name: "Shahi Dhakai Borhani",
      bengaliName: "শাহী পুরান ঢাকার বোরহানি",
      price: "৳১৩০",
      description: "Traditional spiced yogurt beverage blended with mint, coriander, roasted cumin, black salt, and green chilli.",
      bengaliDescription: "টকদই, পুদিনা পাতা, বিট লবণ ও ভাজা জিরার মিশ্রণে তৈরি কাচ্চি বিরিয়ানির আসল ঢাকাই বোরহানি।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/shahi-dhakai-borhani.jpg",
      tag: "DIGESTIVE REFRESHER",
      badge: "খাঁটি বোরহানি"
    },
    // 16. Kancha Aamer Panna
    {
      id: "item-16",
      name: "Pora Kancha Aamer Panna",
      bengaliName: "পোড়া কাঁচা আমের পন্না শরবত",
      price: "৳১২০",
      description: "Fire-roasted raw green mango pulp blended with pink salt, roasted cumin, and crushed ice.",
      bengaliDescription: "আগুনে পোড়ানো কাঁচা আমের টক-মিষ্টি পাল্প, পুদিনা আর বরফ কুচিতে মন-প্রাণ জুড়ানো শরবত।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/pora-kancha-aamer-panna.jpg",
      tag: "CHILLED",
      badge: "প্রাণ জুড়ানো"
    },
    // 17. Bogurar Mishti Doi
    {
      id: "item-17",
      name: "Authentic Bogurar Sura Mishti Doi",
      bengaliName: "ঐতিহ্যবাহী বগুড়ার সরা-দই",
      price: "৳১৭০",
      description: "Authentic caramelized sweetened baked yogurt matured slowly in natural earthenware pots.",
      bengaliDescription: "মাটির সরায় তৈরি বগুড়ার খাঁটি ঘন লাল মিষ্টি দই—ঘন সরের পরতে ভোজের রাজকীয় সমাপ্তি।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/authentic-bogurar-sura-mishti-doi.jpg",
      tag: "CLAY POT MATURED",
      badge: "বগুড়ার আসল দই"
    },
    // 18. Zafrani Firni
    {
      id: "item-18",
      name: "Shahi Zafrani Firni in Matir Patro",
      bengaliName: "মাটির পাত্রে শাহী জাফরানি ফিরনি",
      price: "৳১৬০",
      description: "Aromatic chinigura rice pudding cooked in thickened milk with Iranian saffron, pistachios, and silver leaf.",
      bengaliDescription: "জাফরানের সোনালী আভা, কাঠবাদাম ও পেস্তা কুচিতে সাজানো মাটির সানকির সুস্বাদু ক্ষীর-ফিরনি।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/shahi-zafrani-firni-in-matir-patro.jpg",
      tag: "SAFFRON DESSERT",
      badge: "শাহী মিষ্টান্ন"
    },
    // 19. Comillar Rosomalai
    {
      id: "item-19",
      name: "Comillar Khas Rosomalai (2 Pcs)",
      bengaliName: "কুমিল্লার স্পেশাল খাঁটি রসমলাই",
      price: "৳১৯০",
      description: "Soft fresh cottage cheese dumplings simmered in luscious condensed cardamom milk.",
      bengaliDescription: "তাজা ছানার নরম তুলতুলে রসগোল্লা আর এলাচের ঘ্রাণের ঘন ক্ষীরের তৈরি কুমিল্লার আসল রসমলাই।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/comillar-khas-rosomalai-2-pcs.jpg",
      tag: "SWEET MASTERPIECE",
      badge: "কুমিল্লার রসমলাই"
    },
    // 20. Shahi Tukra
    {
      id: "item-20",
      name: "Shahi Tukra with Malai Rabri",
      bengaliName: "শাহী টুকরা ও মালাই রাবড়ি",
      price: "৳২০০",
      description: "Ghee-crisped brioche soaked in saffron cardamom syrup, drenched with slow-reduced thick malai rabri.",
      bengaliDescription: "ঘিয়ে ভাজা মুচমুচে টোস্টে জাফরানি রস ও ঘন দুধের মালাই রাবড়ির অতুলনীয় মোঘলাই মিষ্টি।",
      image: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/shahi-tukra-with-malai-rabri.jpg",
      tag: "ROYAL SWEET",
      badge: "মোঘলাই মিষ্টান্ন"
    }
  ],

  gallery: [
    { id: "g1", url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/dining-room.jpg", title: "The Dining Room", bengali: "শান্ত ও রুচিশীল সান্ধ্যকালীন আবহ", aspect: "video" },
    { id: "g2", url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/kitchen-cooking-process.jpg", title: "Slow-Cooked Kacchi", bengali: "দম কাচ্চির সুবাস ও জাফরানি চাল", aspect: "portrait" },
    { id: "g3", url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/exterior-signage-close-up.jpg", title: "The Kansari Mark", bengali: "কাঁসারীর ঐতিহ্যবাহী প্রতীক", aspect: "square" },
    { id: "g5", url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/spices.jpg", title: "Artisanal Spices", bengali: "শিল-পাটায় বাটা খাঁটি মসলার জাদু", aspect: "video" },
    { id: "g6", url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/hospitality-moment.jpg", title: "Hospitality & Details", bengali: "আন্তরিক সেবা ও যত্নশীল আতিথেয়তা", aspect: "square" },
    { id: "g7", url: "https://gdkqlzggyhzznomnmsvr.supabase.co/storage/v1/object/public/kansari-uploads/grand-kansari-thali.jpg", title: "The Grand Kansari Thali", bengali: "ঐতিহ্যবাহী কাঁসার পাত্রে পরিবেশন", aspect: "square" },
  ],

  reviews: [
    {
      id: "r1",
      name: "তাহসান রহমান (Tahsan Rahman)",
      text: "কাচ্চি বিরিয়ানির মাংস এত তুলতুলে আর চালের সুবাস চমৎকার! ঢাকার ভেতরে খাঁটি বাংলাদেশি ঐতিহ্যবাহী খাবারের জন্য কাঁসারী অনন্য।",
      date: "অক্টোবর ২০২৫"
    },
    {
      id: "r2",
      name: "নুসরাত জাহান (Nusrat Jahan)",
      text: "কালাভুনা এবং সরিষা ইলিশ অসাধারণ লেগেছে। কাঁসার পাত্রে গরম গরম পরিবেশন আর পারিবারিক পরিবেশ মন কেড়ে নেওয়ার মতো।",
      date: "সেপ্টেম্বর ২০২৫"
    },
    {
      id: "r3",
      name: "ইফতেখার আহমেদ (Iftekhar Ahmed)",
      text: "পরিপাটি ও রুচিশীল ডাইনিং। প্রতিটি পদে খাঁটি স্বাদ ধরে রাখা হয়েছে। বিশেষ করে বিয়ের বাড়ির মোরগ পোলাও আর বোরহানি ছিল দারুণ।",
      date: "নভেম্বর ২০২৫"
    },
    {
      id: "r4",
      name: "সাবরিনা চৌধুরী (Sabrina Chowdhury)",
      text: "বগুড়ার দই আর জাফরানি ফিরনি দিয়ে ভোজ শেষ করার অনুভূতি ছিল অতুলনীয়। কর্মীদের ব্যবহারও অত্যন্ত আন্তরিক ও অমায়িক।",
      date: "ডিসেম্বর ২০২৫"
    }
  ]
};
