'use server';

import 'server-only';

import type { ThemeCookieVal } from '@marbemac/ui-theme';
import { cookies } from 'next/headers';

export const setThemeCookie = async (theme: ThemeCookieVal) => {
  cookies().set('theme', JSON.stringify(theme));
};
