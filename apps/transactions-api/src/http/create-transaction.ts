import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { transactionSchema } from '../models/transaction';
import { ClientsRepositoryDatabase } from '../repositories/clients-repository';
import { NotificationsRepositoryMemory } from '../repositories/notifications-repository';
import { TransactionsRepositoryDatabase } from '../repositories/transactions-repository';
import { CreateTransactionUsecase } from '../usecases/create-transaction';

// TODO: add tests

export async function createTransactionRoute(app: FastifyInstance) {
  app.post('/transactions', async (request, reply) => {
    try {
      const transaction = transactionSchema.parse(request.body);

      const clientsRepository = new ClientsRepositoryDatabase();
      const notificationsRepository = new NotificationsRepositoryMemory();
      const transactionsRepository = new TransactionsRepositoryDatabase();
      const usecase = new CreateTransactionUsecase(
        clientsRepository,
        notificationsRepository,
        transactionsRepository
      );
      const response = await usecase.execute({ transaction });

      if (!response.success) {
        return reply.status(400).send({
          message: response.message
        });
      }

      return reply
        .status(201)
        .headers({ location: `/api/transactions/${response.data!.id}` })
        .send();
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
