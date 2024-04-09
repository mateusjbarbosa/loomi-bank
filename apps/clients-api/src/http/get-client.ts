import { FastifyInstance } from 'fastify';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { ClientsRepositoryDatabase } from '../repositories/clients-repository';
import { GetClientUsecase } from '../usecases/get-client';

// TODO: add tests

export async function getClientRoute(app: FastifyInstance) {
  app.get('/clients/:id', async (request, reply) => {
    const getClientParamsSchema = z.object({
      id: z.string()
    });

    try {
      const { id } = getClientParamsSchema.parse(request.params);
      const repository = new ClientsRepositoryDatabase();
      const usecase = new GetClientUsecase(repository);
      const response = await usecase.execute({ id });

      if (!response.success) {
        return reply.status(400).send({
          message: response.message
        });
      }

      return reply.status(200).send({
        data: response.data
      });
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
