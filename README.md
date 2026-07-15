# Cari-in 🎯

> "Kehilangan sesuatu? Cari-in ajaa."

Platform Lost & Found anonim berbasis web untuk civitas kampus.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4 (Neo Brutalism)
- **Backend:** Supabase (PostgreSQL + Auth + Storage)
- **Icons:** Lucide React
- **Deployment:** Vercel

## Features

- ✅ Google Login + Anonymous Identity
- ✅ Create Lost / Found Post (max 3 images)
- ✅ Edit / Delete Post (owner only)
- ✅ Feed with Tabs (Mading / Lost / Found)
- ✅ Search & Filter (category, location, status)
- ✅ Comment System (text + image)
- ✅ In-App Notification Badge
- ✅ Status Update (OPEN / RESOLVED)
- ✅ Basic Reporting (auto-hide after 3 reports)
- ✅ Responsive Design (Mobile First)

## Getting Started

### Prerequisites

- Node.js 18+
- Supabase account (free)

### Setup

1. Clone repo:
```bash
git clone https://github.com/<username>/cari-in.git
cd cari-in
```

2. Install dependencies:
```bash
npm install
```

3. Setup Supabase:
   - Create project at [supabase.com](https://supabase.com)
   - Run `supabase/schema.sql` in SQL Editor
   - Create storage bucket `post-images` (public)
   - Enable Google provider in Authentication

4. Copy `.env.local.example` to `.env.local` and fill:
```env
NEXT_PUBLIC_SUPABASE_URL=<your-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-key>
SUPABASE_SERVICE_ROLE_KEY=<your-key>
```

5. Run dev server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
src/
├── app/
│   ├── auth/callback/    # OAuth callback
│   ├── notifications/    # Notification list
│   ├── post/[id]/        # Post detail + comments
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Feed page
├── components/
│   ├── ui/               # Design system components
│   ├── Navbar.tsx
│   ├── PostCard.tsx
│   ├── CreatePostModal.tsx
│   ├── EditPostModal.tsx
│   ├── DeleteConfirmModal.tsx
│   └── ReportModal.tsx
├── lib/
│   ├── supabase.ts       # Client-side Supabase
│   ├── db.ts             # Database queries
│   ├── storage.ts        # Image upload
│   ├── notifications.ts  # Notification service
│   └── AuthProvider.tsx  # Auth context
└── types/
    └── index.ts          # TypeScript types
```

## Design System

Neo Brutalism style with:
- **Colors:** Green (#22C55E), Yellow (#FACC15), Blue (#2563EB)
- **Border:** 4px solid black
- **Shadow:** 8px 8px 0px #000
- **Radius:** 16px
- **Font:** Poppins

## License

MIT
