This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.



## Screenshots

### Desktop Application

| Form Page | Results Page |
|-----------|--------------|
| <img src="https://raw.githubusercontent.com/jithu2023/ai-spend-audit/main/public/screenshot-1-form.png" width="400"> | <img src="https://raw.githubusercontent.com/jithu2023/ai-spend-audit/main/public/screenshot-2-results.png" width="400"> |

### Mobile Responsive

<img src="https://raw.githubusercontent.com/jithu2023/ai-spend-audit/main/public/screenshot-3-mobile.png" width="300">

### PDF Report & Sharing

| PDF Report | Shared Link (Incognito) |
|------------|-------------------------|
| <img src="https://raw.githubusercontent.com/jithu2023/ai-spend-audit/main/public/screenshot-4-pdf.png" width="400"> | <img src="https://raw.githubusercontent.com/jithu2023/ai-spend-audit/main/public/screenshot-5-share.png" width="400"> |

## Live Demo

🔗 **Live URL:** [https://ai-spend-audit-hazel-seven.vercel.app](https://ai-spend-audit-hazel-seven.vercel.app)

## Features

- ✅ **9 AI Tools Supported**: Cursor, GitHub Copilot, Claude, ChatGPT, Gemini, Windsurf, Anthropic API, OpenAI API
- ✅ **Smart Audit Engine**: Detects team plan overpayment, redundant tools, API vs subscription savings
- ✅ **Optimization Score**: 0-100 score showing how optimized your spending is
- ✅ **Smart Summary Generator**: Personalized audit insights using rule-based LLM (always works, no API dependency)
- ✅ **PDF Export**: Download professional report
- ✅ **Shareable URLs**: Each audit gets unique link with OG tags
- ✅ **Email Capture**: Save audits to Supabase database
- ✅ **Rate Limiting**: 20 requests/minute for API protection
- ✅ **19 Passing Tests**: Comprehensive test coverage