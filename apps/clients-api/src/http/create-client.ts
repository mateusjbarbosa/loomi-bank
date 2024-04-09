import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { clientSchema } from '../models/client';
import { ClientsRepositoryDatabase } from '../repositories/clients-repository';
import { CreateClientUsecase } from '../usecases/create-client';

// TODO: add tests

export async function createClientRoute(app: FastifyInstance) {
  app.post('/clients', async (request, reply) => {
    try {
      const client = clientSchema.parse(request.body);

      const repository = new ClientsRepositoryDatabase();
      const usecase = new CreateClientUsecase(repository);
      const response = await usecase.execute({ client });

      if (!response.success) {
        return reply.status(400).send({
          message: response.message
        });
      }

      return reply.status(201).headers({ location: `/v1/users/${response.data!.id}` }).send();
    } catch (e) {
      if (e instanceof ZodError) {
        const validationError = fromZodError(e);

        const errors = validationError.details.map((detail) => {
          return {
            field: detail.path[0],
            message: detail.message
          };
        });

        return reply.status(400).send({
          errors
        });
      }
    }
  });
}
