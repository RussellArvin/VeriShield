import { sql } from "drizzle-orm";
import {
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
