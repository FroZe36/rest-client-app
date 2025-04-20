class DASHBOARD {
  private root = '/dashboard';

  ROOT = `/`;
  HOME = this.root;
  REST = `${this.root}/rest`;
  HISTORY = `${this.root}/history`;
  VARIABLES = `${this.root}/variables`;
}

export const DASHBOARD_PAGES = new DASHBOARD();

export const AUTH_PATH = '/auth';
export const SIGNIN_PATH = '/auth/signin';
export const SIGNUP_PATH = '/auth/signup';

export const ERROR_PATH = '/error';
