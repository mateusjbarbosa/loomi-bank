import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number(),
  DATABASE_URL: z.string().url(),
  AWS_REGION: z.string(),
  AWS_ACESS_KEY_ID: z.string(),
  AWS_SECRET_ACESS_KEY: z.string(),
  AWS_BUCKET: z.string(),
  AWS_BUCKET_BASE_URL: z.string().url()
});

export const env = envSchema.parse(process.env);
