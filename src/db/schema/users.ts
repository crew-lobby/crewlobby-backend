import { boolean, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
id: uuid("id").defaultRandom().primaryKey(),
name: varchar("name", { length: 120 }).notNull(),
email: varchar("email", { length: 255 }).notNull().unique(),
emailVerified: boolean("email_verified").default(false).notNull(),
image: varchar("image", { length: 500 }),
createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
});