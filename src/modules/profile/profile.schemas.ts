import { z } from "zod";

export const profileLinkSchema = z.object({
  label: z.string().min(1).max(60),
  url: z.url(),
});

export const updateProfileSchema = z
  .object({
    preferredName: z.string().max(120).nullable(),

    photoUrl: z.url().nullable(),

    location: z.string().max(160).nullable(),

    timezone: z.string().max(80).nullable(),

    about: z.string().max(4000).nullable(),

    skills: z
      .array(z.string().min(1).max(40))
      .max(30),

    github: z.url().nullable(),

    linkedin: z.url().nullable(),

    personalWebsite: z.url().nullable(),

    otherLinks: z
      .array(profileLinkSchema)
      .max(10),

    jobTitle: z.string().max(120).nullable(),

    workEmail: z.email().nullable(),

    startDate: z.iso.date().nullable(),

    teamId: z.uuid().nullable(),

    managerId: z.uuid().nullable(),
  })
  .partial()
  .strict();

export type UpdateProfileSchema = z.infer<
  typeof updateProfileSchema
>;