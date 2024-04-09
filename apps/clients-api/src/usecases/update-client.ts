import { Client } from '../models/client';
import { ClientsRepository } from '../repositories/clients-repository';

// TODO: add tests

export class UpdateClientUsecase {

  constructor(readonly clientsRepository: ClientsRepository) {}

  async execute({ id, client }: Input): Promise<Output> {
    try {
      const clientData = await this.clientsRepository.getById(id);

      if (!clientData) {
        return {
          success: false,
          message: 'Client not found'
        };
      }

      const response = await this.clientsRepository.update(id, {
        ...client
      });

      // TODO: log
      // TODO: create queue message

      return {
        success: true,
        data: {
          id: response.id
        }
      };
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
  client: Partial<Pick<Client, 'name' | 'email' | 'address'>>
}

interface Output {
  success: boolean
  data?: { id: string }
  message?: string
}
