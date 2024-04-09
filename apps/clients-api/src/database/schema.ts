import { createId } from '@paralleldrive/cuid2';
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  address: text('address').notNull(),
  agency: integer('agency').notNull(),
  account: integer('account').unique().notNull(),
  digit: varchar('digit', { length: 1 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});
