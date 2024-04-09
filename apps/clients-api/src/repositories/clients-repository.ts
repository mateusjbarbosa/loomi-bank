import { desc, eq } from 'drizzle-orm';
import { db } from '../database/connection';
import { clients } from '../database/schema';
import { BankingDetails, Client } from '../models/client';

export interface ClientsRepository {
  getByEmail(email: string): Promise<Client | null>
  getLastAccount(): Promise<BankingDetails | null>
  save(client: Client): Promise<{id: string}>
}

export class ClientsRepositoryDatabase implements ClientsRepository {

  constructor() {}

  async getByEmail(email: string): Promise<Client | null> {
    const data = await db.select().from(clients).where(eq(clients.email, email));

    if (!data[0]) return null;

    return {
      name: data[0].name,
      email: data[0].email,
      address: data[0].address,
      bankingDetails: {
        agency: data[0].agency,
        account: data[0].account,
        digit: data[0].digit,
      }
    };
  }

  async getLastAccount(): Promise<BankingDetails | null> {
    const data = await db
      .select({
        agency: clients.agency,
        account: clients.account,
        digit: clients.digit,
      })
      .from(clients)
      .orderBy(desc(clients.createdAt))
      .limit(1);

    if(!data[0]) return null;

    return {
      agency: data[0].agency,
      account: data[0].account,
      digit: data[0].digit
    };
  }

  async save(client: Client): Promise<{id: string}> {
    const response = await db.insert(clients).values({
      name: client.name,
      email: client.email,
      address: client.address,
      agency: client.bankingDetails!.agency,
      account: client.bankingDetails!.account,
      digit: client.bankingDetails!.digit,
    }).returning();

    return {
      id: response[0].id
    };
  }

}
