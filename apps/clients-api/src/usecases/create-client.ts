import { Client } from '../models/client';
import { ClientsRepository } from '../repositories/clients-repository';

export class CreateClientUsecase {

  constructor(readonly clientsRepository: ClientsRepository) {}

  async execute({ client }: Input): Promise<Output> {
    const existsClient = await this.clientsRepository.getByEmail(client.email);

    if (existsClient) {
      return {
        success: false,
        message: 'Already exists client with this e-mail'
      };
    }

    try {
      const response = await this.clientsRepository.save(client);

      // TODO: log
      // TODO: create queue message

      return {
        success: true,
        data: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
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
  client: Client
}

interface Output {
  success: boolean
  data?: { id: string }
  message?: string
}
