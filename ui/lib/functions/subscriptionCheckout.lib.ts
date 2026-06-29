import { ISubscriptionModel } from '@/typescript/interface/subscription.interfaces';
import { destroyCookie } from 'nookies';
import { SessionStorageKey } from './keys/sesssionStorageKeys';
import { sessionStorageHelper } from './sessionStorageHelper';
import { checkWindow, setCookieClient } from './storage.lib';

export const getSubscriptionAccessToken = (
  response: ISubscriptionModel['SubscriptionLoginResponse']
) => {
  return response.accessToken || response.data?.accessToken || '';
};

export const saveSubscriptionAuthToken = (token: string) => {
  setCookieClient(process.env.NEXT_APP_TOKEN_NAME || 'accessToken', token);
  window.sessionStorage.setItem(process.env.NEXT_APP_TOKEN_NAME || 'accessToken', token);
};

export const clearSubscriptionCheckoutSession = (token: string) => {
  const tokenCookieNames = [process.env.NEXT_APP_TOKEN_NAME].filter(
    (cookieName, index, cookieNames): cookieName is string => {
      return Boolean(cookieName) && cookieNames.indexOf(cookieName) === index;
    }
  );

  tokenCookieNames.forEach(cookieName => {
    destroyCookie(null, cookieName, {
      path: '/',
    });
  });

  if (!checkWindow()) {
    return;
  }

  tokenCookieNames.forEach(cookieName => {
    window.sessionStorage.removeItem(cookieName);
  });
  window.sessionStorage.removeItem(`subscription_checkout:${token}`);
  sessionStorageHelper.remove(SessionStorageKey.SubscriptionPlan);
};
