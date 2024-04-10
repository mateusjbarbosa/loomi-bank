export interface NotificationsRepository {
  send({ clientId, message }: SendInput): Promise<boolean>
}

interface SendInput {
  clientId: string
  message: string
}
