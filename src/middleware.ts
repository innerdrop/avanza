import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // Check if request is for /ops routes
    if (request.nextUrl.pathname.startsWith('/ops')) {

        // Allow access to login page
        if (request.nextUrl.pathname === '/ops/login') {
            return NextResponse.next();
        }

        // Check for auth token
        const authToken = request.cookies.get('auth_token');

        // If no token or invalid admin token, redirect to login
        if (!authToken || authToken.value !== 'admin_session') {
            const loginUrl = new URL('/ops/login', request.url);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/ops/:path*',
};
