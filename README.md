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
