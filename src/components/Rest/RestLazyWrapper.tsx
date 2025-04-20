'use client';

import { Suspense, lazy } from 'react';

import Spinner from '../Spinner/Spinner';

const LazyRest = lazy(() => import('@/components/Rest/Rest'));

interface RestLazyWrapperProps {
  slugs: string[];
}

const RestLazyWrapper = ({ slugs }: RestLazyWrapperProps) => {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyRest slugs={slugs} />
    </Suspense>
  );
};

export default RestLazyWrapper;
