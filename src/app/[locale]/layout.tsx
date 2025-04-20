import type { Metadata } from 'next';
import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { Exo_2 } from 'next/font/google';
import { notFound } from 'next/navigation';
import { Toaster } from 'sonner';

import AuthRedirectHandler from '@/components/AuthRedirectHandler';
import Footer from '@/components/Footer';
import Header from '@/components/Header';

import SessionChecker from '@/utils/SessionChecker';

import './globals.css';
import { VariablesProvider } from '@/context/VariablesContext';
import { routing } from '@/i18n/routing';

const exo = Exo_2({
  variable: '--font-exo',
  subsets: ['latin', 'cyrillic'],
});

export const metadata: Metadata = {
  title: 'REST Client',
  description: 'Send HTTP request and view the response',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  return (
    <html lang={locale}>
      <body className={`${exo.variable}`}>
        <NextIntlClientProvider>
          <SessionChecker />
          <VariablesProvider>
            <div className='appWrapper'>
              <Header />
              <main>{children}</main>
              <Footer />

              <Toaster
                theme='light'
                position='top-right'
                duration={2000}
                expand={true}
                richColors
                toastOptions={{
                  style: {
                    fontSize: '1.1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                  },
                }}
              />
              <AuthRedirectHandler />
            </div>
          </VariablesProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
