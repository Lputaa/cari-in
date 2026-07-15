# PRD - Cari-in
Version: 1.1
Status: Draft
Team Size: 3 People
Development Time: 1 Week

---

# 1. Overview

## Product Name
Cari-in

## Tagline
"Kehilangan sesuatu? Cari-in ajaa."

## Description
Cari-in adalah platform Lost & Found anonim berbasis web yang membantu civitas kampus melaporkan barang hilang dan barang ditemukan secara terpusat.

Pengguna dapat membuat posting kehilangan (Lost) atau penemuan (Found), berdiskusi secara anonim, serta membantu mengembalikan barang kepada pemiliknya.

---

# 2. Problem Statement

Informasi mengenai barang hilang dan ditemukan di kampus biasanya:

- Tersebar di berbagai grup WhatsApp.
- Cepat tenggelam oleh pesan lain.
- Tidak terorganisir.
- Sulit dicari kembali.
- Membutuhkan pengguna membagikan identitas pribadi.

Akibatnya, banyak barang yang sebenarnya ditemukan tetapi tidak pernah kembali ke pemiliknya.

---

# 3. Solution

Membangun platform bulletin board digital yang:

- Terpusat.
- Mudah digunakan.
- Bersifat anonim.
- Mudah dicari kembali (search & filter).
- Mendorong budaya saling membantu.

---

# 4. Goals

## Business Goal
Membuktikan bahwa platform sederhana dapat meningkatkan peluang barang kembali kepada pemiliknya.

## Product Goal
Menjadi media Lost & Found digital untuk lingkungan kampus.

## User Goal
- Melaporkan barang hilang.
- Melaporkan barang ditemukan.
- Mencari informasi dengan cepat.
- Mendapat notifikasi saat ada respons.
- Berinteraksi tanpa membuka identitas pribadi.

---

# 5. Target Users

- Mahasiswa
- Dosen
- Staff kampus
- Organisasi kampus

---

# 6. User Persona

## User A - Kehilangan Barang

"Saya kehilangan dompet dan tidak tahu harus bertanya ke mana."

Goal:
Membuat posting kehilangan dan mendapatkan informasi secepat mungkin, tanpa harus terus-menerus mengecek aplikasi secara manual.

---

## User B - Menemukan Barang

"Saya menemukan kartu mahasiswa dan ingin mengembalikannya."

Goal:
Membuat posting temuan dan menunggu pemilik menghubungi, tanpa harus membagikan identitas asli.

---

# 7. Core Features

## Authentication

- Login menggunakan Google.
- Identitas asli (nama, email) disimpan di database, hanya dapat diakses oleh backend/sistem — tidak pernah ditampilkan ke user lain dalam kondisi apapun.
- Identitas publik menggunakan Anonymous ID, digenerate otomatis saat akun pertama kali dibuat dan bersifat permanen per user.

Contoh:

Anonymous #382

---

## Feed

Tab:

- Mading (Info Terkini)
- Lost
- Found

Feed menggunakan model seperti X/Twitter.

---

## Search & Filter

User dapat:

- Mencari post berdasarkan kata kunci judul.
- Memfilter berdasarkan kategori.
- Memfilter berdasarkan lokasi.
- Memfilter berdasarkan status (OPEN/RESOLVED).

Catatan: Ini adalah bagian dari core value proposition (bukan future scope), karena "sulit dicari kembali" adalah salah satu masalah utama yang ingin diselesaikan produk ini.

---

## Lost Post

User dapat membuat posting:

- Judul
- Deskripsi
- Kategori
- Lokasi
- Maksimal 3 foto
- Status

Pembuat post dapat mengedit atau menghapus posting miliknya sendiri.

---

## Found Post

User dapat membuat posting:

- Judul
- Deskripsi
- Kategori
- Lokasi
- Maksimal 3 foto
- Status

Pembuat post dapat mengedit atau menghapus posting miliknya sendiri.

---

## Comment System

Semua pengguna dapat:

- Menulis komentar.
- Mengunggah gambar.
- Memberikan informasi tambahan.

---

## Notifications (In-App)

- Badge counter pada navbar saat ada komentar baru di post milik user.
- Notifikasi dasar saat status post berubah menjadi RESOLVED.

Catatan: Fitur ini dipindahkan dari Future Scope ke Core Feature karena tanpa notifikasi, tujuan utama produk (mempertemukan pemilik dan penemu barang) berisiko gagal — user tidak akan tahu ada respons kecuali membuka aplikasi secara manual.

---

## Reporting (Basic)

User dapat melaporkan post atau komentar yang tidak pantas. Post/komentar yang dilaporkan diberi status "hidden" secara otomatis setelah mencapai ambang batas laporan tertentu, tanpa perlu admin dashboard penuh.

---

## Status

- OPEN
- RESOLVED

Hanya pembuat posting yang dapat mengubah status.

---

# 8. Categories

- Elektronik
- Dompet
- Kunci
- Dokumen
- Aksesoris
- Lainnya

---

# 9. Locations

- Lantai 5
- Lantai 6
- Lantai 7
- Lantai 8
- Parkiran Gerbang Utara
- Parkiran Gerbang Selatan
- Perpustakaan
- Kantin

---

# 10. User Flow

## Lost Flow

Login
↓
Create Lost Post
↓
Community Responds
↓
User Menerima Notifikasi
↓
Item Found
↓
Mark as Resolved

---

## Found Flow

Login
↓
Create Found Post
↓
Owner Responds
↓
User Menerima Notifikasi
↓
Item Returned
↓
Mark as Resolved

---

# 11. Database Design

## users

- uid
- email
- anonymous_id
- created_at

## posts

- id
- user_id
- type
- title
- description
- category
- location
- images[]
- status
- report_count
- created_at
- updated_at

## comments

- id
- post_id
- user_id
- message
- images[]
- report_count
- created_at

## notifications

- id
- user_id
- post_id
- type
- is_read
- created_at

---

# 12. Non Functional Requirements

## Performance
Page load < 3 seconds.

## Responsiveness
Mobile First.

## Security
- Google Authentication.
- Firestore Security Rules: hanya pembuat post/comment yang dapat mengedit/menghapus miliknya sendiri.
- Identitas asli tidak pernah dikirim ke client selain milik user yang login.

## Storage
Firebase Storage.

---

# 13. Future Scope

- Auto Matching
- Private Anonymous Chat
- Push Notification (browser/mobile, di luar in-app badge)
- Admin Dashboard penuh
- AI Content Moderation
- Heatmap Lost Area

---

# 14. Success Metrics

- User dapat membuat posting dalam < 1 menit.
- Rata-rata waktu dari post dibuat hingga komentar pertama masuk < 10 menit saat demo/testing.
- User dapat menemukan post relevan melalui search/filter dalam < 3 interaksi.
- Demonstrasi berjalan tanpa error kritis.
- Minimal satu skenario barang berhasil dikembalikan (status RESOLVED) saat presentasi.
