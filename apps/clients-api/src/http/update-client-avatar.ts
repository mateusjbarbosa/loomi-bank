import { FastifyInstance } from 'fastify';
import { ZodError, z } from 'zod';
import { fromZodError } from 'zod-validation-error';
import { ClientsRepositoryDatabase } from '../repositories/clients-repository';
import { S3Adapter } from '../repositories/storage-repository';
import { UpdateClientAvatarUsecase } from '../usecases/update-client-avatar';

// TODO: add tests

export async function updateClientAvatarRoute(app: FastifyInstance) {
  app.patch('/clients/:id/avatar', async (request, reply) => {
    const updateClientParamsSchema = z.object({
      id: z.string()
    });

    try {
      const { id } = updateClientParamsSchema.parse(request.params);

      const data = await request.file();
      const fileContent = await data!.toBuffer();

      const databaseRepository = new ClientsRepositoryDatabase();
      const storageRepository = new S3Adapter();
      const usecase = new UpdateClientAvatarUsecase(databaseRepository, storageRepository);
      const response = await usecase.execute({ id, file: fileContent, mimetype: data!.mimetype });

      if (!response.success) {
        return reply.status(400).send({
          message: response.message
        });
      }

      return reply.status(200).headers({ location: `/api/clients/${id}` }).send({
        success: response.success,
        message: response.message
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
