import { createServerClient } from '@supabase/ssr';
import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { updateSession } from '@/utils/supabase/middleware';

const mockCookieStore = {
  cookies: new Map<string, string>(),
  getAll: vi.fn(() => {
    const cookies = [];
    for (const [name, value] of mockCookieStore.cookies) {
      cookies.push({ name, value });
    }
    return cookies;
  }),
  set: vi.fn((name: string, value: string) => {
    mockCookieStore.cookies.set(name, value);
  }),
};

vi.mock('next/server', () => ({
  NextResponse: {
    next: vi.fn(() => ({
      cookies: {
        set: vi.fn(),
      },
    })),
    redirect: vi.fn(),
  },
  NextRequest: class MockNextRequest {
    constructor(url: string) {
      this.url = url;
      this.cookies = {
        getAll: mockCookieStore.getAll,
        set: mockCookieStore.set,
      };
    }
    url: string;
    cookies: {
      getAll: () => { name: string; value: string }[];
      set: (name: string, value: string, options?: string) => void;
    };
  },
}));

vi.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn((url, key, options) => {
    return {
      auth: {
        getUser: vi.fn(() => {
          return Promise.resolve({ data: { user: {} }, error: null });
        }),
      },
      cookies: options.cookies,
    };
  }),
}));

describe('Supabase Middleware', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test_anon_key');
  });

  afterEach(() => {
    mockCookieStore.cookies.clear();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('should call supabase.auth.getUser', async () => {
    const request = new NextRequest(new URL('http://localhost'));
    await updateSession(request);
    const mockedCreateServerClient = vi.mocked(createServerClient);
    const supabaseClient = mockedCreateServerClient.mock.results[0].value;
    expect(supabaseClient.auth.getUser).toHaveBeenCalled();
  });

  it('should set cookies', async () => {
    const request = new NextRequest(new URL('http://localhost'));
    await updateSession(request);
    const mockedCreateServerClient = vi.mocked(createServerClient);
    const supabaseClient = mockedCreateServerClient.mock.results[0].value;
    const cookiesToSet = [
      { name: 'test', value: 'test', options: {} },
      { name: 'test2', value: 'test2', options: {} },
    ];
    supabaseClient.cookies.setAll(cookiesToSet);
    expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
    expect(mockCookieStore.set).toHaveBeenNthCalledWith(1, 'test', 'test');
    expect(mockCookieStore.set).toHaveBeenNthCalledWith(2, 'test2', 'test2');
  });

  it('should return NextResponse', async () => {
    const request = new NextRequest(new URL('http://localhost'));
    const response = await updateSession(request);
    expect(response).toBeDefined();
  });
});
