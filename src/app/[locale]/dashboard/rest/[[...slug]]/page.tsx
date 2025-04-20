import type { Metadata } from 'next';

import RestLazyWrapper from '@/components/Rest/RestLazyWrapper';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

export const metadata: Metadata = {
  title: 'Rest',
  ...NO_INDEX_PAGE,
};

export default async function RestPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;

  return <RestLazyWrapper slugs={slug} />;
}
