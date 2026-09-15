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
};

export type ProfileView = {
  userId: string;
  name: string;
  email: string;
  image: string | null;
  profile: Omit<ProfileRecord, "id" | "userId" | "createdAt" | "updatedAt"> | null;
  employment: MembershipEmployment | null;
};

export type UpdateProfileInput = Partial<{
  preferredName: string;
  photoUrl: string;
  location: string;
  timezone: string;
  about: string;
  skills: string[];
  github: string;
  linkedin: string;
  personalWebsite: string;
  otherLinks: ProfileLink[];
  jobTitle: string;
  workEmail: string;
  startDate: string;
  teamId: string | null;
  managerId: string | null;
}>;