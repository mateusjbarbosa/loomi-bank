import { ClientsRepository } from '../repositories/clients-repository';
import { StorageRepository } from '../repositories/storage-repository';

// TODO: add tests

export class UpdateClientAvatarUsecase {

  constructor(
    readonly clientsRepository: ClientsRepository,
    readonly storageRepository: StorageRepository
  ) {}

  async execute({ id, file, mimetype }: Input): Promise<Output> {
    try {
      const clientData = await this.clientsRepository.getById(id);

      if (!clientData) {
        return {
          success: false,
          message: 'Client not found'
        };
      }

      const storageResponse = await this.storageRepository.saveFile(id, file, mimetype);

      if (!storageResponse.success) {
        return {
          success: false,
          message: storageResponse.message
        };
      }

      await this.clientsRepository.update(id, { avatarId: id });

      return { success: true };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(e: any) { // TODO: type error
      // TODO: log
      return {
        success: false,
        message: e.message
      };
    }
  }

}

interface Input {
  id: string
  file: Buffer
  mimetype: string
}

interface Output {
  success: boolean
  message?: string
}
