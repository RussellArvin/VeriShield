import { sql } from "drizzle-orm";
import {
  boolean,
  integer,
  PgTable,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userSchema = pgTable(
  "user",
  {
    id:text("id").primaryKey().notNull(),
    firstName:text("first_name").notNull(),
    lastName:text("last_name").notNull(),
    email:text("email").unique().notNull(),
    persona: text("persona"),
    keywords: text("keywords")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
    canScan: boolean("can_scan").notNull().default(false),
  }
);
//TODO: PGENUM for status

export const threatSchema = pgTable(
  "threats",
  {
    id: uuid("id").primaryKey().notNull().default(sql`uuid_generate_v4()`),
    userId: text("user_id").notNull().references(() => userSchema.id),
    description: text("description").notNull(),
    sourceUrl: text("source_url").notNull(),
    source: text("source").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    status: text("status").notNull(),
    factCheckerUrl: text("fact_checker_url").notNull(),
    factCheckerDescription: text("fact_checker_description").notNull(),
    responseId: uuid("response_id"),
    analysis: text("analysis")
  });
  
export const threatMediaSchema = pgTable(
  "threat_media",
  {
    id: uuid("id").primaryKey().notNull(),
    threatId: uuid("threat_id").notNull().references(() => threatSchema.id),
    mediaUrl: text("media_url").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
)

export const threatScanSchema = pgTable(
  "threat_scans",
  {
    id: uuid("id").primaryKey().notNull(),
    userId: text("user_id").notNull().references(() => userSchema.id),
    scannedThreats: integer("scanned_threats").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
)

  
 export const threatResponseSchema = pgTable(
  "threat_response",
  {
    id: uuid("id").primaryKey().notNull(),
    threatId: uuid("threat_id").notNull().references(() => threatSchema.id),
    type: text("type").notNull(),
    length: text("length").notNull(),
    response: text("response").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  }
 )