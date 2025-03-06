import { sql } from "drizzle-orm";
import {
  PgTable,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userSchema = pgTable(
  "user",
  {
    id:text("id").primaryKey(),
    firstName:text("first_name").notNull(),
    lastName:text("last_name").notNull(),
    email:text("email").unique().notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  }
);

export const threats = pgTable(
  "threats",
  {
    id: uuid("id").primaryKey(),
    userId: text("user_id").notNull().references(() => userSchema.id),
    description: text("description").notNull(),
    sourceUrl: text("source_url").notNull(),
    source: text("source").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    status: text("status").notNull(),
  });
  
export const threatMedia = pgTable(
  "threat_media",
  {
    id: uuid("id").primaryKey(),
    threatId: uuid("threat_id").notNull().references(() => threats.id),
    mediaUrl: text("media_url").notNull(),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`).notNull(),
  }
)
  
 export const threatResponse = pgTable(
  "threat_response",
  {
    id: uuid("id").primaryKey(),
    threatId: uuid("threat_id").notNull().references(() => threats.id),
    type: text("type").notNull(),
    response: text("response").notNull(),
    createdAt: timestamp("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updatedAt")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  }
 )