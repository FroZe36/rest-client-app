import { redirect } from 'next/navigation';

import { SIGNIN_PATH } from '@/config/pages-url.config';

const AuthPage = () => {
  redirect(SIGNIN_PATH);
};

export default AuthPage;
