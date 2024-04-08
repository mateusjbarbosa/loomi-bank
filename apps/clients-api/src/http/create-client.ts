import { FastifyInstance } from 'fastify';
import { clientSchema } from '../models/client';
import { ClientsRepositoryDatabase } from '../repositories/clients-repository';
import { CreateClientUsecase } from '../usecases/create-client';

export async function createClientRoute(app: FastifyInstance) {
  app.post('/clients', async (request, reply) => {
    const client = clientSchema.parse(request.body); // TODO: thow error if invalid

    const repository = new ClientsRepositoryDatabase();
    const usecase = new CreateClientUsecase(repository);
    const response = await usecase.execute({ client });

    if (!response.success) {
      return reply.status(400).send({
        message: response.message
      });
    }

    return reply.status(200).headers({ location: `/v1/users/${response.data!.id}` }).send();
  });
}
