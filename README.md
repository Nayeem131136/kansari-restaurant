<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1210,50:a9542f,100:1a1210&height=220&section=header&text=KANSARI&fontSize=60&fontColor=F7F2EA&fontAlignY=38&desc=Contemporary%20Bangladeshi%20Dining%20%E2%80%94%20Mohammadpur%2C%20Dhaka%20%F0%9F%8D%9B&descAlignY=58&descSize=20&animation=fadeIn"/>

<br/>

[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
&nbsp;
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
&nbsp;
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)

</div>

---

## 📖 About

**KANSARI** is a modern, editorial-style website for a contemporary Bangladeshi restaurant in Mohammadpur, Dhaka. The site pairs a premium customer-facing menu and reservation experience with a **WhatsApp-powered ordering flow**. An admin dashboard manages the live menu, categories, gallery, reviews, and reservations.

**Architecture note:** this app talks to Supabase **directly from the browser** — there is no custom backend server. Security is enforced by Postgres Row Level Security (RLS) policies and Supabase Auth. This keeps deployment to Vercel simple and reliable (a plain static site, no serverless functions to misconfigure).

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🍽️ **Dynamic Menu System** | Categories & dishes managed live from the admin panel |
| 💬 **WhatsApp Ordering** | Every dish opens WhatsApp with a pre-filled order message |
| 🪑 **Table Reservations** | Public booking form with admin-side status tracking |
| 🖼️ **Gallery with Lightbox** | Keyboard-accessible lightbox gallery |
| ⭐ **Review Management** | Admin can add/edit/publish customer reviews |
| 📊 **Admin Dashboard** | Booking trends, today's covers, activity log |
| 🔐 **Supabase Auth Login** | Single gated admin login, enforced by RLS |
| ☁️ **Direct Cloud Storage** | Admin-uploaded images go straight to Supabase Storage from the browser |

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

---

## 🏗️ Project Structure

```
kansari-restaurant/
├── src/
│   ├── components/
│   │   ├── sections/         # Navbar, Hero, InteractiveMenu, Gallery, Reservation...
│   │   ├── admin/             # AdminLogin, AdminDashboard, Menu/Reservations/Gallery views
│   │   └── ui/                 # FloatingWhatsApp, CustomCursor, ScrollProgress...
│   ├── context/                # AuthContext (Supabase Auth), RestaurantContext, ToastContext
│   ├── lib/
│   │   ├── api.ts              # All Supabase queries live here
│   │   └── supabaseClient.ts   # Browser Supabase client (anon key)
│   └── types/                  # admin.ts — shared data models
├── supabase-schema.sql         # Tables + RLS policies + storage bucket (run FIRST)
├── seed.sql                    # Real menu, gallery, review data (run SECOND)
└── vercel.json
```

---

## ⚙️ One-time Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com).
2. **SQL Editor → New query** → paste and run **`supabase-schema.sql`**. This creates every table, the Row Level Security policies, and the `kansari-uploads` storage bucket.
3. Run **`seed.sql`** the same way — loads the real menu, categories, gallery, and reviews.
4. **Authentication → Providers** → make sure **Email** is enabled.
5. **Authentication → Users → Add user** → create the admin login:
   - Email: `kansari@nayeem.com`
   - Password: choose your own
   - **Auto Confirm User: ON** (so you don't need to click an email link)
6. **Settings → API** → copy the **Project URL** and the **anon / public** key (not `service_role` — this app only ever uses the public key, safe to expose in the browser).

If you ever add a second admin, also add their email to the `is_admin()` function inside `supabase-schema.sql` and re-run that one function definition.

---

## 🚀 Run Locally

```bash
npm install
cp .env.example .env.local
# fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env.local
npm run dev
```

Admin panel: `http://localhost:5173/admin` (or press **Alt+A**).

---

## 🚀 Deploy to Vercel

1. Push this project to a GitHub repo.
2. [vercel.com/new](https://vercel.com/new) → Import the repo.
3. Vercel auto-detects the Vite build from `vercel.json` — nothing to change.
4. Add environment variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
5. **Deploy.**

No serverless functions, no Node runtime to configure — it's a static site, so there's nothing else to get wrong here.

---

## 🗺️ Roadmap

- [ ] Full cart + checkout system with bKash/Nagad payment integration
- [ ] QR-code table menu for in-restaurant ordering
- [ ] Bengali/English full language toggle
- [ ] Delivery zone & charge calculator

---

## 👤 Developer

<div align="center">

| Name | Role |
|---|---|
| **Md. Mahdi Hasan Nayeem** | Creator & Developer |

</div>

---

<div align="center">
<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1210,50:a9542f,100:1a1210&height=120&section=footer"/>
</div>
