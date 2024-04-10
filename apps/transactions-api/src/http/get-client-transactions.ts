import { FastifyInstance } from 'fastify';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { ClientsRepositoryDatabase } from '../repositories/clients-repository';
import { TransactionsRepositoryDatabase } from '../repositories/transactions-repository';
import { GetClientTransactionsUsecase } from '../usecases/get-client-transactions';

// TODO: add tests

export async function getClientTransactionsRoute(app: FastifyInstance) {
  app.get('/transactions/user/:id', async (request, reply) => {
    const getClientTransactionsParamsSchema = z.object({
      id: z.string()
    });

    try {
      const { id } = getClientTransactionsParamsSchema.parse(request.params);
      const clientsRepository = new ClientsRepositoryDatabase();
      const transactionsRepository = new TransactionsRepositoryDatabase();
      const usecase = new GetClientTransactionsUsecase(clientsRepository, transactionsRepository);
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
