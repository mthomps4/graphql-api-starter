import { inputObjectType, objectType } from 'nexus';

export const UserRole = objectType({
  name: 'UserRole',
  description: 'User Roles',
  definition(t) {
    t.nonNull.id('id');
    t.nonNull.date('createdAt');
    t.nonNull.date('updatedAt');
    t.nonNull.string('name');
    t.string('description');
    t.list.field('users', {
      type: 'User',
      resolve: (parent, _, context) => {
        return context.prisma.role.findUnique({ where: { id: parent.id } }).users();
      },
    });
  },
});

export const RoleWhereUniqInput = inputObjectType({
  name: 'RoleWhereUniqInput',
  description: 'Find role By',
  definition(t) {
    t.id('id');
    t.string('name');
  },
});

export const RoleRelationalCreateInput = inputObjectType({
  name: 'RoleRelationalCreateInput',
  description: 'Input to Add a role to a',
  definition(t) {
    t.nonNull.field('connect', { type: 'RoleWhereUniqInput', list: true });
  },
});

export const RoleCreateInput = inputObjectType({
  name: 'RoleCreateInput',
  description: 'Input to create a role',
  definition(t) {
    t.nonNull.string('name');
    t.string('description');
  },
});
