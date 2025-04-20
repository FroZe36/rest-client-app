'use client';

import { useLocale, useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import React, { ChangeEvent, useEffect, useRef } from 'react';
import { toast } from 'sonner';

import {
  DASHBOARD_PAGES,
  SIGNIN_PATH,
  SIGNUP_PATH,
} from '@/config/pages-url.config';

import { useUser } from '@/hooks/useUser';

import logo from '../../public/logo.svg';

import { usePathname, useRouter } from '@/i18n/navigation';

const Header = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const pathname = usePathname();
  const { user, signOut } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Main');

  const handleLangChange = (e: ChangeEvent<HTMLSelectElement>) => {
    router.replace({ pathname }, { locale: e.target.value });
  };

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;
    const handleScroll = () => {
      const shouldBeTransparent = window.scrollY > 20;
      header.style.backgroundColor = shouldBeTransparent
        ? '#272822'
        : 'var(--bg-grey)';
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = async () => {
    await signOut();
    toast.success('Successfully signed out!');

    router.push(DASHBOARD_PAGES.ROOT);
  };

  return (
    <header ref={headerRef}>
      {user ? (
        <>
          <Link
            href={`${DASHBOARD_PAGES.HOME}`}
            className='buttons-container'
          >
            <Image
              priority={true}
              width={30}
              height={30}
              src={logo}
              alt='logo'
            />
            <span data-testid='rest_client_logo'>Rest Client</span>
          </Link>
          <div className='buttons-container'>
            <Link
              href={`${DASHBOARD_PAGES.REST}`}
              className={`button ${pathname.includes(`${DASHBOARD_PAGES.REST}`) ? 'active' : ''}`}
            >
              REST Client
            </Link>
            <Link
              href={`${DASHBOARD_PAGES.HISTORY}`}
              className={`button ${pathname === `${DASHBOARD_PAGES.HISTORY}` ? 'active' : ''}`}
            >
              {t('history')}
            </Link>
            <Link
              href={`${DASHBOARD_PAGES.VARIABLES}`}
              className={`button ${pathname === `${DASHBOARD_PAGES.VARIABLES}` ? 'active' : ''}`}
            >
              {t('variables')}
            </Link>
          </div>
          <div className='buttons-container'>
            <select
              onChange={handleLangChange}
              defaultValue={locale}
            >
              <option value='en'>En</option>
              <option value='ru'>Ru</option>
            </select>

            <button
              className={`button button_colored`}
              onClick={handleLogout}
            >
              {t('signOut')}
            </button>
          </div>
        </>
      ) : (
        <>
          <Link
            href={`${DASHBOARD_PAGES.ROOT}`}
            className='buttons-container'
          >
            <Image
              priority={true}
              width={30}
              height={30}
              src={logo}
              alt='logo'
            />
            <span>Rest Client</span>
          </Link>
          <div className='buttons-container'>
            <select
              onChange={handleLangChange}
              defaultValue={locale}
            >
              <option value='en'>En</option>
              <option value='ru'>Ru</option>
            </select>

            <Link
              href={SIGNIN_PATH}
              className={`button ${pathname === SIGNIN_PATH ? 'active' : ''}`}
            >
              {t('signIn')}
            </Link>
            <Link
              href={SIGNUP_PATH}
              className={`button ${pathname === SIGNUP_PATH ? 'active' : ''}`}
            >
              {t('signUp')}
            </Link>
          </div>
        </>
      )}
    </header>
  );
};

export default Header;
