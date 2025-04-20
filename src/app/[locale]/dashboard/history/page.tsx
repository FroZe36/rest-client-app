import type { Metadata } from 'next';

import HistoryWrapper from '@/components/History/HistoryWrapper';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

export const metadata: Metadata = {
  title: 'History',
  ...NO_INDEX_PAGE,
};

export default function HistoryPage() {
  return <HistoryWrapper />;
}
