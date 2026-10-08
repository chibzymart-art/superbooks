# SuperBooks — Production Reading Platform & Media Compression Pipeline

SuperBooks is an independent, studio-crafted digital reading platform built for Pan-African and world literature. Designed with a warm editorial bookshop aesthetic, tactile dual-mode reading (smooth continuous scroll and physical page flip), synchronized chapter audio narration, short-form vertical Booktok video dispatches, and a client-side media compression and direct-to-cloud upload pipeline.

---

## 🏛 Architecture & Tech Stack

- **Framework**: Next.js 16 (Turbopack, App Router, Server Components for maximum SEO, React 19, TypeScript)
- **Styling**: Tailwind CSS with custom editorial tokens (paper backgrounds, Newsreader serif typography, Plus Jakarta Sans body, deckle edge shadows, zero generic purple/blue gradients)
- **Database & Auth**: Supabase (PostgreSQL 16, Row Level Security enabled on all tables, auth cookie helpers)
- **Object Storage**: Cloudflare R2 (S3-compatible, direct browser-to-bucket presigned uploads for books up to $\le 1\text{ MB}$, short-lived signed URLs with 15-minute rolling TTL for authenticated readers, $\$0.00$ egress fees)
- **Video Delivery**: Cloudflare Stream (Adaptive HLS/DASH video delivery for vertical Booktok reels compressed to $\le 50\text{ MB}$)
- **Deployment**: Vercel CI/CD + GitHub Actions

---

## ⚡ 7-Phase Media Compression & Direct Upload Architecture

1. **Phase 1: Admin Auth Gate & Media Database Schema**:
   - `public.media_assets` table tracking original file size, compressed file size, compression duration, storage path, stream UID, rights status, and verification state.
   - Curator Admin Dashboard (`/admin`) displaying active live ingestion metrics and media asset registry.

2. **Phase 2: Client-Side Compression Engines**:
   - **Books ($\le 1\text{ MB}$ Visually Lossless)**: Decompresses EPUB/PDF archive, losslessly compresses embedded raster assets (WebP/JPEG 82% quality), strips orphaned XML/manifest debris, minifies HTML/CSS, and repacks into a compliant lightweight manuscript.
   - **Videos ($\le 50\text{ MB}$ Visually Lossless)**: Standardizes resolution to 1080x1920 (9:16 vertical), adapts video bitrate (2.5 Mbps target, max 3.2 Mbps), 128 kbps AAC stereo, fast decode profile, eliminating oversized payload issues while retaining pristine quality.

3. **Phase 3: Direct-to-Cloud Upload Pipeline**:
   - **Browser-to-R2**: Generates presigned S3/R2 `PUT` URLs; browser uploads directly to Cloudflare R2 without passing through or burdening Vercel serverless function body limits (4.5 MB ceiling bypassed).
   - **Browser-to-Stream**: Requests Direct Creator Upload tickets via Cloudflare Stream API; browser pushes directly to Cloudflare edge ingest.

4. **Phase 4: Unified Admin Ingestion Station UI (`/admin/upload`)**:
   - Editorial drag-and-drop ingestion desk with real-time 3-stage visual progress:
     - Stage 1: File Analysis & Magic Byte Verification.
     - Stage 2: In-Browser Compression (megabytes saved counter, compression ratio).
     - Stage 3: Direct-to-Cloud Uploading & Supabase registration.
   - Comprehensive book and video metadata form with rights validation (`Public Domain`, `Licensed`, `Creative Commons`).

5. **Phase 5: Cloudflare CDN & Unique Link Generation Engine**:
   - **Canonical Media Resolver (`/api/media/[...key]`)**: Generates rolling signed tokens, 15-minute TTL, and auto-redirect support (`?redirect=true`) under Cloudflare Zero-Egress agreement.
   - **Canonical Stream Resolver (`/api/stream/[uid]`)**: Resolves adaptive HLS (`.m3u8`), MPEG-DASH (`.mpd`), and iframe embed codes across 330+ Anycast edge cities.
   - **CDN Inspector Modal**: Real-time link verification, copy-to-clipboard, and live endpoint testing.

6. **Phase 6: BookTok & Sanctuary Reader Playback Integration**:
   - **BookTok Feed (`/booktok`)**: Cloudflare Stream CDN integration with active edge playback (`readyState: 4`), mute toggle, keyboard navigation (`ArrowUp`/`ArrowDown`), and CDN inspector drawer.
   - **Sanctuary Reader (`/read/[slug]/[chapter]`)**: Cloudflare R2 delivery telemetry badge (`≤1 MB Lossless`), Continuous Scroll and 3D Physical Page-Flip modes, drop-caps, and synchronized audio narration bar.

7. **Phase 7: Live Production Deployment, E2E Smoke Test & Audit**:
   - Deployed on Vercel at [superbooks-seven.vercel.app](https://superbooks-seven.vercel.app).
   - Automated end-to-end browser verification across all endpoints and workflows.

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
- `20261008000003_media_compression_schema.sql`: `media_assets` table and triggers.

### 4. Launch Development Server
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
