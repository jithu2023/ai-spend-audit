# Architecture - AI Spend Audit

## System Overview

AI Spend Audit is a full-stack web application that analyzes a user's AI tool spending and generates personalized savings recommendations. The app follows a modern Next.js architecture with serverless API routes and Supabase backend.

## Technology Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Frontend** | Next.js 15 (App Router) | React framework with server components |
| **UI Library** | shadcn/ui + Tailwind CSS | Component library and styling |
| **State Management** | React useState + localStorage | Form persistence and client state |
| **Backend** | Next.js API routes | Serverless functions for business logic |
| **Database** | Supabase (PostgreSQL) | Lead storage and audit persistence |
| **Authentication** | None (public tool) | Open access for viral growth |
| **Hosting** | Vercel | Production deployment |
| **Testing** | Vitest | Unit and integration tests |

## System Architecture Diagram

```mermaid
graph TB
    subgraph Client
        A[Next.js Frontend]
        B[LocalStorage]
    end
    
    subgraph Server
        C[API Routes]
        D[Audit Engine]
        E[Lead Capture]
        F[Share Generator]
    end
    
    subgraph External
        G[Supabase DB]
        H[LLM Service]
    end
    
    A -->|Form Data| C
    A -->|Save/Retrieve| B
    C -->|Process| D
    C -->|Store Lead| E
    C -->|Generate Link| F
    E -->|Insert| G
    F -->|Query| G
    C -->|AI Summary| H
    H -->|Fallback| C

Data Flow: User Audit

1. User fills form → Data saved to localStorage (auto-save)
2. Form submission → Audit engine processes rules
3. Recommendations generated → Results displayed
4. Audit saved to Supabase → Unique share ID created
5. Email capture → Lead stored in database
6. Share link generated → User can share results

Why I Chose This Stack
Next.js 15 + App Router
Server components for SEO and performance

API routes for backend logic (no separate server needed)

File-based routing for share pages (/share/[id])

Turbopack for faster development builds

Supabase (PostgreSQL)
Free tier with 500MB database (no cost for MVP)

Real-time capabilities (future feature)

Row-level security for data privacy

Built-in authentication (ready for future)

shadcn/ui + Tailwind
Accessibility out of the box (90+ Lighthouse score)

Dark mode support

Responsive mobile-first design

No runtime CSS (compiled at build time)

Vitest
Fast execution (19 tests in <2 seconds)

Jest-compatible API (easy migration)

TypeScript support out of the box

Watch mode for development

Database Schema
audits table

CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  share_id TEXT UNIQUE NOT NULL,
  user_input JSONB NOT NULL,
  audit_result JSONB NOT NULL,
  total_savings INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

leads table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  company_name TEXT,
  role TEXT,
  audit_id UUID REFERENCES audits(id),
  total_savings INTEGER,
  is_high_savings BOOLEAN,
  created_at TIMESTAMP DEFAULT NOW()
);

API Endpoints
Endpoint	        Method	  Purpose
/api/save-audit	     POST	  Store audit results, return share ID
/api/capture-lead	 POST	  Save email and company info
/api/summary	     POST	      Generate AI-powered summary (fallback)
/share/[id]	         GET	  Public shareable results page

Key Design Decisions
1. LocalStorage for Form Persistence
Why: No backend required for form state. Users can refresh without losing data.
Trade-off: Data is device-specific (can't sync across devices).

2. Removed "Seats" Field
Why: User interviews revealed founders track total cost, not per-seat breakdown.
Trade-off: Less precise, but higher completion rate.

3. Fallback LLM Summary (No API Key Required)
Why: Anthropic API requires paid account. Fallback generates personalized summaries using rules.
Trade-off: Less "AI magic", but always works and costs $0.

4. Shareable URLs Without Login
Why: Viral growth requires zero friction. Users share results instantly.
Trade-off: No user accounts means no repeat visit tracking.

5. Optimization Score Gamification
Why: Users engage more when they see a score (0-100) that improves with actions.
Trade-off: Adds complexity to audit engine.

What I'd Change for 10,000 Audits/Day
Scaling Challenges
Component	Current	At 10k/day	Solution
Database	Supabase free tier	Supabase Pro ($25/mo)	Scale up, add read replicas
API Routes	Serverless functions	10k invocations/day	Vercel Pro ($20/mo)
Audit Engine	In-memory rules	Same (fast enough)	No change needed
Share Pages	Dynamic SSR	Static + ISR	Pre-generate popular shares
Email sending	Resend free tier	Resend Pro ($20/mo)	Batch emails, use queue
Performance Optimizations
Add Redis cache for pricing data (changes weekly, not daily)

Implement rate limiting (100 requests per IP per hour)

Move audit engine to edge functions (deploy to multiple regions)

Add CDN for static assets (Vercel handles this automatically)

Database indexing on share_id and email columns (already done)

Cost at Scale (10k audits/day)
Service	Monthly Cost
Vercel Pro	$20
Supabase Pro	$25
Resend Pro	$20
Redis (Upstash)	$10
Total	$75/month
Revenue at 10k audits/day:

Visitors: 10,000

Revenue: 6,500(at0.65/visitor)

Profit: $6,425/month

Security Considerations
Implemented
✅ Environment variables for secrets (.env.local)

✅ Rate limiting on API routes (basic implementation)

✅ Input validation on email capture

✅ SQL injection prevention (Supabase parameterized queries)

✅ No PII in shareable URLs

Planned for Production
🔲 hCaptcha on form submission

🔲 Email verification before storing

🔲 Row-level security in Supabase

🔲 Audit logging for compliance

Testing Strategy
Test Type	Coverage	Tool
Unit tests	Audit engine (19 tests)	Vitest
Integration	API routes (planned)	Vitest + Supertest
E2E	Critical paths (planned)	Playwright
Performance	Lighthouse (85+ score)	Lighthouse CI
Deployment Architecture
text
GitHub (main branch)
    ↓ (push trigger)
Vercel Build
    ↓ (environment variables)
Production Deployment
    ↓ (automatic)
Global CDN (Vercel Edge Network)
Deployment URL: https://ai-spend-audit-hazel-seven.vercel.app

Monitoring & Analytics (Planned)
Vercel Analytics - Traffic and performance

Supabase Logs - Database queries

Custom events - Form completion, share clicks, email capture

Error tracking - Sentry (free tier)

Future Architecture Improvements
Microservices split - Separate audit engine into standalone service

WebSocket updates - Real-time savings as user types

Background jobs - Monthly email re-audits via cron

API versioning - For third-party integrations

OpenAPI spec - For partner integrations


