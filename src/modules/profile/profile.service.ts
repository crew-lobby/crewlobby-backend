import { AppError } from "../../shared/errors/app-error.js";
import { ProfileRepository } from "./profile.repository.js";
import type {
  ProfileView,
  UpdateProfileInput,
} from "./profile.types.js";

type UpdateProfileContext = {
  currentUserId: string;
  isSelfEdit: boolean;
};

export class ProfileService {
  private readonly repository = new ProfileRepository();

  async getProfile(
    organizationId: string,
    userId: string,
  ): Promise<ProfileView> {
    const membership = await this.repository.findMembership(
      organizationId,
      userId,
    );

    if (!membership) {
      throw new AppError(
        404,
        "This person is not part of your organization",
      );
    }

    const targetUser = await this.repository.findUser(userId);

    if (!targetUser) {
      throw new AppError(404, "User not found");
    }

    const profile = await this.repository.findProfile(userId);

    const relations =
      await this.repository.findEmploymentRelations(
        organizationId,
        userId,
      );

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
        team: relations.team,
        manager: relations.manager,
      },
    };
  }

  async updateProfile(
    organizationId: string,
    userId: string,
    input: UpdateProfileInput,
    context: UpdateProfileContext,
  ): Promise<ProfileView> {
    const membership = await this.repository.findMembership(
      organizationId,
      userId,
    );

    if (!membership) {
      throw new AppError(
        404,
        "This person is not part of your organization",
      );
    }

    const currentMembership =
      await this.repository.findMembership(
        organizationId,
        context.currentUserId,
      );

    if (!currentMembership) {
      throw new AppError(
        403,
        "You are not a member of this organization",
      );
    }

    const isAdmin =
      currentMembership.role === "admin" ||
      currentMembership.role === "owner";

    const {
      jobTitle,
      workEmail,
      startDate,
      teamId,
      managerId,
      ...profileFields
    } = input;

    const hasEmploymentChanges =
      jobTitle !== undefined ||
      workEmail !== undefined ||
      startDate !== undefined ||
      teamId !== undefined ||
      managerId !== undefined;

    if (hasEmploymentChanges && !isAdmin) {
      throw new AppError(
        403,
        "Only organization admins and owners can update employment information",
      );
    }

    if (teamId !== undefined && teamId !== null) {
      const team =
        await this.repository.findTeamInOrganization(
          organizationId,
          teamId,
        );

      if (!team) {
        throw new AppError(
          400,
          "The selected team does not belong to your organization",
        );
      }
    }

    if (managerId !== undefined && managerId !== null) {
      const manager =
        await this.repository.findMemberInOrganization(
          organizationId,
          managerId,
        );

      if (!manager) {
        throw new AppError(
          400,
          "The selected manager does not belong to your organization",
        );
      }
    }

    if (Object.keys(profileFields).length > 0) {
      await this.repository.upsertProfile(
        userId,
        profileFields,
      );
    }

    if (hasEmploymentChanges) {
      await this.repository.updateEmployment(
        organizationId,
        userId,
        {
          jobTitle,
          workEmail,
          startDate,
          teamId,
          managerId,
        },
      );
    }

    return this.getProfile(
      organizationId,
      userId,
    );
  }
}