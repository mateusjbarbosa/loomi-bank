import { logger } from 'logger';
import { Transaction } from '../models/transaction';
import { ClientsRepository } from '../repositories/clients-repository';
import { TransactionsRepository } from '../repositories/transactions-repository';

// TODO: add tests

export class GetClientTransactionsUsecase {

  constructor(
    readonly clientsRepository: ClientsRepository,
    readonly transactionsRepository: TransactionsRepository
  ) {}

  async execute({ id }: Input): Promise<Output> {
    try {
      const transactions = await this.transactionsRepository.filterByClientId(id);

      if (!transactions) {
        logger.log({
          level: 'info',
          message: 'Sender not found'
        });

        return {
          success: false,
          message: 'Sender not found'
        };
      }

      if (transactions.length === 0) {
        return {
          success: true,
          data: []
        };
      }

      const output: OutputData = [];

      for (const transaction of transactions) {
        const receiver = await this.clientsRepository.getById(transaction.receiverId);

        output.push({
          receiverId: transaction.receiverId,
          receiverName: receiver?.name ?? '',
          amount: transaction.amount,
          description: transaction.description ?? ''
        });
      }

      return {
        success: true,
        data: output
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

type OutputData = Array<Pick<Transaction, 'receiverId' | 'amount' | 'description'> | ClientOutput>

interface Output {
  success: boolean
  data?: OutputData
  message?: string
}
