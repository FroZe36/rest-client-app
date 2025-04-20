import type { Metadata } from 'next';

import VariablesWrapper from '@/components/Variables/VariablesWrapper';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

export const metadata: Metadata = {
  title: 'Variables',
  ...NO_INDEX_PAGE,
};

export default function VariablesPage() {
  return <VariablesWrapper />;
}
