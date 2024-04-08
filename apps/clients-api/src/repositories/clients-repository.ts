import { eq } from 'drizzle-orm';
import { db } from '../database/connection';
import { clients } from '../database/schema';
import { Client } from '../models/client';

export interface ClientsRepository {
  getByEmail(email: string): Promise<Client | null>
  save(client: Client): Promise<{id: string}>
}

export class ClientsRepositoryDatabase implements ClientsRepository {

  constructor() {}

  async getByEmail(email: string): Promise<Client | null> {
    const client = await db.select().from(clients).where(eq(clients.email, email));

    if (!client[0]) return null;

    return {
      name: (client as unknown as Client).name,
      email: (client as unknown as Client).email,
      address: (client as unknown as Client).address,
    };
  }

  async save(client: Client): Promise<{id: string}> {
    const response = await db.insert(clients).values({
      name: client.name,
      email: client.email,
      address: client.address,
    }).returning();

    return {
      id: response[0].id
    };
  }

}
