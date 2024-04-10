import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import { env } from './env';
import { createTransactionRoute } from './http/create-transaction';
import { getTransactionRoute } from './http/get-client';
import { getClientTransactionsRoute } from './http/get-client-transactions';

const server = Fastify({
  logger: true
});

server.get('/', async function handler () {
  return { message: 'transactions-api' };
});

server.register(createTransactionRoute, { prefix: 'api' });
server.register(getTransactionRoute, { prefix: 'api' });
server.register(getClientTransactionsRoute, { prefix: 'api' });

const start = async () => {
  try {
    await server.listen({ port: env.PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
