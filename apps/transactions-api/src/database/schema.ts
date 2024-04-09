import { createId } from '@paralleldrive/cuid2';
import { relations } from 'drizzle-orm';
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';

export const clients = pgTable('clients', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const clientsRelations = relations(clients, ({ many }) => ({
  transactions: many(transactions),
}));

export const transactions = pgTable('transactions', {
  id: text('id')
    .$defaultFn(() => createId())
    .primaryKey(),
  senderId: text('sender_id').references(() => clients.id).notNull(),
  receiverId: text('receiver_id').references(() => clients.id).notNull(),
  amount: integer('amount').notNull(),
  description: varchar('description', { length: 64 }),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow()
});

export const transactionsRelations = relations(transactions, ({ one }) => ({
  sender: one(clients, {
    fields: [transactions.senderId],
    references: [clients.id],
  }),
  receiver: one(clients, {
    fields: [transactions.receiverId],
    references: [clients.id],
  }),
}));
