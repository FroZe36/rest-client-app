'use client';

import type { Metadata } from 'next';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

import { NO_INDEX_PAGE } from '@/constants/seo.constants';

import img from '@/../public/Error.png';

export const metadata: Metadata = {
  title: 'Error Page',
  ...NO_INDEX_PAGE,
};

export default function Error() {
  const t = useTranslations('Main');
  return (
    <section>
      <Image
        priority={true}
        width={340}
        height={340}
        src={img}
        alt='error'
      />
      <h2>{t('errorPageDescription')}</h2>
    </section>
  );
}
