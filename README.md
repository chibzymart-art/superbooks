# SuperBooks — Production Reading Platform

SuperBooks is an independent, studio-crafted digital reading platform built for Pan-African and world literature. Designed with a warm editorial bookshop aesthetic, tactile dual-mode reading (smooth continuous scroll and physical page flip), synchronized chapter audio narration, and short-form vertical Booktok video dispatches.

---

## 🏛 Architecture & Tech Stack

- **Framework**: Next.js 15 (App Router, Server Components for maximum SEO, React 19, TypeScript)
- **Styling**: Tailwind CSS with custom editorial tokens (paper backgrounds, Newsreader serif typography, Plus Jakarta Sans body, deckle edge shadows, zero generic purple/blue gradients)
- **Database & Auth**: Supabase (PostgreSQL 16, Row Level Security enabled on all tables, auth cookie helpers)
- **Object Storage**: Cloudflare R2 (S3-compatible, direct browser-to-bucket presigned uploads for large PDFs, short-lived signed URLs for authenticated readers)
- **Video Delivery**: Cloudflare Stream (Adaptive HLS/DASH video delivery for vertical Booktok reels)
- **Deployment**: Vercel CI/CD + GitHub Actions

---

## 🚀 Key Features

1. **Dual Reading Engine**:
   - **Smooth Scroll**: Seamless vertical reading with drop caps, typography size controls, and scroll progress tracking.
   - **Page Flip**: Tactile physical book simulation with realistic page curvature, keyboard navigation (arrow keys), and Web Audio API synthesized paper rustle sound.
2. **Synchronized Chapter Audio**:
   - Audio player bar with variable speed controls (`0.75x`, `1.0x`, `1.25x`, `1.5x`, `2.0x`), sleep timer (`5m`, `15m`, `30m`), and bookmark resume.
   - Automatically uses uploaded audio if provided; falls back gracefully to Web SpeechSynthesis API with natural pacing.
3. **Server-Side Access Gating**:
   - Visitors can browse the entire library catalog and read full books marked `is_free`.
   - For members/premium titles, Chapter 1 is fully server-rendered (SSR) for search crawlers and previews.
   - Chapter 2 onward is protected on the server—returning an editorial subscription gate if unauthenticated.
4. **Vertical Booktok Reel Feed (`/booktok`)**:
   - Mobile-first snap-scroll vertical video feed with Cloudflare Stream playback, like counter, and direct "Read Book" links.
5. **Curator Admin Dashboard (`/admin`)**:
   - Publish books, attach chapter audio, upload video episodes, and review community reports.
   - **Mandatory `rights_status` validation**: Publishing is strictly blocked until positive copyright or licensing status is declared.
6. **Community Margin Notes (`/community`)**:
   - Threaded discussions linked to catalog books, likes, and moderation reporting.

---

## 🛠 Local Setup & Running

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```
Fill in your credentials for Supabase and Cloudflare R2/Stream. (If credentials are not yet configured, SuperBooks automatically runs with full mock fixtures).

### 3. Run Migrations on Supabase
Execute the migrations located in `/supabase/migrations/`:
- `20261008000001_initial_schema.sql`: Tables, relations, triggers, and Row Level Security policies.
- `20261008000002_seed_demo_data.sql`: 5 curated public domain books and 3 Booktok episodes.

### 4. Create First Admin User
Run the bootstrap script to create or elevate an admin account:
```bash
npx tsx scripts/seed-admin.ts admin@superbooks.studio SuperBooksAdmin2026! "SuperBooks Curator"
```

### 5. Launch Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔍 SEO & AI Engine Optimization (GEO)

- **Dynamic Sitemap**: Accessible at `/sitemap.xml` with automatic URL enumeration for all books and chapters.
- **Robots.txt**: Explicitly permits AI engines (`GPTBot`, `ClaudeBot`, `PerplexityBot`, `Google-Extended`).
- **LLM Discovery**: `/llms.txt` and `/llms-full.txt` provide machine-readable transcripts and summaries.
- **Structured JSON-LD**: Schemas for `Organization`, `WebSite`, `Book`, `Chapter`, and `VideoObject`.
