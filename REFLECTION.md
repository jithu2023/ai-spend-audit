# Reflection - AI Spend Audit

## 1. The hardest bug I hit this week, and how I debugged it

The hardest bug was form state not persisting when clicking "Back to form" from results. The form would reset to default values instead of showing the user's original inputs.

**How I debugged it:**
1. Added console.log statements to track state changes
2. Realized the form was re-mounting fresh when coming back from results
3. Implemented an `initialData` prop that passes the last submitted input back to the form
4. Added priority loading: initialData → localStorage → default values

**What worked:** Treating the form as a controlled component that can receive external initial data while maintaining its own internal state.

## 2. A decision I reversed mid-week, and what made me reverse it

**Decision reversed:** I initially included a "Seats per tool" field thinking it would provide more accurate audit results.

**Why I reversed it:** 
- User mental model: founders don't track per-tool seats, they know total monthly cost
- Added unnecessary complexity to the form (4 columns instead of 3)
- The audit logic became overly complex with seat-based calculations

**What I learned:** Simplicity > precision for an MVP. Get 80% accurate data from 100 users, not 95% from 10 users.

## 3. What I would build in week 2 if I had it

1. **Company Benchmarking Dashboard** - Show how your AI spend compares to similar-stage startups
2. **Automated Monthly Re-audits** - Email users when pricing changes or new tools launch
3. **Slack Integration** - "/aiaudit" command that runs an audit on your team's tools
4. **Referral Program** - Share the tool, both parties get Credex credits

## 4. How I used AI tools

**Tools used:** Cursor (primary), ChatGPT (brainstorming)

**What I used them for:**
- Cursor: Autocomplete, refactoring, test generation
- ChatGPT: Brainstorming GTM strategies and user interview questions

**What I did NOT trust AI with:**
- Pricing data accuracy (verified each URL manually)
- Audit logic math (wrote manual tests to validate)
- User interviews (real conversations only)

**One specific time AI was wrong:**
Cursor suggested memoizing all audit results with useMemo. The problem? The audit runs once per submission, so memoization added complexity without benefit.

## 5. Self-rating (1-10)

| Metric | Rating | Reason |
|--------|--------|--------|
| **Discipline** | 9/10 | Committed daily, following the 7-day plan |
| **Code Quality** | 8/10 | TypeScript, tests, readable components. Need better error handling |
| **Design Sense** | 7/10 | Functional with shadcn/ui. Room for custom animations |
| **Problem-Solving** | 8/10 | Debugged state persistence, simplified form based on feedback |
| **Entrepreneurial Thinking** | 8/10 | Did user interviews (planned), thought about GTM and economics |

**Total: 40/50**