import { BankingDetails, Client } from '../models/client';
import { ClientsRepository } from '../repositories/clients-repository';

// TODO: add tests

export class CreateClientUsecase {

  constructor(readonly clientsRepository: ClientsRepository) {}

  async execute({ client }: Input): Promise<Output> {
    try {
      const existsClient = await this.clientsRepository.getByEmail(client.email);

      if (existsClient) {
        return {
          success: false,
          message: 'Already exists client with this e-mail'
        };
      }

      const bankingDetails = await this.generateClientAccount();

      const response = await this.clientsRepository.save({
        ...client,
        bankingDetails
      });

      // TODO: log
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
      // TODO: log
      return {
        success: false,
        message: e.message
      };
    }
  }

  /**
   * @description Generate account number with digit
   * Reference: https://www.creditas.com/exponencial/digito-da-conta-o-que-e-para-que-serve-e-como-encontra-lo/#2
   */
  private async generateClientAccount(): Promise<BankingDetails> {
    const lastAccount = await this.clientsRepository.getLastAccount();

    let agency: number;
    let newAccount: number;
    let digit = 0;

    if (!lastAccount) {
      agency = 1;
      newAccount = 1;
    } else {
      if (lastAccount.account >= 99999999) {
        agency = lastAccount.agency + 1;
        newAccount = 1;
      }

      agency = lastAccount.agency;
      newAccount = lastAccount.account + 1;
    }

    const newAccountAsArray = newAccount.toString().split('').map(Number);
    const multipliers = [9, 8, 7, 6, 5, 4, 3, 2];

    for (let i = 0; i < newAccountAsArray.length; i++) {
      digit += newAccountAsArray[i] * multipliers[i];
    }

    digit %= 11;

    return {
      agency,
      account: newAccount,
      digit: digit === 10 ? 'X' : digit.toString()
    };
  }
}

interface Input {
  client: Client
}

interface Output {
  success: boolean
  data?: { id: string }
  message?: string
}
