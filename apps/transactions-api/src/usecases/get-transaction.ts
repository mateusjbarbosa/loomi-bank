import { logger } from 'logger';
import { Transaction } from '../models/transaction';
import { ClientsRepository } from '../repositories/clients-repository';
import { TransactionsRepository } from '../repositories/transactions-repository';

// TODO: add tests

export class GetTransactionUsecase {

  constructor(
    readonly clientsRepository: ClientsRepository,
    readonly transactionsRepository: TransactionsRepository
  ) {}

  async execute({ id }: Input): Promise<Output> {
    try {
      const transaction = await this.transactionsRepository.getById(id);
      if (!transaction) {
        logger.log({
          level: 'info',
          message: 'Transaction not found'
        });

        return {
          success: false,
          message: 'Transaction not found'
        };
      }

      const sender = await this.clientsRepository.getById(transaction.senderId);
      const receiver = await this.clientsRepository.getById(transaction.receiverId);

      return {
        success: true,
        data: {
          senderId: transaction.senderId,
          senderName: sender?.name ?? '',
          receiverId: transaction.receiverId,
          receiverName: receiver?.name ?? '',
          amount: transaction.amount,
          description: transaction.description ?? ''
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

interface ClientOutput {
  senderName: string
  receiverName: string
}

interface Output {
  success: boolean
  data?: Transaction & ClientOutput
  message?: string
}
