import { z } from 'zod';

const bankingDetailsSchema = z.object({
  agency: z.number(),
  account: z.number(),
  digit: z.string()
});

export const clientSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  address: z.string(),
  bankingDetails: bankingDetailsSchema.optional(),
});

export type BankingDetails = z.infer<typeof bankingDetailsSchema>
export type Client = z.infer<typeof clientSchema>
