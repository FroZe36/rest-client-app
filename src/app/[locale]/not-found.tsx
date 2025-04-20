import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';

import { DASHBOARD_PAGES } from '@/config/pages-url.config';

import img from '@/../public/404.png';

export default function NotFound() {
  const t = useTranslations('404');
  return (
    <div>
      <h1 className='maintext_green'>{t('title')}</h1>
      <p className='subtext'>{t('description')}</p>
      <Link
        href={`${DASHBOARD_PAGES.HOME}`}
        className='button button_colored'
      >
        {t('backButton')}
      </Link>
      <Image
        priority={true}
        width={500}
        height={400}
        src={img}
        alt='Error'
      />
    </div>
  );
}
