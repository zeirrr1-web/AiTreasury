# AI-News

Autonomous AI news platform that detects global events, generates articles, and produces AI news broadcasts in near real time.

## Architecture

- **Frontend:** Next.js 14 App Router + Tailwind CSS
- **Backend:** Next.js API routes (serverless compatible)
- **Database:** PostgreSQL + Prisma ORM
- **Auth:** NextAuth (credentials provider baseline)
- **Realtime:** Server Sent Events (`/api/live`)
- **Automation:** Vercel cron + local job scripts in `jobs/`

## Core Capabilities

- Multi-source ingestion (`NewsAPI`, `GDELT`, plus service placeholders for EventRegistry / RSS / social)
- AI event detection and prioritization
- AI article generation (OpenAI API)
- AI broadcast generation (placeholder integration points for HeyGen / D-ID / Synthesia)
- Breaking news banner + global event map
- Seeded demo content for immediate local startup

## Project Structure

```txt
/app
  /api/events /api/news /api/weather /api/social /api/broadcast /api/live
  /breaking /world /technology /business /politics /weather /live /map
/components
/lib
/jobs
/database
/prisma
/types
/utils
```

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Configure env:
   ```bash
   cp .env.example .env
   ```
3. Start PostgreSQL and run Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run seed
   ```
4. Run app:
   ```bash
   npm run dev
   ```

## Environment Variables

- `OPENAI_API_KEY`
- `NEWS_API_KEY`
- `REDDIT_CLIENT_ID`
- `REDDIT_SECRET`
- `MAPBOX_KEY`
- `DATABASE_URL`
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`

## Deployment (Vercel)

- `vercel.json` includes build command and 5-minute cron entry.
- Deploy with:
  ```bash
  vercel --prod
  ```
- Ensure `DATABASE_URL` and API keys are configured in Vercel environment settings.

## API Endpoints

- `GET /api/events` — recent detected events
- `GET /api/events/scan` — triggers ingestion + detection
- `GET /api/news` — generated articles
- `GET /api/weather` — NOAA alerts
- `GET /api/social` — social velocity signals (baseline)
- `GET /api/broadcast` — latest AI broadcast
- `GET /api/live` — SSE updates

## Notes

- External integrations that require paid/API credentials are scaffolded with safe defaults/placeholders.
- The app is structured for immediate Vercel deployment and incremental hardening.
