declare module 'next-router-mock' {
  import { ReactNode } from 'react';
  import { NextRouter } from 'next/router';

  export function mockRouter(router: Partial<NextRouter>): NextRouter;
  export function MemoryRouterProvider({
    children,
  }: {
    children: ReactNode;
  }): JSX.Element;
  export function useRouter(): NextRouter;
  export function createMockRouter(router: Partial<NextRouter>): NextRouter;
}
