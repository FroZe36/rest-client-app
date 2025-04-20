'use client';

import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

import { DASHBOARD_PAGES } from '@/config/pages-url.config';

import { useUser } from '@/hooks/useUser';

import About from '../About/About';

import styles from './dashboard.module.css';

const { dashboard } = styles;

const Dashboard = () => {
  const { user, signOut } = useUser();
  const router = useRouter();
  const handleLogout = async () => {
    await signOut();
    toast.success('Successfully signed out!');

    router.push(DASHBOARD_PAGES.ROOT);
  };

  const t = useTranslations('Main');

  return (
    <>
      <section className={dashboard}>
        <h1 className='maintext'>
          {t('authorizedTitle')},{' '}
          <span className='maintext_green'>
            {user?.identities?.[0]?.identity_data?.first_name}
          </span>
          !
        </h1>
        <p className='subtext'>{t('authorizedDescription')}</p>
        <button
          onClick={handleLogout}
          className='button button_colored'
        >
          {t('signOut')}
        </button>
      </section>
      <About />
    </>
  );
};
export default Dashboard;
