import { z } from 'zod';

const envSchema = z.object({
  PORT: z.number(),
  DATABASE_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
