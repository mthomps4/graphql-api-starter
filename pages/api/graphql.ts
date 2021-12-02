import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginLandingPageGraphQLPlayground,
  ApolloServerPluginLandingPageDisabled,
} from 'apollo-server-core';
import { ApolloServer } from 'apollo-server-micro';
import type { NextApiRequest, NextApiResponse } from 'next';

import { createContext } from '../../graphql/context';
import { schema } from '../../graphql/schema';

export const GRAPHQL_PATH = '/api/graphql';

// this config block is REQUIRED on Vercel! It stops the body of incoming HTTP requests from being parsed
export const config = {
  api: {
    bodyParser: false,
  },
};

export const apolloServer = new ApolloServer({
  schema,
  introspection: true,
  context: createContext,
  plugins: [
    process.env.NODE_ENV === 'production'
      ? ApolloServerPluginLandingPageDisabled()
      : ApolloServerPluginLandingPageGraphQLPlayground(),
    ApolloServerPluginCacheControl({
      calculateHttpHeaders: false,
    }),
  ],
});

const startServer = apolloServer.start();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // https://github.com/vercel/next.js/blob/canary/examples/api-routes-graphql/pages/api/graphql.js
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );

  if (req.method === 'OPTIONS') {
    res.end();

    return false;
  }

  await startServer;
  await apolloServer.createHandler({
    path: '/api/graphql',
  })(req, res);
}
