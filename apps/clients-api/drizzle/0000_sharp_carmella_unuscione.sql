CREATE TABLE IF NOT EXISTS "clients" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"address" text NOT NULL,
	"avatar_id" text DEFAULT '' NOT NULL,
	"agency" integer NOT NULL,
	"account" integer NOT NULL,
	"digit" varchar(1) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "clients_email_unique" UNIQUE("email"),
	CONSTRAINT "clients_account_unique" UNIQUE("account")
);
