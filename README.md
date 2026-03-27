# 談笑書生 SaaS Platform

AI-powered YouTube video generator. Users subscribe, customize content settings, and generate news videos with one click.

## Tech Stack

- **Frontend**: Next.js 14 (App Router) + Tailwind CSS
- **Auth**: Clerk
- **Payment**: Stripe (subscription)
- **Database**: Supabase (PostgreSQL)
- **Compute**: Mac Mini via Cloudflare Tunnel (video_server.py:5680)
- **Host**: Vercel

## Getting Started

```bash
cp .env.example .env.local   # Fill in all API keys
npm install
npm run dev                   # http://localhost:3000
```

## Folder Structure

```
src/
├── app/
│   ├── (auth)/              # Sign-in / Sign-up pages
│   ├── (dashboard)/         # Protected dashboard pages
│   │   └── dashboard/
│   │       ├── jobs/        # Video generation history
│   │       ├── settings/    # User customization
│   │       └── billing/     # Subscription management
│   ├── (marketing)/         # Landing page
│   └── api/
│       ├── webhooks/stripe/ # Stripe webhook handler
│       ├── webhooks/clerk/  # Clerk webhook handler
│       └── jobs/            # Job CRUD API
├── components/
│   ├── ui/                  # Reusable UI components
│   ├── dashboard/           # Dashboard-specific components
│   └── marketing/           # Landing page components
├── lib/
│   ├── supabase.ts          # Supabase client
│   ├── stripe.ts            # Stripe client + plans config
│   └── video-server.ts      # Mac Mini API client
├── types/
│   └── index.ts             # TypeScript type definitions
└── middleware.ts             # Clerk auth middleware
```

## Database Setup

Run `supabase/schema.sql` in your Supabase SQL Editor.

## Pricing

| Plan | Price | Videos/Month |
|------|-------|-------------|
| Free | $0 | 1 |
| Basic | $9.99/mo | 10 |
| Pro | $29.99/mo | 60 |

## Next Steps

1. [ ] Set up Clerk project and get API keys
2. [ ] Set up Stripe products/prices
3. [ ] Create Supabase project and run schema.sql
4. [ ] Set up Cloudflare Tunnel for Mac Mini
5. [ ] Update video_server.py to support multi-user auth tokens
6. [ ] Build dashboard UI (settings form, job list)
7. [ ] Build landing page with pricing
8. [ ] Implement Stripe checkout flow
9. [ ] Add job queue logic on video server
10. [ ] Deploy to Vercel
