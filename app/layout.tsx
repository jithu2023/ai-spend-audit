import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap', // This helps with LCP - shows text immediately
  preload: true,
});

export const metadata: Metadata = {
  title: 'AI Spend Audit - Stop Overpaying on AI Tools | Free Audit Tool',
  description: 'Free AI spend audit shows exactly where you\'re wasting money on Cursor, ChatGPT, Claude, GitHub Copilot, and more. Save up to 40% on AI tools instantly.',
  keywords: 'AI spend, cost optimization, Cursor, ChatGPT, Claude, GitHub Copilot, AI tools, cloud credits, Credex',
  authors: [{ name: 'Credex' }],
  openGraph: {
    title: 'AI Spend Audit - Free AI Cost Optimization Tool',
    description: 'Discover how much you\'re overspending on AI tools and how to fix it.',
    url: 'https://ai-spend-audit.vercel.app',
    siteName: 'AI Spend Audit',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI Spend Audit - Free AI Cost Optimization Tool',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Spend Audit - Free AI Cost Optimization Tool',
    description: 'Discover how much you\'re overspending on AI tools and how to fix it.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}