import { sql } from "drizzle-orm";
import {
  char,
  check,
  date,
  index,
  numeric,
  pgEnum,
  pgTable,
  smallint,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { organization} from "./organization.js";
import { users } from "./users.js";

export const projectStatusEnum = pgEnum("project_status", [
  "planned",
  "active",
  "on_hold",
  "completed",
  "cancelled",
]);

export const projectPriorityEnum = pgEnum("project_priority", [
  "low",
  "medium",
  "high",
  "critical",
]);

export const projects = pgTable(
  "projects",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    companyId: uuid("company_id")
      .notNull()
      .references(() => organization.id, { onDelete: "cascade" }),

    projectManagerId: uuid("project_manager_id").references(() => users.id, {
      onDelete: "set null",
    }),

    name: varchar("name", { length: 150 }).notNull(),

    code: varchar("code", { length: 30 }).notNull(),

    description: text("description"),

    status: projectStatusEnum("status").notNull().default("planned"),

    priority: projectPriorityEnum("priority").notNull().default("medium"),

    startDate: date("start_date"),

    dueDate: date("due_date"),

    completedAt: timestamp("completed_at", { withTimezone: true }),

    budgetAmount: numeric("budget_amount", { precision: 14, scale: 2 }),

    currencyCode: char("currency_code", { length: 3 })
      .notNull()
      .default("USD"),

    progressPercent: smallint("progress_percent").notNull().default(0),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    archivedAt: timestamp("archived_at", { withTimezone: true }),
  },
  (table) => [
    unique("projects_company_code_unique").on(table.companyId, table.code),

    check(
      "projects_valid_dates",
      sql`${table.dueDate} IS NULL OR ${table.startDate} IS NULL OR ${table.dueDate} >= ${table.startDate}`
    ),

    check(
      "projects_valid_budget",
      sql`${table.budgetAmount} IS NULL OR ${table.budgetAmount} >= 0`
    ),

    check(
      "projects_valid_progress",
      sql`${table.progressPercent} BETWEEN 0 AND 100`
    ),

    index("projects_company_status_idx").on(table.companyId, table.status),

    index("projects_manager_idx").on(table.projectManagerId),

    index("projects_due_date_idx")
      .on(table.dueDate)
      .where(sql`${table.archivedAt} IS NULL`),
  ]
);