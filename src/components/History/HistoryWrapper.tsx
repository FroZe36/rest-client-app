'use client';

import { Suspense, lazy } from 'react';

import Spinner from '../Spinner/Spinner';

const LazyHistory = lazy(() => import('@/components/History/History'));

const HistoryWrapper = () => {
  return (
    <Suspense fallback={<Spinner />}>
      <LazyHistory />
    </Suspense>
  );
};

export default HistoryWrapper;
