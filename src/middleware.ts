import createMiddleware from 'next-intl/middleware';
import { type NextRequest, NextResponse } from 'next/server';

import { updateSession } from '@/utils/supabase/middleware';
import { createClient } from '@/utils/supabase/server';

import { AUTH_PATH, DASHBOARD_PAGES } from './config/pages-url.config';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { nextUrl } = request;

  const response = await updateSession(request);

  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    await supabase.auth.signOut();
  }

  const isAuthPage = nextUrl.pathname.includes(AUTH_PATH);
  const isRest = nextUrl.pathname.includes(DASHBOARD_PAGES.REST);
  const isHistory = nextUrl.pathname.includes(DASHBOARD_PAGES.HISTORY);
  const isVariables = nextUrl.pathname.includes(DASHBOARD_PAGES.VARIABLES);
  const hasCode = nextUrl.searchParams.has('code');

  if (hasCode) {
    return response;
  }

  if (!user && (isRest || isHistory || isVariables)) {
    return NextResponse.redirect(new URL(AUTH_PATH, request.url));
  }

  if (user && isAuthPage) {
    return NextResponse.redirect(new URL(DASHBOARD_PAGES.HOME, request.url));
  }

  const intlResponse = intlMiddleware(request);
  if (intlResponse) {
    return intlResponse;
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|login|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
