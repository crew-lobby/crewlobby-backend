import {
  date,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  type AnyPgColumn,
} from "drizzle-orm/pg-core";

import { users } from "./users.js";

export const organization = pgTable("organization", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: text("name").notNull(),

  slug: text("slug").notNull().unique(),

  logo: text("logo"),

  metadata: text("metadata"),

  addressLine1: text("address_line_1"),

  addressLine2: text("address_line_2"),

  city: text("city"),

  state: text("state"),

  country: text("country"),

  zip: text("zip"),

  employeeCount: integer("employee_count"),

  sector: text("sector"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  name: text("name").notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const member = pgTable("member", {
  id: uuid("id").defaultRandom().primaryKey(),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  role: text("role").notNull().default("user"),

  jobTitle: text("job_title"),

  workEmail: text("work_email"),

  startDate: date("start_date"),

  teamId: uuid("team_id").references(() => teams.id, {
    onDelete: "set null",
  }),

  managerId: uuid("manager_id").references(
    (): AnyPgColumn => member.id,
    { onDelete: "set null" },
  ),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});

export const invitation = pgTable("invitation", {
  id: uuid("id").defaultRandom().primaryKey(),

  email: text("email").notNull(),

  inviterId: uuid("inviter_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organization.id, { onDelete: "cascade" }),

  role: text("role"),

  status: text("status").notNull().default("pending"),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
});