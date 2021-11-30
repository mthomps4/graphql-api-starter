import { UserRole, RoleCreateInput } from '../../../types';
import { prisma } from '../../../lib/prisma';

type SeedRoleResult = Pick<UserRole, 'id' | 'name'>;

export const seedRoles = async (roles: RoleCreateInput[]): Promise<SeedRoleResult[]> => {
  const rolePromiseArray = roles.map(
    async (role): Promise<SeedRoleResult> =>
      prisma.role.upsert({
        where: {
          name: role.name,
        },
        create: {
          name: role.name,
          description: role.description,
        },
        update: {},
        select: {
          id: true,
          name: true,
        },
      })
  );

  return Promise.all(rolePromiseArray);
};
