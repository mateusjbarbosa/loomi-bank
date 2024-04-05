import dotenv from 'dotenv';
import Fastify from 'fastify';
import { env } from './env';

dotenv.config();

const server = Fastify({
  logger: true
});

server.get('/', async function handler () {
  return { message: 'clients-api' };
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
