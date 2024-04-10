import { eq } from 'drizzle-orm';
import { db } from '../database/connection';
import { clients } from '../database/schema';
import { Client } from '../models/client';

export interface ClientsRepository {
  getById(id: string): Promise<Client | null>
}

export class ClientsRepositoryDatabase implements ClientsRepository {

  constructor() {}

  async getById(id: string): Promise<Client | null> {
    const data = await db.select().from(clients).where(eq(clients.id, id));

    if (!data[0]) return null;

    return {
      name: data[0].name,
    };
  }

}
