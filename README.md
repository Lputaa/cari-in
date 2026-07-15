<![CDATA[<div align="center">

# 🎯 Cari-in

### *"Kehilangan sesuatu? Cari-in ajaa."*

Platform **Lost & Found anonim** berbasis web untuk civitas kampus.
Laporkan barang hilang atau temuan — bantu sesama tanpa buka identitas.

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ecf8e?style=flat-square&logo=supabase&logoColor=white)](https://supabase.com)
[![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)](https://vercel.com)

</div>

---

## 📖 Tentang

Di kampus, informasi barang hilang biasanya tersebar di grup WhatsApp — cepat tenggelam, tidak terorganisir, dan sulit dicari kembali. **Cari-in** memecahkan masalah ini dengan menyediakan papan pengumuman digital yang:

- **Terpusat** — satu tempat untuk semua laporan hilang & temuan
- **Anonim** — identitas terlindungi, hanya Anonymous ID yang terlihat
- **Mudah dicari** — filter berdasarkan kategori, lokasi, dan status
- **Community-driven** — siapa saja bisa membantu mengembalikan barang

---

## ✨ Fitur

| Fitur | Deskripsi |
|-------|-----------|
| 🔐 **Google Login** | Autentikasi aman via Google, identitas anonim otomatis |
| 📝 **Compose Inline** | Buat postingan langsung di feed — ala X/Facebook |
| 🔴🟢 **Lost / Found** | Toggle icon untuk pilih jenis laporan |
| 🖼️ **Upload Gambar** | Maksimal 3 foto per postingan, preview full-screen |
| 🔍 **Search & Filter** | Cari judul, filter kategori, lokasi, status |
| 💬 **Komentar** | Diskusi anonim dengan dukungan gambar |
| 🔔 **Notifikasi** | Badge counter di navbar, notifikasi saat ada aktivitas |
| ✅ **Status** | Tandai RESOLVED saat barang kembali ke pemiliknya |
| 🚩 **Reporting** | Laporkan konten tidak pantas, auto-hide setelah 3 laporan |
| 📱 **Responsive** | Mobile-first, optimal di semua ukuran layar |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 — Neo Brutalism |
| **Database** | Supabase PostgreSQL |
| **Auth** | Supabase Auth (Google OAuth) |
| **Storage** | Supabase Storage |
| **Icons** | Lucide React |
| **Font** | Poppins |
| **Deployment** | Vercel |

---

## 🎨 Design System

Neo Brutalism — bold, playful, friendly.

```
Primary:    #22C55E (Hijau — Hope, Help, Recovery)
Secondary:  #FACC15 (Kuning — Attention, Announcement)
Accent:     #2563EB (Biru — Trust, Information)
Danger:     #EF4444 (Merah — Lost, Warning)

Border:     4px solid #000
Shadow:     8px 8px 0px #000
Radius:     16px
Font:       Poppins (400–900)
Grid:       8px base unit
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) 18+
- [Supabase](https://supabase.com) account (free tier)

### 1. Clone

```bash
git clone https://github.com/Lputaa/cari-in.git
cd cari-in
npm install
```

### 2. Setup Supabase

1. Buat project baru di [supabase.com](https://supabase.com)
2. **SQL Editor** → paste isi `supabase/schema.sql` → Run
3. **Storage** → buat bucket `post-images` → centang **Public**
4. **Authentication → Providers** → aktifkan **Google**
5. **Authentication → URL Configuration**:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 3. Environment Variables

```bash
cp .env.local.example .env.local
```

Isi `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

### 4. Run

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) 🎉

---

## 📁 Project Structure

```
cari-in/
├── project/                    # PRD, Style Guide, Dev Tasks
├── supabase/
│   └── schema.sql              # Database schema + RLS policies
├── src/
│   ├── app/
│   │   ├── auth/callback/      # OAuth callback handler
│   │   ├── notifications/      # Notifikasi page
│   │   ├── post/[id]/          # Post detail + komentar
│   │   ├── layout.tsx          # Root layout + providers
│   │   ├── page.tsx            # Feed page
│   │   └── globals.css         # Design tokens
│   ├── components/
│   │   ├── ui/                 # Design system (Button, Card, Modal, etc.)
│   │   ├── ComposeBox.tsx      # Inline compose (expandable)
│   │   ├── SwipeableToggle.tsx # Lost/Found icon toggle
│   │   ├── FeedTabs.tsx        # Mading/Lost/Found tabs
│   │   ├── PostCard.tsx        # Feed card
│   │   ├── Navbar.tsx          # Navigation bar
│   │   ├── ImagePreviewModal.tsx
│   │   ├── EditPostModal.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   └── ReportModal.tsx
│   ├── lib/
│   │   ├── supabase.ts         # Supabase client
│   │   ├── db.ts               # Database queries
│   │   ├── storage.ts          # Image upload/delete
│   │   ├── notifications.ts    # Notification service
│   │   └── AuthProvider.tsx    # Auth context
│   └── types/
│       └── index.ts            # TypeScript types
├── public/
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

## 🔄 Alur Penggunaan

```
┌─────────────────────────────────────────────┐
│                                             │
│  1. Login dengan Google                     │
│         ↓                                   │
│  2. Dapat Anonymous ID (#xxx)               │
│         ↓                                   │
│  3. Buat postingan (Lost / Found)           │
│     ├── Judul + Deskripsi                   │
│     ├── Kategori + Lokasi                   │
│     └── Foto (max 3)                        │
│         ↓                                   │
│  4. Komunitas merespons via komentar        │
│         ↓                                   │
│  5. Terima notifikasi                       │
│         ↓                                   │
│  6. Tandai RESOLVED saat selesai            │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 📄 License

MIT © 2026

---

<div align="center">

**Dibuat dengan ❤️ untuk civitas kampus**

*"Kehilangan sesuatu? Cari-in ajaa."*

</div>
]]>