import { Prisma } from '@prisma/client';

import { buildPrismaIncludeFromAttrs } from '../helpers/buildPrismaIncludeFromAttrs';
import { prisma } from '../../lib/prisma';

export const RoleFactory = {
  build: (attrs: Partial<Prisma.RoleCreateInput> = {}) => {
    return {
      name: 'ADMIN',
      ...attrs,
    };
  },

  create: async (attrs: Partial<Prisma.RoleCreateInput> = {}) => {
    const role = RoleFactory.build(attrs);
    const options: Record<string, any> = {};
    const includes = buildPrismaIncludeFromAttrs(attrs);
    if (includes) options.include = includes;

    return await prisma.role.create({
      data: { ...role },
      ...options,
    });
  },
};
