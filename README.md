<p align="center">
  <h1 align="center">🎯 Cari-in</h1>
  <p align="center">
    <i>"Kehilangan sesuatu? Cari-in ajaa."</i>
  </p>

  <p align="center">
    Platform <b>Lost & Found anonim</b> berbasis web untuk civitas kampus.<br>
    Laporkan barang hilang atau temuan — bantu sesama tanpa buka identitas.
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript" />
    <img src="https://img.shields.io/badge/Tailwind-4-38bdf8?style=flat-square&logo=tailwindcss" />
    <img src="https://img.shields.io/badge/Supabase-3ecf8e?style=flat-square&logo=supabase&logoColor=white" />
    <img src="https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel" />
  </p>
</p>

---

# 📖 Tentang

Di kampus, informasi barang hilang biasanya tersebar di grup WhatsApp—cepat tenggelam, tidak terorganisir, dan sulit dicari kembali.

**Cari-in** memecahkan masalah ini dengan menyediakan papan pengumuman digital yang:

- 📌 Terpusat — satu tempat untuk semua laporan hilang & temuan
- 🔒 Anonim — identitas terlindungi, hanya Anonymous ID yang terlihat
- 🔍 Mudah dicari — filter berdasarkan kategori, lokasi, dan status
- 🤝 Community-driven — siapa saja bisa membantu mengembalikan barang

---

# ✨ Fitur

| Fitur | Deskripsi |
| ----- | ---------- |
| 🔐 Google Login | Autentikasi aman via Google |
| 📝 Compose Inline | Buat postingan langsung di feed |
| 🔴🟢 Lost / Found | Toggle jenis laporan |
| 🖼️ Upload Gambar | Maksimal 3 foto per postingan |
| 🔍 Search & Filter | Cari judul, kategori, lokasi |
| 💬 Komentar | Diskusi anonim dengan gambar |
| 🔔 Notifikasi | Badge dan pemberitahuan aktivitas |
| ✅ Status | Tandai RESOLVED |
| 🚩 Reporting | Auto-hide setelah 3 laporan |
| 📱 Responsive | Mobile-first |

---

# 🛠️ Tech Stack

| Layer | Technology |
| ----- | ---------- |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 4 |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (Google OAuth) |
| Storage | Supabase Storage |
| Icons | Lucide React |
| Font | Poppins |
| Deployment | Vercel |

---

# 🎨 Design System

```txt
Primary:    #22C55E (Hope, Help, Recovery)
Secondary:  #FACC15 (Announcement)
Accent:     #2563EB (Trust)
Danger:     #EF4444 (Warning)

Border:     4px solid #000
Shadow:     8px 8px 0px #000
Radius:     16px
Font:       Poppins (400–900)
Grid:       8px base unit
```

---

# 🚀 Getting Started

## Prerequisites

- Node.js 18+
- Supabase Account (Free Tier)

## Clone Repository

```bash
git clone https://github.com/Lputaa/cari-in.git
cd cari-in
npm install
```

## Setup Supabase

1. Buat project baru di Supabase.
2. Jalankan `supabase/schema.sql`.
3. Buat bucket `post-images` dan set ke **Public**.
4. Aktifkan Google Provider.
5. Tambahkan:

```txt
Site URL:
http://localhost:3000

Redirect URL:
http://localhost:3000/auth/callback
```

## Environment Variables

```bash
cp .env.local.example .env.local
```

Isi:

```env
NEXT_PUBLIC_SUPABASE_URL=https://<project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>
SUPABASE_SERVICE_ROLE_KEY=<service-role-key>
```

## Run

```bash
npm run dev
```

Buka:

```txt
http://localhost:3000
```

---

# 📁 Project Structure

```txt
cari-in/
├── project/
├── supabase/
├── src/
│   ├── app/
│   ├── components/
│   ├── lib/
│   └── types/
├── public/
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

# 🔄 Alur Penggunaan

```txt
Login Google
      ↓
Dapat Anonymous ID
      ↓
Buat Post Lost/Found
      ↓
Komunitas Berkomentar
      ↓
Terima Notifikasi
      ↓
Status RESOLVED
```

---

# 📄 License

MIT © 2026

---

<p align="center">
  <b>Dibuat dengan ❤️ untuk civitas kampus</b><br><br>
  <i>"Kehilangan sesuatu? Cari-in ajaa."</i>
</p>