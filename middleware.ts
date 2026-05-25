import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory rate limit (resets on server restart - fine for demo)
const ipRequests = new Map<string, number[]>();

// Helper to get client IP from headers
function getClientIp(request: NextRequest): string {
  // Try different headers that might contain the IP
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0];
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }
  
  // Fallback to a unique identifier based on headers
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const acceptLanguage = request.headers.get('accept-language') || 'unknown';
  return `${userAgent}-${acceptLanguage}`;
}

export function middleware(request: NextRequest) {
  // Only rate limit API routes
  if (!request.nextUrl.pathname.startsWith('/api/')) {
    return NextResponse.next();
  }
  
  const clientIp = getClientIp(request);
  const now = Date.now();
  const windowMs = 60 * 1000; // 1 minute
  const maxRequests = 20; // 20 requests per minute
  
  const requests = ipRequests.get(clientIp) || [];
  const recentRequests = requests.filter(time => now - time < windowMs);
  
  if (recentRequests.length >= maxRequests) {
    return new NextResponse(
      JSON.stringify({ error: 'Too Many Requests', message: 'Please try again later.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }
  
  recentRequests.push(now);
  ipRequests.set(clientIp, recentRequests);
  
  // Clean up old entries periodically
  if (ipRequests.size > 1000) {
    for (const [ip, times] of ipRequests.entries()) {
      const validTimes = times.filter(time => now - time < windowMs);
      if (validTimes.length === 0) {
        ipRequests.delete(ip);
      } else {
        ipRequests.set(ip, validTimes);
      }
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: '/api/:path*',
}