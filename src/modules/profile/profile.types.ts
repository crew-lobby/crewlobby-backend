import type { ProfileLink } from "../../db/schema/profile.js";

export type ProfileRecord = {
  id: string;
  userId: string;
  preferredName: string | null;
  photoUrl: string | null;
  location: string | null;
  timezone: string | null;
  about: string | null;
  skills: string[];
  github: string | null;
  linkedin: string | null;
  personalWebsite: string | null;
  otherLinks: ProfileLink[];
  createdAt: Date;
  updatedAt: Date;
};

export type MembershipEmployment = {
  jobTitle: string | null;
  workEmail: string | null;
  startDate: string | null;
  teamId: string | null;
  managerId: string | null;

  team: {
    id: string;
    name: string;
  } | null;

  manager: {
    userId: string;
    name: string;
    image: string | null;
  } | null;
};

export type ProfileView = {
  userId: string;
  name: string;
  email: string;
  image: string | null;

  profile: Omit<
    ProfileRecord,
    "id" | "userId" | "createdAt" | "updatedAt"
  > | null;

  employment: MembershipEmployment | null;
};

export type UpdateProfileInput = Partial<{
  preferredName: string | null;
  photoUrl: string | null;
  location: string | null;
  timezone: string | null;
  about: string | null;
  skills: string[];
  github: string | null;
  linkedin: string | null;
  personalWebsite: string | null;
  otherLinks: ProfileLink[];

  jobTitle: string | null;
  workEmail: string | null;
  startDate: string | null;
  teamId: string | null;
  managerId: string | null;
}>;