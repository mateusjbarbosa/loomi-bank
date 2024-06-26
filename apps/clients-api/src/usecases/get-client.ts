import { logger } from 'logger';
import { env } from '../env';
import { Client } from '../models/client';
import { ClientsRepository } from '../repositories/clients-repository';

// TODO: add tests

export class GetClientUsecase {

  constructor(readonly clientsRepository: ClientsRepository) {}

  async execute({ id }: Input): Promise<Output> {
    try {
      const client = await this.clientsRepository.getById(id);

      if (!client) {
        logger.log({
          level: 'info',
          message: 'Client not found'
        });

        return {
          success: false,
          message: 'Client not found'
        };
      }

      return {
        success: true,
        data: {
          name: client.name,
          email: client.email,
          address: client.address,
          avatarId: client.avatarId ? env.AWS_BUCKET_BASE_URL + client.avatarId : '',
          bankingDetails: {
            agency: client.bankingDetails!.agency.toString().padStart(4, '0'),
            account: client.bankingDetails!.account.toString().padStart(8, '0'),
            digit: client.bankingDetails!.digit
          }
        }
      };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch(e: any) { // TODO: type error
      logger.log({
        level: 'info',
        message: e.message
      });

      return {
        success: false,
        message: e.message
      };
    }
  }

}

interface Input {
  id: string
}

interface BankingDetailsOutput { bankingDetails: { agency: string, account: string, digit: string }}

interface Output {
  success: boolean
  data?: Pick<Client, 'name' | 'email' | 'address' | 'avatarId'> & BankingDetailsOutput
  message?: string
}
