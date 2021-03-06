import { Context } from '../graphql/context';
import { User } from '../types';

/**
 * Returns true if the user has a role of admin
 * @param user The user to check the role for
 */
export const isAdmin = (ctx: Context): boolean => {
  return ctx.user.roles.some((role) => role.name === 'ADMIN');
};

/**
 * Returns true if the passed in user is the same as the logged in user
 * @param user the user to test
 * @param ctx the context which contains the current user
 */
export function isSelf(user: Pick<User, 'id'>, ctx: Context): boolean {
  return user.id === ctx.user?.id;
}

/**
 * Returns true if a user can access an object. This is a very basic check that quickly does the following:
 *   The current user is an admin
 *   The current user is trying to access themselves
 *   The object has a userId property that the same id as the current user
 * @param object the object to check for a userId property on
 * @param ctx the context which contains the current user
 * @param idField the key in the object to check against
 */
export function canAccess(user: Pick<User, 'id'>, ctx: Context): boolean {
  if (!ctx.user) return false;
  if (isAdmin(ctx)) return true;
  if (isSelf(user, ctx)) return true;

  return false;
}
