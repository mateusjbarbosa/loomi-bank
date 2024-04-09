import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import { env } from './env';
import { createClientRoute } from './http/create-client';
import { getClientRoute } from './http/get-client';

const server = Fastify({
  logger: true
});

server.get('/', async function handler () {
  return { message: 'clients-api' };
});

server.register(createClientRoute, { prefix: 'v1' });
server.register(getClientRoute, { prefix: 'v1' });

const start = async () => {
  try {
    await server.listen({ port: env.PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
