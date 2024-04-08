import { createId } from '@paralleldrive/cuid2';
import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  address: text('address').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});
