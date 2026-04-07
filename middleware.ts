import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; 
const MAX_REQUESTS = 100; 

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  
  if (pathname.startsWith('/cleed/dashboard') || pathname.startsWith('/api/cleed')) {
    
    if (pathname !== '/api/cleed/login') {
      const session = request.cookies.get('cleed_session');
      if (!session || session.value !== 'authenticated_admin') {
        
        if (pathname.startsWith('/api/')) {
          return new NextResponse(
            JSON.stringify({ error: 'Identity verification required' }),
            { status: 401, headers: { 'Content-Type': 'application/json' } }
          );
        }
        return NextResponse.redirect(new URL('/cleed/login', request.url));
      }
    }
  }

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || request.headers.get('x-real-ip') || '127.0.0.1';
  const now = Date.now();
  
  let count = 0;
  const isSignin = pathname.includes('/signin');
  const limit = isSignin ? 10 : MAX_REQUESTS;

  try {
    const { default: redis } = await import('@/lib/redis');
    if (redis) {
      const key = `ratelimit:${ip}:${isSignin ? 'signin' : 'api'}`;
      count = await redis.incr(key);
      if (count === 1) await redis.expire(key, 60);
    } else {
      const rateLimitInfo = rateLimitMap.get(ip) || { count: 0, lastReset: now };
      if (now - rateLimitInfo.lastReset > RATE_LIMIT_WINDOW) {
        rateLimitInfo.count = 0;
        rateLimitInfo.lastReset = now;
      }
      rateLimitInfo.count++;
      rateLimitMap.set(ip, rateLimitInfo);
      count = rateLimitInfo.count;
    }
  } catch (err) {
  }

  if (count > limit && pathname.startsWith('/api')) {
    return new NextResponse(
      JSON.stringify({ error: 'System policy: Too many attempts. Security block active.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  
  const response = NextResponse.next();
  
  
  
  response.headers.set(
    'Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.supabase.co https://checkout.razorpay.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; img-src 'self' data: https: blob:; font-src 'self' https://fonts.gstatic.com; connect-src 'self' https://*.supabase.co https://api.razorpay.com; frame-src 'self' https://*.razorpay.com; base-uri 'self'; form-action 'self';"
  );

  
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

  
  response.headers.set('X-Frame-Options', 'DENY');

  
  response.headers.set('X-Content-Type-Options', 'nosniff');

  
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  
  response.headers.set('X-XSS-Protection', '1; mode=block');

  
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), interest-cohort=()');

  return response;
}

export const config = {
  matcher: [
    






    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
