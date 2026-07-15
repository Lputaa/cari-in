# Cari-in Development Task
Duration: 1 Week
Team: 3 People

---

# Member Roles

## Member 1
Frontend Lead

## Member 2
Backend Lead

## Member 3
UI/UX + Integration

---

# Day 1

## Planning
- Finalisasi PRD
- Finalisasi UI (design system: warna, tipografi, spacing, komponen dasar)
- Setup Repository
- Setup Firebase Project
- Setup Next.js
- Setup Deployment Pipeline (Vercel + Environment Variables Firebase)

Catatan: Design System (Button, Card, Input, Modal, Tab, Badge) harus rampung di Day 1 agar Frontend Lead tidak menunggu sampai akhir minggu untuk mulai styling.

---

# Day 2

## Authentication

- Google Login
- Anonymous ID Generation
- Session Management

---

## Database

- User Collection
- Post Collection
- Comment Collection
- Notification Collection
- Firestore Security Rules (draft awal)

---

## UI/UX (paralel)

- Component Library: Modal, Tab Bar, Avatar/Anonymous ID Badge, Empty State, Loading Skeleton, Toast

---

# Day 3

## Feed

- Hero Section
- Tabs
- Post Card
- Navigation
- Search Bar + Filter (kategori, lokasi, status)

## QA Checkpoint
- Test Authentication flow end-to-end

---

# Day 4

## Posting Feature

- Create Lost Post
- Create Found Post
- Edit / Delete Post (milik sendiri)
- Upload Image
- Multiple Image Upload

## QA Checkpoint
- Test Feed + Search/Filter

---

# Day 5

## Comment System

- Text Comment
- Image Comment
- Comment Counter
- Real-time Update (stretch goal — fallback: manual refresh/polling jika waktu tidak cukup)

## Notification (In-App)

- Badge Counter di Navbar
- Notifikasi saat status berubah RESOLVED

## QA Checkpoint
- Test Posting Feature (create/edit/delete/upload)

---

# Day 6

## Status

- OPEN
- RESOLVED

## Reporting (Basic)

- Report Post/Comment
- Auto-hide setelah ambang batas laporan

## Polish

- Loading State
- Empty State
- Error State
- Responsive Design

## QA Checkpoint
- Test Comment System + Notification
- Test Status Update + Reporting

---

# Day 7

## Final Testing

- Regression test seluruh fitur
- Bug Fixing
- Demo Scenario Rehearsal
- Presentation Preparation

Catatan: Karena testing dilakukan bertahap sejak Day 3, Day 7 fokus ke bug minor dan kelancaran alur demo, bukan menemukan bug besar di menit-menit akhir.

---

# Task Breakdown

## Frontend

### Authentication Pages
Priority: High

### Feed Page (+ Search/Filter)
Priority: High

### Post Detail Page
Priority: High

### Create/Edit Post Modal
Priority: High

### Comment Section
Priority: High

### Notification Badge
Priority: Medium

---

## Backend

### Firebase Authentication
Priority: High

### Firestore Schema
Priority: High

### Storage Upload
Priority: High

### Security Rules
Priority: High

### Notification Logic
Priority: Medium

### Reporting Logic
Priority: Medium

---

## UI/UX

### Design System
Priority: High

### Component Library (Modal, Tab, Badge, Empty/Loading State)
Priority: High

### Responsive Design
Priority: Medium

### Icons & Assets
Priority: Medium

---

# MVP Checklist

- [ ] Google Login
- [ ] Anonymous Identity
- [ ] Create Lost Post
- [ ] Create Found Post
- [ ] Edit / Delete Post
- [ ] Upload 3 Images
- [ ] Feed
- [ ] Search & Filter
- [ ] Comment System
- [ ] In-App Notification Badge
- [ ] Status Update
- [ ] Basic Reporting
- [ ] Responsive Layout
- [ ] Deployment

---

# Demo Scenario

Scenario 1:
User kehilangan dompet, membuat Lost Post.

Scenario 2:
User menemukan dompet, membuat Found Post.

Scenario 3:
Keduanya bertemu melalui komentar; pembuat post menerima notifikasi.

Scenario 4:
Posting ditandai RESOLVED.

Scenario 5 (opsional, jika waktu memungkinkan):
Pemilik dompet menemukan post melalui fitur Search & Filter, bukan hanya dari Feed.

---

# Presentation Flow

1. Masalah di kampus.
2. Solusi yang ditawarkan.
3. Demo aplikasi.
4. Arsitektur sistem.
5. Future Development.
6. Penutup.

Tagline:

"Kehilangan sesuatu? Cari-in ajaa."
