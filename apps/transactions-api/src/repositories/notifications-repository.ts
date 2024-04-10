export interface NotificationsRepository {
  send({ clientId, message }: SendInput): Promise<boolean>
}

export class NotificationsRepositoryMemory implements NotificationsRepository {

  constructor() {}

  send({ clientId, message }: SendInput): Promise<boolean> {
    console.log(`Sended notification to ${clientId}: ${message}`);

    return new Promise((resolve) => resolve(true));
  }

}

interface SendInput {
  clientId: string
  message: string
}
