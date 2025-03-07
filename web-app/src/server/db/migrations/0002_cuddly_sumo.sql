CREATE TABLE IF NOT EXISTS "threat_media" (
	"id" uuid PRIMARY KEY NOT NULL,
	"threat_id" uuid NOT NULL,
	"media_url" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threat_response" (
	"id" uuid PRIMARY KEY NOT NULL,
	"threat_id" uuid NOT NULL,
	"type" text NOT NULL,
	"response" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threat_scans" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"scanned_threats" integer NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "threats" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"description" text NOT NULL,
	"source_url" text NOT NULL,
	"source" text NOT NULL,
	"created_at" timestamp DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"status" text NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_media" ADD CONSTRAINT "threat_media_threat_id_threats_id_fk" FOREIGN KEY ("threat_id") REFERENCES "threats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_response" ADD CONSTRAINT "threat_response_threat_id_threats_id_fk" FOREIGN KEY ("threat_id") REFERENCES "threats"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threat_scans" ADD CONSTRAINT "threat_scans_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "threats" ADD CONSTRAINT "threats_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
