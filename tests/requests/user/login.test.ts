import { GraphQLError } from 'graphql';

import { graphQLRequest, resetDB, disconnect } from '../../helpers';
import { UserFactory } from '../../factories/user';
import { RoleFactory } from '../../factories/role';

beforeEach(async () => resetDB());
afterAll(async () => disconnect());

describe('login mutation', () => {
  const query = `
    mutation LOGIN($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        user {
          email
        }
      }
    }
  `;

  describe('invalid email', () => {
    it('returns an Authentication error', async () => {
      await RoleFactory.create({ name: 'ADMIN' });
      await RoleFactory.create({ name: 'USER' });
      await UserFactory.create({ email: 'foo@wee.net' });

      const variables = { email: 'fake', password: 'fake' };
      const response = await graphQLRequest({ query, variables });
      const errorMessages = response.body.errors.map((e: GraphQLError) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "No user found for email: fake",
        ]
      `);
    });
  });

  describe('invalid password', () => {
    it('returns an Authentication error', async () => {
      await RoleFactory.create({ name: 'ADMIN' });
      await RoleFactory.create({ name: 'USER' });
      const user = await UserFactory.create({ email: 'foo@wee.net' });

      const variables = { email: user.email, password: 'fake' };
      const response = await graphQLRequest({ query, variables });
      const errorMessages = response.body.errors.map((e: GraphQLError) => e.message);

      expect(errorMessages).toMatchInlineSnapshot(`
        Array [
          "Invalid password",
        ]
      `);
    });
  });

  describe('valid password', () => {
    it('returns the auth payload', async () => {
      await RoleFactory.create({ name: 'ADMIN' });
      await RoleFactory.create({ name: 'USER' });
      const password = 'asdf';

      const user = await UserFactory.create({
        email: 'test@wee.net',
        password,
      });

      const variables = { email: user.email, password };
      const response = await graphQLRequest({ query, variables });

      expect(response.body).toMatchInlineSnapshot(`
        Object {
          "data": Object {
            "login": Object {
              "user": Object {
                "email": null,
              },
            },
          },
        }
      `);
    });
  });
});
