import { getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';

// Middleware for next-auth defines protected paths and redirects to login if user is not authenticated
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const protectedPaths = ['/', '/admin'];
  const isPathProtected = protectedPaths?.some(path => pathname == path);

  const res = NextResponse.next();

  if (isPathProtected) {
    const token = await getToken({ req });
    if (!token) {
      const url = new URL(`/login`, req.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
  }

  return res;
}
