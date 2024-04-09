import dotenv from 'dotenv';
dotenv.config();

import multipart from '@fastify/multipart';
import Fastify from 'fastify';
import { env } from './env';
import { createClientRoute } from './http/create-client';
import { getClientRoute } from './http/get-client';
import { updateClientRoute } from './http/update-client';

const server = Fastify({
  logger: true
});

server.get('/', async function handler () {
  return { message: 'clients-api' };
});

server.register(createClientRoute, { prefix: 'api' });
server.register(getClientRoute, { prefix: 'api' });
server.register(updateClientRoute, { prefix: 'api' });
server.register(multipart);

const start = async () => {
  try {
    await server.listen({ port: env.PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
