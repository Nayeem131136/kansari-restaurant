<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1210,50:a9542f,100:1a1210&height=220&section=header&text=KANSARI&fontSize=60&fontColor=F7F2EA&fontAlignY=38&desc=Contemporary%20Bangladeshi%20Dining%20%E2%80%94%20Mohammadpur%2C%20Dhaka%20%F0%9F%8D%9B&descAlignY=58&descSize=20&animation=fadeIn"/>

<br/>

[![Live Repo](https://img.shields.io/badge/🌐%20GitHub-KANSARI-a9542f?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Nayeem131136/kansari-restaurant)
&nbsp;
[![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com)
&nbsp;
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
&nbsp;
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
&nbsp;
[![License](https://img.shields.io/badge/License-MIT-a9542f?style=for-the-badge)](LICENSE)

<br/>

<img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=600&size=18&pause=1000&color=E8A874&center=true&vCenter=true&width=650&lines=Authentic+Bangladeshi+Cuisine+%F0%9F%8D%9B;WhatsApp-Powered+Ordering+%F0%9F%92%AC;Table+Reservation+System+%F0%9F%AA%91;Real-Time+Admin+Dashboard+%E2%9A%A1" alt="Typing SVG"/>

</div>

---

## 📖 About

**KANSARI** is a modern, editorial-style website for a contemporary Bangladeshi restaurant in Mohammadpur, Dhaka. The site pairs a premium customer-facing menu and reservation experience with a **WhatsApp-powered ordering flow** — no payment gateway required. Customers browse the full menu, and every dish opens a pre-filled WhatsApp message straight to the restaurant. A Supabase-backed admin dashboard manages the live menu, categories, gallery, reviews, reservations, and restaurant settings.

> *"স্বাদের শিকড়, নতুন এক আয়োজন।"*

---

## ✨ Key Features

<div align="center">

| Feature | Description |
|---|---|
| 🍽️ **Dynamic Menu System** | Categories & dishes managed live from the admin panel — name, Bengali name, price, photo, tags, availability |
| 💬 **WhatsApp Ordering** | Every dish has an "অর্ডার করুন" button that opens WhatsApp with a pre-filled order message; a floating WhatsApp button is always available |
| 🪑 **Table Reservation System** | Public booking form (name, phone, date, time, guests) with admin-side status tracking (Pending → Confirmed → Completed / Cancelled / No-show) |
| 🖼️ **Gallery with Lightbox** | Keyboard-accessible lightbox gallery of the dining room, kitchen, and dishes |
| ⭐ **Review Management** | Admin can add, edit, publish/unpublish customer reviews shown on the site |
| 📊 **Admin Dashboard** | Booking volume charts, today's covers, activity log, and quick actions |
| 🔐 **JWT Admin Auth** | Single gated admin login, bcrypt-hashed password, Supabase Row Level Security on all tables |
| ☁️ **Persistent Cloud Storage** | Admin-uploaded images go straight to Supabase Storage — no local disk dependency, safe on serverless hosting |
| 🎨 **Editorial Bengali/English UI** | Warm, premium restaurant aesthetic with scroll-reveal micro-animations and a custom cursor |

</div>

---

## 🛠️ Tech Stack

<div align="center">

![React](https://img.shields.io/badge/React%2019-61DAFB?style=flat-square&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind%20CSS%204-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)

</div>

---

## 🏗️ Project Structure

```
kansari-restaurant/
├── 🎨 src/
│   ├── components/
│   │   ├── sections/         # Navbar, Hero, InteractiveMenu, Gallery, Reservation, Footer...
│   │   ├── admin/             # AdminLogin, AdminDashboard, Menu/Reservations/Gallery views
│   │   └── ui/                 # FloatingWhatsApp, CustomCursor, ScrollProgress, PageIntro
│   ├── context/                # AuthContext, RestaurantContext, ToastContext
│   ├── config/                 # data.ts — offline fallback content
│   ├── lib/                    # api.ts client, utils
│   └── types/                  # admin.ts — shared data models
├── 🖥️ server/
│   ├── routes/                 # auth, menu, reservations, gallery, reviews, restaurant, upload
│   ├── db.ts                   # Supabase (Postgres) data layer
│   ├── supabaseClient.ts
│   └── app.ts                  # shared Express app (local dev + Vercel)
├── 🗄️ schema.sql                # Database tables (run once in Supabase)
├── 🗄️ seed.sql                  # Real menu, gallery, review seed data
├── api/index.ts                # Vercel serverless entry point
└── vercel.json
```

---

## 🔄 How It Works

```mermaid
graph LR
    A[🍽️ Browse Menu] -->|Pick a Dish| B[💬 WhatsApp Order Button]
    B -->|Pre-filled Message| C[✅ Order Sent to Restaurant]
    A --> D[🪑 Reserve a Table]
    D -->|Fill Details| E[💾 Reservation Saved — Pending]
    E -->|Real-time in Dashboard| F[🔔 Admin Notified]
    F -->|Confirm / Cancel| G[📋 Reservation Lifecycle Tracked]
```

---

## ⚙️ Installation & Setup

```bash
# 1. Clone the repository
git clone https://github.com/Nayeem131136/kansari-restaurant.git
cd kansari-restaurant

# 2. Install dependencies
npm install

# 3. Add your environment variables (create a .env file)
JWT_SECRET=your_long_random_secret
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# 4. Set up the database — in Supabase SQL Editor, run:
#    schema.sql, then seed.sql

# 5. Run locally
npm run dev
```

---

## 🚀 Deploy Your Own

```bash
# Push to GitHub
git init
git add .
git commit -m "Initial commit: KANSARI"
git branch -M main
git remote add origin https://github.com/Nayeem131136/kansari-restaurant.git
git push -u origin main
```

Then on **[vercel.com/new](https://vercel.com/new)**:
1. Import the `kansari-restaurant` repo
2. Add the three environment variables under Project Settings → Environment Variables
3. Click **Deploy** 🚀

Every push to `main` auto-redeploys. The build targets Vercel's serverless Node runtime out of the box via `vercel.json`.

---

## 🧭 Usage

| Step | Action |
|---|---|
| 1️⃣ | Customer browses the Menu, filters by category or searches a dish |
| 2️⃣ | Clicks **"হোয়াটসঅ্যাপে অর্ডার করুন"** on any dish — WhatsApp opens pre-filled with the order |
| 3️⃣ | Or fills the **Reservation** form — name, phone, date, time, guest count |
| 4️⃣ | Reservation is saved as Pending, confirmation follows by phone/WhatsApp |
| 5️⃣ | Admin logs into `/#admin`, sees the new reservation on the Dashboard |
| 6️⃣ | Admin confirms/cancels the booking, manages menu items, gallery, and reviews |

---

## 🗺️ Roadmap

- [ ] Full cart + checkout system with bKash/Nagad payment integration
- [ ] QR-code table menu for in-restaurant ordering
- [ ] Bengali/English full language toggle
- [ ] Delivery zone & charge calculator
- [ ] Customer loyalty / discount code system

---

## 👤 Developer

<div align="center">

| Name | Role | GitHub |
|---|---|---|
| **Md. Mahdi Hasan Nayeem** | 🏆 Creator & Developer | [@Nayeem131136](https://github.com/Nayeem131136) |

**Portfolio:** [mahdi-hasan-nayeem-portfolio.vercel.app](https://mahdi-hasan-nayeem-portfolio.vercel.app/)

</div>

---

<div align="center">

<img width="100%" src="https://capsule-render.vercel.app/api?type=waving&color=0:1a1210,50:a9542f,100:1a1210&height=120&section=footer"/>

**⭐ Star this repo if it helped you! | 🍴 Fork to build your own**

[![GitHub stars](https://img.shields.io/github/stars/Nayeem131136/kansari-restaurant?style=social)](https://github.com/Nayeem131136/kansari-restaurant/stargazers)
&nbsp;
[![GitHub forks](https://img.shields.io/github/forks/Nayeem131136/kansari-restaurant?style=social)](https://github.com/Nayeem131136/kansari-restaurant/network/members)

*Built with 🖤 by Md. Mahdi Hasan Nayeem*

</div>
