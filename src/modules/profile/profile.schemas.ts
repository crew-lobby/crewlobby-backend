import { z } from "zod";

export const profileLinkSchema = z.object({
  label: z.string().min(1).max(60),
  url: z.url(),
});

export const updateProfileSchema = z
  .object({
    preferredName: z.string().max(120),
    photoUrl: z.url(),
    location: z.string().max(160),
    timezone: z.string().max(80),
    about: z.string().max(4000),
    skills: z.array(z.string().min(1).max(40)).max(30),
    github: z.url(),
    linkedin: z.url(),
    personalWebsite: z.url(),
    otherLinks: z.array(profileLinkSchema).max(10),
    jobTitle: z.string().max(120),
    workEmail: z.email(),
    startDate: z.iso.date(),
    teamId: z.uuid().nullable(),
    managerId: z.uuid().nullable(),
  })
  .partial()
  .strict();

export type UpdateProfileSchema = z.infer<typeof updateProfileSchema>;