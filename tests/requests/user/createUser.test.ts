import { GraphQLError } from 'graphql';

import { resetDB, disconnect, graphQLRequestAsUser } from '../../helpers';
import { UserFactory } from '../../factories/user';
import { RoleFactory } from '../../factories/role';
import { UserCreateInput } from '../../../types';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('User createUser mutation', () => {
  describe('non-admin', () => {
    it('returns a Forbidden error', async () => {
      const query = `
        mutation CREATEUSER($data: UserCreateInput!) {
          createUser(data: $data) {
            id
            email
          }
        }
      `;

      await RoleFactory.create({ name: 'ADMIN' });
      await RoleFactory.create({ name: 'USER' });

      const user = await UserFactory.create({
        email: 'foo@wee.net',
        roles: { connect: [{ name: 'USER' }] },
      });

      const variables: { data: UserCreateInput } = {
        data: { email: 'otherUser@email.com', password: 'fake' },
      };

      const response = await graphQLRequestAsUser(user, { query, variables });
      console.log(response.body);

      const errorMessages = response.body.errors.map((e: GraphQLError) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Not authorized",
        ]
      `);
    });
  });

  // describe('admin', () => {
  //   it('allows setting role', async () => {
  //     const query = `
  //       mutation CREATEUSER($data: UserCreateInput!) {
  //         createUser(data: $data) {
  //           id
  //           roles
  //         }
  //       }
  //     `;

  //     const admin = await UserFactory.create({ roles: { connect: { name: 'ADMIN' } } });

  //     const variables: { data: UserCreateInput } = {
  //       data: { email: 'hello@wee.net', password: 'fake', roles: { where: { name: 'ADMIN' } } },
  //     };

  //     const response = await graphQLRequestAsUser(admin, { query, variables });
  //     const user = response.body.data.createUser;

  //     const expectedRoles = [Role.ADMIN];
  //     expect(user.id).not.toBeNull();
  //     expect(user.roles).toEqual(expectedRoles);
  //   });
  // });
});
