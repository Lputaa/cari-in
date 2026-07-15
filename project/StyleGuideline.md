# Cari-in Style Guideline

---

# Design Principle

Friendly.
Simple.
Community Driven.
Neo Brutalism.

---

# Design Keywords

- Playful
- Bold
- Friendly
- Human
- Informative

---

# Color Palette

## Primary

Green
#22C55E

Meaning:
Hope, Help, Recovery.

Text on Primary:
Black (#000000) — kontras terbaik di atas hijau.

---

## Secondary

Yellow
#FACC15

Meaning:
Attention, Announcement.

Text on Secondary:
Black (#000000) — wajib, teks putih gagal kontras di atas kuning.

---

## Accent

Blue
#2563EB

Meaning:
Trust, Information.

Text on Accent:
White (#FFFFFF).

---

## Neutral

Black
#000000

White
#FFFFFF

Gray
#F5F5F5

---

# Spacing & Grid

Base unit: 8px grid.

- xs : 4px
- sm : 8px
- md : 16px
- lg : 24px
- xl : 32px
- 2xl : 48px

Container max-width: 1200px, dengan padding horizontal 16px di mobile dan 32px di desktop.

---

# Neo Brutalism Rules

## Border

4px solid black

---

## Border Radius

16px

---

## Shadow

8px 8px 0px #000

---

## Button Hover

translate(-2px,-2px)

---

# Typography

## Font

Poppins

Alternative:
Inter

---

## Heading

Font Weight:
700

---

## Body

Font Weight:
400

---

# Font Size

## Desktop (≥1024px)

H1 : 48px
H2 : 36px
H3 : 24px
Body : 16px
Caption : 14px

## Mobile (<768px)

H1 : 32px
H2 : 26px
H3 : 20px
Body : 16px
Caption : 13px

Catatan: Body dan Caption tetap konsisten antar breakpoint agar keterbacaan konten (deskripsi post, komentar) tidak terganggu.

---

# Components

## Button

Primary:
Green background, teks hitam.

Secondary:
Yellow background, teks hitam.

Danger:
Red background, teks putih.

---

## Card

Background:
White.

Border:
4px solid black.

Shadow:
8px 8px black.

---

## Input

Border:
4px solid black.

Radius:
16px.

---

## Modal (Create/Edit Post)

Background:
White dengan overlay hitam 60% opacity di belakangnya.

Border:
4px solid black.

Shadow:
8px 8px black.

Posisi:
Center pada desktop, bottom-sheet (full width, slide-up) pada mobile.

---

## Tab Bar

Border bawah:
4px solid black.

Tab Aktif:
Underline 4px warna Primary (Green), teks bold.

Tab Non-aktif:
Teks abu-abu (#000000 opacity 50%).

---

## Avatar / Anonymous ID Badge

Bentuk:
Rounded square (radius 8px), border 2px solid black.

Isi:
Inisial angka acak atau ikon default, dengan label "Anonymous #xxx" di sebelahnya.

---

## Empty State

Ilustrasi sederhana (rounded, friendly) + teks singkat + CTA button.

Contoh teks: "Belum ada laporan di sini. Jadi yang pertama membantu!"

---

## Loading Skeleton

Bentuk:
Blok abu-abu (#F5F5F5) dengan border 4px solid black, mengikuti bentuk Card asli.

Animasi:
Pulse, durasi 1s, tanpa shimmer berlebihan (tetap sesuai prinsip animasi minimal).

---

## Toast Notification

Posisi:
Top-center pada mobile, top-right pada desktop.

Border:
4px solid black.

Shadow:
8px 8px black.

Durasi tampil:
3 detik, auto-dismiss.

---

## Post Card

Contains:

- User Anonymous ID
- Time
- Category
- Description
- Image Carousel
- Comment Count
- Status

---

# Status Colors

OPEN

Background:
#FACC15

Teks:
Hitam.

RESOLVED

Background:
#22C55E

Teks:
Hitam.

---

# Icons

Library:
Lucide React

Stroke Width:
2.5px (lebih tebal dari default 2px, agar konsisten dengan border 4px pada elemen neo-brutalism lainnya).

---

# Animation

Minimal.

Duration:
200ms.

Digunakan untuk:
Button hover/press, modal open/close, toast enter/exit.

Tidak digunakan untuk:
Transisi halaman penuh, animasi dekoratif berlebihan.

---

# Responsive Breakpoints

Mobile:
<768px

Tablet:
768px

Desktop:
1024px+

---

# Illustration Style

Rounded.
Friendly.
Simple.

---

# Tone of Voice

Helpful.
Positive.
Encouraging.

Examples:

"Kehilangan sesuatu? Cari-in ajaa."

"Ada yang menemukan barangmu?"

"Terima kasih sudah membantu sesama!"

"Belum ada laporan di sini. Jadi yang pertama membantu!"
