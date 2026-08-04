import {
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const session = pgTable("session", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  token: text("token").notNull().unique(),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  ipAddress: text("ip_address"),

  userAgent: text("user_agent"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const account = pgTable("account", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, {
      onDelete: "cascade",
    }),

  accountId: text("account_id").notNull(),

  providerId: text("provider_id").notNull(),

  accessToken: text("access_token"),

  refreshToken: text("refresh_token"),

  idToken: text("id_token"),

  accessTokenExpiresAt: timestamp("access_token_expires_at", {
    withTimezone: true,
  }),

  refreshTokenExpiresAt: timestamp("refresh_token_expires_at", {
    withTimezone: true,
  }),

  scope: text("scope"),

  password: text("password"),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});

export const verification = pgTable("verification", {
  id: uuid("id").defaultRandom().primaryKey(),

  identifier: text("identifier").notNull(),

  value: text("value").notNull(),

  expiresAt: timestamp("expires_at", {
    withTimezone: true,
  }).notNull(),

  createdAt: timestamp("created_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", {
    withTimezone: true,
  })
    .defaultNow()
    .notNull(),
});