import { NextRequest, NextResponse } from 'next/server';

// If the incoming request has the "token" cookie
export function middleware(request: NextRequest) {
  const hasToken = request.cookies.get(process.env.NEXT_APP_TOKEN_NAME!)?.name;

  if (hasToken === undefined || hasToken === null) {
    request.nextUrl.pathname = '/login';

    return NextResponse.redirect(request.nextUrl);
  } else {
    return NextResponse.next();
  }
}

export const config = {
  matcher: ['/dashboard/dashboardfirst/'],
};
