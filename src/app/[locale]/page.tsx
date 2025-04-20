import { useTranslations } from 'next-intl';
import Link from 'next/link';

import About from '@/components/About/About';

import { SIGNIN_PATH, SIGNUP_PATH } from '@/config/pages-url.config';

export default function Home() {
  const t = useTranslations('Main');
  return (
    <>
      <section className='home'>
        <h1 className='maintext'>
          {t.rich('title', {
            span: (chunk) => <span className='maintext_green'>{chunk}</span>,
          })}
        </h1>
        <p className='subtext'>
          {t.rich('description', {
            br: () => <br />,
          })}
        </p>
        <div className='buttons-container'>
          <Link
            href={SIGNIN_PATH}
            className='button button_colored'
          >
            {t('signIn')}
          </Link>
          <Link
            href={SIGNUP_PATH}
            className='button button_colored'
          >
            {t('signUp')}
          </Link>
        </div>
      </section>
      <About />
    </>
  );
}
