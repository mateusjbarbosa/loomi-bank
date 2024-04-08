import dotenv from 'dotenv';
dotenv.config();

import Fastify from 'fastify';
import { env } from './env';

const server = Fastify({
  logger: true
});

server.get('/', async function handler () {
  return { message: 'transactions-api' };
});

const start = async () => {
  try {
    await server.listen({ port: env.PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
