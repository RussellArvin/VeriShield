ALTER TABLE "user" ADD COLUMN "persona" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "keywords" text[] DEFAULT '{}'::text[] NOT NULL;