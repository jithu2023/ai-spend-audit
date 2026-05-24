# Unit Economics - AI Spend Audit

## Business Model Overview

**Freemium Lead Generation Tool for Credex**

The AI Spend Audit is a free tool that generates high-intent leads for Credex. Users get instant savings analysis. Credex gets qualified leads who are already primed to buy discounted AI credits.

User runs free audit
↓
Sees $X/month savings opportunity
↓
Books Credex consultation (for high-savings cases)
↓
Buys discounted credits through Credex
↓
Credex takes 15% commission on each credit sale



---

## What's a Converted Lead Worth to Credex?

### Core Assumptions (Based on Industry Data + User Interviews)

| Variable | Estimate | Source |
|----------|----------|--------|
| Average startup AI spend | $500/month | Industry data + 3 founder interviews |
| Average potential savings | 30% | Audit engine analysis |
| Monthly savings per customer | $150 | $500 × 30% |
| Credex commission rate | 15% | Standard marketplace fee |
| Average customer lifetime | 18 months | SaaS subscription average |
| Consultation booking rate (high-savings leads) | 10% | Conservative estimate |
| Consultation to purchase conversion | 30% | Typical B2B sales funnel |

### Customer Lifetime Value (LTV) Calculation

**Step 1: Annual savings per customer**
$150/month × 12 months = $1,800/year

**Step 2: Credex annual revenue per customer**
$1,800 × 15% commission = $270/year

**Step 3: Customer lifetime value**
$270/year × 1.5 years = $405 per customer

**Step 4: Weighted LTV (accounting for conversion rates)**
$405 × 10% (consultation rate) = $40.50 per high-savings lead

> **Key Insight:** Each high-savings lead (user with >$100/month potential savings) is worth approximately **$40.50** to Credex over their lifetime.

---

## Customer Acquisition Cost (CAC) by Channel

### Organic Channels ($0 Budget - First 3 Months)

| Channel | Effort Required | Expected Monthly Leads | CAC |
|---------|----------------|----------------------|-----|
| Product Hunt launch | 1 day preparation | 50-100 | $0 |
| Twitter/X (organic) | Daily posting (15 min) | 30-50 | $0 |
| Reddit (r/SaaS, r/startups) | Weekly engagement | 40-60 | $0 |
| Indie Hackers post | One-time | 20-30 | $0 |
| Slack communities (Founders Cafe, etc.) | Weekly participation | 25-40 | $0 |
| Direct founder outreach (DM) | 2 hours/week | 20-30 | $0 |
| Referral / viral (shareable links) | Built into product | 50-100 | $0 |

**Total Expected Monthly Leads (Organic):** 235 - 410

**CAC (Organic):** $0

### Paid Channels (Future - After Proof of Concept)

| Channel | Monthly Budget | Expected Leads | CAC | Profitable? |
|---------|---------------|----------------|-----|-------------|
| Google Ads (AI tools keywords) | $500 | 100-150 | $3.33 - $5.00 | ❌ Not yet |
| LinkedIn Ads (CTO/Founder targeting) | $500 | 80-120 | $4.17 - $6.25 | ❌ Not yet |
| Twitter/X Ads | $300 | 60-80 | $3.75 - $5.00 | ❌ Not yet |
| Reddit Ads (r/SaaS, r/startups) | $200 | 40-60 | $3.33 - $5.00 | ❌ Not yet |

**Why Paid Ads Aren't Profitable Yet:** With weighted LTV at $40.50 per lead, CAC needs to be below $40.50 to break even. Paid ads at $3-6 CAC are technically profitable on paper, but we need to validate conversion rates with real data before spending money.

**Recommendation:** Stick to organic for first 6 months. Reinvest revenue into paid ads after proving the funnel.

---

## Conversion Funnel Analysis

### Complete Funnel (per 1,000 unique visitors)

| Step | Description | Count | Rate |
|------|-------------|-------|------|
| 1 | Visitor lands on page | 1,000 | 100% |
| 2 | Completes full audit | 600 | 60% |
| 3 | High-savings opportunity (>$100/month) | 180 | 30% of audits |
| 4 | Provides email (lead captured) | 54 | 30% of high-savings |
| 5 | Books Credex consultation | 5.4 | 10% of leads |
| 6 | Purchases discounted credits | 1.6 | 30% of consultations |

### Revenue from 1,000 Visitors

1.6 customers ×  405LTV=648 revenue
Revenue per visitor = 0.65 Revenueperauditcompletion=1.08
Revenue per lead (email captured) = $12.00


### What These Numbers Mean for Credex

| Metric | Value | Interpretation |
|--------|-------|----------------|
| Traffic needed for $10K MRR | 15,400 visitors/month | Very achievable |
| Traffic needed for $100K MRR | 154,000 visitors/month | Requires viral growth |
| Traffic needed for $1M MRR | 1.54M visitors/month | Enterprise + paid ads |

---

## Break-Even Analysis

### Current State (Organic Traffic Only)

| Cost Category | Monthly Amount |
|---------------|----------------|
| Vercel hosting (Pro plan) | $20 |
| Supabase database (Free tier) | $0 |
| Resend emails (Free - 3,000/month) | $0 |
| Domain (if purchased) | $0 (using vercel.app) |
| **Total Monthly Costs** | **$20** |

### Break-Even Calculation

Monthly revenue needed to cover 20cost=20

At 0.65revenuepervisitor:20 ÷ $0.65 = 31 visitors per month

Break-even point: 31 visitors/month


**Current estimate:** 5,000+ visitors in first month (Product Hunt launch)

**Conclusion:** Profitable from day one with even minimal traffic.

---

## Path to $1M ARR in 18 Months

### Scenario A: Organic + Viral Growth (Most Likely)

**Key Assumptions:**
- Viral coefficient: 1.2 (each user brings 1.2 more users via shareable links)
- No paid ads for first 12 months
- Conversion rates improve by 20% through optimization
- Monthly visitors grow at 15% (organic) + viral multiplier

**Monthly Projection:**

| Month | Visitors | Monthly Revenue | Cumulative Revenue |
|-------|----------|-----------------|---------------------|
| 1 (Launch) | 5,000 | $3,240 | $3,240 |
| 2 | 7,500 | $4,860 | $8,100 |
| 3 | 11,000 | $7,128 | $15,228 |
| 4 | 15,000 | $9,720 | $24,948 |
| 5 | 20,000 | $12,960 | $37,908 |
| 6 | 30,000 | $19,440 | $57,348 |
| 7 | 42,000 | $27,216 | $84,564 |
| 8 | 58,000 | $37,584 | $122,148 |
| 9 | 78,000 | $50,544 | $172,692 |
| 10 | 100,000 | $64,800 | $237,492 |
| 11 | 130,000 | $84,240 | $321,732 |
| 12 | 160,000 | $103,680 | $425,412 |
| 13 | 195,000 | $126,360 | $551,772 |
| 14 | 235,000 | $152,280 | $704,052 |
| 15 | 280,000 | $181,440 | $885,492 |
| 16 | 330,000 | $213,840 | $1,099,332 |
| 17 | 385,000 | $249,480 | $1,348,812 |
| 18 | 445,000 | $288,360 | $1,637,172 |

**Result:** $1.64M ARR by month 18 ✅

### Scenario B: Conservative (No Viral Growth)

**Key Assumptions:**
- Viral coefficient: 1.0 (no sharing)
- 10% monthly visitor growth (organic only)
- Same conversion rates

**Projection:**

| Month | Visitors | Monthly Revenue | Cumulative Revenue |
|-------|----------|-----------------|---------------------|
| 6 | 8,000 | $5,184 | $22,000 |
| 12 | 15,000 | $9,720 | $80,000 |
| 18 | 28,000 | $18,144 | $200,000 |

**Result:** $200K ARR by month 18

**Conclusion:** Even without viral growth, the tool generates meaningful revenue. Viral growth is what makes it a $1M+ opportunity.

### Scenario C: Enterprise Focus (Higher LTV)

**Key Assumptions:**
- Build enterprise version (role-based access, team analytics)
- Enterprise LTV: $2,000 (vs $405 for startup)
- Sales-led acquisition (not self-serve)
- Higher CAC: $50 per lead (sales team time)

**Revenue per enterprise lead:**
$2,000 LTV × 30% conversion = $600 per lead

**Visitors needed for $1M ARR:**
$1,000,000 ÷ $600 = 1,667 enterprise leads per year
→ 139 enterprise leads per month

**Conclusion:** Enterprise is higher effort but lower volume required. Best approached after proving self-serve model.

---

## Unit Economics Summary

| Metric | Current (Organic) | Target (Optimized) | Enterprise |
|--------|-------------------|---------------------|------------|
| **LTV per customer** | $405 | $500 | $2,000 |
| **CAC (organic)** | $0 | $0 | $50 |
| **CAC (paid)** | $3-6 | $2 | $50 |
| **Contribution margin** | 99% | 99% | 80% |
| **Payback period** | Immediate | Immediate | 3 months |
| **Break-even (visitors/month)** | 31 | 25 | 10 (enterprise leads) |

---

## Key Metrics to Track

### North Star Metric

**Weekly Active Audits** - Number of unique users who complete an audit each week.

*Why this matters:* This measures both acquisition (people finding the tool) AND engagement (people finding value). For a free lead-gen tool, completion is more important than traffic.

### Leading Indicators

| Metric | Current | Target | Action if Below Target |
|--------|---------|--------|----------------------|
| Form completion rate | 60% | 70% | Simplify form (remove fields) |
| High-savings rate | 30% | 40% | Improve audit engine logic |
| Email capture rate | 30% | 45% | A/B test placement (before vs after results) |
| Share rate | 10% | 25% | Add incentive (unlock benchmarks) |
| Consultation booking rate | 10% | 20% | Add automated follow-up emails |

### Lagging Indicators

| Metric | Current | Target |
|--------|---------|--------|
| Monthly active users | 0 | 5,000 |
| Leads captured per month | 0 | 500 |
| Revenue per visitor | $0.65 | $1.00 |
| Viral coefficient | 0 | 1.2 |

---

## Pivot Triggers

| Trigger | Metric Threshold | Pivot Action |
|---------|-----------------|--------------|
| **Low completion** | <40% after 500 visitors | Redesign form (too complex, remove fields) |
| **Low email capture** | <15% after 200 audits | Move email gate BEFORE results |
| **Low share rate** | <5% after 500 shares | Add incentive (e.g., "share to unlock benchmark data") |
| **Low consultation booking** | <5% of high-savings leads | Add automated follow-up sequence |
| **No viral growth** | <1.0 coefficient after 1,000 audits | Build manual outreach campaign |
| **High bounce rate** | >80% on landing page | Redesign headline and CTA |

---

## What Makes This Attractive to Credex

### 1. Capital Efficient
- **$0 CAC** for first 6-12 months (organic only)
- **99% contribution margin** (only hosting costs)
- **Immediate payback period**

### 2. High-Intent Leads
- Users who complete audit have already:
  - Self-identified as AI tool users
  - Seen their specific savings number
  - Validated they want to optimize spend
- **These are not cold leads** - they're pre-qualified

### 3. Scalable
- Viral loop (shareable links) reduces marginal cost
- Each audit generates a shareable URL
- Each share brings new users at $0 cost

### 4. Defensible
- **Data moat:** Pricing data verified from 9+ vendors
- **Logic moat:** 19 tests ensure accuracy
- **Brand moat:** First-mover in "AI spend audit" category

### 5. Timely
- AI spending growing 40% YoY
- Companies desperately seeking cost optimization
- No direct competitor in this space

---

## Investment Ask (If Scaling)

### To Accelerate to $1M ARR in 12 months (instead of 18)

| Investment | Amount | Expected Impact |
|------------|--------|-----------------|
| Part-time developer (6 months) | $15,000 | Add PDF export, Slack integration, benchmarks |
| Google Ads ($500/month for 6 months) | $3,000 | Test paid acquisition |
| Content writer (launch post + 10 articles) | $2,000 | SEO foundation |
| **Total** | **$20,000** | **Accelerate to $1M ARR by month 12** |

**ROI of $20,000 investment:**
- Without investment: $1.64M ARR at month 18
- With investment: $1.64M ARR at month 12
- **6 months faster = $800,000+ additional revenue**

---

## Conclusion

The AI Spend Audit has compelling unit economics:

- **$0 CAC** for organic acquisition
- **$405 LTV** per converted customer
- **99% contribution margin**
- **31 visitors/month to break even**
- **Clear path to $1M+ ARR** in 18 months

The tool is profitable from day one, requires minimal ongoing investment, and generates high-intent leads for Credex's core business.

**The question isn't whether this works. The question is how quickly we want to scale it.**

---

*Last updated: May 24, 2026*
*Based on: 3 founders and colleagues interviews (Abdulla Shahil - Onesol AI Labs, Musthafa C P - Thoughtworks, Arun Gulecha - Kalvium/ex-Google), industry pricing data, and audit engine analysis*

