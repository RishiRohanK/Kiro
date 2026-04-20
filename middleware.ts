import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // 1. Allow the logs API to function so we can see what's happening
    if (pathname.startsWith('/api/admin/commits')) {
        return NextResponse.next();
    }

    // 2. Block all other API mutations (POST, PUT, DELETE) during the breach
    if (pathname.startsWith('/api/')) {
        const method = request.method.toUpperCase();
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
            return new NextResponse(
                JSON.stringify({ error: "System Locked: Security Breach Protocol Active" }),
                { status: 403, headers: { 'Content-Type': 'application/json' } }
            );
        }
    }

    // 3. Add Security Headers to all responses
    const response = NextResponse.next();
    
    // Strict CSP
    response.headers.set('Content-Security-Policy', "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; frame-src 'self' https://www.google.com/recaptcha/ https://recaptcha.google.com/;");
    
    // Prevent Clickjacking
    response.headers.set('X-Frame-Options', 'DENY');
    
    // Prevent MIME-sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff');
    
    // Referrer Policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    
    // HSTS (Force HTTPS)
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');

    return response;
}

// Ensure middleware runs on all relevant paths
export const config = {
    matcher: [
        '/api/:path*',
        '/admin/:path*',
        '/intern/:path*',
        '/employee/:path*',
    ],
};
