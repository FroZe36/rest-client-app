import { createServerClient } from '@supabase/ssr';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createClient } from '@/utils/supabase/server';

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

vi.mock('next/headers', () => ({
  cookies: () => mockCookieStore,
}));

vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn((url, key, options) => {
    return {
      auth: {
        getUser: vi.fn(() => {
          options.cookies.getAll();
          return Promise.resolve({ data: { user: {} }, error: null });
        }),
      },
      cookies: options.cookies,
    };
  }),
}));

describe('Supabase Server Client', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321');
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test_anon_key');
  });

  afterEach(() => {
    mockCookieStore.cookies.clear();
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  it('should create a Supabase client', async () => {
    const client = await createClient();
    expect(client).toBeDefined();
  });

  it('should get all cookies', async () => {
    mockCookieStore.cookies.set('test', 'test');
    mockCookieStore.cookies.set('test2', 'test2');
    //eslint-disable-next-line
    const client = await createClient();
    const mockedCreateServerClient = vi.mocked(createServerClient);
    const supabaseClient = mockedCreateServerClient.mock.results[0].value;
    await supabaseClient.auth.getUser();
    expect(mockCookieStore.getAll).toHaveBeenCalled();
    expect(mockCookieStore.getAll()).toEqual([
      { name: 'test', value: 'test' },
      { name: 'test2', value: 'test2' },
    ]);
  });

  it('should set cookies', async () => {
    //eslint-disable-next-line
    const client = await createClient();
    const cookiesToSet = [
      { name: 'test', value: 'test', options: {} },
      { name: 'test2', value: 'test2', options: {} },
    ];
    const mockedCreateServerClient = vi.mocked(createServerClient);
    const supabaseClient = mockedCreateServerClient.mock.results[0].value;
    supabaseClient.cookies.setAll(cookiesToSet);
    expect(mockCookieStore.set).toHaveBeenCalledTimes(2);
    expect(mockCookieStore.set).toHaveBeenNthCalledWith(1, 'test', 'test', {});
    expect(mockCookieStore.set).toHaveBeenNthCalledWith(
      2,
      'test2',
      'test2',
      {}
    );
  });
});
