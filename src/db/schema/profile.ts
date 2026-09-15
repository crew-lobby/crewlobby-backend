import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

import { users } from "./users.js";

export type ProfileLink = {
  label: string;
  url: string;
};

export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),

  userId: uuid("user_id")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),

  preferredName: text("preferred_name"),

  photoUrl: text("photo_url"),

  location: text("location"),

  timezone: text("timezone"),

  about: text("about"),

  skills: jsonb("skills").$type<string[]>().default([]).notNull(),

  github: text("github"),

  linkedin: text("linkedin"),

  personalWebsite: text("personal_website"),

  otherLinks: jsonb("other_links").$type<ProfileLink[]>().default([]).notNull(),

  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),

  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
});