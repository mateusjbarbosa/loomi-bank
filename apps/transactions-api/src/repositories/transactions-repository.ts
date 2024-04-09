import { eq } from 'drizzle-orm';
import { db } from '../database/connection';
import { transactions } from '../database/schema';
import { Transaction } from '../models/transaction';

export interface TransactionsRepository {
  getById(id: string): Promise<Transaction | null>
  save(client: Transaction): Promise<{id: string}>
}

export class TransactionsRepositoryDatabase implements TransactionsRepository {

  constructor() {}

  async getById(id: string): Promise<Transaction | null> {
    const data = await db.select().from(transactions).where(eq(transactions.id, id));

    if (!data[0]) return null;

    return {
      senderId: data[0].senderId,
      receiverId: data[0].receiverId,
      amount: data[0].amount,
      description: data[0].description ?? ''
    };
  }

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
