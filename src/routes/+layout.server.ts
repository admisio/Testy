import { JWT_SECRET } from '$env/static/private';
import jwt from 'jsonwebtoken';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad<
  { isAuthenticated?: false; userName?: never } | { isAuthenticated: true; userName: string }
> = async ({ cookies }) => {
  try {
    const { name: userName } = jwt.verify(cookies.get('jwt') || '', JWT_SECRET) as { name: string };
    return { isAuthenticated: true, userName };
  } catch {
    return { isAuthenticated: false };
  }
};
