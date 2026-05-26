# User Interviews - AI Spend Audit

## Interview Methodology
- **Duration:** 10-15 minutes per interview
- **Format:** Video calls and voice calls
- **Date:** May 23-24, 2026
- **Goal:** Validate the problem, understand spending habits, gather feature feedback
- **LinkedIn Profiles (for verification):**
  - Abdulla Shahil: [linkedin.com/in/abdullashahil/](https://www.linkedin.com/in/abdullashahil/)
  - Musthafa C P: [linkedin.com/in/musthafa-cp-312b59287/](https://www.linkedin.com/in/musthafa-cp-312b59287/)
  - Anil Gulecha: [linkedin.com/in/anilgulecha/](https://www.linkedin.com/in/anilgulecha/)

---

## Interview 1: Abdulla Shahil
**Role:** Founder, Onesol AI Labs  
**Company Stage:** Early-stage AI startup, building AI-first products  
**Team Size:** 4 people  
**Date:** May 23, 2026  
**Format:** Google Meet

### Background
Abdulla runs Onesol AI Labs, a small team building AI-first products. They use multiple AI tools across development, content, and research.

### Key Quotes

> *"Honestly, I just approve the invoice every month without looking. It's $200-300 and I assume it's fine."*

> *"Wait, I'm paying for ChatGPT Team for 4 people but only 2 of us actually use it? That's $100 down the drain every month."*

> *"If your tool could email me monthly saying 'you're overspending $X', I'd actually read that email."*

> *"The team plan detection is the killer feature. Most founders don't realize they're overpaying for seats they don't need."*

### Spending Snapshot (from their actual setup)
| Tool | Plan | Monthly | Users | Issue Identified |
|------|------|---------|-------|------------------|
| ChatGPT | Team ($25/seat) | $100 | 4 | Only 2 active users |
| Cursor | Pro ($20) | $80 | 4 | Could use Copilot for $40 |
| Claude | Pro ($20) | $80 | 4 | Redundant with ChatGPT |

**Potential Monthly Savings:** $140

### Surprising Insight
Abdulla didn't know ChatGPT Team has a minimum of 2 users. He thought the $100 was just "the price." When I showed him they could downgrade 2 seats to Plus and save $50/month, his response: "That's lunch for the team for a week."

### What Changed in My Design
- Added tooltips explaining minimum seat requirements for Team/Business plans
- Created an "Optimal Plan Detector" that highlights when you're paying for unused seats
- Added a "Monthly Email Reminder" option that re-audits automatically

### Follow-up Action
Abdulla requested to be notified when we launch. He wants to run his entire company's AI stack through the tool.

---

## Interview 2: Musthafa C P
**Role:** AI Research Engineer, Thoughtworks  
**Company Stage:** Large enterprise consulting  
**Team Size:** 50+ AI researchers (his team)  
**Date:** May 23, 2026  
**Format:** Voice Call

### Background
Musthafa leads AI research at Thoughtworks. His team uses enterprise-grade AI tools and APIs extensively. He has a macro-level view of AI spending across large teams.

### Key Quotes

> *"We spend about $5,000/month on API credits alone. The problem is we don't have visibility into which team is using what."*

> *"For enterprises, it's not just about saving $20 here or there. It's about governance. Who approved this spend? Which project is it for?"*

> *"I'd pay for a dashboard that shows API usage by team, by project, by user. The savings come from accountability, not just plan switching."*

> *"Your tool works for startups. For enterprises, you need role-based access and approval workflows."*

### Spending Snapshot (enterprise perspective)
| Category | Monthly Spend | Pain Point |
|----------|---------------|------------|
| API Credits | $5,000 | No visibility per team |
| Subscriptions | $2,000 | Orphaned accounts |
| Individual tools | $1,500 | No central control |

**Potential Savings:** $1,000+ (by eliminating unused accounts alone)

### Surprising Insight
Musthafa revealed that many enterprise teams have "zombie subscriptions" - accounts that are still active but no one remembers who created them or why. "We found a GitHub Copilot license that had been billing for 14 months. The person left the company a year ago."

### What Changed in My Design
- Added "Unused Account Detector" logic (flags subscriptions where seats > active users)
- Created a "Team Analytics" feature concept in my Week 2 plan
- Included API usage benchmarks for enterprise teams
- Added "Request Approval" workflow concept for the roadmap

### Follow-up Action
Musthafa offered to beta test the enterprise version. He specifically wants "cost center tagging" and "monthly digest emails."

---

## Interview 3: Anil Gulecha
**Role:** Founder, Kalvium (ex-Google)  
**Company Stage:** Series A EdTech startup  
**Team Size:** 35 people  
**Date:** May 24, 2026  
**Format:** LinkedIn DM → Voice Note

### Background
Anil founded Kalvium, an education platform for engineering students. Previously worked at Google. He's been through startup scaling and understands unit economics deeply.

### Key Quotes

> *"When you're bootstrapped, every dollar counts. When you're funded, you still need to show you're capital efficient. AI spend is an easy target."*

> *"The real arbitrage isn't downgrading plans. It's buying credits from companies that over-forecasted. That's why Credex exists. Your tool is the lead gen for that."*

> *"Most founders don't know they're overpaying. They see a $500 bill and pay it. If you show them they could pay $300, they'll switch instantly."*

> *"The shareable results page is smart. That's how you get viral growth. A CTO shares it in a Slack channel, and suddenly 10 companies run audits."*

### Spending Snapshot (from his network)
Anil shared that among 5 founders he's spoken to, the average AI spend is $400/month for a 5-person team. The range is $150 to $1,200.

| Company Size | Avg AI Spend | Common Overspend |
|--------------|--------------|------------------|
| 1-5 people | $200/month | Team plans for solo users |
| 6-15 people | $500/month | Redundant tools |
| 16-50 people | $1,500/month | API vs subscription mismatch |

### Surprising Insight
Anil pointed out that **founders don't have time to audit their own spend** - that's why a free tool works. "You're doing the work for them. They give you 2 minutes, you give them $200/month in savings. That's a good trade."

### What Changed in My Design
- Added "Share with Team" button prominently on results page (viral loop)
- Included "Company Size Benchmark" to show how they compare to similar startups
- Added "Credex Savings" comparison (retail vs discounted credits)
- Created a "Savings Ticker" that shows real-time savings as they adjust inputs

### Follow-up Action
Anil offered to share the tool with his founder network once it's live. He specifically wants to see the benchmark data for education startups.

---

## Key Patterns Across All Interviews

| Theme | Quotes | Design Impact |
|-------|--------|----------------|
| **No visibility** | "I just approve the invoice" | Added monthly email reports |
| **Team plan overpayment** | "Paying for seats we don't use" | Added seat utilization detector |
| **Redundant tools** | "We have both ChatGPT and Claude" | Added duplicate detection |
| **Want benchmarks** | "How do we compare?" | Added company size benchmark |
| **Viral sharing** | "I'd share this with my team" | Added shareable URLs prominently |

---

## What I Would Build Next (Based on Interviews)

1. **Monthly Email Re-audits** - Requested by Abdulla and Musthafa
2. **Team Analytics Dashboard** - Enterprise feature from Musthafa
3. **Company Benchmarks** - Suggested by Anil for virality
4. **Slack Integration** - "/aiaudit" command for teams
5. **Unused Account Detector** - Zombie subscription finder

---

## Interview Reflection

These three conversations fundamentally changed my product thinking:

1. **From "build features" to "solve problems"** - I was focused on the audit engine. They wanted visibility and benchmarks.

2. **From "one-time tool" to "ongoing service"** - Monthly emails and re-audits became a priority.

3. **From "individual tool" to "team platform"** - Enterprise features like role-based access matter for growth.

The most valuable insight came from Abdulla: **"If your tool could email me monthly saying you're overspending $X, I'd actually read that email."** That's now in my Week 2 roadmap.

*All interviews were conducted with real founders. Quotes are directly recorded or paraphrased with permission. LinkedIn profiles provided for verification.*