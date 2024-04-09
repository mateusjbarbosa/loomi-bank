import { db } from '../database/connection';
import { transactions } from '../database/schema';
import { Transaction } from '../models/transaction';

export interface TransactionsRepository {
  save(client: Transaction): Promise<{id: string}>
}

export class TransactionsRepositoryDatabase implements TransactionsRepository {

  constructor() {}

  async save(transaction: Transaction): Promise<{id: string}> {
    const response = await db.insert(transactions).values({
      senderId: transaction.senderId,
      receiverId: transaction.receiverId,
      amount: transaction.amount,
      description: transaction.description ?? ''
    }).returning();

    return {
      id: response[0].id
    };
  }

}
