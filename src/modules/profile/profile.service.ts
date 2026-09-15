import { AppError } from "../../shared/errors/app-error.js";
import { ProfileRepository } from "./profile.repository.js";
import type { ProfileView, UpdateProfileInput } from "./profile.types.js";

export class ProfileService {
  private readonly repository = new ProfileRepository();

  async getProfile(organizationId: string, userId: string): Promise<ProfileView> {
    const membership = await this.repository.findMembership(organizationId, userId);

    if (!membership) {
      throw new AppError(404, "This person is not part of your organization");
    }

    const targetUser = await this.repository.findUser(userId);

    if (!targetUser) {
      throw new AppError(404, "User not found");
    }

    const profile = await this.repository.findProfile(userId);

    return {
      userId,
      name: targetUser.name,
      email: targetUser.email,
      image: targetUser.image,
      profile: profile
        ? {
            preferredName: profile.preferredName,
            photoUrl: profile.photoUrl,
            location: profile.location,
            timezone: profile.timezone,
            about: profile.about,
            skills: profile.skills,
            github: profile.github,
            linkedin: profile.linkedin,
            personalWebsite: profile.personalWebsite,
            otherLinks: profile.otherLinks,
          }
        : null,
      employment: {
        jobTitle: membership.jobTitle,
        workEmail: membership.workEmail,
        startDate: membership.startDate,
        teamId: membership.teamId,
        managerId: membership.managerId,
      },
    };
  }

  async updateProfile(
    organizationId: string,
    userId: string,
    input: UpdateProfileInput,
  ): Promise<ProfileView> {
    const membership = await this.repository.findMembership(organizationId, userId);

    if (!membership) {
      throw new AppError(404, "This person is not part of your organization");
    }

    const {
      jobTitle,
      workEmail,
      startDate,
      teamId,
      managerId,
      ...profileFields
    } = input;

    if (Object.keys(profileFields).length > 0) {
      await this.repository.upsertProfile(userId, profileFields);
    }

    await this.repository.updateEmployment(organizationId, userId, {
      jobTitle,
      workEmail,
      startDate,
      teamId,
      managerId,
    });

    return this.getProfile(organizationId, userId);
  }
}