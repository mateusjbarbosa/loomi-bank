import { logger } from 'logger';
import { Transaction } from '../models/transaction';
import { ClientsRepository } from '../repositories/clients-repository';
import { NotificationsRepository } from '../repositories/notifications-repository';
import { TransactionsRepository } from '../repositories/transactions-repository';

// TODO: add tests

export class CreateTransactionUsecase {

  constructor(
    readonly clientsRepository: ClientsRepository,
    readonly notificationsRepository: NotificationsRepository,
    readonly transactionRepository: TransactionsRepository
  ) {}

  async execute({ transaction }: Input): Promise<Output> {
    try {
      const existsSender = await this.clientsRepository.getById(transaction.senderId);

      if (!existsSender) {
        logger.log({
          level: 'info',
          message: 'Sender client not found'
        });

        return {
          success: false,
          message: 'Sender client not found'
        };
      }

      const existsReceiver = await this.clientsRepository.getById(transaction.receiverId);

      if (!existsReceiver) {
        logger.log({
          level: 'info',
          message: 'Receiver client not found'
        });

        return {
          success: false,
          message: 'Receiver client not found'
        };
      }

      if (transaction.amount <= 0) {
        logger.log({
          level: 'info',
          message: 'Invalid amount'
        });

        return {
          success: false,
          message: 'Invalid amount'
        };
      }

      // TODO: validate sender wallet

      const response = await this.transactionRepository.save(transaction);

      await this.notificationsRepository.send({
        clientId: transaction.senderId,
        message: 'Transação realizada'
      });

      await this.notificationsRepository.send({
        clientId: transaction.receiverId,
        message: 'Transação recebida'
      });

      logger.log({
        level: 'info',
        message: `Created transaction: ${response.id}`
      });

      // TODO: create queue message
      // TODO: send e-mail

      return {
        success: true,
        data: {
          id: response.id
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
  transaction: Transaction
}

interface Output {
  success: boolean
  data?: { id: string }
  message?: string
}
