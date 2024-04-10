import { z } from 'zod';

export const transactionSchema = z.object({
  senderId: z.string().cuid2(),
  receiverId: z.string().cuid2(),
  amount: z.number(),
  description: z.string().optional(),
});

export type Transaction = z.infer<typeof transactionSchema>
