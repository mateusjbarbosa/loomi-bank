# Loomi Bank

Um monorepo com dois microsserviços para gestão de clientes e transações.

## Para rodar local

- Preparar o ambiente

  - Node.js >= v20.12
  - PNPM >= v8.15 (npm install -g pnpm)
  - Docker

- Preparar .env

  - apps/clients-api

  ```sh
    PORT: number,
    DATABASE_URL: string,
    AWS_REGION: string,
    AWS_ACESS_KEY_ID: string,
    AWS_SECRET_ACESS_KEY: string,
    AWS_BUCKET: string,
    AWS_BUCKET_BASE_URL: string
  ```

  - apps/transactions-api

  ```sh
    PORT: number,
    DATABASE_URL: string,
  ```

- Instalar as dependências

```sh
  $ pnpm install
```

- Levantar docker containers

```sh
  $ docker compose up -d
```

- Subir migrations das bases de dados

```sh
  $ pnpm -r db:push
```

- Executar os apps

```sh
  $ pnpm -r dev
```

## Endpoints

### clients-api

- POST /api/clients

  - Para criar novos clientes

  ```json
  {
    "name": "John Doe",
    "email": "john.doe@email.com",
    "address": "Rua das transferências, 1234, Banco Feliz, Ilhas Bancárias, Brasil, 12345-000"
  }
  ```

- GET /api/clients/:id

  - Para obter detalhes de um usuário

- PATCH /api/clients/:id

  - Para atualizar dados de um usuário

  ```json
  {
    "name": "John Doe",
    "email": "john.doe@email.com",
    "address": "Rua das transferências, 1234, Banco Feliz, Ilhas Bancárias, Brasil, 12345-000"
  }
  ```

- PATCH /api/clients/:id/avatar

  - Para atualizar o avatar de um usuário

  ```sh
    # multipart/form-data
    file: image/jpeg
  ```

### transactions-api

- POST /api/transactions

  - Para criar novas transferências

  ```json
  {
    "senderId": "example_cuid2",
    "receiverId": "example_cuid2",
    "amount": 150,
    "description": "Almoço"
  }
  ```

- GET /api/transactions/:id

  - Para obter detalhes de uma transação

- GET /api/transactions/user/:id

  - Para obter transações de um usuário
