import { z } from 'zod';

export const clientSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
});

export type Client = z.infer<typeof clientSchema>
