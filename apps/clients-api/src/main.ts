import dotenv from 'dotenv';
import Fastify from 'fastify';

dotenv.config();

const server = Fastify({
  logger: true
});

server.get('/', async function handler () {
  return { message: 'clients-api' };
});

const start = async () => {
  try {
    await server.listen({ port: process.env.PORT as unknown as number });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
