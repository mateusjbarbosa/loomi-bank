import { FastifyInstance } from 'fastify';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { ClientsRepositoryDatabase } from '../repositories/clients-repository';
import { UpdateClientUsecase } from '../usecases/update-client';

// TODO: add tests

export async function updateClientRoute(app: FastifyInstance) {
  app.patch('/clients/:id', async (request, reply) => {
    const updateClientParamsSchema = z.object({
      id: z.string()
    });

    const updateClientSchema = z.object({
      name: z.string().optional(),
      email: z.string().email().optional(),
      address: z.string().optional(),
    });

    try {
      const { id } = updateClientParamsSchema.parse(request.params);
      const client = updateClientSchema.parse(request.body);

      const repository = new ClientsRepositoryDatabase();
      const usecase = new UpdateClientUsecase(repository);
      const response = await usecase.execute({ id, client });

      if (!response.success) {
        return reply.status(400).send({
          message: response.message
        });
      }

      return reply.status(200).headers({ location: `/api/clients/${id}` }).send();
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
